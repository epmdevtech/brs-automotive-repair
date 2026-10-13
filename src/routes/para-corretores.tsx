import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FileText, Handshake, Phone, ShieldCheck, Clock } from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/brs/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ContactCTA } from "@/components/brs/contact-cta";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ImageReveal } from "@/components/ui/image-reveal";
import corretoresVistoria from "@/assets/corretores-vistoria.jpg";

export const Route = createFileRoute("/para-corretores")({
  component: ParaCorretoresPage,
  head: () =>
    buildRouteHead({
      title: "Atendimento para Corretores de Seguros | BRS",
      description:
        "Canal exclusivo para corretores de seguros em Toledo-PR. Comunicação ágil no sinistro, suporte em vistorias, laudos técnicos e livre escolha de oficina.",
      path: "/para-corretores",
      image: "/assets/funilaria.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          buildBreadcrumbSchema([{ name: "Para corretores", path: "/para-corretores" }]),
          {
            "@type": "WebPage",
            name: "Atendimento a Corretores de Seguros — BRS Reparações Automotivas",
            url: "http://brs.localhost/para-corretores",
            description:
              "Diretrizes de cooperação profissional entre corretores de seguros e a oficina mecânica em Toledo-PR.",
          },
        ],
      },
    }),
});

function ParaCorretoresPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="page-width mb-12">
        <ScrollReveal direction="up" delay={0.05}>
          <Breadcrumbs items={[{ name: "Para corretores" }]} className="mb-6" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={0.1}>
              <p className="eyebrow mb-3">Parceria Profissional</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight">
                Tranquilidade para o Corretor.
                <br />
                <span className="text-primary">Cuidado Rigoroso com o Segurado.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6">
                A indicação de uma oficina em momento de sinistro coloca em jogo a reputação que o
                corretor construiu com seu cliente. Na BRS Reparações Automotivas, tratamos o
                segurado com total transparência, cumprimento estrito de prazos e atualização
                contínua do andamento dos reparos.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.38}>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button variant="primary" asChild className="h-11 px-6 text-xs font-semibold">
                  <Link to="/contato" search={{ audience: "corretor" }}>
                    Iniciar conversa sobre parceria{" "}
                    <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="secondary" asChild className="h-11 px-6 text-xs font-medium">
                  <a href={company.phoneHref}>
                    <Phone size={14} className="mr-2 text-primary" aria-hidden="true" />
                    {company.phone}
                  </a>
                </Button>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 relative">
            <ImageReveal
              delay={0.15}
              className="rounded-xl border border-border aspect-4/3 relative overflow-hidden"
            >
              <img
                src={corretoresVistoria}
                alt="Vistoria técnica e atendimento a segurados em oficina (fotografia ilustrativa)"
                width={1200}
                height={800}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs pointer-events-none">
                Fotografia ilustrativa
              </span>
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Pilares da Parceria — Matriz Editorial com Bordas Compartilhadas */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <ScrollReveal direction="up" delay={0.08} className="max-w-2xl mb-10">
          <p className="eyebrow mb-2">Compromissos</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Como a BRS Facilita a Rotina do Corretor
          </h2>
        </ScrollReveal>

        <div className="border-y border-border/80 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
          <ScrollReveal
            direction="up"
            delay={0.0}
            className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                01 / TRANSPARÊNCIA
              </span>
              <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                Comunicação e Prazos
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Informamos você e seu segurado em cada marco da recuperação: desmontagem, funilaria,
                estufa e montagem final, sem ruídos na comunicação.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.12}
            className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                02 / DOCUMENTAÇÃO
              </span>
              <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                Orçamentos e Laudos
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Elaboramos orçamentos técnicos detalhados e registro fotográfico das avarias para
                facilitar vistorias prévias e complementares de sinistro.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.24}
            className="py-8 sm:py-10 sm:px-8 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                03 / DIREITO LEGAL
              </span>
              <h3 className="text-base sm:text-lg font-semibold font-display text-white mb-2">
                Livre Escolha de Oficina
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                O segurado tem direito legal garantido à livre escolha da oficina de sua confiança.
                Atendemos clientes de qualquer seguradora com total respaldo técnico.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Nota de Esclarecimento Editorial sobre Convênios */}
        <ScrollReveal
          direction="up"
          delay={0.32}
          className="mt-12 py-6 border-b border-border/60 text-xs text-neutral-400 leading-relaxed"
        >
          <span className="font-semibold text-white block mb-1">Princípio de Integridade:</span>
          Não divulgamos credenciamentos falsos ou convênios artificiais com seguradoras. Nosso
          relacionamento baseia-se no direito do consumidor à livre escolha de oficina e na
          qualidade inquestionável do serviço entregue ao segurado.
        </ScrollReveal>
      </section>

      <ContactCTA
        title="Vamos conversar sobre uma parceria em Toledo?"
        description="Agende uma visita ou envie uma mensagem direta para nossa equipe técnica."
        label="Abrir canal de atendimento ao corretor"
        audience="corretor"
      />
    </div>
  );
}
