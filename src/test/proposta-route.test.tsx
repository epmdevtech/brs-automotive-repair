import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { commercialProposals, type CommercialProposal } from "@/lib/proposta";
import { ProposalView } from "@/components/brs/proposal/proposal-view";
import { ProposalNotFound } from "@/components/brs/proposal/proposal-not-found";
import { primaryNavigation } from "@/lib/brs";
import { buildRouteHead } from "@/lib/seo";

describe("SPEC-027 / TASK-027-01 — Componentes e Roteamento de Proposta Comercial", () => {
  const queryClient = new QueryClient();
  const router = createRouter({ routeTree, context: { queryClient } });

  describe("1. Roteamento e Isolamento Público", () => {
    it("resolve com sucesso a rota direta /proposta", () => {
      const matches = router.matchRoutes("/proposta");
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });

    it("resolve com sucesso a rota individualizada /proposta/master-digital-presence", () => {
      const matches = router.matchRoutes("/proposta/master-digital-presence");
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });

    it("garante que /proposta não está listada no menu primário público da Master", () => {
      const publicPaths = primaryNavigation.map(([, href]) => href);
      expect(publicPaths).not.toContain("/proposta");
      expect(publicPaths.some((p) => p.startsWith("/proposta"))).toBe(false);
    });

    it("gera meta tag robots com noindex, nofollow para a rota de proposta", () => {
      const head = buildRouteHead({
        title: "Proposta Comercial",
        description: "Apresentação comercial",
        path: "/proposta/master-digital-presence",
        noindex: true,
      });

      const robotsMeta = head.meta.find((m) => m["name"] === "robots");
      expect(robotsMeta).toBeDefined();
      expect(robotsMeta?.["content"]).toBe("noindex, nofollow");
    });
  });

  describe("2. Renderização da Proposta Comercial Pronta", () => {
    const proposal = commercialProposals["master-digital-presence"];

    it("renderiza o cabeçalho com identificação do cliente e autoria discreta da EPM DevTech", () => {
      render(<ProposalView proposal={proposal} />);

      expect(screen.getByText(/Preparada para Master Chapeação e Pinturas/i)).toBeInTheDocument();
      expect(screen.getByText(proposal.projectTitle)).toBeInTheDocument();
      expect(screen.getByText(/Autoria: EPM DevTech/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Ref: master-digital-presence/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(proposal.clientName)).toBeInTheDocument();
    });

    it("renderiza a sub-navegação rápida por âncoras da proposta", () => {
      render(<ProposalView proposal={proposal} />);

      const nav = screen.getByRole("navigation", { name: "Navegação da proposta comercial" });
      expect(nav).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Visão Geral" })).toHaveAttribute(
        "href",
        "#visao-geral",
      );
      expect(screen.getByRole("link", { name: "Investimento" })).toHaveAttribute(
        "href",
        "#investimento",
      );
      expect(screen.getByRole("link", { name: "Escopo & Entregáveis" })).toHaveAttribute(
        "href",
        "#escopo",
      );
    });

    it("exibe o escopo com entregáveis incluídos e exclusões transparentes", () => {
      render(<ProposalView proposal={proposal} />);

      expect(screen.getByText("Incluído no Projeto")).toBeInTheDocument();
      expect(screen.getByText("Não Incluído no Projeto")).toBeInTheDocument();

      // Verifica itens incluídos
      expect(
        screen.getByText("Website Institucional Multipágina & Arquitetura de Rotas"),
      ).toBeInTheDocument();
      expect(screen.getByText("Página Exclusiva para Corretores de Seguros")).toBeInTheDocument();
      expect(screen.getByText("Comparador Interativo Antes & Depois")).toBeInTheDocument();

      // Verifica itens excluídos
      expect(
        screen.getByText("Sessão Fotográfica Presencial e Vídeos de Drone"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Gestão de Tráfego Pago e Campanhas de Anúncios"),
      ).toBeInTheDocument();
    });

    it("exibe o investimento em moeda brasileira e deixa explícita a ausência de mensalidade", () => {
      render(<ProposalView proposal={proposal} />);

      // Verifica formatação brasileira do valor total
      expect(screen.getByText(/R\$\s?3\.800,00/)).toBeInTheDocument();

      // Verifica explicitação sobre ausência de mensalidade
      expect(screen.getAllByText(/Sem Mensalidade Obrigatória/i).length).toBeGreaterThanOrEqual(1);
      expect(
        screen.getByText(/Sem mensalidade obrigatória ou cobrança recorrente fixa/i),
      ).toBeInTheDocument();
    });

    it("renderiza o acordeão de dúvidas frequentes com respostas acessíveis", () => {
      render(<ProposalView proposal={proposal} />);

      const faqHeading = screen.getByText("Perguntas Frequentes Sobre a Proposta");
      expect(faqHeading).toBeInTheDocument();

      const questionBtn = screen.getByText("O que está incluído no valor do investimento?");
      expect(questionBtn).toBeInTheDocument();

      fireEvent.click(questionBtn);

      expect(
        screen.getByText(
          /Está incluído todo o planejamento, design editorial, desenvolvimento das páginas/i,
        ),
      ).toBeInTheDocument();
    });

    it("abre o modal de manifestação de interesse com prévia da mensagem e sem falsa alegação de contrato", () => {
      render(<ProposalView proposal={proposal} />);

      const ctaButton = screen.getByRole("button", {
        name: /^tenho interesse nesta proposta$/i,
      });
      expect(ctaButton).toBeInTheDocument();

      fireEvent.click(ctaButton);

      // Modal aberto
      expect(screen.getByText("Manifestação de Interesse Comercial")).toBeInTheDocument();
      expect(screen.getByText(/Como funciona a transição:/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Agendamos a sessão de briefing guiado para coletar os insumos da oficina/i,
        ),
      ).toBeInTheDocument();

      // Botão para copiar texto
      expect(screen.getByRole("button", { name: /copiar texto/i })).toBeInTheDocument();

      // Alerta de que não é contrato assinado
      expect(
        screen.getByText(
          /Esta manifestação representa interesse em avançar ao briefing e não constitui contrato jurídico irrevogável/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("3. Tratamento de Estados Excepcionais", () => {
    it("renderiza estado 404 quando o identificador não é localizado", () => {
      render(<ProposalNotFound slug="slug-inexistente" />);

      expect(screen.getByText("Proposta não localizada")).toBeInTheDocument();
      expect(screen.getByText("slug-inexistente")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /página inicial Master/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /falar com a epm devtech/i })).toHaveAttribute(
        "href",
        "mailto:contato@epmdevtech.com.br",
      );
    });

    it("bloqueia proposta em rascunho com dados incompletos e exibe aviso de pendências", () => {
      const draftWithMissingData: CommercialProposal = {
        ...commercialProposals["master-digital-presence"],
        status: "draft",
        investment: {
          ...commercialProposals["master-digital-presence"].investment,
          totalValue: 0,
        },
      };

      render(<ProposalView proposal={draftWithMissingData} />);

      expect(screen.getByText("Proposta em Configuração Comercial")).toBeInTheDocument();
      expect(
        screen.getByText(/contém pendências de preenchimento comercial obrigatórias/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/O valor total do investimento deve ser um número maior que zero/i),
      ).toBeInTheDocument();
    });
  });
});
