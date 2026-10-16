import fs from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "@/components/brs/header";
import { ServicePageLayout } from "@/components/brs/service-page-layout";
import { ContactCTA } from "@/components/brs/contact-cta";
import { HomePageContent, SiteLayout } from "@/components/brs/website";
import { navigation, primaryNavigation, services } from "@/lib/brs";
import { Wrench } from "lucide-react";

const ROOT = process.cwd();
const read = (file: string) => fs.readFileSync(path.resolve(ROOT, file), "utf-8");

describe("SPEC-017 — Consolidação da arquitetura multipágina", () => {
  describe("AC-017-01: home resumida, sem seções movidas para rotas próprias", () => {
    it("não renderiza galeria, formulário de contato, FAQ nem seções completas de sobre/corretores", () => {
      const { container } = render(<HomePageContent />);

      expect(container.querySelector("#trabalho")).toBeNull();
      expect(container.querySelector("#corretores")).toBeNull();
      expect(container.querySelector("#sobre")).toBeNull();
      expect(container.querySelector("#contato")).toBeNull();
      expect(container.querySelector("form")).toBeNull();
      expect(screen.queryByText("Dúvidas frequentes")).toBeNull();
      expect(screen.queryByText("Galeria Antes & Depois")).toBeNull();
    });

    it("mantém hero, serviços, processo e encaminhamento para as páginas internas", () => {
      const { container } = render(<HomePageContent />);

      expect(container.querySelector("#inicio")).not.toBeNull();
      expect(container.querySelector("#servicos")).not.toBeNull();
      expect(container.querySelector("#processo")).not.toBeNull();

      const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
      expect(hrefs).toEqual(expect.arrayContaining(["/para-corretores", "/contato"]));
      services.forEach((service) => expect(hrefs).toContain(service.path));
    });

    it("possui exatamente um h1 e IDs únicos", () => {
      const { container } = render(<HomePageContent />);

      expect(container.querySelectorAll("h1")).toHaveLength(1);
      const ids = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe("AC-017-04: âncoras da home apontam para IDs existentes", () => {
    it("todo href '#x' da home tem um elemento com id correspondente", () => {
      const { container } = render(<HomePageContent />);

      const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
      anchors.forEach((anchor) => {
        const id = anchor.getAttribute("href")!.slice(1);
        expect(container.querySelector(`#${id}`)).not.toBeNull();
      });
      expect(container.querySelector("#inicio")).not.toBeNull();
      expect(container.querySelector("#servicos")).not.toBeNull();
      expect(container.querySelector("#processo")).not.toBeNull();
    });
  });

  describe("AC-017-03: navbar enxuta com estado ativo", () => {
    it("lista 5 itens de navegação mais o CTA, sem 'Contato' duplicando o CTA", () => {
      render(<Header />);

      const nav = screen.getByRole("navigation", { name: "Navegação principal" });
      const labels = within(nav)
        .getAllByRole("link")
        .map((a) => a.textContent);
      expect(labels).toEqual(primaryNavigation.map(([label]) => label));
      expect(labels).not.toContain("Contato");
      expect(screen.getAllByRole("link", { name: /solicitar avaliação/i })[0]).toHaveAttribute(
        "href",
        "/contato",
      );
    });

    it("marca a rota atual com aria-current='page' (apenas Início em '/')", () => {
      render(<Header />);

      const nav = screen.getByRole("navigation", { name: "Navegação principal" });
      const current = within(nav)
        .getAllByRole("link")
        .filter((a) => a.getAttribute("aria-current") === "page");
      expect(current).toHaveLength(1);
      expect(current[0]).toHaveTextContent("Início");
    });

    it("mantém todas as rotas no rodapé (navigation completa)", () => {
      expect(navigation.map(([, href]) => href)).toContain("/contato");
      expect(primaryNavigation.length).toBe(navigation.length - 1);
    });
  });

  describe("AC-017-06: layout único", () => {
    it("renderiza um banner, um contentinfo e um main", () => {
      render(
        <SiteLayout>
          <p>conteúdo</p>
        </SiteLayout>,
      );

      expect(screen.getAllByRole("banner")).toHaveLength(1);
      expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  });

  describe("AC-017-07: páginas de serviço", () => {
    it("ServicePageLayout apresenta h1 próprio e links para os outros serviços", () => {
      const service = services[0]!;
      render(
        <ServicePageLayout
          service={service}
          eyebrow="Eyebrow"
          title="Título específico"
          intro="Introdução"
          heroCtaLabel="Pedir avaliação"
          image="/x.jpg"
          imageAlt="alt"
          applicationsIcon={Wrench}
          applicationsTitle="Aplicações"
          limitationsTitle="Limitações"
          limitationNote="Nota"
          processEyebrow="Processo"
          processTitle="Etapas"
          ctaTitle="CTA título"
          ctaText="CTA texto"
          ctaLabel="CTA rótulo"
        />,
      );

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Título específico");
      const others = within(screen.getByRole("navigation", { name: "Outros serviços" }))
        .getAllByRole("link")
        .map((a) => a.getAttribute("href"));
      expect(others).toEqual(services.slice(1).map((s) => s.path));
    });

    it("ContactCTA aponta para /contato e propaga o público", () => {
      render(<ContactCTA title="T" description="D" label="Falar" audience="corretor" />);

      expect(screen.getByRole("link", { name: /Falar/ })).toHaveAttribute(
        "href",
        "/contato?audience=corretor",
      );
    });

    it("as três páginas de serviço usam o layout compartilhado", () => {
      services.forEach((service) => {
        expect(read(`src/routes/servicos/${service.slug}.tsx`)).toContain("<ServicePageLayout");
      });
    });
  });

  describe("AC-017-05: contato com FAQ e entrada de corretores", () => {
    it("/contato inclui o FAQ e /para-corretores envia audience=corretor", () => {
      expect(read("src/routes/contato.tsx")).toContain("<FAQAccordion");
      expect(read("src/routes/para-corretores.tsx")).toContain('audience: "corretor"');
    });
  });

  describe("AC-017-02: navegação client-side", () => {
    it("não há <a href> interno para rotas em componentes e rotas (usar Link)", () => {
      const files = [
        ...fs
          .readdirSync(path.resolve(ROOT, "src/components/brs"))
          .map((f) => `src/components/brs/${f}`),
        "src/components/ui/minimal-footer.tsx",
        ...["404", "contato", "para-corretores", "privacidade", "sobre", "trabalhos"].map(
          (f) => `src/routes/${f}.tsx`,
        ),
        ...fs
          .readdirSync(path.resolve(ROOT, "src/routes/servicos"))
          .map((f) => `src/routes/servicos/${f}`),
      ].filter((f) => f.endsWith(".tsx"));

      const offenders = files.filter((file) => /<a[^>]*\shref=["']\/[a-z]/s.test(read(file)));
      expect(offenders).toEqual([]);
    });
  });
});
