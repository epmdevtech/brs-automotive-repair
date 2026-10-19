import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/brs/hero";
import { Services } from "@/components/brs/services";
import { ProjectGallery } from "@/components/brs/project-gallery";
import { Header } from "@/components/brs/header";
import { Route } from "@/routes/__root";

describe("Sistema Tipográfico Master (SPEC-009)", () => {
  it("carrega exclusivamente Sora e Manrope com pesos otimizados no Head", () => {
    const headConfig = Route.options.head?.({} as never);
    const stylesheetLink = headConfig?.links?.find(
      (link) =>
        link.rel === "stylesheet" &&
        typeof link.href === "string" &&
        link.href.includes("fonts.googleapis.com"),
    );

    expect(stylesheetLink).toBeDefined();
    const href = stylesheetLink?.href ?? "";
    expect(href).toContain("family=Manrope:wght@400;500;600");
    expect(href).toContain("family=Sora:wght@500;600");
    expect(href).toContain("display=swap");
    expect(href).not.toContain("Barlow");
  });

  it("centraliza as variáveis de fontes e escala fluida com clamp em styles.css", () => {
    const stylesPath = path.resolve(process.cwd(), "src/styles.css");
    const stylesContent = fs.readFileSync(stylesPath, "utf-8");

    // Famílias tipográficas
    expect(stylesContent).toContain('--font-display: "Sora"');
    expect(stylesContent).toContain('--font-body: "Manrope"');

    // Escala fluida clamp()
    expect(stylesContent).toMatch(/--text-hero:\s*clamp\(/);
    expect(stylesContent).toMatch(/--text-section:\s*clamp\(/);
    expect(stylesContent).toMatch(/--text-h3:\s*clamp\(/);
    expect(stylesContent).toMatch(/--text-body:\s*clamp\(/);

    // Boas práticas de estabilidade e wrapping editorial
    expect(stylesContent).toContain("font-size-adjust: from-font");
    expect(stylesContent).toContain("text-wrap: balance");
    expect(stylesContent).toContain("text-wrap: pretty");
  });

  it("renderiza o Hero com H1 em Sora font-semibold sem uppercase agressivo", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("font-display");
    expect(heading.className).toContain("font-semibold");
    expect(heading.className).not.toContain("uppercase");
    expect(heading.textContent?.replace(/\u00a0/g, " ")).toContain(
      "Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR.",
    );
  });

  it("renderiza cards de serviços com títulos sem caixa alta forçada", () => {
    render(<Services />);
    const serviceHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(serviceHeadings.length).toBeGreaterThanOrEqual(3);

    serviceHeadings.forEach((h3) => {
      expect(h3.className).toContain("font-display");
      expect(h3.className).toContain("font-semibold");
      expect(h3.className).not.toContain("uppercase");
    });
  });

  it("renderiza galeria de projetos com títulos de caso sem uppercase forçado", () => {
    render(<ProjectGallery />);
    const caseHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(caseHeadings.length).toBe(3);

    caseHeadings.forEach((h3) => {
      expect(h3.className).toContain("font-display");
      expect(h3.className).toContain("font-semibold");
      expect(h3.className).not.toContain("uppercase");
    });
  });

  it("renderiza a barra de navegação com links legíveis em Manrope", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(nav).toBeInTheDocument();
    const links = nav.querySelectorAll("a");
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      expect(link.className).toContain("font-medium");
      expect(link.className).not.toContain("uppercase");
    });
  });
});
