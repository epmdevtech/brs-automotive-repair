import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Paintbrush, Phone, ShieldAlert } from "lucide-react";
import { company, services } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";
import painting from "@/assets/pintura.jpg";

const service = services.find((s) => s.slug === "pintura-automotiva")!;

export const Route = createFileRoute("/servicos/pintura-automotiva")({
  component: PinturaPage,
  head: () =>
    buildRouteHead({
      title: "Pintura Automotiva em Toledo | BRS",
      description:
        "Pintura automotiva em estufa com controle de temperatura em Toledo-PR. Colorimetria precisa, primers anticorrosivos e cura térmica de alta resistência.",
      path: "/servicos/pintura-automotiva",
      image: "/assets/pintura.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([
            { name: "Serviços", path: "/servicos" },
            { name: "Pintura automotiva", path: "/servicos/pintura-automotiva" },
          ]),
          buildServiceSchema({
            name: "Pintura automotiva",
            description: service.description,
            path: "/servicos/pintura-automotiva",
          }),
        ],
      },
    }),
});

function PinturaPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-12">
        <Breadcrumbs
          items={[{ name: "Serviços", path: "/servicos" }, { name: "Pintura automotiva" }]}
          className="mb-6"
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Especialidade Técnica</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
              Pintura Automotiva em Estufa em Toledo.
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              O acabamento de pintura da BRS alia rigor em preparação de superfície com aplicação em
              cabine com controle térmico e fluxo de ar filtrado. Cada reparo passa por análise
              colorimétrica minuciosa para garantir a correspondência de tonalidade e textura com as
              peças originais do veículo.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="automotive" asChild className="h-11 px-6 text-xs font-semibold">
                <a href="/contato">
                  Solicitar avaliação de pintura{" "}
                  <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                </a>
              </Button>
              <Button variant="automotiveOutline" asChild className="h-11 px-6 text-xs font-medium">
                <a href={company.phoneHref}>
                  <Phone size={14} className="mr-2 text-primary" aria-hidden="true" />
                  Ligar {company.phone}
                </a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative overflow-hidden rounded-sm border border-border aspect-4/3">
            <img
              src={painting}
              alt="Serviço de pintura automotiva em cabine (fotografia ilustrativa)"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs">
              Fotografia ilustrativa
            </span>
          </div>
        </div>
      </section>

      {/* Aplicações e Limitações Técnicas */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Aplicações */}
          <div className="p-6 sm:p-8 rounded-sm border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-8 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <Paintbrush size={16} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold font-display text-white">
                Aplicações da Pintura
              </h2>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300">
              {service.applications.map((app, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuidados e Limitações */}
          <div className="p-6 sm:p-8 rounded-sm border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-8 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <ShieldAlert size={16} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold font-display text-white">
                Requisitos de Cura e Limitações
              </h2>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300">
              {service.limitations.map((limit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>{limit}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-neutral-400 bg-background/60 p-3 rounded-xs border border-border/60">
              * A cura total do verniz ocorre progressivamente. Orientamos detalhadamente cada
              cliente sobre a rotina de cuidados recomendada nas semanas seguintes à entrega.
            </p>
          </div>
        </div>
      </section>

      {/* Etapas do Processo de Pintura */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">Processo Técnico</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Ciclo de Preparação e Pintura em Cabine
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {service.processSteps.map((step, idx) => (
            <div key={idx} className="p-6 rounded-sm border border-border bg-card/40">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                Fase 0{idx + 1}
              </span>
              <h3 className="text-base font-semibold font-display text-white mb-2">{step.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner de CTA Final */}
      <section className="page-width mt-20 pt-12 border-t border-border text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white mb-4">
            Precisa repintar ou retocar uma peça do veículo?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Traga seu carro para uma conferência de tonalidade e orçamento sem surpresas na BRS em
            Toledo-PR.
          </p>
          <Button variant="automotive" asChild className="h-11 px-8 text-xs font-semibold">
            <a href="/contato">Agendar avaliação de pintura</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
