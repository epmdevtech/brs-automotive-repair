import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
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
      {/* Hero Section Padrão Awwwards Site of the Day (SPEC-034 / SPEC-043) */}
      <PageHero
        breadcrumbs={[{ name: "Trabalhos" }]}
        codeIndex="GAL.03 // PORTFÓLIO"
        eyebrow="PORTFÓLIO & COMPROVAÇÃO TÉCNICA"
        title="Casos de Reparação e Acabamento."
        description={
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Veja na prática a recuperação de vincos, alinhamento milimétrico de peças e fidelidade
            de cor em veículos atendidos pela BRS. Compare o estado de entrada com o padrão final
            entregue de fábrica.
          </p>
        }
        footerContent={
          <div className="py-2.5 px-3.5 rounded-sm border border-primary/20 bg-primary/5 flex items-center gap-2.5 text-[11px] text-neutral-300">
            <Info size={14} className="text-primary shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold text-white">Transparência Fotográfica: </span>
              Acervo fotográfico real em fase de documentação em Toledo-PR. Imagens ilustrativas
              demonstrativas de método e tolerâncias de fábrica.
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
