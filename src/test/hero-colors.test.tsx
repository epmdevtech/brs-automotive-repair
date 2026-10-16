import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/brs/hero";
import { Header } from "@/components/brs/header";

describe("SPEC-012 / SPEC-064 — Padronização de Cores da Seção Hero e Sincronia com Navbar", () => {
  it("renderiza o H1 de forma monocromática em branco sem text-primary ou text-amber-500 (SPEC-044 / SPEC-064)", () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain(
      "Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR.",
    );

    // O H1 deve conter a classe de texto em branco e não conter text-primary nem text-amber-500
    expect(h1?.className).toContain("text-white");
    expect(h1?.querySelector(".text-primary")).toBeNull();
    expect(h1?.innerHTML).not.toContain("text-amber-500");
  });

  it("assegura que o selo genérico de IA foi completamente eliminado do Hero (SPEC-022)", () => {
    render(<Hero />);
    const badgeText = screen.queryByText(/Precisão no reparo • Cuidado no atendimento/i);
    expect(badgeText).toBeNull();
  });

  it("renderiza o texto descritivo com leitura clara sobre serviços e diagnóstico", () => {
    const { container } = render(<Hero />);
    const desc = container.querySelector("p");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toContain(
      "Reparação de lataria, pintura automotiva em cabine e desamassamento sem pintura",
    );
  });

  it("garante que o Header e a Hero possuem o CTA canônico 'Solicitar avaliação' apontando para /contato (SPEC-064)", () => {
    const { container: heroContainer } = render(<Hero />);
    const { container: headerContainer } = render(<Header />);

    const heroPrimaryCta = heroContainer.querySelector("a[href='/contato']");
    expect(heroPrimaryCta).not.toBeNull();
    expect(heroPrimaryCta?.className).toContain("btn--primary");

    const headerCta = headerContainer.querySelector("a[href='/contato']");
    expect(headerCta).not.toBeNull();
    expect(headerCta?.className).toContain("btn--primary");
    expect(headerCta?.className).not.toContain("btn-bevel-4");
  });

  it("exibe endereço e horário confirmados na barra inferior da Hero (SPEC-064)", () => {
    render(<Hero />);
    expect(screen.getByText(/R\. Barão do Rio Branco, 4892/i)).toBeInTheDocument();
    expect(screen.getByText(/Segunda a sexta, das 08h às 18h/i)).toBeInTheDocument();
  });
});
