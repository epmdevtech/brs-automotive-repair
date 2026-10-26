import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { canonicalUrl } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { ProjectGallery } from "@/components/brs/project-gallery";
import { ContactCTA } from "@/components/brs/contact-cta";
import { WorkshopGallery } from "@/components/brs/workshop-gallery";
import oficinaFachada01 from "@/assets/cliente/oficina-fachada-01.jpg";

export const Route = createFileRoute("/trabalhos")({
  component: TrabalhosPage,
  head: () =>
    buildRouteHead({
      title: "Trabalhos, Estrutura e Métodos | Master",
      description:
        "Imagens oficiais da estrutura da Master em Toledo-PR e demonstrações ilustrativas dos métodos de funilaria, pintura e martelinho de ouro.",
      path: "/trabalhos",
      image: oficinaFachada01,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Trabalhos", path: "/trabalhos" }]),
          {
            "@type": "WebPage",
            name: "Trabalhos, Estrutura e Métodos — Master",
            url: canonicalUrl("/trabalhos"),
            description:
              "Registros fotográficos reais da oficina e demonstrações ilustrativas dos métodos de reparação.",
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
        title="A oficina, os métodos e o acabamento."
        description={
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Conheça a estrutura da Master em Toledo-PR e entenda as etapas técnicas que orientam a
            recuperação de vincos, o alinhamento de peças e a fidelidade de cor.
          </p>
        }
        footerContent={
          <div className="py-2.5 px-3.5 rounded-sm border border-primary/20 bg-primary/5 flex items-center gap-2.5 text-[11px] text-neutral-300">
            <Info size={14} className="text-brand-accent shrink-0" aria-hidden="true" />
            <p>
              <span className="font-semibold text-white">Transparência Fotográfica: </span>
              As imagens da estrutura são registros oficiais da oficina, com placas de terceiros
              substituídas pela marca. As sequências de método são ilustrativas e não representam
              casos de clientes.
            </p>
          </div>
        }
        className="mb-0 border-b-0 pb-6 sm:pb-8"
      />

      <WorkshopGallery className="mt-10" />

      {/* Galeria com Filtros Interativos e Slider Antes/Depois com Respiro Otimizado */}
      <ProjectGallery className="mt-20" />

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
