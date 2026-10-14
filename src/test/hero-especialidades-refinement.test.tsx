import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/brs/hero";
import { Services } from "@/components/brs/services";
import { Philosophy } from "@/components/brs/philosophy";
import { HomePageContent } from "@/components/brs/website";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

describe("SPEC-039 — Refinamento da Hero Section e Transição Direta para Especialidades", () => {
  it("AC-039-01: Exclui completamente a faixa de micro-benefícios (trust-strip) do Hero", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    // Ausência do container trust-strip e itens
    expect(container.querySelector(".trust-strip")).toBeNull();
    expect(container.querySelectorAll(".trust-item")).toHaveLength(0);
  });

  it("AC-039-02: Hero possui CTA dominante e botão secundário Ver especialidades com estilo outline apontando para #especialidades", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    // CTA Primário de conversão dominante
    const primaryCta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute("href", "/contato");
    expect(primaryCta.className).toContain("btn--primary");

    // Botão Secundário 'Ver especialidades' com peso outline/ghost (.btn--secondary)
    const secondaryCta = screen.getByRole("link", { name: /ver especialidades/i });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute("href", "#especialidades");
    expect(secondaryCta.className).toContain("btn--secondary");

    // Limpeza de tags soltas sobre Toledo no rodapé do Hero e ausência de link duplicado no rodapé
    const footerLinks = container.querySelectorAll(".page-width a[href='#servicos']");
    expect(footerLinks).toHaveLength(0);

    // Localização mantida com elegância e sutileza no eyebrow
    const eyebrow = container.querySelector(".eyebrow");
    expect(eyebrow?.textContent).toContain("Toledo, PR");
  });

  it("AC-039-03: Especialidades responde a #especialidades e #servicos com respiro vertical adequado (py-16 md:py-24)", () => {
    const { container } = render(<Services />);

    // Seção possui ID servicos e âncora especialidades
    const section = container.querySelector("#servicos");
    expect(section).not.toBeNull();
    expect(section?.className).toContain("py-16");
    expect(section?.className).toContain("md:py-24");

    const anchor = container.querySelector("#especialidades");
    expect(anchor).not.toBeNull();
  });

  it("AC-039-04: Conecta Hero diretamente a Especialidades e incorpora diferenciais organicamente em Philosophy", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <HomePageContent />
      </SmoothScrollProvider>,
    );

    // Hero (#inicio) e Especialidades (#servicos / #especialidades) presentes na Home
    expect(container.querySelector("#inicio")).not.toBeNull();
    expect(container.querySelector("#servicos")).not.toBeNull();
    expect(container.querySelector("#especialidades")).not.toBeNull();

    // Validação dos 3 diferenciais integrados organicamente
    const { container: philContainer } = render(<Philosophy />);
    expect(philContainer.textContent).toContain("Reparação e pintura técnica de precisão");
    expect(philContainer.textContent).toContain("Diagnóstico honesto e transparente");
    expect(philContainer.textContent).toContain("Serviço de leva e traz em Toledo-PR");
  });

  it("garante interação com botão secundário de rolagem suave", () => {
    render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    const secondaryBtn = screen.getByRole("link", { name: /ver especialidades/i });
    expect(() => fireEvent.click(secondaryBtn)).not.toThrow();
  });
});
