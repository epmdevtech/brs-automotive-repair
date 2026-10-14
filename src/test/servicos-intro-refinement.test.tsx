import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { Route as ServicosRoute } from "@/routes/servicos/index";
import { PageHero } from "@/components/brs/page-hero";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll-provider";

const ROOT = path.resolve(__dirname, "../..");
const readSource = (file: string) => fs.readFileSync(path.resolve(ROOT, file), "utf-8");

describe("SPEC-042: Refinamento Visual da Hero/Intro de Serviços (/servicos)", () => {
  it("AC-042-01: Garante ausência total dos 3 mini-cards compactos de resumo no Hero de /servicos", () => {
    const Component = ServicosRoute.options.component as React.ComponentType;
    const { container } = render(
      <SmoothScrollProvider>
        <Component />
      </SmoothScrollProvider>,
    );

    const pageHero = container.querySelector("[data-page-hero]");
    expect(pageHero).not.toBeNull();

    // No Hero, não deve existir o grid de badges de telemetria
    const telemetryContainer = pageHero?.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3",
    );
    expect(telemetryContainer).toBeNull();

    // No Hero, não devem existir mini-cards duplicados de telemetria
    expect(pageHero?.textContent).not.toContain("Mesa de tração e gaps de fábrica");
    expect(pageHero?.textContent).not.toContain("Pressão positiva e colorimetria digital");
    expect(pageHero?.textContent).not.toContain("Desamassamento com verniz original");
  });

  it("AC-042-02: Remove CTA primário de avaliação no Hero e preserva apenas ação de exploração secundária", () => {
    const Component = ServicosRoute.options.component as React.ComponentType;
    const { container } = render(
      <SmoothScrollProvider>
        <Component />
      </SmoothScrollProvider>,
    );

    const pageHero = container.querySelector("[data-page-hero]");
    expect(pageHero).not.toBeNull();

    // Ausência do botão "Solicitar avaliação técnica" no Hero
    const linksInHero = Array.from(pageHero?.querySelectorAll("a") || []);
    const avaliacaoLink = linksInHero.find((link) =>
      /solicitar avaliação técnica/i.test(link.textContent || ""),
    );
    expect(avaliacaoLink).toBeUndefined();

    // Presença exclusiva da ação de exploração "Ver trabalhos concluídos"
    const trabalhosLink = linksInHero.find((link) =>
      /ver trabalhos concluídos/i.test(link.textContent || ""),
    );
    expect(trabalhosLink).toBeDefined();
    expect(trabalhosLink?.getAttribute("href")).toBe("/trabalhos");

    // Botão é variante secondary (.btn--secondary) e possui tap target mínimo de 44px
    const button = trabalhosLink?.closest("button") || trabalhosLink;
    expect(button?.className).toContain("btn--secondary");
    expect(button?.className).toContain("min-h-[44px]");

    // Container subsequente possui id lista-servicos e classes de respiro py-16 lg:py-20
    const listaServicosSection = container.querySelector("#lista-servicos");
    expect(listaServicosSection).not.toBeNull();
    expect(listaServicosSection?.className).toContain("py-16");
    expect(listaServicosSection?.className).toContain("lg:py-20");
  });

  it("AC-042-03: PageHero sem telemetria aplica mt-6 sm:mt-8 nas ações e mb-0 na descrição", () => {
    const { container } = render(
      <SmoothScrollProvider>
        <PageHero
          title="Título de Teste"
          description={<p>Descrição do teste institucional</p>}
          actions={[
            {
              label: "Explorar Serviços",
              href: "#lista-servicos",
              variant: "secondary",
            },
          ]}
        />
      </SmoothScrollProvider>,
    );

    const descWrapper = container.querySelector("div.text-neutral-300");
    expect(descWrapper?.className).toContain("mb-0");
    expect(descWrapper?.className).not.toContain("mb-6");

    const actionsWrapper = container.querySelector("[data-page-hero-actions]");
    expect(actionsWrapper?.className).toContain("mt-6");
    expect(actionsWrapper?.className).toContain("sm:mt-8");
    expect(actionsWrapper?.className).toContain("gap-0"); // botão único sem gap órfão
  });

  it("AC-042-03: Código-fonte em servicos/index.tsx não contém imports órfãos nem mapa morto serviceIcons", () => {
    const source = readSource("src/routes/servicos/index.tsx");
    expect(source).not.toContain("serviceIcons");
    expect(source).not.toMatch(/import\s*{[^}]*\bWrench\b[^}]*}\s*from\s*["']lucide-react["']/);
    expect(source).not.toMatch(/import\s*{[^}]*\bPaintbrush\b[^}]*}\s*from\s*["']lucide-react["']/);
    expect(source).not.toMatch(/import\s*{[^}]*\bCar\b[^}]*}\s*from\s*["']lucide-react["']/);
    expect(source).not.toContain("bodywork");
  });
});
