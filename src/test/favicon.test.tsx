import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { Route } from "@/routes/__root";

describe("SPEC-011 — Identidade Visual de Favicon BRS e Expurgo Lovable", () => {
  const publicDir = path.resolve(process.cwd(), "public");

  it("verifica a presença de todos os assets de favicon e ícones no diretório public", () => {
    const requiredFiles = [
      "favicon.ico",
      "favicon.svg",
      "apple-touch-icon.png",
      "favicon-96x96.png",
      "web-app-manifest-192x192.png",
      "web-app-manifest-512x512.png",
      "site.webmanifest",
    ];

    requiredFiles.forEach((file) => {
      const filePath = path.join(publicDir, file);
      expect(fs.existsSync(filePath), `Arquivo ${file} deve existir em public/`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(0);
    });
  });

  it("valida que favicon.svg representa fielmente a marca BRS", () => {
    const svgPath = path.join(publicDir, "favicon.svg");
    const svgContent = fs.readFileSync(svgPath, "utf-8");

    // Verifica elementos canônicos da marca BRS
    expect(svgContent).toContain("BR");
    expect(svgContent).toContain("S");
    expect(svgContent).toContain("REPARAÇÕES");
    expect(svgContent).toMatch(/#f59e0b/i); // Dourado âmbar oficial
    expect(svgContent).not.toContain("lovable");
  });

  it("valida que site.webmanifest contém dados oficiais da BRS", () => {
    const manifestPath = path.join(publicDir, "site.webmanifest");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.name).toBe("BRS Reparações Automotivas");
    expect(manifest.short_name).toBe("BRS");
    expect(manifest.theme_color).toBe("#0b0d10");
    expect(manifest.background_color).toBe("#0b0d10");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
  });

  it("declara favicons, apple touch icon e manifesto nos metadados do RootRoute", () => {
    // Executa a função head configurada na rota raiz
    const headConfig =
      typeof Route.options.head === "function" ? Route.options.head({} as never) : null;
    expect(headConfig).not.toBeNull();

    const links = headConfig?.links || [];
    const hrefs = links.map((l: { href?: string }) => l.href);

    expect(hrefs).toContain("/favicon.ico");
    expect(hrefs).toContain("/favicon.svg");
    expect(hrefs).toContain("/apple-touch-icon.png");
    expect(hrefs).toContain("/site.webmanifest");

    // Verifica que não há nenhuma menção residual a Lovable
    const stringified = JSON.stringify(headConfig);
    expect(stringified.toLowerCase()).not.toContain("lovable");
  });
});
