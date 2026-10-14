import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Phone } from "lucide-react";
import { company } from "@/lib/brs";
import { buildRouteHead, buildBreadcrumbSchema } from "@/lib/seo";
import { PageHero } from "@/components/brs/page-hero";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NumericCounter } from "@/components/ui/numeric-counter";
import corretoresVistoria from "@/assets/corretores-vistoria.jpg";

export const Route = createFileRoute("/para-corretores")({
  component: ParaCorretoresPage,
  head: () =>
    buildRouteHead({
      title: "Atendimento para Corretores de Seguros | BRS",
      description:
        "Canal profissional de relacionamento técnico para corretores de seguros e peritos em Toledo-PR. Suporte em avarias, documentação e livre escolha de oficina.",
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
      <PageHero
        breadcrumbs={[{ name: "Para corretores" }]}
        codeIndex="PAR.05 // RELACIONAMENTO TÉCNICO & SINISTROS"
        eyebrow="TOLEDO — PARANÁ | ATENDIMENTO PROFISSIONAL B2B"
        title="Parceria técnica. Transparência operacional. Confiança em cada reparação."
        description={
          <div className="space-y-3 text-neutral-300 text-sm sm:text-base leading-relaxed">
            <p>
              A escolha de uma oficina para atender um segurado envolve mais do que a execução de um
              reparo: exige confiança, clareza nas informações e acompanhamento responsável de cada
              etapa.
            </p>
            <p>
              A BRS Reparações Automotivas estabelece um canal profissional de relacionamento com
              corretores de seguros e demais profissionais do setor, oferecendo suporte técnico na
              avaliação das avarias, elaboração de orçamentos, documentação fotográfica e
              acompanhamento dos serviços de reparação.
            </p>
            <p>
              Nosso compromisso é conduzir cada atendimento com rigor técnico, comunicação objetiva
              e transparência sobre o andamento dos trabalhos, contribuindo para uma experiência
              mais segura e previsível para o segurado e para os profissionais envolvidos no
              processo.
            </p>
          </div>
        }
        actions={[
          {
            label: "Conversar com a equipe técnica",
            to: "/contato",
            search: { audience: "corretor" },
            variant: "primary",
            icon: ArrowUpRight,
          },
          {
            label: "(45) 2035-9440",
            href: company.phoneHref,
            variant: "secondary",
            icon: Phone,
          },
        ]}
        asideContent={
          <div className="relative rounded-2xl border border-white/10 overflow-hidden bg-card/40 aspect-4/3">
            <img
              src={corretoresVistoria}
              alt="Avaliação técnica e documentação de avarias em ambiente de reparação automotiva (fotografia ilustrativa)"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 bg-background/85 text-muted-foreground border border-border/50 backdrop-blur-xs rounded-xs pointer-events-none">
              Fotografia ilustrativa
            </span>
          </div>
        }
        className="mb-0 border-b-0 pb-8 sm:pb-12"
      />

      {/* Relacionamento Profissional — 4 Pilares Técnicos com Bordas Compartilhadas */}
      <section className="page-width mt-16 pt-12 border-t border-border">
        <ScrollReveal direction="up" delay={0.08} className="max-w-3xl mb-10">
          <p className="eyebrow mb-2">Relacionamento Profissional</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Suporte técnico para uma gestão de sinistros mais transparente
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
            Entendemos as responsabilidades de quem acompanha um segurado durante um sinistro. Por
            isso, estruturamos nosso atendimento para facilitar o acesso às informações relevantes
            sobre a reparação, respeitando os procedimentos aplicáveis e as particularidades de cada
            veículo.
          </p>
        </ScrollReveal>

        <div className="border-y border-border/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
          <ScrollReveal
            direction="up"
            delay={0.0}
            className="py-8 sm:py-10 sm:px-6 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={1} padZero /> / ACOMPANHAMENTO
              </span>
              <h3 className="text-base font-semibold font-display text-white mb-2">
                Comunicação técnica e acompanhamento
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Informações claras sobre o andamento da reparação, desde a avaliação inicial até as
                etapas de execução, montagem e inspeção final. O acompanhamento é conduzido conforme
                a evolução efetiva dos serviços.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.08}
            className="py-8 sm:py-10 sm:px-6 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={2} padZero /> / DOCUMENTAÇÃO
              </span>
              <h3 className="text-base font-semibold font-display text-white mb-2">
                Orçamentos e documentação de avarias
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Elaboração de orçamentos técnicos e registros fotográficos para subsidiar a análise
                dos danos, a avaliação dos reparos necessários e eventuais vistorias complementares,
                conforme a demanda de cada caso.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.16}
            className="py-8 sm:py-10 sm:px-6 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={3} padZero /> / INTERFACE B2B
              </span>
              <h3 className="text-base font-semibold font-display text-white mb-2">
                Interface profissional no atendimento
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Canal direto para tratar de questões relacionadas aos serviços, esclarecer dúvidas
                técnicas e alinhar informações pertinentes à reparação, observados os limites de
                autorização e o compartilhamento adequado de dados do segurado.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.24}
            className="py-8 sm:py-10 sm:px-6 last:sm:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                <NumericCounter target={4} padZero /> / PREVISIBILIDADE
              </span>
              <h3 className="text-base font-semibold font-display text-white mb-2">
                Previsibilidade e transparência operacional
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Acompanhamento das etapas do serviço e comunicação sobre necessidades adicionais
                identificadas durante a reparação, possíveis alterações no escopo e fatores que
                possam impactar a previsão de conclusão.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Princípios de Atuação — Independência Técnica e Clareza nas Relações */}
      <section className="page-width mt-20 pt-16 border-t border-border">
        <ScrollReveal direction="up" delay={0.08} className="max-w-3xl mb-10">
          <p className="eyebrow mb-2">Princípios de Atuação</p>
          <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white">
            Independência técnica. Clareza nas relações. Respeito ao segurado.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 leading-relaxed">
            A BRS conduz seu relacionamento profissional com base na transparência das informações,
            na responsabilidade técnica e no respeito às decisões do proprietário do veículo.
          </p>
        </ScrollReveal>

        <div className="border-y border-border/80 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
          <ScrollReveal
            direction="up"
            delay={0.0}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                DIREITO DO CONSUMIDOR
              </span>
              <h3 className="text-lg font-semibold font-display text-white mb-3">
                Livre escolha da oficina
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                A escolha da oficina deve respeitar os direitos aplicáveis ao consumidor e as
                condições pertinentes ao atendimento securitário. A BRS está disponível para receber
                segurados encaminhados por corretores, independentemente de eventual indicação de
                rede referenciada, sem apresentar essa relação como credenciamento quando ele não
                existir.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.12}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                RIGOR TÉCNICO
              </span>
              <h3 className="text-lg font-semibold font-display text-white mb-3">
                Documentação e clareza nas informações
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                As informações sobre avarias, serviços propostos e necessidades identificadas
                durante a execução devem ser apresentadas de forma objetiva, permitindo que os
                envolvidos compreendam os aspectos técnicos relevantes para a tomada de decisão.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={0.24}
            className="py-8 md:py-10 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold text-primary uppercase tracking-wider block mb-3">
                INTEGRIDADE INSTITUCIONAL
              </span>
              <h3 className="text-lg font-semibold font-display text-white mb-3">
                Relacionamento baseado em confiança
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed text-pretty">
                Não utilizamos alegações de credenciamento, convênio ou parceria com seguradoras sem
                a devida comprovação. Nosso relacionamento profissional é construído com
                transparência, qualidade na execução dos serviços e respeito a todos os envolvidos.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Conexão Profissional — Banner de Contato e Relacionamento B2B */}
      <section className="page-width mt-20">
        <ScrollReveal
          direction="up"
          delay={0.12}
          className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.07] via-background to-background p-8 sm:p-12 relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-primary/10 blur-3xl -z-10"
          />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="eyebrow mb-2">Conexão Profissional</p>
              <h3 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-white mb-3">
                Vamos estabelecer um canal de relacionamento com a BRS?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
                Se você atua com corretagem de seguros, regulação, análise de sinistros ou gestão de
                atendimento a segurados, nossa equipe está disponível para apresentar a estrutura de
                atendimento da BRS e conversar sobre possibilidades de relacionamento profissional.
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Entre em contato para agendar uma visita, conhecer nossos processos de reparação ou
                esclarecer dúvidas sobre a documentação e o acompanhamento técnico dos serviços.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Button
                variant="primary"
                asChild
                className="h-12 min-h-[44px] px-8 text-xs font-semibold cursor-pointer shadow-lg shadow-primary/15"
              >
                <Link to="/contato" search={{ audience: "corretor" }}>
                  <span>Falar com a equipe da BRS</span>
                  <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <div className="text-xs text-neutral-400 flex items-center gap-2 pt-1 font-mono">
                <span className="text-white font-medium">BRS Reparações</span>
                <span>•</span>
                <span>Toledo — PR</span>
                <span>•</span>
                <a href={company.phoneHref} className="text-primary hover:underline">
                  (45) 2035-9440
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
