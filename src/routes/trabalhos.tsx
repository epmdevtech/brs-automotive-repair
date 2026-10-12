import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Camera, Info } from "lucide-react";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { ProjectGallery } from "@/components/brs/project-gallery";
import { Button } from "@/components/ui/button";

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
        <Breadcrumbs items={[{ name: "Trabalhos" }]} className="mb-6" />

        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Galeria Técnica Interativa</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
            Casos de Reparação e Acabamento.
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
            Explore abaixo a comparação interativa de procedimentos. Arraste o divisor central ou
            utilize as teclas direcionais do teclado para alternar entre as fases de avaliação e o
            resultado final obtido.
          </p>

          {/* Aviso Explícito de Conformidade Fotográfica */}
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
        </div>
      </section>

      {/* Galeria com Sliders e Lightbox */}
      <ProjectGallery />

      {/* CTA Final */}
      <section className="page-width mt-16 pt-12 border-t border-border text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white mb-4">
            Deseja uma análise técnica para o seu veículo?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Envie imagens ou venha nos visitar para receber uma previsão clara sobre prazo e
            procedimentos cabíveis.
          </p>
          <Button variant="automotive" asChild className="h-11 px-8 text-xs font-semibold">
            <a href="/contato">
              Solicitar avaliação do seu carro{" "}
              <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
