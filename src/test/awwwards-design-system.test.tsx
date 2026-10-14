import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SPEC-035 / TASK-035-01 — Awwwards Design System & Anti-AI Genericness", () => {
  const ROOT = process.cwd();
  const read = (file: string) => fs.readFileSync(path.resolve(ROOT, file), "utf-8");

  describe("1. Artefato Canônico DESIGN.md", () => {
    it("garante a existência de DESIGN.md na raiz do repositório", () => {
      expect(fs.existsSync(path.resolve(ROOT, "DESIGN.md"))).toBe(true);
    });

    it("contém todas as seções obrigatórias de especificação criativa da skill Awwwards", () => {
      const designDoc = read("DESIGN.md");

      // Brief e Diagnóstico
      expect(designDoc).toContain("Brief & Diagnóstico Canônico");
      expect(designDoc).toContain("BRS Reparações Automotivas");

      // Concept Card
      expect(designDoc).toContain("Concept Card");
      expect(designDoc).toContain("Ideia:");
      expect(designDoc).toContain("Metáfora:");
      expect(designDoc).toContain("Assinatura:");
      expect(designDoc).toContain("Emoção:");
      expect(designDoc).toContain("Verbo Motion:");

      // Paleta de 5 papéis funcionais
      expect(designDoc).toContain("Ground");
      expect(designDoc).toContain("Ink");
      expect(designDoc).toContain("Muted");
      expect(designDoc).toContain("Line");
      expect(designDoc).toContain("Accent");
      expect(designDoc).toContain("Curtain");

      // Tipografia e escala fluida
      expect(designDoc).toContain("Sora");
      expect(designDoc).toContain("Manrope");
      expect(designDoc).toContain("--t-mega");
      expect(designDoc).toContain("--t-xl");
      expect(designDoc).toContain("--t-body");

      // Spacing moods e grid
      expect(designDoc).toContain("--space-tight");
      expect(designDoc).toContain("--space-normal");
      expect(designDoc).toContain("--space-airy");
      expect(designDoc).toContain("--space-viewport");

      // Anti-AI Genericness Audit
      expect(designDoc).toContain("Anti-AI Genericness Audit");
    });
  });

  describe("2. Tokens de Escala Tipográfica Fluida e Spacing Moods em src/styles.css", () => {
    const css = read("src/styles.css");

    it("declara a escala tipográfica fluida com tokens --t-*", () => {
      expect(css).toContain("--t-mega:");
      expect(css).toContain("--t-xl:");
      expect(css).toContain("--t-l:");
      expect(css).toContain("--t-m:");
      expect(css).toContain("--t-body:");
      expect(css).toContain("--t-s:");
      expect(css).toContain("--t-xs:");
      expect(css).toContain("--t-micro:");
    });

    it("declara spacing moods deliberados e classes utilitárias de ritmo", () => {
      expect(css).toContain("--space-tight:");
      expect(css).toContain("--space-normal:");
      expect(css).toContain("--space-airy:");
      expect(css).toContain("--space-viewport:");
      expect(css).toContain(".space-tight");
      expect(css).toContain(".space-normal");
      expect(css).toContain(".space-airy");
      expect(css).toContain(".tech-card");
      expect(css).toContain(".hairline-border");
    });
  });

  describe("3. Erradicação e Blindagem contra Estilos Genéricos de IA", () => {
    it("não contém gradientes roxos/azuis artificiais ou paletas genéricas de IA no CSS", () => {
      const css = read("src/styles.css");

      expect(css).not.toMatch(/linear-gradient\([^)]*(#6366f1|#a855f7|#8b5cf6|purple|violet)/i);
      expect(css).not.toMatch(/from-purple/);
      expect(css).not.toMatch(/from-violet/);
      expect(css).not.toMatch(/from-indigo/);
    });

    it("garante que as páginas de serviço e galeria utilizam matrizes arquiteturais em vez de cards SaaS genéricos", () => {
      const gallery = read("src/components/brs/project-gallery.tsx");
      const servicesLayout = read("src/components/brs/service-page-layout.tsx");

      expect(gallery).toContain("border-y border-border/80");
      expect(servicesLayout).toContain("border-y border-border/80");
    });
  });
});
