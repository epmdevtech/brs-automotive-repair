import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkshopGallery } from "@/components/brs/workshop-gallery";

describe("WorkshopGallery — registros oficiais da oficina", () => {
  it("renderiza as seis fotografias com texto alternativo e dimensões", () => {
    const { container } = render(<WorkshopGallery />);

    const images = Array.from(container.querySelectorAll("img"));
    expect(images).toHaveLength(6);
    images.forEach((image) => {
      expect(image.getAttribute("alt")).toBeTruthy();
      expect(image.getAttribute("width")).toBeTruthy();
      expect(image.getAttribute("height")).toBeTruthy();
    });
  });

  it("abre a ampliação acessível ao acionar uma fotografia", () => {
    render(<WorkshopGallery />);

    fireEvent.click(
      screen.getByRole("button", { name: /Ampliar fotografia: Fachada e caminhão-plataforma/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Registro oficial · 1 de 6/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fotografia anterior/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Próxima fotografia/i })).toBeInTheDocument();
    expect(
      screen.getAllByText(/Placas de terceiros substituídas pela marca/i).length,
    ).toBeGreaterThan(0);
  });
});
