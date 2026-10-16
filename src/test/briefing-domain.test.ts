import { describe, it, expect } from "vitest";
import {
  isValidCNPJ,
  formatCNPJ,
  getContrastRatio,
  evaluateWCAGContrast,
  BriefingCompletoSchema,
  brsDefaultBriefing,
  buildBookingConfig,
  generateBriefingSummaryMessage,
} from "@/lib/briefing";

describe("Briefing Domain & Validation Engine", () => {
  describe("Validador de CNPJ Canônico", () => {
    it("deve validar CNPJ real da BRS Reparações Automotivas", () => {
      expect(isValidCNPJ("53.877.400/0001-46")).toBe(true);
      expect(isValidCNPJ("53877400000146")).toBe(true);
    });

    it("deve rejeitar CNPJ inválido ou com dígitos verificadores incorretos", () => {
      expect(isValidCNPJ("53.877.400/0001-99")).toBe(false);
      expect(isValidCNPJ("11.111.111/1111-11")).toBe(false);
      expect(isValidCNPJ("")).toBe(false);
      expect(isValidCNPJ("123456")).toBe(false);
    });

    it("deve formatar número cru de CNPJ com máscara adequada", () => {
      expect(formatCNPJ("53877400000146")).toBe("53.877.400/0001-46");
    });
  });

  describe("Calculador de Contraste WCAG 2.2 AA", () => {
    it("deve calcular razão de contraste adequada entre Dourado BRS e Fundo Escuro", () => {
      // Dourado #D4AF37 contra fundo preto #0B0D10
      const ratio = getContrastRatio("#D4AF37", "#0B0D10");
      expect(ratio).toBeGreaterThanOrEqual(4.5);

      const evaluation = evaluateWCAGContrast(ratio);
      expect(evaluation.passesNormalAA).toBe(true);
      expect(evaluation.passesLargeAA).toBe(true);
    });

    it("deve detectar contraste insuficiente em cores de baixo contraste", () => {
      // Grafite escuro #1C1F26 contra fundo preto #0B0D10
      const ratio = getContrastRatio("#1C1F26", "#0B0D10");
      expect(ratio).toBeLessThan(3.0);

      const evaluation = evaluateWCAGContrast(ratio);
      expect(evaluation.passesNormalAA).toBe(false);
    });
  });

  describe("Schema Zod do Briefing Completo", () => {
    it("deve validar com sucesso o seed canônico padrão da BRS", () => {
      const parsed = BriefingCompletoSchema.safeParse(brsDefaultBriefing);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.contratante.razao_social).toBe("Brs Comercio de Pecas Automotivas LTDA");
        expect(parsed.data.servicos.itens.length).toBeGreaterThanOrEqual(3);
        expect(parsed.data.equipe.membros.length).toBeGreaterThanOrEqual(1);
      }
    });

    it("deve falhar a validação se campos essenciais forem omitidos", () => {
      const invalidData = {
        ...brsDefaultBriefing,
        contratante: {
          ...brsDefaultBriefing.contratante,
          cnpj: "00.000.000/0000-00", // CNPJ inválido
        },
      };
      const parsed = BriefingCompletoSchema.safeParse(invalidData);
      expect(parsed.success).toBe(false);
    });
  });

  describe("Gerador de Booking Config (booking-config.json)", () => {
    it("deve transformar o briefing no formato estruturado para o motor de agendamento", () => {
      const config = buildBookingConfig(brsDefaultBriefing, "BRS Reparações");

      expect(config.version).toBe("1.0");
      expect(config.business_name).toBe("Brs Comercio de Pecas Automotivas LTDA");
      expect(config.niche).toBe("oficina_automotiva");
      expect(config.units.length).toBe(1);
      expect(config.units[0].name).toBe("BRS Oficina Central Toledo");
      expect(config.units[0].accessible).toBe(true);

      expect(config.professionals.length).toBe(2);
      expect(config.professionals[0].name).toBe("Bruno Rafael dos Santos");

      expect(config.services.length).toBe(4);
      expect(config.services[0].name).toContain("Funilaria");

      expect(config.booking_rules.min_lead_time_hours).toBe(4);
      expect(config.booking_rules.max_lead_time_days).toBe(30);
      expect(config.booking_rules.niche_rules).toHaveProperty(
        "solicita_placa_modelo_reserva",
        true,
      );
    });
  });

  describe("Gerador de Resumo para Envio", () => {
    it("deve criar texto legível com os dados do cliente e contadores", () => {
      const message = generateBriefingSummaryMessage(brsDefaultBriefing, 0);
      expect(message).toContain("BRIEFING CONCLUÍDO");
      expect(message).toContain("BRS Reparações Automotivas");
      expect(message).toContain("53.877.400/0001-46");
      expect(message).toContain("Nenhuma (100% preenchido)");
    });
  });
});
