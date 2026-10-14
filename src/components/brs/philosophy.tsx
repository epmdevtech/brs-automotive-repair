import * as React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NumericCounter } from "@/components/ui/numeric-counter";

export function Philosophy() {
  const pillars = [
    [
      "Reparação e pintura técnica de precisão",
      "Alinhamento milimétrico de painéis, preparação minuciosa e controle de aplicação do verniz em estufa de pressão positiva.",
    ],
    [
      "Diagnóstico honesto e transparente",
      "Orientações objetivas e laudo claro para que você compreenda a real extensão da avaria, sem procedimentos desnecessários.",
    ],
    [
      "Serviço de leva e traz em Toledo-PR",
      "Comodidade na retirada e entrega do veículo com atendimento ágil e responsável para você e seu corretor parceiro.",
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
          <p className="eyebrow mb-5">Padrão de execução</p>
          <h2 className="section-title">
            Critério técnico e
            <br />
            <span className="text-primary">cuidado em cada etapa.</span>
          </h2>
          <p className="body-copy mt-6 max-w-[440px]">
            Um reparo automotivo duradouro exige técnica apurada, ferramentas adequadas e
            responsabilidade. Nosso compromisso começa na avaliação inicial do dano para orientar a
            solução mais eficiente para o seu veículo.
          </p>
          <p className="text-[10px] text-muted-foreground mt-5">
            Princípios que norteiam cada veículo atendido na oficina.
          </p>
        </ScrollReveal>

        <div data-reveal="" style={{ "--i": 1 } as React.CSSProperties} className="space-y-6">
          {pillars.map(([title, description], i) => (
            <ScrollReveal key={title} direction="up" delay={0.1 + i * 0.12} className="pillar">
              <div className="flex items-center justify-center">
                <span className="pillar-number font-mono">
                  <NumericCounter target={i + 1} padZero />
                </span>
              </div>
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
