import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { ProjectGallery } from "@/components/brs/project-gallery";
import { ContactCTA } from "@/components/brs/contact-cta";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
      <section className="page-width mb-8">
        <ScrollReveal direction="up" delay={0.05}>
          <Breadcrumbs items={[{ name: "Trabalhos" }]} className="mb-6" />
        </ScrollReveal>

        <div className="max-w-3xl">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="eyebrow mb-3">Galeria Técnica Interativa</p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
              Casos de Reparação e Acabamento.
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              Explore abaixo a comparação interativa de procedimentos. Arraste o divisor central ou
              utilize as teclas direcionais do teclado para alternar entre as fases de avaliação e o
              resultado final obtido.
            </p>
          </ScrollReveal>

          {/* Aviso Explícito de Conformidade Fotográfica */}
          <ScrollReveal direction="up" delay={0.38}>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3 text-xs text-neutral-300">
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
          </ScrollReveal>
        </div>
      </section>

      {/* Galeria com Sliders e Lightbox */}
      <ProjectGallery />

      <ContactCTA
        title="Deseja uma análise técnica para o seu veículo?"
        description="Envie imagens ou venha nos visitar para receber uma previsão clara sobre prazo e procedimentos cabíveis."
        label="Solicitar avaliação do seu carro"
      />
    </div>
  );
}
