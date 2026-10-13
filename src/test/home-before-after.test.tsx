import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeBeforeAfter } from "@/components/brs/home-before-after";

describe("HomeBeforeAfter component (SPEC-025)", () => {
  it("renders the Before & After showcase section with editorial hierarchy", () => {
    render(<HomeBeforeAfter />);

    // Título editorial e eyebrow
    expect(screen.getByText("Demonstração Técnica Antes & Depois")).toBeInTheDocument();
    expect(screen.getByText("Recuperação estrutural com padrão de fábrica.")).toBeInTheDocument();

    // Identificação do caso técnico
    expect(screen.getByText("Funilaria de Precisão & Alinhamento Estrutural")).toBeInTheDocument();
  });

  it("renders the interactive BeforeAfterSlider within the visual column", () => {
    render(<HomeBeforeAfter />);

    const slider = screen.getByRole("slider", {
      name: "Controle deslizante de comparação antes e depois",
    });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    // Labels de Antes e Depois
    expect(screen.getByText("Antes (Avaria)")).toBeInTheDocument();
    expect(screen.getByText("Depois (Alinhado)")).toBeInTheDocument();
  });

  it("contains direct CTA linking to the canonical gallery /trabalhos", () => {
    render(<HomeBeforeAfter />);

    const galleryCta = screen.getByRole("link", { name: /ver galeria completa/i });
    expect(galleryCta).toBeInTheDocument();
    expect(galleryCta).toHaveAttribute("href", "/trabalhos");
  });

  it("includes the photographic compliance notice", () => {
    render(<HomeBeforeAfter />);

    expect(
      screen.getByText(/O acervo fotográfico real está em documentação em Toledo-PR/i),
    ).toBeInTheDocument();
  });
});
