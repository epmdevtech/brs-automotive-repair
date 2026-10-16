import fs from "node:fs";
import path from "node:path";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { company, services, canonicalUrl } from "@/lib/brs";

const PUBLIC_ROUTES = [
  "/",
  "/servicos",
  "/servicos/funilaria",
  "/servicos/pintura-automotiva",
  "/servicos/martelinho-de-ouro",
  "/trabalhos",
  "/para-corretores",
  "/sobre",
  "/contato",
  "/privacidade",
];

describe("SPEC-014 — Arquitetura Multipágina, SEO Técnico e LLMs", () => {
  const queryClient = new QueryClient();
  const router = createRouter({ routeTree, context: { queryClient } });

  describe("1. Arquitetura de Roteamento TanStack Router", () => {
    it.each(PUBLIC_ROUTES)("resolve com sucesso a rota pública '%s'", (routePath) => {
      const matches = router.matchRoutes(routePath);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });

    it("resolve a rota 404 personalizada", () => {
      const matches = router.matchRoutes("/404");
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    });
  });

  describe("2. Integridade de Metadados e SEO Técnico", () => {
    it("garante que todas as rotas públicas possuem metadados canônicos e descrições coerentes", () => {
      const canonicalUrls = PUBLIC_ROUTES.map((p) => canonicalUrl(p));
      const uniqueCanonicals = new Set(canonicalUrls);

      expect(uniqueCanonicals.size).toBe(PUBLIC_ROUTES.length);
      canonicalUrls.forEach((url) => {
        expect(url).toMatch(/^https:\/\/brs\.epmdevtech\.com\.br(\/.*)?$/);
      });
    });

    it("assegura que os 3 serviços possuem rotas dedicadas e descrições técnicas", () => {
      expect(services).toHaveLength(3);
      services.forEach((service) => {
        expect(PUBLIC_ROUTES).toContain(service.path);
        expect(service.applications.length).toBeGreaterThanOrEqual(3);
        expect(service.limitations.length).toBeGreaterThanOrEqual(1);
        expect(service.processSteps.length).toBe(3);
      });
    });
  });

  describe("3. Sitemap XML (/sitemap.xml)", () => {
    const sitemapPath = path.resolve(process.cwd(), "public/sitemap.xml");

    it("arquivo sitemap.xml existe e é um XML bem formatado", () => {
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const content = fs.readFileSync(sitemapPath, "utf-8");
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    });

    it("sitemap.xml lista exatamente as 10 rotas públicas canônicas e nenhuma rota de erro", () => {
      const content = fs.readFileSync(sitemapPath, "utf-8");
      PUBLIC_ROUTES.forEach((route) => {
        const expectedLoc = `<loc>${canonicalUrl(route)}</loc>`;
        expect(content).toContain(expectedLoc);
      });

      // Não deve conter rota 404 no sitemap
      expect(content).not.toContain("/404");
    });
  });

  describe("4. Robots.txt (/robots.txt) e Regras para Motores de Busca e IA", () => {
    const robotsPath = path.resolve(process.cwd(), "public/robots.txt");

    it("arquivo robots.txt existe e faz apontamento para o sitemap.xml", () => {
      expect(fs.existsSync(robotsPath)).toBe(true);
      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content).toContain("Sitemap: https://brs.epmdevtech.com.br/sitemap.xml");
    });

    it("configura permissões documentadas para rastreadores tradicionais e motores de IA", () => {
      const content = fs.readFileSync(robotsPath, "utf-8");
      expect(content).toContain("User-agent: Googlebot");
      expect(content).toContain("User-agent: Bingbot");
      expect(content).toContain("User-agent: OAI-SearchBot");
      expect(content).toContain("User-agent: PerplexityBot");
      expect(content).toContain("User-agent: GPTBot");
      expect(content).toContain("User-agent: *");
      expect(content).toContain("Allow: /");
    });
  });

  describe("5. Arquivo llms.txt (/llms.txt)", () => {
    const llmsPath = path.resolve(process.cwd(), "public/llms.txt");

    it("arquivo llms.txt existe e está formatado em Markdown com dados verificados", () => {
      expect(fs.existsSync(llmsPath)).toBe(true);
      const content = fs.readFileSync(llmsPath, "utf-8");

      expect(content).toContain("# BRS Reparações Automotivas — Toledo, PR");
      expect(content).toContain(company.phone);
      expect(content).toContain(company.instagram);
      expect(content).toContain("Toledo, Paraná");
      expect(content).toContain("As fotografias exibidas no site são ilustrativas");
      expect(content).toContain("Funilaria Automotiva");
      expect(content).toContain("Pintura Automotiva");
      expect(content).toContain("Martelinho de Ouro");

      PUBLIC_ROUTES.forEach((route) => {
        expect(content).toContain(canonicalUrl(route));
      });
    });

    it("não contém dados inventados ou certificações/convênios falsos", () => {
      const content = fs.readFileSync(llmsPath, "utf-8");
      expect(content).not.toContain("CNPJ");
      expect(content).not.toContain("4.9 estrelas");
      expect(content).not.toContain("convênio exclusivo");
    });
  });
});
