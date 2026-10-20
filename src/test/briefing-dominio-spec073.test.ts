import { describe, it, expect } from "vitest";
import { BRIEFING_SECTION_KEYS } from "@/features/briefing/domain/section-keys";
import { BRIEFING_STEPS } from "@/features/briefing/domain/steps";
import {
  BRIEFING_SECTION_SCHEMAS,
  buildSectionSchema,
  getSectionSchema,
  getStepBySectionKey,
  validateSectionPayload,
} from "@/features/briefing/domain/section-schemas";
import {
  ADMIN_TRANSITIONS,
  BRIEFING_STATUSES,
  BRIEFING_STATUS_LABELS,
  assertTransition,
  canTransition,
  isBriefingStatus,
} from "@/features/briefing/domain/status";
import {
  PERMISSIONS,
  hasPermission,
  isBriefingRole,
  isOwner,
  requirePermission,
} from "@/features/briefing/domain/roles";
import {
  ALLOWED_BRIEFING_MIME_TYPES,
  MAX_BRIEFING_FILE_BYTES,
  buildBriefingStoragePath,
  validateBriefingFile,
} from "@/features/briefing/domain/file-policy";

const STEP_ONE = BRIEFING_STEPS[0]!;

describe("SPEC-073 — domínio validado do briefing", () => {
  describe("1. Identificadores canônicos das 15 etapas", () => {
    it("usa os identificadores exigidos e na ordem canônica", () => {
      expect(BRIEFING_SECTION_KEYS).toEqual([
        "company_identification",
        "services",
        "facility",
        "equipment",
        "team",
        "operations",
        "capacity",
        "quality",
        "compliance",
        "technology",
        "suppliers",
        "accreditation_interest",
        "portfolio",
        "website_content",
        "observations",
      ]);
    });

    it("mantém a correspondência entre section_key e etapa do formulário", () => {
      expect(BRIEFING_STEPS.map((step) => step.id)).toEqual([...BRIEFING_SECTION_KEYS]);
      expect(getStepBySectionKey("capacity")?.number).toBe(7);
      expect(getStepBySectionKey("inexistente")).toBeUndefined();
    });

    it("expõe um schema Zod para cada etapa", () => {
      for (const key of BRIEFING_SECTION_KEYS) {
        expect(BRIEFING_SECTION_SCHEMAS[key]).toBeDefined();
      }
      expect(() => getSectionSchema("etapa_inexistente")).toThrow(/Etapa desconhecida/);
    });
  });

  describe("2. Schema por etapa, obrigatórios e pendências", () => {
    it("recusa etapa com campo obrigatório vazio", () => {
      const schema = buildSectionSchema(STEP_ONE);
      const result = schema.safeParse({
        "empresa.razaoSocial": "",
        "empresa.proprietario": "Maria",
      });

      expect(result.success).toBe(false);
    });

    it("aceita campo obrigatório marcado como pendente", () => {
      const schema = buildSectionSchema(STEP_ONE, { "empresa.razaoSocial": true });
      const result = schema.safeParse({
        "empresa.razaoSocial": "",
        "empresa.proprietario": "Maria",
      });

      expect(result.success).toBe(true);
    });

    it("recusa opção fora da lista permitida", () => {
      const step = BRIEFING_STEPS.find((item) => item.id === "services")!;
      const field = step.fields.find((item) => item.options && item.options.length > 0)!;
      const schema = buildSectionSchema(step);
      const result = schema.safeParse({ [field.id]: "opcao-inexistente" });

      expect(result.success).toBe(false);
    });

    it("valida o payload no servidor e aponta o campo inválido", () => {
      const invalid = validateSectionPayload(STEP_ONE, {
        values: { "empresa.razaoSocial": "" },
        pending: {},
      });

      expect(invalid.ok).toBe(false);
      if (!invalid.ok) {
        expect(invalid.fieldId).toBe("empresa.razaoSocial");
        expect(invalid.message).toBe("Campo obrigatório");
      }
    });

    it("normaliza o payload validado, removendo vazios e mantendo pendências", () => {
      const valid = validateSectionPayload(STEP_ONE, {
        values: { "empresa.razaoSocial": "LCL Chapeação LTDA", "empresa.cnpj": "   " },
        pending: { "empresa.proprietario": true },
      });

      expect(valid.ok).toBe(true);
      if (valid.ok) {
        expect(valid.values).toEqual({ "empresa.razaoSocial": "LCL Chapeação LTDA" });
        expect(valid.pending).toEqual({ "empresa.proprietario": true });
      }
    });

    it("recusa declarações finais não confirmadas", () => {
      const lastStep = BRIEFING_STEPS[BRIEFING_STEPS.length - 1]!;
      const schema = buildSectionSchema(lastStep);
      const result = schema.safeParse({ "confirmacao.veracidade": false });

      expect(result.success).toBe(false);
    });
  });

  describe("3. Transições de status", () => {
    it("lista os cinco estados canônicos", () => {
      expect(BRIEFING_STATUSES).toEqual([
        "draft",
        "submitted",
        "in_review",
        "awaiting_information",
        "completed",
      ]);
      expect(BRIEFING_STATUS_LABELS.completed).toBe("Concluído");
      expect(isBriefingStatus("draft")).toBe(true);
      expect(isBriefingStatus("aprovado")).toBe(false);
    });

    it("permite ao cliente apenas enviar o rascunho e reabrir a complementação", () => {
      expect(canTransition("draft", "submitted", "client")).toBe(true);
      expect(canTransition("draft", "completed", "client")).toBe(false);
      expect(canTransition("submitted", "completed", "client")).toBe(false);
      expect(canTransition("awaiting_information", "draft", "client")).toBe(true);
    });

    it("restringe transições indevidas também para o administrador", () => {
      expect(canTransition("draft", "completed", "admin")).toBe(false);
      expect(canTransition("submitted", "in_review", "admin")).toBe(true);
      expect(canTransition("in_review", "completed", "admin")).toBe(true);
      expect(ADMIN_TRANSITIONS.completed).toEqual([]);
      expect(() => assertTransition("completed", "draft", "admin")).toThrow(
        /Transição de status não permitida/,
      );
    });
  });

  describe("4. Papéis e permissões", () => {
    it("reconhece apenas os papéis client e admin", () => {
      expect(isBriefingRole("client")).toBe(true);
      expect(isBriefingRole("admin")).toBe(true);
      expect(isBriefingRole("root")).toBe(false);
    });

    it("separa permissões de cliente e de administrador", () => {
      expect(hasPermission("client", PERMISSIONS.readOwnBriefing)).toBe(true);
      expect(hasPermission("client", PERMISSIONS.listAllBriefings)).toBe(false);
      expect(hasPermission("client", PERMISSIONS.changeStatus)).toBe(false);
      expect(hasPermission("admin", PERMISSIONS.changeStatus)).toBe(true);
      expect(() => requirePermission("client", PERMISSIONS.readActivity)).toThrow(
        /Operação não permitida/,
      );
    });

    it("compara a propriedade do briefing com o usuário autenticado", () => {
      expect(isOwner("user-a", "user-a")).toBe(true);
      expect(isOwner("user-a", "user-b")).toBe(false);
    });
  });

  describe("5. Política de arquivos", () => {
    it("aceita formatos e tamanhos permitidos", () => {
      expect(
        validateBriefingFile({ fileName: "fachada.jpg", mimeType: "image/jpeg", sizeBytes: 2048 }),
      ).toEqual({ ok: true });
      expect(ALLOWED_BRIEFING_MIME_TYPES).toContain("application/pdf");
    });

    it("recusa formato não permitido, tamanho excessivo e nome perigoso", () => {
      expect(
        validateBriefingFile({
          fileName: "malware.exe",
          mimeType: "application/x-msdownload",
          sizeBytes: 10,
        }),
      ).toMatchObject({ ok: false, code: "mime_not_allowed" });

      expect(
        validateBriefingFile({
          fileName: "grande.jpg",
          mimeType: "image/jpeg",
          sizeBytes: MAX_BRIEFING_FILE_BYTES + 1,
        }),
      ).toMatchObject({ ok: false, code: "too_large" });

      expect(
        validateBriefingFile({
          fileName: "../escape.jpg",
          mimeType: "image/jpeg",
          sizeBytes: 10,
        }),
      ).toMatchObject({ ok: false, code: "invalid_name" });
    });

    it("constrói o caminho de armazenamento controlado pelo servidor", () => {
      const path = buildBriefingStoragePath({
        userId: "user-a",
        briefingId: "briefing-1",
        category: "Fachada",
        fileName: "fachada.JPG",
        mimeType: "image/jpeg",
        token: "token-1",
      });

      expect(path).toBe("user-a/briefing-1/fachada/token-1.jpg");
      expect(path.startsWith("user-a/")).toBe(true);
    });
  });
});
