import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/brs/hero";
import { Header } from "@/components/brs/header";

describe("SPEC-012 — Padronização de Cores da Seção Hero e Sincronia com Navbar", () => {
  it("renderiza o H1 de forma monocromática em branco sem text-primary ou text-amber-500 (SPEC-044)", () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain("BRS Reparações Automotivas.");

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

  it("renderiza o texto descritivo com a classe de parágrafo text-neutral-400", () => {
    const { container } = render(<Hero />);
    const desc = container.querySelector("p");
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toContain(
      "Funilaria automotiva, pintura em estufa e martelinho de ouro",
    );
    expect(desc?.className).toContain("text-neutral-400");
  });

  it("garante que o Header mantém o CTA canônico e o Hero não duplica o botão de avaliação (SPEC-041)", () => {
    const { container: heroContainer } = render(<Hero />);
    const { container: headerContainer } = render(<Header />);

    // Hero não possui botão duplicado para /contato (SPEC-041)
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
    const secondaryBtn = container.querySelector("a[href='#especialidades']");

    expect(secondaryBtn).not.toBeNull();
    expect(secondaryBtn?.className).toContain("btn--secondary");
    expect(secondaryBtn?.className).not.toContain("btn-bevel-4");
  });
});
