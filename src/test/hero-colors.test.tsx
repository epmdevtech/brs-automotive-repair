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

  it("renderiza o badge overline com tokens de primary e sem tons alaranjados residuais", () => {
    const { container } = render(<Hero />);
    const badgeText = screen.getByText("Precisão no reparo • Cuidado no atendimento");
    expect(badgeText).toBeInTheDocument();
    expect(badgeText.className).toContain("text-primary");

    const badgeContainer = badgeText.closest("div");
    expect(badgeContainer).not.toBeNull();
    expect(badgeContainer?.className).toContain("border-primary/20");
    expect(badgeContainer?.className).toContain("bg-primary/10");
    expect(badgeContainer?.className).not.toContain("amber");
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

  it("garante correspondência exata de classes entre o botão primário da Hero e o CTA da Navbar", () => {
    const { container: heroContainer } = render(<Hero />);
    const { container: headerContainer } = render(<Header />);

    // Filtra especificamente os botões de ação 'Solicitar avaliação'
    const heroCta = heroContainer.querySelector("a[href='/contato']");
    const headerCta = headerContainer.querySelector("a.bg-primary[href='/contato']");

    expect(heroCta).not.toBeNull();
    expect(headerCta).not.toBeNull();

    // Ambos os botões compartilham os tokens primários
    expect(heroCta?.className).toContain("bg-primary");
    expect(heroCta?.className).toContain("text-primary-foreground");
    expect(heroCta?.className).toContain("hover:bg-primary/90");

    expect(headerCta?.className).toContain("bg-primary");
    expect(headerCta?.className).toContain("text-primary-foreground");
    expect(headerCta?.className).toContain("hover:bg-primary/90");
  });

  it("renderiza o botão secundário da Hero com o padrão dark do site", () => {
    const { container } = render(<Hero />);
    const secondaryBtn = container.querySelector("a[href='/servicos']");

    expect(secondaryBtn).not.toBeNull();
    expect(secondaryBtn?.className).toContain("border-neutral-800");
    expect(secondaryBtn?.className).toContain("bg-neutral-900/60");
    expect(secondaryBtn?.className).toContain("text-neutral-300");
    expect(secondaryBtn?.className).toContain("hover:bg-neutral-800");
    expect(secondaryBtn?.className).toContain("hover:text-white");
  });
});
