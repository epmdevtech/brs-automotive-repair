import * as React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Philosophy() {
  const pillars = [
    [
      "Diagnóstico claro antes do serviço",
      "Avaliação presencial dos danos na lataria e na pintura para indicar apenas os procedimentos necessários para o reparo.",
    ],
    [
      "Orçamento e prazo alinhados antes da execução",
      "Escopo do serviço, materiais utilizados e previsão de entrega combinados com você antes de iniciar o trabalho na oficina.",
    ],
    [
      "Serviço de leva e traz em Toledo-PR",
      "Comodidade na retirada e entrega do veículo no perímetro urbano de Toledo, conforme disponibilidade de agendamento.",
    ],
  ];

  return (
    <section className="pt-16 pb-8 border-t border-border bg-secondary/20">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-24">
        <ScrollReveal
          data-reveal=""
          style={{ "--i": 0 } as React.CSSProperties}
          direction="up"
          delay={0.05}
        >
          <p className="eyebrow mb-5">Como trabalhamos</p>
          <h2 className="section-title">Critério técnico em cada etapa do reparo.</h2>
          <p className="body-copy mt-6 max-w-[440px]">
            Nosso compromisso começa na avaliação presencial do dano para orientar a solução
            adequada para o seu veículo, com transparência sobre procedimentos e prazos.
          </p>
        </ScrollReveal>

        <div data-reveal="" style={{ "--i": 1 } as React.CSSProperties} className="space-y-6">
          {pillars.map(([title, description], i) => (
            <ScrollReveal key={title} direction="up" delay={0.1 + i * 0.12} className="py-2">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mb-2 text-balance">
                  {title}
                </h3>
                <p className="body-copy text-xs text-pretty">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
