import { describe, expect, it } from "vitest";
import {
  commercialProposals,
  formatCurrencyBRL,
  generateAcceptanceMessage,
  generateModularAcceptanceMessage,
  calculateSelectedModulesTotal,
  getProposalBySlug,
  listProposals,
  validateProposalCompleteness,
  type CommercialProposal,
} from "@/lib/proposta";

describe("SPEC-027 / TASK-027-01 — Domínio da Proposta Comercial", () => {
  describe("1. Formatação Monetária Brasileira", () => {
    it("formata valores numéricos para o padrão monetário BRL (R$)", () => {
      const formatted = formatCurrencyBRL(3800);
      // Suporta tanto espaço normal quanto non-breaking space do Intl
      expect(formatted).toMatch(/^R\$\s?3\.800,00$/);
      expect(formatCurrencyBRL(1900.5)).toMatch(/^R\$\s?1\.900,50$/);
    });
  });

  describe("2. Validação Rigorosa de Completude e Prevenção de Placeholders", () => {
    it("aprova proposta completa sem campos pendentes", () => {
      const pilotProposal = commercialProposals["master-digital-presence"];
      expect(pilotProposal).toBeDefined();

      const validation = validateProposalCompleteness(pilotProposal);
      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toHaveLength(0);
      expect(validation.errors).toHaveLength(0);
    });

    it("rejeita proposta com slug inválido ou vazio", () => {
      const invalid = {
        ...commercialProposals["master-digital-presence"],
        slug: "Slug Invalido Com Espacos!",
      };
      const validation = validateProposalCompleteness(invalid);
      expect(validation.isValid).toBe(false);
      expect(validation.missingFields.some((f) => f.includes("slug"))).toBe(true);
    });

    it("rejeita proposta com valor total zerado ou negativo", () => {
      const invalid = {
        ...commercialProposals["master-digital-presence"],
        investment: {
          ...commercialProposals["master-digital-presence"].investment,
          totalValue: 0,
        },
      };
      const validation = validateProposalCompleteness(invalid);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((e) => e.includes("maior que zero"))).toBe(true);
    });

    it("rejeita propostas que contenham placeholders genéricos ou termos contaminados de outros segmentos", () => {
      const contaminated: CommercialProposal = {
        ...commercialProposals["master-digital-presence"],
        projectTitle: "Site para Consultório Odontológico de Alto Padrão",
      };
      const validation = validateProposalCompleteness(contaminated);
      expect(validation.isValid).toBe(false);
      expect(
        validation.errors.some((e) => e.includes("placeholders ou termos não permitidos")),
      ).toBe(true);
    });

    it("exige descrição explícita quando a proposta não possui mensalidade mandatória", () => {
      const invalid: CommercialProposal = {
        ...commercialProposals["master-digital-presence"],
        investment: {
          ...commercialProposals["master-digital-presence"].investment,
          hasRecurringMonthly: false,
          recurringDescription: "",
        },
      };
      const validation = validateProposalCompleteness(invalid);
      expect(validation.isValid).toBe(false);
      expect(validation.missingFields.some((f) => f.includes("recurringDescription"))).toBe(true);
    });
  });

  describe("3. Repositório de Propostas e Consulta por Slug", () => {
    it("recupera com sucesso a proposta piloto da Master", () => {
      const found = getProposalBySlug("master-digital-presence");
      expect(found).toBeDefined();
      expect(found?.companyName).toBe("Master Chapeação e Pinturas");
      expect(found?.author).toBe("EPM DevTech");
      expect(found?.investment.totalValue).toBe(3800);
      expect(found?.investment.hasRecurringMonthly).toBe(false);
    });

    it("retorna undefined para identificador inexistente", () => {
      const notFound = getProposalBySlug("slug-inexistente-123");
      expect(notFound).toBeUndefined();
    });

    it("lista propostas cadastradas", () => {
      const list = listProposals();
      expect(list.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("4. Geração Honesta de Mensagem de Manifestação de Interesse", () => {
    it("gera mensagem pré-formatada com dados da proposta e contato do cliente", () => {
      const proposal = commercialProposals["master-digital-presence"];
      const message = generateAcceptanceMessage(proposal, {
        name: "Carlos Diretor",
        notes: "Podemos iniciar na próxima terça-feira.",
      });

      expect(message).toContain("Olá, equipe EPM DevTech!");
      expect(message).toContain(proposal.projectTitle);
      expect(message).toContain(proposal.companyName);
      expect(message).toContain("Ref. Proposta: master-digital-presence");
      expect(message).toContain("Carlos Diretor");
      expect(message).toContain("Podemos iniciar na próxima terça-feira.");
      expect(message).toContain("etapa de briefing");

      // Não deve conter termos falsos de contrato irrevogável assinado
      expect(message).not.toContain("contrato assinado e irrevogável");
      expect(message).not.toContain("cobrança realizada");
    });
  });

  describe("5. SPEC-028 / TASK-028-01 — Portfólio Modular Master Chapeação", () => {
    it("aprova e valida a proposta modular master-chapeacao-pinturas sem pendências", () => {
      const modularProposal = getProposalBySlug("master-chapeacao-pinturas");
      expect(modularProposal).toBeDefined();
      expect(modularProposal?.isModularPortfolio).toBe(true);

      const validation = validateProposalCompleteness(modularProposal!);
      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toHaveLength(0);
      expect(validation.errors).toHaveLength(0);
    });

    it("contém exatamente os 6 módulos do catálogo automotivo com escopo e exclusões", () => {
      const proposal = getProposalBySlug("master-chapeacao-pinturas")!;
      const modules = proposal.modulesCatalog;
      expect(modules).toBeDefined();
      expect(modules).toHaveLength(6);

      const moduleIds = modules!.map((m) => m.id);
      expect(moduleIds).toEqual([
        "epm-web",
        "epm-booking",
        "epm-crm",
        "epm-oficina",
        "epm-connect",
        "epm-insights",
      ]);

      // Cada módulo possui escopo incluído e exclusões explícitas
      modules!.forEach((m) => {
        expect(m.price).toBeGreaterThan(0);
        expect(m.deliverables.length).toBeGreaterThan(0);
        expect(m.exclusions.length).toBeGreaterThan(0);
        expect(m.summary.length).toBeGreaterThan(0);
      });

      // EPM Connect possui flag de preço inicial
      const epmConnect = modules!.find((m) => m.id === "epm-connect");
      expect(epmConnect?.isStartingPrice).toBe(true);
      expect(epmConnect?.price).toBe(1990);
    });

    it("contém as 5 combinações de pacotes sugeridos", () => {
      const proposal = getProposalBySlug("master-chapeacao-pinturas")!;
      const bundles = proposal.bundles;
      expect(bundles).toBeDefined();
      expect(bundles).toHaveLength(5);

      const bundleIds = bundles!.map((b) => b.id);
      expect(bundleIds).toEqual([
        "presenca-digital",
        "captacao-agendamento",
        "gestao-comercial",
        "operacao-digital",
        "ecossistema-expandido",
      ]);

      // Alternativa 4 possui destaque de Operação Completa
      const bundle4 = bundles!.find((b) => b.id === "operacao-digital");
      expect(bundle4?.highlight).toBe(true);
      expect(bundle4?.referencePrice).toBe(18960);

      // Alternativa 5 possui preço inicial
      const bundle5 = bundles!.find((b) => b.id === "ecossistema-expandido");
      expect(bundle5?.isStartingPrice).toBe(true);
    });

    it("segrega custos recorrentes e despesas de terceiros", () => {
      const proposal = getProposalBySlug("master-chapeacao-pinturas")!;
      const rec = proposal.recurringCosts;
      expect(rec).toBeDefined();
      expect(rec!.length).toBeGreaterThanOrEqual(5);

      // Verifica itens essenciais
      const domainItem = rec!.find((r) => r.id === "rec-dominio");
      expect(domainItem?.status).toBe("third_party");

      const supportItem = rec!.find((r) => r.id === "rec-suporte");
      expect(supportItem?.status).toBe("on_demand");
    });

    it("contém as 9 etapas completas do ciclo de execução", () => {
      const proposal = getProposalBySlug("master-chapeacao-pinturas")!;
      const steps = proposal.executionSteps;
      expect(steps).toBeDefined();
      expect(steps).toHaveLength(9);

      expect(steps![0].step).toBe(1);
      expect(steps![0].title).toContain("Apresentação");
      expect(steps![1].step).toBe(2);
      expect(steps![1].title).toContain("Manifestação de Interesse");
      expect(steps![8].step).toBe(9);
      expect(steps![8].title).toContain("Publicação Oficial");
    });

    it("calcula corretamente os totais e flags no utilitário modular", () => {
      const proposal = getProposalBySlug("master-chapeacao-pinturas")!;
      const catalog = proposal.modulesCatalog!;

      // 1 módulo sem flag de "a partir de"
      const res1 = calculateSelectedModulesTotal(["epm-web"], catalog);
      expect(res1.totalValue).toBe(2490);
      expect(res1.hasVariableStartingPrice).toBe(false);
      expect(res1.selectedModules).toHaveLength(1);

      // 2 módulos (EPM Web + EPM Booking)
      const res2 = calculateSelectedModulesTotal(["epm-web", "epm-booking"], catalog);
      expect(res2.totalValue).toBe(6480);
      expect(res2.hasVariableStartingPrice).toBe(false);

      // Com EPM Connect (ativa hasVariableStartingPrice)
      const res3 = calculateSelectedModulesTotal(["epm-web", "epm-connect"], catalog);
      expect(res3.totalValue).toBe(4480);
      expect(res3.hasVariableStartingPrice).toBe(true);
    });

    it("gera mensagem de manifestação de interesse modular pré-formatada", () => {
      const proposal = getProposalBySlug("master-chapeacao-pinturas")!;
      const message = generateModularAcceptanceMessage(proposal, ["epm-web", "epm-booking"], {
        name: "Diretoria Master",
        notes: "Prioridade para o agendamento online.",
      });

      expect(message).toContain("Olá, equipe EPM DevTech!");
      expect(message).toContain("Master Chapeação e Pinturas");
      expect(message).toContain("Ref. Proposta: master-chapeacao-pinturas");
      expect(message).toContain("Diretoria Master");
      expect(message).toContain("EPM Web (Presença digital automotiva)");
      expect(message).toContain("EPM Booking Auto (Solicitações de avaliação e agendamento)");
      expect(message).toContain("R$");
      expect(message).toContain("6.480,00");
      expect(message).toContain("Prioridade para o agendamento online.");
      expect(message).toContain("reunião de alinhamento");
    });
  });
});
