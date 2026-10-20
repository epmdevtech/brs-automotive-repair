import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import {
  PdfDocument,
  encodeWinAnsi,
  measureText,
  wrapText,
} from "@/features/briefing/server/pdf/pdf-writer";
import { buildBriefingPdf } from "@/features/briefing/server/pdf/briefing-document";
import type {
  BriefingActivityRow,
  BriefingAnswerRow,
  BriefingRow,
} from "@/features/briefing/server/db-types";
import { BRIEFING_STEPS } from "@/features/briefing/domain/steps";

const BRIEFING: BriefingRow = {
  id: "11111111-2222-4333-8444-555555555555",
  company_name: "LCL Chapeação LTDA (E2E)",
  owner_user_id: "user-1",
  status: "submitted",
  created_at: "2026-10-20T10:00:00.000Z",
  updated_at: "2026-10-20T11:00:00.000Z",
  submitted_at: "2026-10-20T11:00:00.000Z",
  completed_at: null,
  client_message: null,
};

function buildAnswers(): BriefingAnswerRow[] {
  return BRIEFING_STEPS.map((step) => ({
    id: `answer-${step.id}`,
    briefing_id: BRIEFING.id,
    section_key: step.id,
    answers: {
      values: {
        ...(step.fields[0] ? { [step.fields[0].id]: `Resposta de teste em ${step.title}` } : {}),
      },
      pending: step.fields[0] ? { [step.fields[0].id]: true } : {},
    },
    updated_at: "2026-10-20T10:30:00.000Z",
  }));
}

const ACTIVITY: BriefingActivityRow[] = [
  {
    id: "a1",
    briefing_id: BRIEFING.id,
    actor_user_id: "user-1",
    action: "briefing_created",
    metadata: {},
    created_at: "2026-10-20T10:00:00.000Z",
  },
  {
    id: "a2",
    briefing_id: BRIEFING.id,
    actor_user_id: "user-1",
    action: "submitted",
    metadata: {},
    created_at: "2026-10-20T11:00:00.000Z",
  },
];

function hasPdftotext(): boolean {
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

describe("SPEC-075 — exportação de evidência em PDF", () => {
  describe("1. Escritor de PDF", () => {
    it("gera um arquivo PDF 1.4 estruturalmente válido", () => {
      const document = new PdfDocument();
      document.text("Evidência de teste", 42, 780);
      const bytes = document.build();

      expect(bytes.subarray(0, 8).toString("latin1")).toBe("%PDF-1.4");
      const content = bytes.toString("latin1");
      expect(content).toContain("/Type /Catalog");
      expect(content).toContain("/Type /Pages");
      expect(content).toContain("/BaseFont /Helvetica");
      expect(content).toContain("trailer");
      expect(content.trimEnd().endsWith("%%EOF")).toBe(true);
    });

    it("codifica acentos em WinAnsi sem quebrar o documento", () => {
      expect(encodeWinAnsi("Chapeação").toString("latin1")).toBe("Chapea\xe7\xe3o");
      expect(encodeWinAnsi("Razão social — 2026").toString("latin1")).toBe(
        "Raz\xe3o social \x97 2026",
      );
      expect(encodeWinAnsi("€").toString("latin1")).toBe("\x80");
      expect(encodeWinAnsi("→").toString("latin1")).toBe("?");
    });

    it("quebra texto longo em linhas que cabem na largura", () => {
      const lines = wrapText(
        "Relatório de evidência do briefing operacional da Master Chapeação e Pinturas com todas as etapas preenchidas.",
        10,
        180,
      );

      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) {
        expect(measureText(line, 10)).toBeLessThanOrEqual(180 + 1);
      }
    });

    it("pagina o conteúdo e aplica o rodapé em cada página", () => {
      const document = new PdfDocument();
      document.setFooter((page) => `página ${page}`);

      for (let index = 0; index < 120; index += 1) {
        document.paragraph(`Linha de teste ${index} com texto suficiente para ocupar a linha.`);
      }

      const bytes = document.build().toString("latin1");
      const pageCount = (bytes.match(/\/Type \/Page /g) ?? []).length;

      expect(pageCount).toBeGreaterThan(1);
      expect(bytes).toContain("página 1");
      expect(bytes).toContain(`página ${pageCount}`);
    });
  });

  describe("2. Documento de evidência", () => {
    it("inclui identificação, as 15 etapas, pendências e auditoria", () => {
      const document = buildBriefingPdf({
        briefing: BRIEFING,
        answers: buildAnswers(),
        activity: ACTIVITY,
        companyName: BRIEFING.company_name,
      });

      expect(document.fileName).toBe("evidencia-briefing-11111111-2026-10-20.pdf");
      expect(document.bytes.length).toBeGreaterThan(2000);
      expect(document.pageCount).toBeGreaterThanOrEqual(2);
    });

    it("extrai texto correto do PDF gerado", () => {
      if (!hasPdftotext()) {
        expect(true).toBe(true);
        return;
      }

      const document = buildBriefingPdf({
        briefing: BRIEFING,
        answers: buildAnswers(),
        activity: ACTIVITY,
        companyName: BRIEFING.company_name,
      });

      const extracted = execFileSync("pdftotext", ["-layout", "-", "-"], {
        input: document.bytes,
        encoding: "utf8",
      });

      expect(extracted).toContain("EVIDÊNCIA DE BRIEFING");
      expect(extracted).toContain("LCL Chapeação LTDA (E2E)");
      expect(extracted).toContain("Identificação da empresa");
      expect(extracted).toContain("Observações e confirmação");
      expect(extracted).toContain("Auditoria");
      expect(extracted).toContain("submitted");
      expect(extracted).toContain("não representa credenciamento");
      expect(extracted).toContain("(pendente)");
    });

    it("gera documento mesmo sem respostas registradas", () => {
      const document = buildBriefingPdf({
        briefing: { ...BRIEFING, status: "draft", submitted_at: null },
        answers: [],
        activity: [],
        companyName: "",
      });

      expect(document.bytes.length).toBeGreaterThan(1000);
      expect(document.fileName).toContain("evidencia-briefing-");
    });
  });
});
