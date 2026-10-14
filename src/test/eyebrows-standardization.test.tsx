import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/brs/hero";
import { Services } from "@/components/brs/services";
import { Philosophy } from "@/components/brs/philosophy";
import { HomeBeforeAfter } from "@/components/brs/home-before-after";
import { FinalCTA } from "@/components/brs/final-cta";
import { PageHero } from "@/components/brs/page-hero";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

describe("SPEC-040 — Padronização Tipográfica dos Rótulos de Seção (Eyebrows) e Remoção de Travessões", () => {
  it("AC-040-01: Garante que o pseudo-elemento .eyebrow::before foi completamente eliminado do CSS", () => {
    const cssPath = path.resolve(process.cwd(), "src/styles.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    // Não deve existir a regra .eyebrow::before que injeta traços horizontais
    expect(cssContent).not.toContain(".eyebrow::before");

    // Token de tracking normativo deve ser 0.2em
    expect(cssContent).toContain("--tracking-eyebrow: 0.2em;");
  });

  it("AC-040-02: Valida propriedades tipográficas normativas da classe .eyebrow", () => {
    const cssPath = path.resolve(process.cwd(), "src/styles.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    // Classe eyebrow deve possuir estilo técnico e elegante
    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*text-transform:\s*uppercase/);
    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*letter-spacing:\s*var\(--tracking-eyebrow\)/);
    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*color:\s*var\(--primary\)/);
    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*font-size:\s*0\.75rem/);
  });

  it("AC-040-03: Garante que nenhum eyebrow nos componentes principais inicia com travessão ('—' ou '-')", () => {
    const components = [
      <SmoothScrollProvider key="hero">
        <Hero />
      </SmoothScrollProvider>,
      <Services key="services" />,
      <Philosophy key="philosophy" />,
      <HomeBeforeAfter key="before-after" />,
      <FinalCTA key="final-cta" />,
      <PageHero
        key="page-hero"
        eyebrow="Especialidade Técnica"
        title="Pintura em Estufa"
        description="Descrição da atividade técnica"
        breadcrumbs={[{ name: "Serviços", path: "/servicos" }]}
      />,
    ];

    components.forEach((comp) => {
      const { container } = render(comp);
      const eyebrows = container.querySelectorAll(".eyebrow");
      expect(eyebrows.length).toBeGreaterThan(0);

      eyebrows.forEach((el) => {
        const text = el.textContent?.trim() || "";
        // Não deve iniciar com travessão ou hífen decorativo
        expect(text.startsWith("—")).toBe(false);
        expect(text.startsWith("-")).toBe(false);
        expect(text.startsWith("–")).toBe(false);
      });
    });
  });
});
