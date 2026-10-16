import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SiteLayout } from "@/components/brs/site-layout";
import { Hero } from "@/components/brs/hero";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";
import { PageTransition } from "@/components/ui/page-transition";

describe("SPEC-063 — Prevenção e Blindagem Contra Estouro de Layout Mobile", () => {
  it("AC-063-01: Garante regras de contenção overflow-x clip e max-width 100% em html e body no CSS global", () => {
    const cssPath = path.resolve(process.cwd(), "src/styles.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    // html deve conter overflow-x: clip e max-width: 100%
    expect(cssContent).toMatch(/html\s*\{[^}]*overflow-x:\s*clip/);
    expect(cssContent).toMatch(/html\s*\{[^}]*max-width:\s*100%/);

    // body deve conter overflow-x: clip e max-width: 100%
    expect(cssContent).toMatch(/body\s*\{[^}]*overflow-x:\s*clip/);
    expect(cssContent).toMatch(/body\s*\{[^}]*max-width:\s*100%/);
  });

  it("AC-063-02: Valida flexibilidade e quebra de linha do rótulo .eyebrow para telas estreitas", () => {
    const cssPath = path.resolve(process.cwd(), "src/styles.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*max-width:\s*100%/);
    expect(cssContent).toMatch(/\.eyebrow\s*\{[^}]*word-break:\s*break-word/);
  });

  it("AC-063-03: Garante contenção de layout e ausência de estouro em SiteLayout e PageTransition", () => {
    const { container } = render(
      <SiteLayout>
        <div data-testid="test-content">Conteúdo de Teste</div>
      </SiteLayout>,
    );

    const siteWrapper = container.querySelector(".min-h-screen");
    expect(siteWrapper).toHaveClass("w-full", "max-w-full", "overflow-x-clip");

    const mainElement = container.querySelector("main#conteudo-principal");
    expect(mainElement).toHaveClass("w-full", "max-w-full", "overflow-x-clip");
  });

  it("AC-063-04: PageTransition possui classes de proteção max-w-full e overflow-x-clip", () => {
    const { container } = render(
      <PageTransition pathname="/">
        <div>Transição Segura</div>
      </PageTransition>,
    );

    const transitionDiv = container.querySelector(".w-full");
    expect(transitionDiv).toHaveClass("max-w-full", "overflow-x-clip");
  });

  it("AC-063-05: Hero section renderiza com limites max-w-full e eyebrow flex-wrap", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <Hero />
      </SmoothScrollProvider>,
    );

    const section = container.querySelector("section#inicio");
    expect(section).toHaveClass("max-w-full", "overflow-x-clip");

    const eyebrow = container.querySelector(".eyebrow");
    expect(eyebrow).toHaveClass("flex", "flex-wrap", "max-w-full");
  });
});
