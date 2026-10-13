import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/brs/hero";
import { Header } from "@/components/brs/header";

describe("SPEC-012 — Padronização de Cores da Seção Hero e Sincronia com Navbar", () => {
  it("renderiza o H1 com 'BRS Reparações' em text-white e 'Automotivas.' em text-primary", () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();

    const whiteSpan = h1?.querySelector(".text-white");
    expect(whiteSpan).not.toBeNull();
    expect(whiteSpan?.textContent).toContain("BRS Reparações");

    const primarySpan = h1?.querySelector(".text-primary");
    expect(primarySpan).not.toBeNull();
    expect(primarySpan?.textContent).toContain("Automotivas.");

    // Garante que não restou o tom alaranjado saturado text-amber-500 no H1
    expect(h1?.innerHTML).not.toContain("text-amber-500");
  });

  it("assegura que o selo genérico de IA foi completamente eliminado do Hero (SPEC-022)", () => {
    render(<Hero />);
    const badgeText = screen.queryByText(/Precisão no reparo • Cuidado no atendimento/i);
    expect(badgeText).toBeNull();
  });

  it("renderiza o texto descritivo com a classe de parágrafo text-neutral-400", () => {
    const { container } = render(<Hero />);
    const desc = container.querySelector("p");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toContain(
      "Funilaria automotiva, pintura em estufa e martelinho de ouro",
    );
    expect(desc?.className).toContain("text-neutral-400");
  });

  it("garante que o Hero não duplica o CTA do Header e o Header mantém o CTA primário (SPEC-022)", () => {
    const { container: heroContainer } = render(<Hero />);
    const { container: headerContainer } = render(<Header />);

    // Hero não possui o botão duplicado 'Solicitar avaliação'
    const heroPrimaryCta = heroContainer.querySelector("a[href='/contato']");
    expect(heroPrimaryCta).toBeNull();

    // Header possui o CTA primário com a classe canônica .btn--primary e sem chanfro
    const headerCta = headerContainer.querySelector("a[href='/contato']");
    expect(headerCta).not.toBeNull();
    expect(headerCta?.className).toContain("btn--primary");
    expect(headerCta?.className).not.toContain("btn-bevel-4");
  });

  it("renderiza o botão secundário exclusivo da Hero com o padrão normativo .btn--secondary", () => {
    const { container } = render(<Hero />);
    const secondaryBtn = container.querySelector("a[href='/servicos']");

    expect(secondaryBtn).not.toBeNull();
    expect(secondaryBtn?.className).toContain("btn--secondary");
    expect(secondaryBtn?.className).not.toContain("btn-bevel-4");
  });
});
