import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BeforeAfterSlider } from "@/components/brs/before-after-slider";

describe("BeforeAfterSlider component", () => {
  const defaultProps = {
    beforeImage: "/before.jpg",
    afterImage: "/after.jpg",
    beforeAlt: "Estado inicial da lataria",
    afterAlt: "Estado recuperado da lataria",
    beforeLabel: "Antes",
    afterLabel: "Depois",
    initialPosition: 50,
  };

  it("renders both images with correct alt attributes and initial aria-valuenow", () => {
    render(<BeforeAfterSlider {...defaultProps} />);

    expect(screen.getByAltText("Estado inicial da lataria")).toBeInTheDocument();
    expect(screen.getByAltText("Estado recuperado da lataria")).toBeInTheDocument();

    const slider = screen.getByRole("slider", {
      name: "Controle deslizante de comparação antes e depois",
    });
    expect(slider).toHaveAttribute("aria-valuenow", "50");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("supports keyboard navigation with arrows, Home and End keys", () => {
    const onPositionChange = vi.fn();
    render(<BeforeAfterSlider {...defaultProps} onPositionChange={onPositionChange} />);

    const slider = screen.getByRole("slider");

    // Seta para a direita aumenta em 5
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "55");
    expect(onPositionChange).toHaveBeenCalledWith(55);

    // Seta para a esquerda diminui em 5
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider).toHaveAttribute("aria-valuenow", "50");

    // Home leva para 0
    fireEvent.keyDown(slider, { key: "Home" });
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    expect(onPositionChange).toHaveBeenCalledWith(0);

    // End leva para 100
    fireEvent.keyDown(slider, { key: "End" });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    expect(onPositionChange).toHaveBeenCalledWith(100);

    // PageDown diminui em 10 (100 -> 90)
    fireEvent.keyDown(slider, { key: "PageDown" });
    expect(slider).toHaveAttribute("aria-valuenow", "90");
    expect(onPositionChange).toHaveBeenCalledWith(90);

    // PageUp aumenta em 10 (90 -> 100)
    fireEvent.keyDown(slider, { key: "PageUp" });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    expect(onPositionChange).toHaveBeenCalledWith(100);
  });

  it("renders custom labels, hint text and handles clamping", () => {
    render(
      <BeforeAfterSlider
        {...defaultProps}
        beforeLabel="Avaria"
        afterLabel="Restauração"
        initialPosition={150} // Deve ser clampado para 100
        hint="Arraste para inspecionar"
      />,
    );

    expect(screen.getByText("Avaria")).toBeInTheDocument();
    expect(screen.getByText("Restauração")).toBeInTheDocument();
    expect(screen.getByText("Arraste para inspecionar")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "100");
  });

  it("supports priority property configuring eager image loading", () => {
    render(<BeforeAfterSlider {...defaultProps} priority />);

    const afterImg = screen.getByAltText("Estado recuperado da lataria");
    expect(afterImg).toHaveAttribute("loading", "eager");
    expect(afterImg).toHaveAttribute("fetchpriority", "high");
  });
});
