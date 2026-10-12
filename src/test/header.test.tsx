import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/brs/header";
import { Website } from "@/components/brs/website";

describe("Header component and floating capsule navbar", () => {
  it("renders the single Header with brand and navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("BRS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "/servicos");
  });

  it("renders floating capsule design with dark glassmorphism and rounded gold CTA", () => {
    const { container } = render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("fixed");

    // Cápsula flutuante centralizada com glassmorphism escuro
    const capsule = container.querySelector(".max-w-6xl");
    expect(capsule).toBeInTheDocument();
    expect(capsule).toHaveClass("rounded-full");
    expect(capsule).toHaveClass("backdrop-blur-md");

    // Botão CTA dourado com cantos arredondados rounded-full
    const ctaButton = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(ctaButton.closest("button") || ctaButton).toHaveClass("rounded-full");
  });

  it("toggles the responsive mobile navigation on hamburger click", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Abrir menu de navegação" });
    fireEvent.click(menuButton);

    const mobileNav = screen.getByLabelText("Navegação móvel");
    expect(mobileNav).toBeInTheDocument();
    expect(mobileNav).toHaveClass("rounded-2xl");
  });

  it("ensures exactly ONE banner/header exists on the entire landing page", () => {
    render(<Website />);

    const headers = screen.getAllByRole("banner");
    expect(headers).toHaveLength(1);
  });
});
