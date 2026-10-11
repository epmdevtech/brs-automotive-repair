import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectGallery } from "@/components/brs/project-gallery";

describe("ProjectGallery component with Lightbox", () => {
  it("renders the 3 gallery cases with interactive sliders", () => {
    render(<ProjectGallery />);

    expect(screen.getByText("Alinhamento Estrutural e Recuperação de Vincos")).toBeInTheDocument();
    expect(screen.getByText("Equalização de Cor e Verniz Alto Sólidos")).toBeInTheDocument();
    expect(screen.getByText("Desamassamento Fino sem Repintura")).toBeInTheDocument();

    const sliders = screen.getAllByRole("slider");
    expect(sliders.length).toBe(3);
  });

  it("opens the high-res Lightbox modal on clicking 'Inspecionar ampliado'", () => {
    render(<ProjectGallery />);

    const inspectButtons = screen.getAllByRole("button", { name: /Inspecionar ampliado/ });
    expect(inspectButtons.length).toBe(3);

    fireEvent.click(inspectButtons[0]);

    // O modal deve ser exibido com role dialog
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Deve exibir os detalhes e o botão de navegação
    expect(
      screen.getByRole("button", { name: "Visualizar próximo caso técnico" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Visualizar caso técnico anterior" }),
    ).toBeInTheDocument();
  });
});
