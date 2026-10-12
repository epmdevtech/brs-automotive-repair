import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Car, Phone, ShieldAlert, Sparkles } from "lucide-react";
import { company, services } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema, buildServiceSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";
import dent from "@/assets/martelinho.jpg";

const service = services.find((s) => s.slug === "martelinho-de-ouro")!;

export const Route = createFileRoute("/servicos/martelinho-de-ouro")({
  component: MartelinhoPage,
  head: () =>
    buildRouteHead({
      title: "Martelinho de Ouro em Toledo | BRS",
      description:
        "Martelinho de ouro artesanal (PDR) em Toledo-PR. Desamasse seu veículo sem repintar, preservando 100% da originalidade de fábrica e o valor de revenda.",
      path: "/servicos/martelinho-de-ouro",
      image: "/assets/martelinho.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([
            { name: "Serviços", path: "/servicos" },
            { name: "Martelinho de ouro", path: "/servicos/martelinho-de-ouro" },
          ]),
          buildServiceSchema({
            name: "Martelinho de ouro",
            description: service.description,
            path: "/servicos/martelinho-de-ouro",
          }),
        ],
      },
    }),
});

function MartelinhoPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-12">
        <Breadcrumbs
          items={[{ name: "Serviços", path: "/servicos" }, { name: "Martelinho de ouro" }]}
          className="mb-6"
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">Especialidade Artesanal</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
              Martelinho de Ouro (PDR) em Toledo.
            </h1>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
              O martelinho de ouro é a técnica que permite desamassar painéis e lataria sem recorrer
              a lixamentos, massas ou repintura. Na BRS, atuamos com alavancas anatômicas e ventosas
              térmicas para recuperar a superfície preservando intacta a pintura de fábrica,
              garantindo que o veículo não sofra desvalorização comercial.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="automotive" asChild className="h-11 px-6 text-xs font-semibold">
                <a href="/contato">
                  Avaliar viabilidade de PDR{" "}
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
              src={dent}
              alt="Serviço de martelinho de ouro em chapa automotiva (fotografia ilustrativa)"
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
                <Sparkles size={16} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold font-display text-white">
                Casos Ideais para o Martelinho
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

          {/* Limitações Claras */}
          <div className="p-6 sm:p-8 rounded-sm border border-border bg-card/50">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-8 rounded-sm bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <ShieldAlert size={16} aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold font-display text-white">
                Quando o PDR Não é Indicado
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
              * Caso o martelinho não seja viável devido ao rompimento do verniz, apresentamos as
              alternativas combinadas de funilaria e pintura sem cobrança de procedimentos
              incompatíveis.
            </p>
          </div>
        </div>
      </section>

      {/* Etapas do Processo de PDR */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">Processo Artesanal</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Como Funciona o Desamassamento sem Repintura
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
            Tem um amassado sem dano na pintura?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Mantenha a originalidade de fábrica do seu carro. Faça uma triagem rápida na BRS em
            Toledo-PR.
          </p>
          <Button variant="automotive" asChild className="h-11 px-8 text-xs font-semibold">
            <a href="/contato">Agendar avaliação de martelinho de ouro</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
