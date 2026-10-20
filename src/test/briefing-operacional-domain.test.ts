import { describe, it, expect, beforeEach } from "vitest";
import {
  authorizeBriefing,
  isBriefingAuthorized,
  revokeBriefingAccess,
  BRIEFING_SESSION_KEY,
} from "@/features/briefing/domain/access";
import {
  buildBriefingExport,
  buildExportFileName,
  generateBriefingReportText,
  serializeBriefingExport,
} from "@/features/briefing/domain/export";
import {
  canAdvanceStep,
  getMissingRequiredFields,
  getPendingItems,
  getProgress,
} from "@/features/briefing/domain/progress";
import {
  BRIEFING_STEPS,
  PHOTO_CATEGORIES,
  TOTAL_BRIEFING_FIELDS,
} from "@/features/briefing/domain/steps";
import {
  BRIEFING_DRAFT_KEY,
  createEmptyDraft,
  createPhotoRecord,
  loadBriefingDraft,
  saveBriefingDraft,
} from "@/features/briefing/domain/storage";
import type { BriefingDraft } from "@/features/briefing/domain/types";

const STEP_ONE = BRIEFING_STEPS[0]!;
const LAST_STEP = BRIEFING_STEPS[BRIEFING_STEPS.length - 1]!;

function completeRequiredFields(draft: BriefingDraft): BriefingDraft {
  draft.values["empresa.razaoSocial"] = "LCL Chapeação LTDA";
  draft.values["empresa.proprietario"] = "Responsável Master";
  draft.values["confirmacao.responsavel"] = "Responsável Master";
  draft.values["confirmacao.veracidade"] = true;
  draft.values["confirmacao.ciencia"] = true;
  return draft;
}

describe("Briefing operacional — domínio", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("define 15 etapas numeradas com títulos e campos únicos", () => {
    expect(BRIEFING_STEPS).toHaveLength(15);
    expect(BRIEFING_STEPS.map((step) => step.number)).toEqual(
      Array.from({ length: 15 }, (_, index) => index + 1),
    );
    expect(BRIEFING_STEPS.map((step) => step.title)).toEqual([
      "Identificação da empresa",
      "Serviços e especialidades",
      "Estrutura física",
      "Equipamentos e ferramentas",
      "Equipe e responsabilidades",
      "Processos operacionais",
      "Capacidade operacional e prazos",
      "Qualidade, garantia e rastreabilidade",
      "Documentação e regularidade",
      "Sistemas e tecnologia",
      "Fornecedores e terceiros",
      "Interesse em credenciamento",
      "Fotos e portfólio",
      "Informações para o site",
      "Observações e confirmação",
    ]);

    const allFieldIds = BRIEFING_STEPS.flatMap((step) => step.fields.map((field) => field.id));
    expect(new Set(allFieldIds).size).toBe(allFieldIds.length);
    expect(TOTAL_BRIEFING_FIELDS).toBe(allFieldIds.length);
    expect(TOTAL_BRIEFING_FIELDS).toBeGreaterThan(100);
    expect(PHOTO_CATEGORIES.length).toBeGreaterThanOrEqual(10);
  });

  it("mantém apenas os campos essenciais como obrigatórios e permite pendência neles", () => {
    const required = BRIEFING_STEPS.flatMap((step) =>
      step.fields.filter((field) => field.required),
    );

    expect(required.map((field) => field.id)).toEqual([
      "empresa.razaoSocial",
      "empresa.proprietario",
      "confirmacao.responsavel",
      "confirmacao.veracidade",
      "confirmacao.ciencia",
    ]);
    expect(
      required.filter((field) => field.type !== "checkbox").every((field) => field.allowPending),
    ).toBe(true);
    expect(
      required.filter((field) => field.type === "checkbox").every((field) => !field.allowPending),
    ).toBe(true);
  });

  it("bloqueia o avanço apenas quando um obrigatório não tem resposta nem pendência", () => {
    const draft = createEmptyDraft();

    expect(getMissingRequiredFields(STEP_ONE, draft).map((field) => field.id)).toEqual([
      "empresa.razaoSocial",
      "empresa.proprietario",
    ]);
    expect(canAdvanceStep(STEP_ONE, draft)).toBe(false);

    draft.values["empresa.razaoSocial"] = "LCL Chapeação LTDA";
    expect(canAdvanceStep(STEP_ONE, draft)).toBe(false);

    draft.pending["empresa.proprietario"] = true;
    expect(canAdvanceStep(STEP_ONE, draft)).toBe(true);
    expect(getMissingRequiredFields(STEP_ONE, draft)).toHaveLength(0);

    const progress = getProgress(draft);
    expect(progress.answeredFields).toBe(2);
    expect(progress.percent).toBeGreaterThan(0);
    expect(progress.pendingCount).toBe(1);
    expect(progress.completedSteps).toContain(1);
  });

  it("lista pendências com etapa e rótulo", () => {
    const draft = createEmptyDraft();
    draft.pending["empresa.cnpj"] = true;
    draft.pending["confirmacao.documentosPendentes"] = true;

    expect(getPendingItems(draft)).toEqual([
      {
        stepNumber: 1,
        stepTitle: "Identificação da empresa",
        fieldId: "empresa.cnpj",
        label: "CNPJ",
      },
      {
        stepNumber: 15,
        stepTitle: "Observações e confirmação",
        fieldId: "confirmacao.documentosPendentes",
        label: "Documentos ainda pendentes",
      },
    ]);
  });

  it("salva e restaura o rascunho versionado, rejeitando conteúdo corrompido", () => {
    const draft = createEmptyDraft(new Date("2026-10-20T12:00:00.000Z"));
    draft.values["empresa.razaoSocial"] = "LCL Chapeação LTDA";
    draft.pending["empresa.cnpj"] = true;

    expect(saveBriefingDraft(draft)).toBe(true);
    expect(loadBriefingDraft()).toEqual(draft);

    localStorage.setItem(BRIEFING_DRAFT_KEY, "{conteudo-invalido");
    expect(loadBriefingDraft()).toBeNull();

    localStorage.setItem(BRIEFING_DRAFT_KEY, JSON.stringify({ ...draft, schemaVersion: "2.0" }));
    expect(loadBriefingDraft()).toBeNull();
  });

  it("descarta propriedades desconhecidas ao validar o rascunho", () => {
    const draft = createEmptyDraft();
    localStorage.setItem(
      BRIEFING_DRAFT_KEY,
      JSON.stringify({ ...draft, segredoExtra: "não deve permanecer" }),
    );

    const loaded = loadBriefingDraft();
    expect(loaded).not.toBeNull();
    expect(loaded).not.toHaveProperty("segredoExtra");
  });

  it("registra fotos somente como metadados, sem conteúdo do arquivo", () => {
    const photo = createPhotoRecord(
      { name: "fachada.jpg", size: 2048, type: "image/jpeg" },
      { id: "fachada", label: "Fachada" },
    );

    expect(photo).toMatchObject({
      categoryId: "fachada",
      categoryLabel: "Fachada",
      fileName: "fachada.jpg",
      fileSize: 2048,
      fileType: "image/jpeg",
      authorized: false,
      identifiable: false,
    });
    expect(Object.keys(photo)).not.toContain("dataUrl");
    expect(Object.keys(photo)).not.toContain("content");
  });

  it("exporta JSON e relatório com status honesto, pendências e avisos", () => {
    const draft = completeRequiredFields(createEmptyDraft());
    draft.pending["empresa.cnpj"] = true;

    const exportData = buildBriefingExport(draft);
    expect(exportData.kind).toBe("briefing-operacional-master");
    expect(exportData.status).toBe("rascunho");
    expect(exportData.sections).toHaveLength(15);
    expect(exportData.pending).toEqual([
      {
        stepNumber: 1,
        stepTitle: "Identificação da empresa",
        fieldId: "empresa.cnpj",
        label: "CNPJ",
      },
    ]);
    expect(exportData.disclaimers.join(" ")).toMatch(/não foi enviado/i);
    expect(exportData.disclaimers.join(" ")).toMatch(/não foram publicadas/i);

    const parsed = JSON.parse(serializeBriefingExport(draft)) as Record<string, unknown>;
    expect(parsed["status"]).toBe("rascunho");
    expect(parsed).not.toHaveProperty("submitted");

    const report = generateBriefingReportText(exportData);
    expect(report).toContain("PENDÊNCIAS");
    expect(report).toContain("Etapa 1 — CNPJ");
    expect(report).toContain("não foram enviadas nem armazenadas");
    expect(buildExportFileName(draft)).toMatch(
      /^briefing-operacional-master-chapeacao-e-pinturas-\d{4}-\d{2}-\d{2}\.json$/,
    );
  });

  it("marca a conclusão local sem simular envio", () => {
    const draft = completeRequiredFields(createEmptyDraft());
    draft.completed = true;

    const exportData = buildBriefingExport(draft);
    expect(exportData.status).toBe("concluido_localmente");
    expect(exportData.disclaimers.join(" ")).toContain("conclusão local não representa");
    expect(LAST_STEP.number).toBe(15);
  });

  it("autoriza a sessão de demonstração por 8 horas e permite revogar", () => {
    expect(authorizeBriefing("codigo-incorreto")).toBe(false);
    expect(isBriefingAuthorized()).toBe(false);

    expect(authorizeBriefing("master-2026")).toBe(true);
    expect(isBriefingAuthorized()).toBe(true);

    const session = JSON.parse(sessionStorage.getItem(BRIEFING_SESSION_KEY) ?? "{}") as {
      expiresAt?: number;
    };
    expect(session.expiresAt ?? 0).toBeGreaterThan(Date.now() + 7 * 60 * 60 * 1000);

    sessionStorage.setItem(BRIEFING_SESSION_KEY, JSON.stringify({ expiresAt: Date.now() - 1000 }));
    expect(isBriefingAuthorized()).toBe(false);
    expect(sessionStorage.getItem(BRIEFING_SESSION_KEY)).toBeNull();

    authorizeBriefing("MASTER-2026");
    revokeBriefingAccess();
    expect(isBriefingAuthorized()).toBe(false);
  });
});
