import * as React from "react";
import { Reveal } from "./reveal";

export function Philosophy() {
  const pillars = [
    [
      "Atenção rigorosa aos detalhes",
      "Alinhamento milimétrico de painéis, preparação minuciosa e controle de aplicação do verniz.",
    ],
    [
      "Comunicação clara e transparente",
      "Orientações objetivas para que você compreenda o diagnóstico e as etapas de cada reparo.",
    ],
    [
      "Compromisso com o proprietário",
      "Tratamento responsável com quem confia seu veículo e com corretores que recomendam a BRS.",
    ],
  ];

  return (
    <section className="section-space border-y border-border bg-secondary/40">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-24">
        <Reveal staggerIndex={0}>
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
        </Reveal>
        <div data-reveal="" style={{ "--i": 1 } as React.CSSProperties} className="space-y-6">
          {pillars.map(([title, description], i) => (
            <Reveal key={title} staggerIndex={i} className="pillar">
              <Reveal delay={0.04} yOffset={10}>
                <span className="pillar-number">0{i + 1}</span>
              </Reveal>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mb-2 text-balance">
                  {title}
                </h3>
                <p className="body-copy text-xs text-pretty">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
