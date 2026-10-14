import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Route as ServicosRoute } from "@/routes/servicos/index";
import { Route as TrabalhosRoute } from "@/routes/trabalhos";
import { Route as ParaCorretoresRoute } from "@/routes/para-corretores";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

const ROOT = path.resolve(__dirname, "../..");
const readSource = (file: string) => fs.readFileSync(path.resolve(ROOT, file), "utf-8");

describe("SPEC-043: Refatoração Global de UX/UI (/servicos, /trabalhos e /para-corretores)", () => {
  describe("AC-043-01: Despoluição e Arquitetura de Conversão em /servicos", () => {
    it("garante âncoras locais e ausência de botões repetidos de avaliação nos 3 cards principais", () => {
      const Component = ServicosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      // Âncoras locais presentes nos 3 cards
      expect(container.querySelector("#funilaria-estrutural")).not.toBeNull();
      expect(container.querySelector("#pintura-estufa")).not.toBeNull();
      expect(container.querySelector("#martelinho-pdr")).not.toBeNull();

      // Nenhum card principal possui botão preenchido 'Solicitar avaliação'
      const funilariaArticle = container.querySelector("#funilaria-estrutural");
      const pinturaArticle = container.querySelector("#pintura-estufa");
      const martelinhoArticle = container.querySelector("#martelinho-pdr");

      [funilariaArticle, pinturaArticle, martelinhoArticle].forEach((article) => {
        expect(article).not.toBeNull();
        const articleLinks = Array.from(article?.querySelectorAll("a") || []);
        const avaliacaoLink = articleLinks.find((l) =>
          /solicitar avaliação/i.test(l.textContent || ""),
        );
        expect(avaliacaoLink).toBeUndefined();

        // Possui link contextual para o portfólio
        const portfolioLink = articleLinks.find((l) =>
          /ver casos deste serviço no portfólio/i.test(l.textContent || ""),
        );
        expect(portfolioLink).toBeDefined();
        expect(portfolioLink?.getAttribute("href")).toContain("/trabalhos");
      });
    });

    it("Guia de Triagem possui links com âncoras locais para a mesma página", () => {
      const Component = ServicosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      expect(container.querySelector('a[href="#martelinho-pdr"]')).not.toBeNull();
      expect(container.querySelector('a[href="#funilaria-estrutural"]')).not.toBeNull();
      expect(container.querySelector('a[href="#pintura-estufa"]')).not.toBeNull();
    });

    it("Cards de Estética Automotiva não contêm botões individuais de conversão", () => {
      const Component = ServicosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const esteticaSection = container.querySelector("#estetica-automotiva");
      expect(esteticaSection).not.toBeNull();
      const buttonsInsideEstetica = esteticaSection?.querySelectorAll("a[href='/contato'], button");
      expect(buttonsInsideEstetica?.length || 0).toBe(0);
    });

    it("Bottom CTA Banner de Leva e Traz é o ponto focal de conversão da rota", () => {
      const Component = ServicosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const bottomBanner = container.querySelector("#leva-e-traz");
      expect(bottomBanner).not.toBeNull();
      expect(bottomBanner?.textContent).toContain(
        "Diagnóstico técnico preciso com comodidade de Leva e Traz em Toledo-PR",
      );
      expect(bottomBanner?.textContent).toContain("Solicitar Avaliação Técnica via WhatsApp");
    });
  });

  describe("AC-043-02: Foco em Autoridade Técnica em /trabalhos", () => {
    it("remove mini-cards e botão primário do topo de /trabalhos", () => {
      const Component = TrabalhosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const pageHero = container.querySelector("[data-page-hero]");
      expect(pageHero).not.toBeNull();

      // Sem mini-cards de telemetria
      expect(
        pageHero?.querySelector(".grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3"),
      ).toBeNull();

      // Sem botão no topo
      expect(pageHero?.querySelector("a[href='/contato']")).toBeNull();

      // Eyebrow e microcopy técnica corretos
      expect(pageHero?.textContent).toContain("PORTFÓLIO & COMPROVAÇÃO TÉCNICA");
      expect(pageHero?.textContent).toContain("Casos de Reparação e Acabamento.");
      expect(pageHero?.textContent).toContain("Veja na prática a recuperação de vincos");
    });

    it("possui disclaimer de transparência fotográfica compacto", () => {
      const Component = TrabalhosRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const disclaimer = container.querySelector(".border-primary\\/20.bg-primary\\/5");
      expect(disclaimer).not.toBeNull();
      expect(disclaimer?.className).toContain("text-[11px]");
      expect(disclaimer?.textContent).toContain("Transparência Fotográfica");
    });
  });

  describe("AC-043-03: Consolidação Editorial Canônica B2B em /para-corretores", () => {
    it("renderiza Hero institucional com código PAR.05 e título canônico", () => {
      const Component = ParaCorretoresRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      const hero = container.querySelector("[data-page-hero]");
      expect(hero).not.toBeNull();
      expect(hero?.textContent).toContain("PAR.05 // RELACIONAMENTO TÉCNICO & SINISTROS");
      expect(hero?.textContent).toContain("TOLEDO — PARANÁ | ATENDIMENTO PROFISSIONAL B2B");
      expect(hero?.textContent).toContain(
        "Parceria técnica. Transparência operacional. Confiança em cada reparação.",
      );
      expect(hero?.textContent).toContain("Conversar com a equipe técnica");
    });

    it("renderiza as 3 seções temáticas canônicas: Relacionamento, Princípios e Conexão B2B", () => {
      const Component = ParaCorretoresRoute.options.component as React.ComponentType;
      const { container } = render(
        <SmoothScrollProvider>
          <Component />
        </SmoothScrollProvider>,
      );

      // Relacionamento Profissional (4 pilares)
      expect(container.textContent).toContain(
        "Suporte técnico para uma gestão de sinistros mais transparente",
      );
      expect(container.textContent).toContain("Comunicação técnica e acompanhamento");
      expect(container.textContent).toContain("Orçamentos e documentação de avarias");
      expect(container.textContent).toContain("Interface profissional no atendimento");
      expect(container.textContent).toContain("Previsibilidade e transparência operacional");

      // Princípios de Atuação (3 blocos)
      expect(container.textContent).toContain(
        "Independência técnica. Clareza nas relações. Respeito ao segurado.",
      );
      expect(container.textContent).toContain("Livre escolha da oficina");
      expect(container.textContent).toContain("Documentação e clareza nas informações");
      expect(container.textContent).toContain("Relacionamento baseado em confiança");

      // Conexão Profissional (Bottom CTA)
      expect(container.textContent).toContain(
        "Vamos estabelecer um canal de relacionamento com a BRS?",
      );
      expect(container.textContent).toContain("Falar com a equipe da BRS");
    });
  });
});
