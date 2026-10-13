import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MOTION_TOKENS, isReducedMotionPreferred } from "@/lib/motion-system";
import { Reveal } from "@/components/brs/reveal";
import { ImageReveal } from "@/components/brs/image-reveal";
import { BeforeAfterSlider } from "@/components/brs/before-after-slider";
import { ProcessTimeline } from "@/components/brs/process-timeline";
import { HomePathways } from "@/components/brs/home-pathways";
import { Hero } from "@/components/brs/hero";

describe("Sistema Unificado de Motion Design (SPEC-015)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AC-015-01: Tokens normativos de movimento", () => {
    it("centraliza valores rigorosos de duração, curva e deslocamento", () => {
      // Duração base entre 600ms e 800ms
      expect(MOTION_TOKENS.duration.base).toBeGreaterThanOrEqual(0.6);
      expect(MOTION_TOKENS.duration.base).toBeLessThanOrEqual(0.8);

      // Máscara de imagem de até 1000ms
      expect(MOTION_TOKENS.duration.imageMask).toBeLessThanOrEqual(1.0);
      expect(MOTION_TOKENS.duration.imageMask).toBeGreaterThanOrEqual(0.8);

      // Curva padrão suave tipo cubic-bezier(0.22, 1, 0.36, 1)
      expect(MOTION_TOKENS.ease).toEqual([0.22, 1, 0.36, 1]);
      expect(MOTION_TOKENS.easeCss).toBe("cubic-bezier(0.22, 1, 0.36, 1)");

      // Deslocamento de entrada de 16 a 24px no desktop, 12px no mobile
      expect(MOTION_TOKENS.distance.desktop).toBeGreaterThanOrEqual(16);
      expect(MOTION_TOKENS.distance.desktop).toBeLessThanOrEqual(24);
      expect(MOTION_TOKENS.distance.mobile).toBe(12);

      // Stagger entre itens de 80 a 120ms
      expect(MOTION_TOKENS.stagger).toBeGreaterThanOrEqual(0.08);
      expect(MOTION_TOKENS.stagger).toBeLessThanOrEqual(0.12);

      // Disparo único com margem de cerca de -80px
      expect(MOTION_TOKENS.viewport.once).toBe(true);
      expect(MOTION_TOKENS.viewport.margin).toBe("-80px");
    });

    it("identifica preferência de reduced motion corretamente", () => {
      expect(typeof isReducedMotionPreferred()).toBe("boolean");
    });
  });

  describe("AC-015-02: Componente primitivo <Reveal>", () => {
    it("renderiza o conteúdo filho com propriedades de animação estruturadas", () => {
      render(
        <Reveal className="test-reveal" staggerIndex={2} delay={0.1}>
          <span>Conteúdo de Teste</span>
        </Reveal>,
      );

      const element = screen.getByText("Conteúdo de Teste");
      expect(element).toBeInTheDocument();
      expect(element.parentElement).toHaveClass("test-reveal");
    });

    it("suporta tags semânticas customizadas via prop 'as'", () => {
      render(
        <Reveal as="article" data-testid="semantic-reveal">
          <p>Artigo de Teste</p>
        </Reveal>,
      );

      const article = screen.getByTestId("semantic-reveal");
      expect(article.tagName.toLowerCase()).toBe("article");
    });
  });

  describe("AC-015-02: Componente primitivo <ImageReveal>", () => {
    it("renderiza imagem envolvida por máscara com overflow-hidden", () => {
      render(
        <ImageReveal data-testid="image-reveal-wrapper">
          <img src="/test.jpg" alt="Foto de Teste" />
        </ImageReveal>,
      );

      const wrapper = screen.getByTestId("image-reveal-wrapper");
      expect(wrapper).toHaveClass("overflow-hidden");
      expect(screen.getByAltText("Foto de Teste")).toBeInTheDocument();
    });
  });

  describe("AC-015-06: Slider Antes/Depois com touch-pan-y e ARIA", () => {
    it("permite rolagem vertical nativa com touch-pan-y e não trava o mobile", () => {
      render(
        <BeforeAfterSlider
          beforeImage="/before.jpg"
          afterImage="/after.jpg"
          beforeAlt="Antes do Reparo"
          afterAlt="Depois do Reparo"
        />,
      );

      const slider = screen.getByRole("slider", {
        name: "Controle deslizante de comparação antes e depois",
      });

      expect(slider).toBeInTheDocument();
      expect(slider).toHaveClass("touch-pan-y");
      expect(slider).not.toHaveClass("touch-none");
    });

    it("cancela o teaser e atualiza posição ao receber interação do teclado", () => {
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
      fireEvent.keyDown(slider, { key: "ArrowRight" });

      expect(slider).toHaveAttribute("aria-valuenow", "55");
      expect(onPositionChange).toHaveBeenCalledWith(55);
    });
  });

  describe("AC-015-07: Etapas do atendimento com linha de progresso", () => {
    it("renderiza todos os 4 passos sequenciais com marcadores e textos completos", () => {
      render(<ProcessTimeline />);

      expect(screen.getByText("Primeiro contato")).toBeInTheDocument();
      expect(screen.getByText("Avaliação técnica")).toBeInTheDocument();
      expect(screen.getByText("Orçamento e alinhamento")).toBeInTheDocument();
      expect(screen.getByText("Reparação e conferência")).toBeInTheDocument();

      expect(screen.getByText("01")).toBeInTheDocument();
      expect(screen.getByText("02")).toBeInTheDocument();
      expect(screen.getByText("03")).toBeInTheDocument();
      expect(screen.getByText("04")).toBeInTheDocument();
    });
  });

  describe("AC-015-08: Resumo de páginas com cartões em stagger", () => {
    it("renderiza os três cartões de encaminhamento com revelação escalonada", () => {
      const { container } = render(<HomePathways />);

      expect(screen.getByText("Para corretores de seguros")).toBeInTheDocument();
      const reveals = container.querySelectorAll<HTMLElement>("[data-reveal]");
      expect(reveals.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("AC-015-03: Seção Hero animada no mount", () => {
    it("renderiza o Hero acima da dobra imediatamente", () => {
      render(<Hero />);

      expect(screen.getByText("BRS Reparações")).toBeInTheDocument();
      expect(screen.getByText("Automotivas.")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /conhecer os serviços/i })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /solicitar avaliação/i })).toBeNull();
    });
  });
});
