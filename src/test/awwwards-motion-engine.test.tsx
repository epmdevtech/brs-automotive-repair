import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import * as React from "react";
import { NumericCounter } from "@/components/ui/numeric-counter";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { BeforeAfterSlider } from "@/components/brs/before-after-slider";
import { PageTransition } from "@/components/ui/page-transition";

// Mock matchMedia
beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe("SPEC-036: Motion Engine & Componentes Interativos", () => {
  describe("NumericCounter (AC-036-02)", () => {
    it("renderiza o valor numérico com padZero e atributos ARIA corretos", () => {
      render(<NumericCounter target={3} padZero data-testid="counter" />);
      const el = screen.getByTestId("counter");
      expect(el).toBeInTheDocument();
      expect(el.getAttribute("aria-label")).toBe("03");
      expect(el.textContent).toContain("03");
    });

    it("renderiza prefixo e sufixo formatados", () => {
      render(<NumericCounter target={100} prefix="+" suffix="%" data-testid="counter-prefix" />);
      const el = screen.getByTestId("counter-prefix");
      expect(el.getAttribute("aria-label")).toBe("+100%");
      expect(el.textContent).toContain("+100%");
    });

    it("suporta formatação customizada", () => {
      render(
        <NumericCounter target={1} format={(v) => `< ${v}.0mm`} data-testid="counter-format" />,
      );
      const el = screen.getByTestId("counter-format");
      expect(el.getAttribute("aria-label")).toBe("< 1.0mm");
      expect(el.textContent).toContain("< 1.0mm");
    });
  });

  describe("ParallaxImage (AC-036-03)", () => {
    it("renderiza container com overflow-hidden e imagem interna com alt descritivo", () => {
      render(
        <ParallaxImage
          src="/test.jpg"
          alt="Fotografia técnica de funilaria"
          data-testid="parallax-wrap"
        >
          <span data-testid="overlay-badge">Badge</span>
        </ParallaxImage>,
      );

      const wrap = screen.getByTestId("parallax-wrap");
      expect(wrap).toHaveClass("overflow-hidden");

      const img = screen.getByRole("img", { name: "Fotografia técnica de funilaria" });
      expect(img).toBeInTheDocument();
      expect(img.getAttribute("src")).toBe("/test.jpg");

      expect(screen.getByTestId("overlay-badge")).toBeInTheDocument();
    });
  });

  describe("BeforeAfterSlider (AC-036-04)", () => {
    it("renderiza o slider com role slider e acessibilidade ARIA", () => {
      render(
        <BeforeAfterSlider
          beforeImage="/before.jpg"
          afterImage="/after.jpg"
          beforeLabel="Avaria"
          afterLabel="Restaurado"
          initialPosition={50}
        />,
      );

      const slider = screen.getByRole("slider");
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute("aria-valuenow", "50");
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
      expect(screen.getByText("Avaria")).toBeInTheDocument();
      expect(screen.getByText("Restaurado")).toBeInTheDocument();
    });

    it("responde aos controles de teclado (ArrowLeft, ArrowRight, Home, End)", () => {
      const onPositionChange = vi.fn();
      render(
        <BeforeAfterSlider
          beforeImage="/before.jpg"
          afterImage="/after.jpg"
          initialPosition={50}
          onPositionChange={onPositionChange}
        />,
      );

      const slider = screen.getByRole("slider");

      // Seta para a direita (+5%)
      fireEvent.keyDown(slider, { key: "ArrowRight" });
      expect(slider).toHaveAttribute("aria-valuenow", "55");
      expect(onPositionChange).toHaveBeenCalledWith(55);

      // Seta para a esquerda (-5%)
      fireEvent.keyDown(slider, { key: "ArrowLeft" });
      expect(slider).toHaveAttribute("aria-valuenow", "50");

      // Home (0%)
      fireEvent.keyDown(slider, { key: "Home" });
      expect(slider).toHaveAttribute("aria-valuenow", "0");

      // End (100%)
      fireEvent.keyDown(slider, { key: "End" });
      expect(slider).toHaveAttribute("aria-valuenow", "100");
    });
  });

  describe("PageTransition (AC-036-06)", () => {
    it("renderiza o conteúdo da página com wrapper animado", () => {
      render(
        <PageTransition pathname="/servicos">
          <div data-testid="page-child">Conteúdo da Rota</div>
        </PageTransition>,
      );

      expect(screen.getByTestId("page-child")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade Prefers Reduced Motion (AC-036-07)", () => {
    it("NumericCounter renderiza valor final diretamente sob prefers-reduced-motion", () => {
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

      render(<NumericCounter target={4} padZero data-testid="counter-reduced" />);
      const el = screen.getByTestId("counter-reduced");
      expect(el.getAttribute("aria-label")).toBe("04");
      expect(el.textContent).toContain("04");
    });
  });
});
