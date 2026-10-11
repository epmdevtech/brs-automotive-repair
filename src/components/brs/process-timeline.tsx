import { reveal } from "@/lib/motion";

export function ProcessTimeline() {
  const steps = [
    [
      "Primeiro contato",
      "Informe os dados do veículo e descreva o ocorrido para receber as orientações iniciais.",
    ],
    [
      "Avaliação técnica",
      "Inspeção minuciosa dos danos na lataria e pintura para diagnóstico da melhor abordagem.",
    ],
    [
      "Orçamento e alinhamento",
      "Definição clara do escopo do serviço, materiais aplicados e previsão de prazo para execução.",
    ],
    [
      "Reparação e conferência",
      "Execução do serviço com controle rigoroso de qualidade e alinhamento para a entrega do veículo.",
    ],
  ];

  return (
    <section className="section-space bg-secondary/50 border-y border-border">
      <div className="page-width">
        <div className="mb-12" {...reveal(0)}>
          <p className="eyebrow mb-4">Etapas do atendimento</p>
          <h2 className="section-title">
            Fluxo estruturado e
            <br />
            <span className="text-muted-foreground">decisão com total segurança.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map(([title, copy], i) => (
            <div key={title} className="process-step" {...reveal(i + 1)}>
              <span className="text-primary text-xs font-semibold tracking-wider">0{i + 1}</span>
              <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mt-3 mb-3 text-balance">
                {title}
              </h3>
              <p className="body-copy text-xs text-pretty">{copy}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-8">
          Etapas padrão do processo de reparo. Condições específicas e prazos são definidos após a
          avaliação técnica de cada veículo.
        </p>
      </div>
    </section>
  );
}
