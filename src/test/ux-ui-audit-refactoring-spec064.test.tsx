import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePageContent, SiteLayout } from "@/components/brs/website";
import { Hero } from "@/components/brs/hero";
import { Services } from "@/components/brs/services";
import { ProcessTimeline } from "@/components/brs/process-timeline";
import { HomePathways } from "@/components/brs/home-pathways";
import { FinalCTA } from "@/components/brs/final-cta";
import { MinimalFooter } from "@/components/ui/minimal-footer";
import { company, canonicalUrl, aestheticServices } from "@/lib/brs";
import { buildRouteHead, buildAutoBodyShopSchema } from "@/lib/seo";

describe("SPEC-064 — Auditoria e Refatoração UX/UI (Conversão, Integridade Editorial, Home em 6 Blocos e SEO)", () => {
  it("CA-01 & CA-02: Hero declara o que a BRS faz e onde no H1 e possui CTA dominante 'Solicitar avaliação'", () => {
    const { container } = render(<Hero />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR.");

    const primaryCta = screen.getByRole("link", { name: /solicitar avaliação/i });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute("href", "/contato");

    // Ausência de canvas de partículas/laser/HUD e rótulo decorativo 'OFICINA TÉCNICA'
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.queryByText("OFICINA TÉCNICA")).toBeNull();
    expect(screen.queryByRole("link", { name: /ver especialidades/i })).toBeNull();

    // Presença de img com fetchPriority='high' para LCP e aviso de fotografia ilustrativa
    const lcpImg = container.querySelector('img[fetchpriority="high"]');
    expect(lcpImg).not.toBeNull();
    expect(screen.getByText("Fotografia ilustrativa")).toBeInTheDocument();
  });

  it("CA-03: Services exibe 3 cards com apenas 1 link por card ('Ver detalhes do serviço') e linha compacta de estética", () => {
    render(<Services />);

    const detailLinks = screen.getAllByRole("link", { name: /ver detalhes do serviço/i });
    expect(detailLinks).toHaveLength(3);
    expect(detailLinks.map((a) => a.getAttribute("href"))).toEqual([
      "/servicos/funilaria",
      "/servicos/pintura-automotiva",
      "/servicos/martelinho-de-ouro",
    ]);

    // Linha compacta de estética automotiva com link único para /servicos#estetica-automotiva
    expect(
      screen.getByText(/espelhamento de pintura, vitrificação cerâmica e polimento técnico/i),
    ).toBeInTheDocument();
    const aestheticLink = screen.getByRole("link", { name: /ver estética e proteção/i });
    expect(aestheticLink).toHaveAttribute("href", "/servicos#estetica-automotiva");
  });

  it("CA-01 & CA-04: ProcessTimeline consolida até 3 diferenciais sem numeração/laudo e 4 etapas em linha com sequência numérica única", () => {
    const { container } = render(<ProcessTimeline />);

    expect(screen.getByText("Diagnóstico claro antes do serviço")).toBeInTheDocument();
    expect(screen.getByText("Orçamento e prazo alinhados antes da execução")).toBeInTheDocument();
    expect(screen.getByText("Serviço de leva e traz em Toledo-PR")).toBeInTheDocument();

    // Ausência da palavra 'laudo' e da numeração duplicada 'Etapa 01'
    expect(container.textContent?.toLowerCase()).not.toContain("laudo");
    expect(screen.queryByText(/Etapa 01/i)).toBeNull();

    // 4 etapas presentes com sequência única 01 a 04
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(screen.getByText("Primeiro contato")).toBeInTheDocument();
    expect(screen.getByText("Avaliação técnica")).toBeInTheDocument();
    expect(screen.getByText("Orçamento e alinhamento")).toBeInTheDocument();
    expect(screen.getByText("Reparação e conferência")).toBeInTheDocument();
  });

  it("CA-01: HomePathways exibe faixa horizontal discreta para corretores com link único para /para-corretores", () => {
    render(<HomePathways />);

    expect(screen.getByRole("heading", { name: /é corretor de seguros\?/i })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /atendimento para corretores/i });
    expect(link).toHaveAttribute("href", "/para-corretores");
  });

  it("CA-01 & CA-04: FinalCTA e MinimalFooter exibem canais confirmados (telefone, endereço, horário) sem imagem repetida e sem frase de demonstração", () => {
    const { container: ctaContainer } = render(<FinalCTA />);
    expect(ctaContainer.querySelector("img")).toBeNull();
    expect(screen.queryByRole("link", { name: /conhecer o instagram/i })).toBeNull();
    expect(screen.getByRole("link", { name: /solicitar avaliação/i })).toHaveAttribute(
      "href",
      "/contato",
    );
    expect(ctaContainer.textContent).toContain(company.phone);
    expect(ctaContainer.textContent).toContain(company.address.street);
    expect(ctaContainer.textContent).toContain(company.openingHours);

    const { container: footerContainer } = render(<MinimalFooter />);
    expect(footerContainer.textContent).toContain(company.address.full);
    expect(footerContainer.textContent).toContain(company.openingHours);
    expect(footerContainer.textContent).not.toContain("Demonstração institucional oficial");
  });

  it("CA-04 & CA-05: SEO canônico usa https://brs.epmdevtech.com.br e aestheticServices não contém números sem respaldo", () => {
    expect(company.siteUrl).toBe("https://brs.epmdevtech.com.br");
    expect(canonicalUrl("/servicos")).toBe("https://brs.epmdevtech.com.br/servicos");

    const head = buildRouteHead({
      title: "BRS",
      description: "Desc",
      path: "/",
    });
    expect(head.links[0]?.href).toBe("https://brs.epmdevtech.com.br/");

    const schema = buildAutoBodyShopSchema();
    expect(schema.url).toBe("https://brs.epmdevtech.com.br/");
    expect(schema.address.streetAddress).toBe("R. Barão do Rio Branco, 4892");
    expect(schema.address.postalCode).toBe("85905-625");
    expect(schema.openingHoursSpecification).toHaveLength(1);

    const allBenefits = aestheticServices.flatMap((s) => s.benefits).join(" ");
    expect(allBenefits).not.toContain("90%");
    expect(allBenefits).not.toContain("1 a 3 anos");
  });

  it("CA-01: HomePageContent + SiteLayout renderiza exatamente os 6 blocos funcionais sem HomeBeforeAfter nem MediaExpand", () => {
    const { container } = render(
      <SiteLayout>
        <HomePageContent />
      </SiteLayout>,
    );

    expect(container.querySelector("#inicio")).not.toBeNull();
    expect(container.querySelector("#servicos")).not.toBeNull();
    expect(container.querySelector("#processo")).not.toBeNull();
    expect(container.querySelector("#corretores-parceiros")).not.toBeNull();
    expect(container.querySelector("#demonstracao")).toBeNull();
    expect(container.querySelector(".media-expand")).toBeNull();
    expect(container.querySelector("footer")).not.toBeNull();
  });
});
