import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/brs/header";
import { Website } from "@/components/brs/website";

describe("Header component and single navbar layout", () => {
  it("renders the single Header with brand and navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("BRS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "#inicio");
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "#servicos");
  });

  it("toggles the responsive mobile navigation on hamburger click", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Abrir menu de navegação" });
    fireEvent.click(menuButton);

    const mobileNav = screen.getByLabelText("Navegação móvel");
    expect(mobileNav).toBeInTheDocument();
  });

  it("ensures exactly ONE banner/header exists on the entire landing page", () => {
    render(<Website />);

    const headers = screen.getAllByRole("banner");
    expect(headers).toHaveLength(1);
  });
});
