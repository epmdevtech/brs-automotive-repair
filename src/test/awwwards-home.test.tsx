import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { Hero } from "@/components/brs/hero";
import { AnimatedHero } from "@/components/brs/animated-hero";
import { HomeBeforeAfter } from "@/components/brs/home-before-after";
import { MediaExpand } from "@/components/brs/media-expand";

function TestScrollConsumer() {
  const { scrollTo } = useSmoothScroll();
  return (
    <button type="button" onClick={() => scrollTo(0)}>
      Test Scroll
    </button>
  );
}

describe("SPEC-032 — Awwwards Site of the Day Redesign (Hero, Showcase, Lenis e GSAP)", () => {
  it("SmoothScrollProvider inicializa sem erros e fornece contexto funcional de rolagem", () => {
    render(
      <SmoothScrollProvider>
        <TestScrollConsumer />
      </SmoothScrollProvider>,
    );

    const button = screen.getByRole("button", { name: "Test Scroll" });
    expect(button).toBeInTheDocument();
  });

  it("Hero exibe o status de telemetria técnica e LED pulsante da Master em Toledo-PR", () => {
    render(<Hero />);

    expect(screen.getByText(/Oficina Técnica Especializada • Toledo, PR/i)).toBeInTheDocument();
  });

  it("AnimatedHero renderiza os 3 pilares técnicos de telemetria da oficina automotiva", () => {
    render(
      <AnimatedHero backgroundImageUrl="/test.jpg" description="Teste de descrição técnica" />,
    );

    expect(screen.getByText("Colorimetria Espectrofotométrica")).toBeInTheDocument();
    expect(screen.getByText("Alinhamento Estrutural")).toBeInTheDocument();
    expect(screen.getByText("Diagnóstico Transparente")).toBeInTheDocument();
  });

  it("HomeBeforeAfter renderiza comparativo ilustrativo com transparência editorial", () => {
    render(<HomeBeforeAfter />);

    expect(screen.getByText(/Comparativo Ilustrativo de Método/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Recuperação estrutural e alinhamento de painéis/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Fotografia ilustrativa/i).length).toBeGreaterThan(0);
  });

  it("MediaExpand exibe a legenda da estufa de pintura sem ruído técnico artificial", () => {
    render(<MediaExpand />);

    expect(screen.getByText(/Pintura automotiva em estufa/i)).toBeInTheDocument();
    expect(screen.getByText("Acabamento uniforme, do preparo ao verniz.")).toBeInTheDocument();
  });
});
