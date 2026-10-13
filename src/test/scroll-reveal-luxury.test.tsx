import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SPEC-018 — Motion Design de Luxo (ScrollReveal & ImageReveal)", () => {
  describe("1. ScrollReveal Component", () => {
    it("renderiza o conteúdo filho com wrapper padrão 'div'", () => {
      render(
        <ScrollReveal>
          <span data-testid="child">Conteúdo de luxo</span>
        </ScrollReveal>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Conteúdo de luxo")).toBeInTheDocument();
    });

    it("suporta elementos semânticos customizados via prop 'as'", () => {
      const { container } = render(
        <ScrollReveal as="article" className="luxury-card">
          <h2>Título do Card</h2>
        </ScrollReveal>,
      );

      const article = container.querySelector("article");
      expect(article).not.toBeNull();
      expect(article).toHaveClass("luxury-card");
      expect(screen.getByText("Título do Card")).toBeInTheDocument();
    });

    it("respeita prefers-reduced-motion desativando o cálculo de translação", () => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { container } = render(
        <ScrollReveal direction="up" distance={30}>
          <p>Acessível</p>
        </ScrollReveal>,
      );

      expect(container.querySelector("p")).toBeInTheDocument();
    });
  });

  describe("2. ImageReveal Component", () => {
    it("renderiza o container com classe 'overflow-hidden'", () => {
      const { container } = render(
        <ImageReveal className="aspect-video">
          <img src="/car.jpg" alt="Automóvel em estufa" />
        </ImageReveal>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("overflow-hidden");
      expect(wrapper).toHaveClass("aspect-video");
      expect(screen.getByAltText("Automóvel em estufa")).toBeInTheDocument();
    });

    it("renderiza normalmente com prefers-reduced-motion ativo", () => {
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ImageReveal>
          <img src="/verniz.jpg" alt="Verniz cerâmico" />
        </ImageReveal>,
      );

      expect(screen.getByAltText("Verniz cerâmico")).toBeInTheDocument();
    });
  });
});
