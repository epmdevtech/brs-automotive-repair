import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/brs/header";
import { HomePageContent, SiteLayout } from "@/components/brs/website";

describe("Header component and floating capsule navbar", () => {
  it("renders the single Header with brand and navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByLabelText(/Master Chapeação e Pinturas: início/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute("href", "/servicos");
  });

  it("renders floating capsule design with dark glassmorphism and rounded gold CTA", () => {
    const { container } = render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("fixed");

    // Cápsula flutuante centralizada com glassmorphism escuro e raio normativo de 12px (SPEC-022)
    const capsule = container.querySelector(".max-w-6xl");
    expect(capsule).toBeInTheDocument();
    expect(capsule).toHaveClass("rounded-xl");
    expect(capsule).not.toHaveClass("rounded-full");
    expect(capsule).toHaveClass("backdrop-blur-md");

    // Botão CTA dourado com classe canônica .btn--primary sem chanfro (SPEC-022)
    const ctaButton = screen.getByRole("link", { name: /solicitar avaliação/i });
    const btnElem = ctaButton.closest("button") || ctaButton;
    expect(btnElem).toHaveClass("btn--primary");
    expect(btnElem).not.toHaveClass("btn-bevel-4");
  });

  it("toggles the responsive mobile navigation on hamburger click and preserves lg:hidden without .btn collision", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "Abrir menu de navegação" });
    expect(menuButton).toHaveClass("lg:hidden");
    expect(menuButton).not.toHaveClass("btn");

    fireEvent.click(menuButton);

    const mobileNav = screen.getByLabelText("Navegação móvel");
    expect(mobileNav).toBeInTheDocument();
    expect(mobileNav).toHaveClass("rounded-xl");
  });

  it("ensures exactly ONE banner/header exists on the entire home layout", () => {
    render(
      <SiteLayout>
        <HomePageContent />
      </SiteLayout>,
    );

    const headers = screen.getAllByRole("banner");
    expect(headers).toHaveLength(1);
  });

  it("oculta CTA no mobile na barra superior e exibe rótulo conciso 'Avaliação' no menu móvel (SPEC-062)", () => {
    const { container } = render(<Header />);

    // CTA na barra superior possui hidden sm:inline-flex para não sobrecarregar o topo mobile
    const magneticWrapper = container.querySelector(".hidden.sm\\:inline-flex");
    expect(magneticWrapper).toBeInTheDocument();

    const menuButton = screen.getByRole("button", { name: "Abrir menu de navegação" });
    fireEvent.click(menuButton);

    const mobileNav = screen.getByLabelText("Navegação móvel");
    const mobileCta = mobileNav.querySelector("a[href='/contato']");
    expect(mobileCta).toBeInTheDocument();
    expect(mobileCta).toHaveTextContent("Avaliação");
    expect(mobileCta?.textContent?.trim()).toMatch(/^Avaliação$/i);
  });
});
