import { createFileRoute } from "@tanstack/react-router";
import { Info, Sparkles, CheckCircle2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { ProjectGallery } from "@/components/brs/project-gallery";
import { ContactCTA } from "@/components/brs/contact-cta";

export const Route = createFileRoute("/trabalhos")({
  component: TrabalhosPage,
  head: () =>
    buildRouteHead({
      title: "Trabalhos e Reparações Automotivas | BRS",
      description:
        "Galeria interativa de trabalhos e processos de reparação da BRS em Toledo-PR. Comparação antes/depois e ampliação técnica em alta resolução.",
      path: "/trabalhos",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Trabalhos", path: "/trabalhos" }]),
          {
            "@type": "WebPage",
            name: "Trabalhos e Reparações Automotivas — BRS",
            url: "http://brs.localhost/trabalhos",
            description:
              "Galeria técnica demonstrando intervenções de funilaria, pintura e martelinho de ouro.",
          },
        ],
      },
    }),
});

function TrabalhosPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero Section Padrão Awwwards Site of the Day (SPEC-034) */}
      <PageHero
        breadcrumbs={[{ name: "Trabalhos" }]}
        codeIndex="GAL.03 // PORTFÓLIO"
        eyebrow="Galeria Técnica Interativa"
        title="Casos de Reparação e Acabamento."
        description={
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-2">
            Explore abaixo a comparação interativa de procedimentos. Arraste o divisor central ou
            utilize as teclas direcionais do teclado para alternar entre as fases de avaliação e o
            resultado final obtido.
          </p>
        }
        telemetryBadges={[
          {
            icon: Sparkles,
            label: "Comparador Interativo",
            detail: "Deslizamento contínuo e inspeção de gaps",
          },
          {
            icon: CheckCircle2,
            label: "Precisão Milimétrica",
            detail: "Padrão de fábrica sem enxertos pesados",
          },
          {
            icon: ShieldCheck,
            label: "Toledo, Paraná",
            detail: "Documentação técnica dos procedimentos",
          },
        ]}
        actions={[
          {
            label: "Solicitar avaliação técnica",
            to: "/contato",
            variant: "primary",
            icon: ArrowUpRight,
          },
        ]}
        footerContent={
          <div className="p-4 rounded-sm border border-primary/20 bg-primary/5 flex items-start gap-3 text-xs text-neutral-300">
            <Info size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-semibold text-white block mb-0.5">
                Transparência Fotográfica
              </span>
              <span>
                O acervo fotográfico real da BRS está em fase de documentação com autorização de
                clientes em Toledo-PR. As imagens apresentadas nesta galeria são ilustrativas
                temporárias demonstrativas da precisão e dos métodos empregados pela oficina.
              </span>
            </div>
          </div>
        }
      />

      {/* Galeria com Filtros Interativos e Slider Antes/Depois */}
      <ProjectGallery />

      {/* CTA de Fechamento */}
      <div className="mt-16">
        <ContactCTA
          title="Precisa de uma avaliação para o seu veículo?"
          description="Envie as fotos da avaria e receba uma orientação técnica preliminar sobre o melhor método de reparação para o seu caso."
          label="Solicitar avaliação técnica"
        />
      </div>
    </div>
  );
}
