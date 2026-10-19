import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { AnimatedHero } from "@/components/brs/animated-hero";
import { Header } from "@/components/brs/header";
import { Hero } from "@/components/brs/hero";
import { company } from "@/lib/brs";
import {
  getHasPlayedHeroIntro,
  setHasPlayedHeroIntro,
  resetHeroIntroState,
} from "@/lib/hero-cinematic-state";

describe("SPEC-067: Hero com Abertura Cinematográfica, Zoom Lento e Reflexo de Luz", () => {
  beforeEach(() => {
    resetHeroIntroState();
    vi.restoreAllMocks();
  });

  it("renders the 4 visual layers with correct CSS classes and layer hierarchy", () => {
    const { container } = render(
      <AnimatedHero
        backgroundImageUrl="/images/hero-car.webp"
        eyebrow="OFICINA TÉCNICA ESPECIALIZADA • TOLEDO, PR"
        title="Master Chapeação e Pinturas"
        description="Recuperação estética e estrutural."
        bottomContent={<div>Rodapé de teste</div>}
      />,
    );

    // Camada 1: Imagem com zoom lento (hero-photo-cinematic)
    const photo = container.querySelector(".hero-photo-cinematic");
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", "/images/hero-car.webp");
    expect(photo).toHaveAttribute("fetchpriority", "high");

    // Camada 2: Reflexo de luz (hero-light-flare)
    const flare = container.querySelector(".hero-light-flare");
    expect(flare).toBeInTheDocument();
    expect(flare).toHaveAttribute("aria-hidden", "true");

    // Camada 3: Gradiente de legibilidade escuro (hero-overlay-cinematic)
    const overlay = container.querySelector(".hero-overlay-cinematic");
    expect(overlay).toBeInTheDocument();

    // Camada 4: UI container com classes sequenciais
    expect(container.querySelector(".hero-intro-eyebrow")).toBeInTheDocument();
    expect(container.querySelector(".hero-intro-h1")).toBeInTheDocument();
    expect(container.querySelector(".hero-intro-lead")).toBeInTheDocument();
    expect(container.querySelector(".hero-intro-foot")).toBeInTheDocument();
  });

  it("renders canonical Hero content with non-breaking spaces, unified 'estufa', and canonical primary CTA", () => {
    const { container } = render(<Hero />);

    // H1 com text-wrap: balance e non-breaking spaces em 'pintura em estufa' e 'martelinho de ouro'
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent).toContain("pintura\u00a0em\u00a0estufa");
    expect(h1.textContent).toContain("martelinho\u00a0de\u00a0ouro");
    expect(h1.textContent).not.toContain("cabine");

    // CTA Primário para /contato
    const primaryCta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(primaryCta).toHaveAttribute("href", "/contato");

    // Rodapé de viewport com alto contraste e aviso de fotografia ilustrativa
    expect(screen.queryByText("Fotografia ilustrativa")).toBeNull();
    expect(screen.getByText(new RegExp(company.openingHours))).toBeInTheDocument();
    expect(container.querySelector(".hero-intro-foot")).toBeInTheDocument();
  });

  it("supports optional secondary phone call CTA in AnimatedHero using official telephone", () => {
    render(
      <AnimatedHero
        backgroundImageUrl="/images/hero.webp"
        title="Master Teste"
        description="Descrição"
        ctaButton={{ text: "Avaliação", href: "/contato" }}
        secondaryCta={{ text: `Ligar ${company.phone}`, href: company.phoneHref }}
      />,
    );

    const phoneLink = screen.getByRole("link", {
      name: new RegExp(company.phone.replace(/[()-\s]/g, ".*")),
    });
    expect(phoneLink).toHaveAttribute("href", company.phoneHref);
  });

  it("applies header-cinematic-intro only on first visit to homepage and skips on subsequent visits", () => {
    // Primeira visita na home: deve ter a classe de animação cinematográfica
    const { container: container1 } = render(<Header isHome={true} />);
    const header1 = container1.querySelector("header");
    expect(header1).toHaveClass("header-cinematic-intro");

    // Marca como já reproduzido (simulando conclusão da introdução)
    setHasPlayedHeroIntro(true);

    // Segunda visita (ou retorno SPA): não deve ter a animação
    const { container: container2 } = render(<Header isHome={true} />);
    const header2 = container2.querySelector("header");
    expect(header2).not.toHaveClass("header-cinematic-intro");

    // Página interna: nunca deve ter a animação do Hero
    const { container: container3 } = render(<Header isHome={false} />);
    const header3 = container3.querySelector("header");
    expect(header3).not.toHaveClass("header-cinematic-intro");
  });

  it("fast-forwards UI reveal on deliberate scroll (wheel >25px), not on plain click", () => {
    vi.useFakeTimers();

    const { container } = render(
      <AnimatedHero
        backgroundImageUrl="/images/hero.webp"
        title="Master Teste"
        description="Descrição"
      />,
    );

    const heroSection = container.querySelector("section");
    expect(heroSection).not.toHaveClass("hero-intro-complete");
    expect(getHasPlayedHeroIntro()).toBe(false);

    // Clique simples NÃO deve abortar a abertura cinematográfica (bug corrigido: SPEC-068)
    act(() => {
      window.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(heroSection).not.toHaveClass("hero-intro-complete");
    expect(getHasPlayedHeroIntro()).toBe(false);

    // Avançar o grace period de 600ms para os listeners de wheel/key serem registrados
    act(() => {
      vi.advanceTimersByTime(700);
    });

    // Rolagem deliberada (deltaY > 25px) DEVE fast-forward a abertura
    act(() => {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 80, bubbles: true }));
    });
    expect(heroSection).toHaveClass("hero-intro-complete");
    expect(getHasPlayedHeroIntro()).toBe(true);

    vi.useRealTimers();
  });

  it("fast-forwards Header when master:hero-intro-skip custom event is dispatched", () => {
    const { container } = render(<Header isHome={true} />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("header-cinematic-intro");

    act(() => {
      window.dispatchEvent(new CustomEvent("master:hero-intro-skip"));
    });

    expect(header).not.toHaveClass("header-cinematic-intro");
  });

  it("immediately completes intro when prefers-reduced-motion is active", () => {
    // Mock do window.matchMedia para reduced-motion
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <AnimatedHero
        backgroundImageUrl="/images/hero.webp"
        title="Master Redução"
        description="Sem animações"
      />,
    );

    const heroSection = container.querySelector("section");
    expect(heroSection).toHaveClass("hero-intro-complete");
    expect(getHasPlayedHeroIntro()).toBe(true);
  });
});
