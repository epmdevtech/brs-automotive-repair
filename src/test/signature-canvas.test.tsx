import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignatureCanvas } from "@/components/brs/signature-canvas";
import { PageTransition } from "@/components/ui/page-transition";

describe("SPEC-033 — Signature WebGL/Canvas Experience & Refined Page Transitions", () => {
  it("SignatureCanvas renderiza canvas e HUD de controle óptico", () => {
    const { container } = render(<SignatureCanvas />);

    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();

    expect(screen.getByText("OPTICAL HUD")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VERNIZ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LASER" })).toBeInTheDocument();
  });

  it("permite alternar entre os modos VERNIZ e LASER no HUD", () => {
    render(<SignatureCanvas />);

    const laserButton = screen.getByRole("button", { name: "LASER" });
    fireEvent.click(laserButton);
    expect(laserButton.className).toContain("bg-primary");

    const vernizButton = screen.getByRole("button", { name: "VERNIZ" });
    fireEvent.click(vernizButton);
    expect(vernizButton.className).toContain("bg-primary");
  });

  it("permite ocultar o HUD pelo botão de visualização", () => {
    render(<SignatureCanvas />);

    const hideButton = screen.getByRole("button", {
      name: "Ocultar HUD de controle óptico",
    });
    fireEvent.click(hideButton);

    expect(screen.queryByText("OPTICAL HUD")).toBeNull();
  });

  it("PageTransition renderiza conteúdo da rota e barra laser superior transitória", () => {
    const { container } = render(
      <PageTransition pathname="/servicos">
        <div data-testid="page-content">Serviços de Pintura e Funilaria</div>
      </PageTransition>,
    );

    expect(screen.getByTestId("page-content")).toHaveTextContent("Serviços de Pintura e Funilaria");
    // Presença da barra laser de rota
    const laserBar = container.querySelector("[aria-hidden='true']");
    expect(laserBar).not.toBeNull();
  });
});
