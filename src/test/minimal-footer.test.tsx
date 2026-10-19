import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MinimalFooter } from "@/components/ui/minimal-footer";
import { HomePageContent, SiteLayout } from "@/components/brs/website";
import { company } from "@/lib/brs";

describe("SPEC-013 — MinimalFooter Premium Master", () => {
  it("renderiza a marca oficial da Master e o texto institucional aprovado", () => {
    const { container } = render(<MinimalFooter />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();

    expect(screen.getByLabelText(/Master Chapeação e Pinturas: início/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Chapeação, funilaria, pintura em estufa, martelinho de ouro e guincho em Toledo, Paraná/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Av\. Maripá, 4138/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Segunda a sexta, das 08h às 12h e das 13h30 às 18h30/i),
    ).toBeInTheDocument();
  });

  it("renderiza todos os links de navegação com as rotas canônicas da página", () => {
    render(<MinimalFooter />);
    const nav = screen.getByRole("navigation", { name: "Navegação do rodapé" });
    expect(nav).toBeInTheDocument();

    const links = nav.querySelectorAll("a");
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/servicos");
    expect(hrefs).toContain("/trabalhos");
    expect(hrefs).toContain("/para-corretores");
    expect(hrefs).toContain("/sobre");
    expect(hrefs).toContain("/contato");
  });

  it("disponibiliza links oficiais confirmados de telefone, Instagram e Facebook, sem redes sociais falsas", () => {
    const { container } = render(<MinimalFooter />);

    // Link de telefone oficial tel:
    const phoneLink = container.querySelector(`a[href="${company.phoneHref}"]`);
    expect(phoneLink).not.toBeNull();
    expect(phoneLink?.textContent).toContain(company.phone);

    // Links oficiais de Instagram e Facebook
    const instaLink = container.querySelector(`a[href="${company.instagram.url}"]`);
    expect(instaLink).not.toBeNull();
    expect(instaLink).toHaveAttribute("target", "_blank");
    expect(instaLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(instaLink?.textContent).toContain(company.instagram.handle);

    const faceLink = container.querySelector(`a[href="${company.social.url}"]`);
    expect(faceLink).not.toBeNull();
    expect(faceLink).toHaveAttribute("target", "_blank");
    expect(faceLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(faceLink?.textContent).toContain("Master Chapeação e Pinturas");

    // Garante que não existem links ou redes sociais fictícias de SaaS
    const allLinks = Array.from(container.querySelectorAll("a")).map(
      (a) => a.getAttribute("href") || "",
    );
    expect(allLinks.some((href) => href.includes("twitter.com") || href.includes("x.com"))).toBe(
      false,
    );
    expect(allLinks.some((href) => href.includes("linkedin.com"))).toBe(false);
    expect(allLinks.some((href) => href.includes("linkedin.com"))).toBe(false);
    expect(allLinks.some((href) => href.includes("github.com"))).toBe(false);
  });

  it("exibe o ano atual dinamicamente e os dados cadastrais sem a frase de demonstração no rodapé", () => {
    render(<MinimalFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} Master Chapeação e Pinturas`, "i")),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Demonstração institucional oficial/i)).not.toBeInTheDocument();
    expect(screen.getByText(new RegExp(company.legalName, "i"))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(company.cnpj, "i"))).toBeInTheDocument();
  });

  it("garante que exatamente UM footer é renderizado no layout completo do Website", () => {
    const { container } = render(
      <SiteLayout>
        <HomePageContent />
      </SiteLayout>,
    );
    const footers = container.querySelectorAll("footer");
    expect(footers.length).toBe(1);
  });
});
