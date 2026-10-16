import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/brs/hero";
import { Header } from "@/components/brs/header";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

describe("SPEC-041 / SPEC-064 — CTA Único de Avaliação na Hero Section e Header", () => {
  it("AC-064-01: Garante CTA único 'Solicitar avaliação' dentro da Hero Section apontando para /contato", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    const heroContatoLink = container.querySelector("a[href='/contato']");
    expect(heroContatoLink).not.toBeNull();
    expect(screen.getByRole("link", { name: /solicitar avaliação/i })).toBeInTheDocument();
    expect(container.querySelectorAll(".hero-cta-group a")).toHaveLength(1);
  });

  it("AC-041-02: Garante que o Header mantém o CTA canônico primário de avaliação", () => {
    render(<Header />);

    const headerCta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(headerCta).toBeInTheDocument();
    expect(headerCta).toHaveAttribute("href", "/contato");
    expect(headerCta.className).toContain("btn--primary");
  });

  it("AC-064-02: O botão 'Solicitar avaliação' é o CTA único da Hero com destino /contato, estilo primário e tap target >= 44px", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    const cta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/contato");
    expect(cta.className).toContain("btn--primary");
    expect(cta.className).toContain("min-h-[44px]");

    const arrowIcon = cta.querySelector("svg");
    expect(arrowIcon).not.toBeNull();

    const ctaGroup = container.querySelector(".hero-cta-group");
    expect(ctaGroup).not.toBeNull();
    expect(ctaGroup?.className).not.toContain("gap-4");
  });
});
