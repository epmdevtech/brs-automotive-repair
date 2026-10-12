import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Wrench, Paintbrush, Car, ShieldAlert, Truck } from "lucide-react";
import { services } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";
import bodywork from "@/assets/funilaria.jpg";
import painting from "@/assets/pintura.jpg";
import dent from "@/assets/martelinho.jpg";

const serviceImages: Record<string, string> = {
  funilaria: bodywork,
  "pintura-automotiva": painting,
  "martelinho-de-ouro": dent,
};

const serviceIcons: Record<string, typeof Wrench> = {
  funilaria: Wrench,
  "pintura-automotiva": Paintbrush,
  "martelinho-de-ouro": Car,
};

export const Route = createFileRoute("/servicos/")({
  component: ServicesPage,
  head: () =>
    buildRouteHead({
      title: "Serviços Automotivos | BRS Reparações Automotivas",
      description:
        "Visão geral das especialidades da BRS em Toledo-PR: funilaria, pintura automotiva em estufa e martelinho de ouro (PDR). Avaliação técnica criteriosa.",
      path: "/servicos",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Serviços", path: "/servicos" }]),
          {
            "@type": "ItemList",
            name: "Especialidades Técnicas da BRS Reparações Automotivas",
            itemListElement: services.map((s, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: s.title,
              url: `http://brs.localhost${s.path}`,
            })),
          },
        ],
      },
    }),
});

function ServicesPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Banner / Header da Página */}
      <section className="page-width mb-12">
        <Breadcrumbs items={[{ name: "Serviços" }]} className="mb-6" />
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Especialidades Técnicas</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
            Recuperação técnica de precisão.
            <br />
            <span className="text-primary">Preservação do padrão de fábrica.</span>
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            A BRS Reparações Automotivas concentra sua atuação em três frentes complementares de
            reparação veicular em Toledo, Paraná. Cada serviço é conduzido mediante diagnóstico
            individualizado da deformação metálica e da integridade da camada de verniz.
          </p>
        </div>
      </section>

      {/* Grid Detalhado dos 3 Serviços */}
      <section className="page-width space-y-16">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.slug] || Wrench;
          const image = serviceImages[service.slug] || bodywork;
          const isReverse = index % 2 === 1;

          return (
            <article
              key={service.slug}
              className={`grid md:grid-cols-12 gap-8 lg:gap-12 items-center rounded-sm border border-border bg-card/60 p-6 sm:p-8 lg:p-10 ${
                isReverse ? "md:grid-flow-dense" : ""
              }`}
            >
              <div
                className={`md:col-span-6 overflow-hidden rounded-sm relative aspect-16/10 border border-border/60 ${
                  isReverse ? "md:col-start-7" : ""
                }`}
              >
                <img
                  src={image}
                  alt={`${service.title} em Toledo-PR (fotografia ilustrativa)`}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs">
                  Fotografia ilustrativa
                </span>
              </div>

              <div
                className={`md:col-span-6 flex flex-col justify-between ${isReverse ? "md:col-start-1" : ""}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <Icon size={16} aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-widest">
                      0{index + 1} · Especialidade
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-white mb-3">
                    <a href={service.path} className="hover:text-primary transition-colors">
                      {service.title}
                    </a>
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {service.fullDescription}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2.5">
                      Indicações comuns:
                    </h3>
                    <ul className="space-y-2">
                      {service.applications.slice(0, 3).map((app, i) => (
                        <li key={i} className="text-xs text-neutral-300 flex items-start gap-2.5">
                          <Check
                            size={14}
                            className="text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
                  <Button variant="automotive" asChild className="h-10 px-5 text-xs font-semibold">
                    <a href={service.path}>
                      Página da especialidade{" "}
                      <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    variant="automotiveOutline"
                    asChild
                    className="h-10 px-5 text-xs font-medium"
                  >
                    <a href="/contato">Solicitar avaliação</a>
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Guia Comparativo de Diagnóstico */}
      <section className="page-width mt-20 pt-16 border-t border-border">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-2.5">Guia de Triagem</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Qual é a técnica indicada para a sua avaria?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
            A escolha do método correto preserva o valor de revenda do veículo e evita intervenções
            invasivas ou custos desnecessários.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-sm border border-border bg-card/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block mb-2">
                Pequenos Amassados
              </span>
              <h3 className="text-lg font-semibold font-display text-white mb-3">
                Martelinho de Ouro
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Indicado quando a pintura original está intacta (sem trincas ou riscos fundos) e a
                chapa metálica não sofreu estiramento severo.
              </p>
            </div>
            <a
              href="/servicos/martelinho-de-ouro"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Saiba mais sobre PDR <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>

          <div className="p-6 rounded-sm border border-border bg-card/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block mb-2">
                Avarias Estruturais e de Painel
              </span>
              <h3 className="text-lg font-semibold font-display text-white mb-3">
                Funilaria Automotiva
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Necessária quando há vincos profundos, desalinhamento de portas ou peças que
                precisam ser repuxadas e alinhadas geometricamente.
              </p>
            </div>
            <a
              href="/servicos/funilaria"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Saiba mais sobre funilaria <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>

          <div className="p-6 rounded-sm border border-border bg-card/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block mb-2">
                Danos ao Acabamento e Cor
              </span>
              <h3 className="text-lg font-semibold font-display text-white mb-3">
                Pintura em Estufa
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Exigida quando o verniz ou a base foram rompidos, em peças substituídas ou quando é
                necessário recuperar a uniformidade visual completa.
              </p>
            </div>
            <a
              href="/servicos/pintura-automotiva"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Saiba mais sobre pintura <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Bloco de Leva e Traz & Aviso */}
        <div className="mt-12 p-6 rounded-sm border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Truck size={24} className="text-primary shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-semibold text-white">Serviço de Leva e Traz em Toledo</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Para sua maior comodidade, consultamos disponibilidade de busca e entrega do veículo
                no perímetro urbano de Toledo-PR.
              </p>
            </div>
          </div>
          <Button variant="automotive" asChild className="h-9 px-4 text-xs font-semibold shrink-0">
            <a href="/contato">Agendar avaliação</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
