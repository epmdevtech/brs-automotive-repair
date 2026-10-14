import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/brs/hero";
import { Header } from "@/components/brs/header";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

describe("SPEC-041 — Remoção do CTA de Avaliação da Hero Section e Foco na Descoberta de Serviços", () => {
  it("AC-041-01: Garante ausência total do CTA duplicado 'Solicitar avaliação' dentro da Hero Section", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    // Não deve existir link para /contato na Hero
    const heroContatoLink = container.querySelector("a[href='/contato']");
    expect(heroContatoLink).toBeNull();
    expect(screen.queryByRole("link", { name: /solicitar avaliação/i })).toBeNull();
  });

  it("AC-041-02: Garante que o Header mantém o CTA canônico primário de avaliação", () => {
    render(<Header />);

    const headerCta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(headerCta).toBeInTheDocument();
    expect(headerCta).toHaveAttribute("href", "/contato");
    expect(headerCta.className).toContain("btn--primary");
  });

  it("AC-041-03: O botão 'Ver especialidades' é o CTA único da Hero com destino #especialidades, estilo outline e ícone", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    // CTA único presente
    const cta = screen.getByRole("link", { name: /ver especialidades/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "#especialidades");

    // Estilo secundário/outline normativo
    expect(cta.className).toContain("btn--secondary");

    // Tap target mínimo de 44px para mobile e desktop
    expect(cta.className).toContain("min-h-[44px]");

    // Ícone de seta para baixo presente dentro do botão
    const arrowIcon = cta.querySelector("svg");
    expect(arrowIcon).not.toBeNull();

    // Container hero-cta-group sem gap desnecessário quando único botão
    const ctaGroup = container.querySelector(".hero-cta-group");
    expect(ctaGroup).not.toBeNull();
    expect(ctaGroup?.className).not.toContain("gap-4");
  });
});
