import * as React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const differentials = [
  {
    title: "Diagnóstico claro antes do serviço",
    description:
      "Avaliação presencial dos danos na lataria e na pintura para indicar apenas os procedimentos necessários para o reparo.",
  },
  {
    title: "Orçamento e prazo alinhados antes da execução",
    description:
      "Escopo do serviço, materiais utilizados e previsão de entrega combinados com você antes de iniciar o trabalho na oficina.",
  },
  {
    title: "Serviço de guincho em Toledo-PR",
    description:
      "Comodidade na retirada e entrega do veículo no perímetro urbano de Toledo, conforme disponibilidade de agendamento.",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Primeiro contato",
    copy: "Informe os dados do veículo e descreva o ocorrido para receber as orientações iniciais.",
  },
  {
    number: "02",
    title: "Avaliação técnica",
    copy: "Inspeção presencial dos danos na lataria e pintura para definir a abordagem adequada.",
  },
  {
    number: "03",
    title: "Orçamento e alinhamento",
    copy: "Definição clara do escopo do serviço, materiais aplicados e previsão de prazo para execução.",
  },
  {
    number: "04",
    title: "Reparação e conferência",
    copy: "Execução do serviço na oficina e conferência de alinhamento e acabamento para a entrega.",
  },
] as const;

/**
 * Bloco consolidado de Confiança e Processo (SPEC-064):
 * - Até 3 diferenciais verificáveis sem numeração e sem promessa de "laudo".
 * - As 4 etapas do atendimento em linha, sem cards individuais, com uma única sequência numérica (01 a 04).
 */
export function ProcessTimeline() {
  return (
    <section id="processo" className="py-16 md:py-24 bg-secondary/20 border-y border-border">
      <div className="page-width">
        <ScrollReveal direction="up" delay={0.05} className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Como trabalhamos</p>
          <h2 className="section-title">
            Diagnóstico claro e etapas definidas do início à entrega.
          </h2>
        </ScrollReveal>

        {/* 3 Diferenciais Verificáveis (sem numeração e sem promessa de laudo) */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/70 border-t border-border/80 pb-12">
          {differentials.map((item, i) => (
            <ScrollReveal
              key={item.title}
              direction="up"
              delay={0.08 + i * 0.08}
              className="pt-8 md:pt-10 md:px-8 first:md:pl-0 last:md:pr-0"
            >
              <h3 className="text-lg md:text-xl font-semibold font-display tracking-tight text-foreground mb-2.5 text-balance">
                {item.title}
              </h3>
              <p className="body-copy text-xs text-pretty leading-relaxed">{item.description}</p>
            </ScrollReveal>
          ))}
        </div>

        {/* 4 Etapas do Atendimento em Linha (sequência numérica única 01 a 04, sem cards individuais) */}
        <div className="border-t border-border/80 pt-10">
          <p className="eyebrow mb-8">Etapas do atendimento</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0 m-0">
            {steps.map((step, i) => (
              <ScrollReveal
                key={step.title}
                as="li"
                direction="up"
                delay={0.1 + i * 0.08}
                className="flex flex-col border-t border-border/50 pt-4"
              >
                <span className="text-primary text-xs font-semibold font-mono tracking-wider mb-2">
                  {step.number}
                </span>
                <h3 className="text-base md:text-lg font-semibold font-display tracking-tight text-foreground mb-2 text-balance">
                  {step.title}
                </h3>
                <p className="body-copy text-xs text-pretty leading-relaxed">{step.copy}</p>
              </ScrollReveal>
            ))}
          </ol>

          <p className="text-[11px] text-muted-foreground mt-8">
            Condições específicas, escopo e prazos são definidos após a avaliação técnica presencial
            de cada veículo.
          </p>
        </div>
      </div>
    </section>
  );
}
