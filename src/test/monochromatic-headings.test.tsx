import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/brs/hero";
import { Philosophy } from "@/components/brs/philosophy";
import { Route as ServicosRoute } from "@/routes/servicos/index";
import { Route as ParaCorretoresRoute } from "@/routes/para-corretores";
import { Route as SobreRoute } from "@/routes/sobre";
import { Route as ContatoRoute } from "@/routes/contato";
import { Route as PrivacidadeRoute } from "@/routes/privacidade";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

const ROOT = path.resolve(__dirname, "../..");
const readSource = (file: string) => fs.readFileSync(path.resolve(ROOT, file), "utf-8");

describe("SPEC-044 / TASK-044-01: Padronização da Hierarquia Tipográfica e Títulos Monocromáticos", () => {
  describe("1. Home Hero (AC-044-01)", () => {
    it("renderiza o H1 do Hero de forma contínua em branco, sem spans com text-primary", () => {
      const { container } = render(<Hero />);
      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.textContent?.replace(/\u00a0/g, " ")).toContain(
        "Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR.",
      );

      // Não há span interno com classes de destaque vermelho/âmbar
      const primarySpan = h1?.querySelector(".text-primary");
      expect(primarySpan).toBeNull();
      expect(h1?.innerHTML).not.toContain("text-amber-");
      expect(h1?.innerHTML).not.toContain("text-yellow-");
    });
  });

  describe("2. Heróis de Rotas Internas (AC-044-02)", () => {
    it("rota /servicos possui título do PageHero monocromático em branco", () => {
      const Component = ServicosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toContain(
        "Recuperação técnica de precisão. Preservação do padrão de fábrica.",
      );
      expect(h1?.querySelector(".text-primary")).toBeNull();
    });

    it("rota /para-corretores possui título do PageHero monocromático em branco", () => {
      const Component = ParaCorretoresRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toContain(
        "Tranquilidade para o Corretor. Cuidado Rigoroso com o Segurado.",
      );
      expect(h1?.querySelector(".text-primary")).toBeNull();
    });

    it("rota /sobre possui título do PageHero monocromático em branco", () => {
      const Component = SobreRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toContain("Oficina Técnica Especializada em Toledo, Paraná.");
      expect(h1?.querySelector(".text-primary")).toBeNull();
    });

    it("rota /contato define títulos do PageHero como strings puras monocromáticas em branco", () => {
      const contatoSource = readSource("src/routes/contato.tsx");
      expect(contatoSource).toContain(
        '"Canal Direto para Corretores. Agilidade e Respaldo Técnico."',
      );
      expect(contatoSource).toContain('"O primeiro passo é um diagnóstico transparente."');
      expect(contatoSource).not.toMatch(/title=\{[\s\S]*?<span[^>]*text-primary[^>]*>/);
    });

    it("rota /privacidade possui título do PageHero monocromático em branco", () => {
      const Component = PrivacidadeRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const h1 = container.querySelector("h1");
      expect(h1).not.toBeNull();
      expect(h1?.textContent).toContain("Transparência e Respeito à sua Privacidade.");
      expect(h1?.querySelector(".text-primary")).toBeNull();
    });
  });

  describe("3. Seção Filosofia / Padrão de Execução (AC-044-03)", () => {
    it("não possui span text-primary no título h2 da seção", () => {
      const { container } = render(<Philosophy />);
      const h2 = container.querySelector("h2");
      expect(h2).not.toBeNull();
      expect(h2?.textContent).toContain("Critério técnico em cada etapa do reparo.");
      expect(h2?.querySelector(".text-primary")).toBeNull();
    });
  });

  describe("4. Varredura Global de Código Estático (AC-044-04 & AC-044-05)", () => {
    it("assegura que os arquivos de rotas não possuem span com text-primary dentro do PageHero title", () => {
      const routesToCheck = [
        "src/routes/servicos/index.tsx",
        "src/routes/para-corretores.tsx",
        "src/routes/sobre.tsx",
        "src/routes/contato.tsx",
        "src/routes/privacidade.tsx",
      ];

      routesToCheck.forEach((routeFile) => {
        const content = readSource(routeFile);
        // Não deve haver title={...<span className="text-primary"...}
        expect(content).not.toMatch(/title=\{[\s\S]*?<span[^>]*text-primary[^>]*>/);
      });
    });
  });
});
