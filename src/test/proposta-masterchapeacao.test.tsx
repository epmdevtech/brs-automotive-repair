import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import {
  calculateSelectedModulesTotal,
  commercialProposals,
  formatCurrencyBRL,
  formatCurrencyCents,
  getProposalBySlug,
  listProposals,
  masterBundles,
  masterModulesCatalog,
  masterRecurringCosts,
  masterChapeacaoProposal,
  validateProposalCompleteness,
} from "@/lib/proposta";
import { primaryNavigation } from "@/lib/brs";
import { ProposalView } from "@/components/brs/proposal/proposal-view";
import { Route as MasterProposalRoute } from "@/routes/proposta/masterchapeacao";

describe("SPEC-079 / TASK-079-01 — Proposta Comercial Modular Master em Rota Dedicada", () => {
  const queryClient = new QueryClient();
  const router = createRouter({ routeTree, context: { queryClient } });
  const originalProposal = commercialProposals["master-digital-presence"];

  describe("AC-079-01: Rota dedicada disponível, confidencial e fora dos menus", () => {
    it("resolve /proposta/masterchapeacao pela rota estática dedicada", () => {
      const matches = router.matchRoutes("/proposta/masterchapeacao");
      expect(matches.at(-1)?.routeId).toBe("/proposta/masterchapeacao");
    });

    it("publica metadados noindex, nofollow para a rota dedicada", () => {
      const head = MasterProposalRoute.options.head?.({} as never);
      const robots = head?.meta?.find((meta) => meta["name"] === "robots");
      expect(robots?.["content"]).toBe("noindex, nofollow");
    });

    it("não inclui a rota /proposta/masterchapeacao na navegação pública", () => {
      const publicPaths = primaryNavigation.map(([, href]) => href);
      expect(publicPaths).not.toContain("/proposta/masterchapeacao");
      expect(publicPaths.some((p) => p.includes("masterchapeacao"))).toBe(false);
    });
  });

  describe("AC-079-02: Identidade oficial da Master Chapeação e Pinturas", () => {
    it("renderiza o logo oficial da Master, título e autoria da EPM DevTech", () => {
      const { container } = render(<ProposalView proposal={masterChapeacaoProposal} />);

      expect(screen.getByText("Preparada para Master Chapeação e Pinturas")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        masterChapeacaoProposal.projectTitle,
      );
      expect(screen.getByRole("img", { name: "Master Chapeação e Pinturas" })).toBeInTheDocument();
      expect(screen.getAllByText(/Ref: masterchapeacao/i).length).toBeGreaterThanOrEqual(1);
      expect(container.textContent).not.toMatch(/\bBRS\b/);
    });
  });

  describe("AC-079-03: Catálogo central dos 6 módulos e modelagem em centavos", () => {
    it("possui exatamente 6 módulos com preços e escopos bem delimitados", () => {
      expect(masterModulesCatalog).toHaveLength(6);
      const ids = masterModulesCatalog.map((m) => m.id);
      expect(ids).toEqual([
        "epm-web",
        "epm-booking",
        "epm-crm",
        "epm-oficina",
        "epm-connect",
        "epm-insights",
      ]);
    });

    it("modela os preços em centavos inteiros e formatação BRL sem distorção", () => {
      const web = masterModulesCatalog.find((m) => m.id === "epm-web")!;
      expect(web.implementationPriceCents).toBe(249000);
      expect(web.price).toBe(2490);
      expect(web.priceType).toBe("fixed");
      expect(web.badge).toBe("Produto de entrada");
      expect(formatCurrencyCents(web.implementationPriceCents)).toMatch(/^R\$\s?2\.490,00$/);

      const booking = masterModulesCatalog.find((m) => m.id === "epm-booking")!;
      expect(booking.implementationPriceCents).toBe(399000);
      expect(booking.price).toBe(3990);
      expect(booking.priceType).toBe("fixed");
      expect(booking.recommended).toBe(true);
      expect(booking.badge).toBe("Primeira evolução sugerida");

      const crm = masterModulesCatalog.find((m) => m.id === "epm-crm")!;
      expect(crm.implementationPriceCents).toBe(499000);
      expect(crm.price).toBe(4990);

      const oficina = masterModulesCatalog.find((m) => m.id === "epm-oficina")!;
      expect(oficina.implementationPriceCents).toBe(749000);
      expect(oficina.price).toBe(7490);

      const connect = masterModulesCatalog.find((m) => m.id === "epm-connect")!;
      expect(connect.implementationPriceCents).toBe(199000);
      expect(connect.price).toBe(1990);
      expect(connect.priceType).toBe("from");
      expect(connect.isStartingPrice).toBe(true);

      const insights = masterModulesCatalog.find((m) => m.id === "epm-insights")!;
      expect(insights.implementationPriceCents).toBe(249000);
      expect(insights.price).toBe(2490);
    });

    it("todos os módulos possuem entregáveis, exclusões e dependências declaradas", () => {
      masterModulesCatalog.forEach((mod) => {
        expect(mod.deliverables.length).toBeGreaterThanOrEqual(5);
        expect(mod.exclusions.length).toBeGreaterThanOrEqual(4);
        expect(mod.dependencies.length).toBeGreaterThanOrEqual(1);
        expect(mod.selectable).toBe(true);
        expect(mod.publicationStatus).toBe("published");
      });
    });

    it("EPM Booking Auto explicita ausência de confirmação automática ou WhatsApp incluso", () => {
      const booking = masterModulesCatalog.find((m) => m.id === "epm-booking")!;
      const text = `${booking.summary} ${booking.commercialNotes} ${booking.exclusions.join(" ")}`;
      expect(text).toMatch(/solicitação sujeita à confirmação/i);
      expect(text).toMatch(/sem confirmação automática/i);
      expect(text).toMatch(/sem api oficial do whatsapp/i);
    });
  });

  describe("AC-079-04: Combinações sugeridas calculadas em centavos", () => {
    it("valida os totais das 5 combinações sugeridas", () => {
      expect(masterBundles).toHaveLength(5);

      const b1 = masterBundles.find((b) => b.id === "presenca-digital")!;
      expect(b1.referencePriceCents).toBe(249000);
      expect(b1.referencePrice).toBe(2490);

      const b2 = masterBundles.find((b) => b.id === "captacao-agendamento")!;
      expect(b2.referencePriceCents).toBe(648000);
      expect(b2.referencePrice).toBe(6480);

      const b3 = masterBundles.find((b) => b.id === "gestao-comercial")!;
      expect(b3.referencePriceCents).toBe(748000);
      expect(b3.referencePrice).toBe(7480);

      const b4 = masterBundles.find((b) => b.id === "operacao-digital")!;
      expect(b4.referencePriceCents).toBe(1896000);
      expect(b4.referencePrice).toBe(18960);
      expect(b4.highlight).toBe(true);

      const b5 = masterBundles.find((b) => b.id === "ecossistema-expandido")!;
      expect(b5.referencePriceCents).toBe(2344000);
      expect(b5.referencePrice).toBe(23440);
      expect(b5.priceType).toBe("from");
      expect(b5.isStartingPrice).toBe(true);
    });

    it("calcula dinamicamente a soma em centavos e reais ao selecionar módulos", () => {
      const res = calculateSelectedModulesTotal(
        ["epm-web", "epm-booking", "epm-crm", "epm-oficina"],
        masterModulesCatalog,
      );
      expect(res.totalValueCents).toBe(1896000);
      expect(res.totalValue).toBe(18960);
      expect(res.hasVariableStartingPrice).toBe(false);

      const resAll = calculateSelectedModulesTotal(
        ["epm-web", "epm-booking", "epm-crm", "epm-oficina", "epm-connect", "epm-insights"],
        masterModulesCatalog,
      );
      expect(resAll.totalValueCents).toBe(2344000);
      expect(resAll.totalValue).toBe(23440);
      expect(resAll.hasVariableStartingPrice).toBe(true);
    });
  });

  describe("AC-079-05: Segregação estrita de custos recorrentes e terceiros", () => {
    it("não inclui custos recorrentes ou despesas externas no total de implantação", () => {
      expect(masterRecurringCosts.length).toBeGreaterThanOrEqual(6);
      masterRecurringCosts.forEach((item) => {
        expect(["third_party", "on_demand"]).toContain(item.status);
      });

      const totalRes = calculateSelectedModulesTotal(["epm-web"], masterModulesCatalog);
      // Somente implantação de R$ 2.490,00, sem domínio ou hospedagem embutidos
      expect(totalRes.totalValue).toBe(2490);
    });
  });

  describe("AC-079-06: Matriz comparativa responsiva e ciclo de 9 etapas", () => {
    it("renderiza cabeçalhos da matriz comparativa conforme especificação", () => {
      render(<ProposalView proposal={masterChapeacaoProposal} />);

      expect(screen.getByRole("columnheader", { name: "Solução" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Objetivo" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Recursos Principais" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Dependências" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Implantação" })).toBeInTheDocument();
    });

    it("exibe as 9 etapas do projeto informando que manifestação não é aceite jurídico", () => {
      render(<ProposalView proposal={masterChapeacaoProposal} />);

      expect(screen.getByText("Apresentação da Proposta")).toBeInTheDocument();
      expect(screen.getByText("Publicação Oficial & Entrega")).toBeInTheDocument();
      expect(screen.getAllByText(/não é aceite jurídico/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("AC-079-07: CTA honesto e canal de contato confirmado", () => {
    it("oferece os botões 'Tenho interesse nesta proposta' e 'Quero esclarecer uma dúvida'", () => {
      render(<ProposalView proposal={masterChapeacaoProposal} />);

      const mainBtn = screen.getByRole("button", { name: /^tenho interesse nesta proposta$/i });
      expect(mainBtn).toBeInTheDocument();

      const questionLink = screen.getByRole("link", { name: /quero esclarecer uma dúvida/i });
      expect(questionLink).toHaveAttribute(
        "href",
        expect.stringContaining("mailto:elessandro@epmdevtech.com.br"),
      );
    });

    it("abre diálogo de interesse sem expor número de WhatsApp fictício", () => {
      render(<ProposalView proposal={masterChapeacaoProposal} />);

      fireEvent.click(screen.getByRole("button", { name: /^tenho interesse nesta proposta$/i }));

      expect(screen.getByText("Manifestação de Interesse Comercial")).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /whatsapp/i })).not.toBeInTheDocument();

      const emailAction = screen.getByRole("link", { name: /enviar por e-mail/i });
      expect(emailAction).toHaveAttribute(
        "href",
        expect.stringContaining("mailto:elessandro@epmdevtech.com.br"),
      );
    });

    it("não propaga dados pessoais na URL ou números de telefone inventados", () => {
      expect(masterChapeacaoProposal.authorContact.email).toBe("elessandro@epmdevtech.com.br");
      expect(masterChapeacaoProposal.authorContact.phone).toBeUndefined();
      expect(masterChapeacaoProposal.authorContact.whatsappNumber).toBeUndefined();

      const { container } = render(<ProposalView proposal={masterChapeacaoProposal} />);
      expect(container.textContent).not.toMatch(/99999-0000|999990000/);
    });
  });

  describe("AC-079-08: Validação completa e isolamento da proposta original", () => {
    it("aprova a completude comercial de masterChapeacaoProposal", () => {
      const validation = validateProposalCompleteness(masterChapeacaoProposal);
      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toHaveLength(0);
      expect(validation.errors).toHaveLength(0);

      expect(getProposalBySlug("masterchapeacao")).toBe(masterChapeacaoProposal);
      expect(listProposals()).toContain(masterChapeacaoProposal);
    });

    it("mantém a proposta original da BRS (/proposta/master-digital-presence) intacta", () => {
      expect(originalProposal).toBeDefined();
      expect(originalProposal.slug).toBe("master-digital-presence");
      expect(originalProposal.isModularPortfolio).toBeUndefined();
      expect(originalProposal.branding).toBeUndefined();
    });
  });
});
