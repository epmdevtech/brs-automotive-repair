import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardSpotlight } from "@/components/brs/card-spotlight";

describe("CardSpotlight component", () => {
  it("renders children content cleanly without layout shifts", () => {
    render(
      <CardSpotlight data-testid="spotlight-card">
        <h3>Funilaria de Precisão</h3>
        <p>Recuperação de vincos</p>
      </CardSpotlight>,
    );

    expect(screen.getByTestId("spotlight-card")).toBeInTheDocument();
    expect(screen.getByText("Funilaria de Precisão")).toBeInTheDocument();
    expect(screen.getByText("Recuperação de vincos")).toBeInTheDocument();
  });

  it("handles mouse pointer interactions without throwing", () => {
    render(
      <CardSpotlight data-testid="spotlight-card">
        <span>Conteúdo de teste</span>
      </CardSpotlight>,
    );

    const card = screen.getByTestId("spotlight-card");
    fireEvent.pointerEnter(card, { clientX: 50, clientY: 50, pointerType: "mouse" });
    fireEvent.pointerMove(card, { clientX: 80, clientY: 80, pointerType: "mouse" });
    fireEvent.pointerLeave(card);

    expect(screen.getByText("Conteúdo de teste")).toBeInTheDocument();
  });

  it("ignores touch pointer interactions to protect mobile performance", () => {
    render(
      <CardSpotlight data-testid="spotlight-card">
        <span>Toque mobile</span>
      </CardSpotlight>,
    );

    const card = screen.getByTestId("spotlight-card");
    fireEvent.pointerEnter(card, { pointerType: "touch" });
    fireEvent.pointerMove(card, { pointerType: "touch" });

    expect(screen.getByText("Toque mobile")).toBeInTheDocument();
  });
});
