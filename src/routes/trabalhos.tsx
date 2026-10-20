import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { canonicalUrl } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { ProjectGallery } from "@/components/brs/project-gallery";
import { ContactCTA } from "@/components/brs/contact-cta";

export const Route = createFileRoute("/trabalhos")({
  component: TrabalhosPage,
  head: () =>
    buildRouteHead({
      title: "Trabalhos e Reparações Automotivas | Master",
      description:
        "Galeria interativa de métodos e processos de reparação da Master em Toledo-PR. Comparação antes/depois e ampliação técnica em alta resolução.",
      path: "/trabalhos",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Trabalhos", path: "/trabalhos" }]),
          {
            "@type": "WebPage",
            name: "Trabalhos e Reparações Automotivas — Master",
            url: canonicalUrl("/trabalhos"),
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
      <PageHero
        breadcrumbs={[{ name: "Trabalhos" }]}
        codeIndex="GAL.03 // PORTFÓLIO"
        eyebrow="PORTFÓLIO & MÉTODOS DE REPARAÇÃO"
        title="Casos de Reparação e Acabamento."
        description={
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Entenda como atuamos na recuperação de vincos, alinhamento de peças e fidelidade de cor.
            As imagens abaixo são ilustrativas e demonstram as etapas técnicas de cada
            especialidade.
          </p>
        }
        footerContent={
          <div className="py-2.5 px-3.5 rounded-sm border border-primary/20 bg-primary/5 flex items-center gap-2.5 text-[11px] text-neutral-300">
            <Info size={14} className="text-brand-accent shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold text-white">Transparência Fotográfica: </span>
              Acervo fotográfico real em fase de documentação em Toledo-PR. Imagens ilustrativas
              demonstrativas dos métodos de reparação.
            </p>
          </div>
        }
        className="mb-0 border-b-0 pb-6 sm:pb-8"
      />

      {/* Galeria com Filtros Interativos e Slider Antes/Depois com Respiro Otimizado */}
      <ProjectGallery className="pt-6 sm:pt-8" />

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
