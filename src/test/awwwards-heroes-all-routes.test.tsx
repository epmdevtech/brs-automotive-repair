import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Wrench, ShieldCheck, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/brs/page-hero";
import { ProposalHero } from "@/components/brs/proposal/proposal-hero";
import { commercialProposals } from "@/lib/proposta";

describe("SPEC-034 / TASK-034-01 — Awwwards Heroes Across All Routes", () => {
  describe("1. Componente Base PageHero", () => {
    it("renderiza breadcrumbs, índice técnico, eyebrow, título e descrição", () => {
      render(
        <PageHero
          breadcrumbs={[{ name: "Início", path: "/" }, { name: "Subpágina" }]}
          codeIndex="TST.01 // TESTE"
          eyebrow="Categoria de Teste"
          title="Título de Alta Precisão"
          description="Descrição detalhada com rigor técnico e acabamento Awwwards."
          telemetryBadges={[
            {
              icon: Wrench,
              label: "Mesa de Tração",
              detail: "Alinhamento a laser",
            },
            {
              icon: ShieldCheck,
              label: "Garantia Técnica",
              detail: "Padrão de montadora",
            },
          ]}
          actions={[
            {
              label: "Ação Interna",
              to: "/contato",
              variant: "primary",
              icon: ArrowUpRight,
            },
            {
              label: "Ação Externa",
              href: "https://www.facebook.com/1630662447189202",
              variant: "secondary",
              target: "_blank",
              rel: "noopener noreferrer",
            },
          ]}
        />,
      );

      expect(screen.getByText("TST.01 // TESTE")).toBeInTheDocument();
      expect(screen.getByText("Categoria de Teste")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Título de Alta Precisão",
      );
      expect(
        screen.getByText("Descrição detalhada com rigor técnico e acabamento Awwwards."),
      ).toBeInTheDocument();

      // Telemetria técnica
      expect(screen.getByText("Mesa de Tração")).toBeInTheDocument();
      expect(screen.getByText("Alinhamento a laser")).toBeInTheDocument();
      expect(screen.getByText("Garantia Técnica")).toBeInTheDocument();

      // Ações com roteamento estrito
      const internalLink = screen.getByRole("link", { name: /Ação Interna/i });
      expect(internalLink).toHaveAttribute("href", "/contato");

      const externalLink = screen.getByRole("link", { name: /Ação Externa/i });
      expect(externalLink).toHaveAttribute("href", "https://www.facebook.com/1630662447189202");
      expect(externalLink).toHaveAttribute("target", "_blank");
      expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renderiza índice editorial e estrutura de PageHero sem coordenadas decorativas", () => {
      const { container } = render(
        <PageHero
          codeIndex="COORDS.01"
          eyebrow="Geolocalização"
          title="Oficina Central"
          description="Toledo, Paraná"
        />,
      );

      expect(screen.getByText("COORDS.01")).toBeInTheDocument();
      expect(screen.queryByText(/COORD: 24°43'S 53°44'W/)).not.toBeInTheDocument();
      expect(container.querySelector("[data-page-hero]")).toBeInTheDocument();
    });
  });

  describe("2. ProposalHero com Padrão Awwwards", () => {
    const proposal = commercialProposals["master-digital-presence"];

    it("renderiza o cabeçalho técnico com índice de seção PRO.08 e telemetria", () => {
      render(<ProposalHero proposal={proposal} />);

      expect(screen.getByText("PRO.08 // APRESENTAÇÃO COMERCIAL")).toBeInTheDocument();
      expect(screen.getByText(/Proposta Comercial Exclusiva/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(proposal.projectTitle);
      expect(screen.getByText(`Preparada para ${proposal.companyName}`)).toBeInTheDocument();
      expect(screen.getByText(proposal.clientName)).toBeInTheDocument();
    });
  });

  describe("3. Presença Canônica e Consistência em Todas as Rotas", () => {
    const ROOT = process.cwd();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path");
    const read = (file: string) => fs.readFileSync(path.resolve(ROOT, file), "utf-8");

    it("garante que todas as rotas e layouts de serviço adotam PageHero com índices padronizados", () => {
      const routesConfig = [
        { file: "src/routes/servicos/index.tsx", code: "CAT.02 // SERVIÇOS" },
        { file: "src/components/brs/service-page-layout.tsx", code: "ESP.0" },
        { file: "src/routes/trabalhos.tsx", code: "GAL.03 // PORTFÓLIO" },
        { file: "src/routes/sobre.tsx", code: "INS.04 // INSTITUCIONAL" },
        {
          file: "src/routes/para-corretores.tsx",
          code: "PAR.05 // RELACIONAMENTO TÉCNICO & SINISTROS",
        },
        { file: "src/routes/contato.tsx", code: "CON.06" },
        { file: "src/routes/privacidade.tsx", code: "LEG.07 // LGPD" },
      ];

      routesConfig.forEach(({ file, code }) => {
        const content = read(file);
        expect(content).toContain("<PageHero");
        expect(content).toContain(code);
      });
    });

    it('assegura que nenhuma rota utiliza links HTML crus <a href="/..."> em heróis', () => {
      const routeFiles = [
        "src/routes/servicos/index.tsx",
        "src/routes/trabalhos.tsx",
        "src/routes/sobre.tsx",
        "src/routes/para-corretores.tsx",
        "src/routes/contato.tsx",
        "src/routes/privacidade.tsx",
      ];

      routeFiles.forEach((file) => {
        const content = read(file);
        expect(content).not.toMatch(/<a\s+[^>]*href=["']\/(?![\s"'])/);
      });
    });
  });
});
