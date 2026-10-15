import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MotionConfig } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import { PageTransition } from "@/components/ui/page-transition";
import {
  MOTION_EASE,
  MOTION_DURATIONS,
  MOTION_DISTANCES,
  MOTION_VIEWPORT,
} from "@/lib/motion-tokens";

afterEach(() => {
  vi.unstubAllGlobals();
});

const mockReducedMotion = () => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("SPEC-020 — Sistema Global de Motion Design Premium", () => {
  describe("Tokens e Parâmetros Normativos (AC-020-01)", () => {
    it("valida curva de easing suave de marcas de luxo", () => {
      expect(MOTION_EASE).toEqual([0.21, 0.47, 0.32, 0.98]);
    });

    it("valida durações calibradas para rapidez e sofisticação", () => {
      expect(MOTION_DURATIONS.fast).toBe(0.2);
      expect(MOTION_DURATIONS.base).toBeGreaterThanOrEqual(0.65);
      expect(MOTION_DURATIONS.base).toBeLessThanOrEqual(0.8);
      expect(MOTION_DURATIONS.image).toBeLessThanOrEqual(1.0);
    });

    it("valida limites contidos de deslocamento vertical", () => {
      expect(MOTION_DISTANCES.short).toBe(16);
      expect(MOTION_DISTANCES.default).toBe(24);
      expect(MOTION_DISTANCES.max).toBeLessThanOrEqual(30);
    });

    it("valida disparo único no viewport para evitar repetições no scroll reverso", () => {
      expect(MOTION_VIEWPORT.once).toBe(true);
      expect(MOTION_VIEWPORT.margin).toBe("0px 0px -60px 0px");
    });
  });

  describe("ScrollReveal (AC-020-02)", () => {
    it("renderiza elemento com conteúdo acessível e visível", () => {
      render(
        <ScrollReveal direction="up" delay={0.1}>
          <span>Conteúdo de teste</span>
        </ScrollReveal>,
      );

      expect(screen.getByText("Conteúdo de teste")).toBeInTheDocument();
    });

    it("suporta polimorfismo semântico (article, section)", () => {
      const { container } = render(
        <ScrollReveal as="article" data-testid="test-article">
          <h2>Título do Artigo</h2>
        </ScrollReveal>,
      );

      const article = container.querySelector("article");
      expect(article).not.toBeNull();
      expect(article).toHaveTextContent("Título do Artigo");
    });

    it("preserva estilos inline e classes do tailwind", () => {
      const { container } = render(
        <ScrollReveal className="custom-luxury-class" style={{ "--i": 2 } as React.CSSProperties}>
          <p>Texto estilizado</p>
        </ScrollReveal>,
      );

      const el = container.firstElementChild as HTMLElement;
      expect(el).toHaveClass("custom-luxury-class");
      expect(el.style.getPropertyValue("--i")).toBe("2");
    });

    it("desativa animação sob preferência de movimento reduzido", () => {
      mockReducedMotion();

      const { container } = render(
        <ScrollReveal direction="up" distance={24}>
          <p>Sem movimento</p>
        </ScrollReveal>,
      );

      expect(container).toHaveTextContent("Sem movimento");
    });
  });

  describe("ImageReveal (AC-020-03)", () => {
    it("renderiza container com overflow-hidden para isolamento de corte", () => {
      const { container } = render(
        <ImageReveal className="aspect-16/10">
          <img src="/test.jpg" alt="Foto teste" width={100} height={100} />
        </ImageReveal>,
      );

      const wrapper = container.firstElementChild as HTMLElement;
      expect(wrapper).toHaveClass("overflow-hidden");
      expect(wrapper).toHaveClass("aspect-16/10");
      expect(screen.getByAltText("Foto teste")).toBeInTheDocument();
    });

    it("renderiza normalmente com useReducedMotion ativo", () => {
      mockReducedMotion();

      render(
        <ImageReveal>
          <img src="/test2.jpg" alt="Foto sem zoom" width={100} height={100} />
        </ImageReveal>,
      );

      expect(screen.getByAltText("Foto sem zoom")).toBeInTheDocument();
    });
  });

  describe("PageTransition & SSR Hydration Safety (AC-020-04, AC-060-02, AC-060-03, AC-060-04)", () => {
    it("renderiza o conteúdo da página sob a chave da rota ativa", () => {
      render(
        <PageTransition pathname="/servicos">
          <div>Página de Serviços</div>
        </PageTransition>,
      );

      expect(screen.getByText("Página de Serviços")).toBeInTheDocument();
    });

    it("renderiza barra laser superior transitória após montagem sem reduced-motion", () => {
      const { container } = render(
        <PageTransition pathname="/servicos">
          <div>Página de Serviços</div>
        </PageTransition>,
      );

      const laser = container.querySelector("[aria-hidden='true']");
      expect(laser).not.toBeNull();
      expect(laser).toHaveClass("motion-reduce:hidden");
    });

    it("desativa transição e suprime barra laser sob prefers-reduced-motion (AC-060-02)", () => {
      mockReducedMotion();

      const { container } = render(
        <MotionConfig reducedMotion="always">
          <PageTransition pathname="/contato">
            <div>Página de Contato</div>
          </PageTransition>
        </MotionConfig>,
      );

      expect(container).toHaveTextContent("Página de Contato");
      const laser = container.querySelector("[aria-hidden='true']");
      expect(laser).toBeNull();
    });

    it("garante isomorfismo SSR e ausência de nós prematuros no servidor (AC-060-03)", async () => {
      const { renderToString } = await import("react-dom/server");
      const html = renderToString(
        <PageTransition pathname="/">
          <div data-testid="ssr-content">Conteúdo SSR Seguro</div>
        </PageTransition>,
      );

      expect(html).toContain("Conteúdo SSR Seguro");
      // No SSR estático, a barra laser efêmera de transição client-side não deve ser pré-renderizada
      expect(html).not.toContain("fixed top-0 left-0 right-0 h-[2px]");
    });
  });

  describe("Otimização de Code-Splitting de Rotas (AC-060-01)", () => {
    it("garante que /acompanhar/$token exporta exclusivamente Route", async () => {
      const routeModule = await import("@/routes/acompanhar/$token");
      expect(routeModule.Route).toBeDefined();
      expect((routeModule as Record<string, unknown>).CustomerTrackingPage).toBeUndefined();
    });
  });
});
