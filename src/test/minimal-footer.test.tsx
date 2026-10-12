import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MinimalFooter } from "@/components/ui/minimal-footer";
import { Website } from "@/components/brs/website";
import { company } from "@/lib/brs";

describe("SPEC-013 — MinimalFooter Premium BRS", () => {
  it("renderiza a marca oficial da BRS e o texto institucional aprovado", () => {
    const { container } = render(<MinimalFooter />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();

    expect(screen.getByLabelText(/BRS Reparações Automotivas: início/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Funilaria, pintura automotiva e martelinho de ouro com atenção aos detalhes e cuidado em cada etapa./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Toledo, Paraná/i)).toBeInTheDocument();
  });

  it("renderiza todos os links de navegação com âncoras reais da página", () => {
    render(<MinimalFooter />);
    const nav = screen.getByRole("navigation", { name: "Navegação do rodapé" });
    expect(nav).toBeInTheDocument();

    const links = nav.querySelectorAll("a");
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("#inicio");
    expect(hrefs).toContain("#servicos");
    expect(hrefs).toContain("#trabalho");
    expect(hrefs).toContain("#corretores");
    expect(hrefs).toContain("#sobre");
    expect(hrefs).toContain("#contato");
  });

  it("disponibiliza links oficiais confirmados de telefone e Instagram, sem redes sociais falsas", () => {
    const { container } = render(<MinimalFooter />);

    // Link de telefone oficial tel:
    const phoneLink = container.querySelector(`a[href="${company.phoneHref}"]`);
    expect(phoneLink).not.toBeNull();
    expect(phoneLink?.textContent).toContain(company.phone);

    // Link de Instagram oficial
    const instaLink = container.querySelector(`a[href="${company.instagram}"]`);
    expect(instaLink).not.toBeNull();
    expect(instaLink).toHaveAttribute("target", "_blank");
    expect(instaLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(instaLink?.textContent).toContain("@brsreparacoes");

    // Garante que não existem links ou redes sociais fictícias de SaaS
    const allLinks = Array.from(container.querySelectorAll("a")).map(
      (a) => a.getAttribute("href") || "",
    );
    expect(allLinks.some((href) => href.includes("twitter.com") || href.includes("x.com"))).toBe(
      false,
    );
    expect(allLinks.some((href) => href.includes("facebook.com"))).toBe(false);
    expect(allLinks.some((href) => href.includes("linkedin.com"))).toBe(false);
    expect(allLinks.some((href) => href.includes("github.com"))).toBe(false);
  });

  it("exibe o ano atual dinamicamente e a nota de conformidade do acervo ilustrativo", () => {
    render(<MinimalFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} BRS Reparações Automotivas`, "i")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Demonstração institucional oficial · Fotografias ilustrativas temporárias/i,
      ),
    ).toBeInTheDocument();
  });

  it("garante que exatamente UM footer é renderizado no layout completo do Website", () => {
    const { container } = render(<Website />);
    const footers = container.querySelectorAll("footer");
    expect(footers.length).toBe(1);
  });
});
