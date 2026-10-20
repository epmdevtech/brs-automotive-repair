import { CheckCircle2, Clock, ArrowRight, CircleDot } from "lucide-react";
import { type ExecutionStep } from "@/lib/proposta";

interface ProposalExecutionStepsProps {
  steps: ExecutionStep[];
}

export function ProposalExecutionSteps({ steps }: ProposalExecutionStepsProps) {
  return (
    <section id="cronograma" className="section-space border-b border-border/80 bg-neutral-950/80">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Metodologia e Entregas</p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl text-white">
            Ciclo de Execução em 9 Etapas
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Do primeiro contato à publicação final e capacitação da equipe, seguimos um processo
            estruturado para garantir previsibilidade de prazos, controle de escopo e qualidade de
            código.
          </p>
        </div>

        {/* Grade de Etapas em Linha do Tempo Visual */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((st) => {
            const isCompleted = st.step === 1;
            const isCurrentAction = st.step === 2;

            return (
              <div
                key={st.step}
                className={`flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 relative ${
                  isCurrentAction
                    ? "border-primary bg-gradient-to-b from-primary/[0.08] to-neutral-950 shadow-lg shadow-primary/10 ring-1 ring-primary/40"
                    : isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-white/10 bg-card/40 hover:border-white/20"
                }`}
              >
                <div>
                  {/* Cabeçalho da Etapa com Número e Status */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isCurrentAction
                            ? "bg-primary text-white"
                            : isCompleted
                              ? "bg-emerald-500 text-neutral-950"
                              : "bg-white/10 text-neutral-300"
                        }`}
                      >
                        {String(st.step).padStart(2, "0")}
                      </span>

                      {isCurrentAction && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-primary/20 text-brand-accent border border-primary/30 font-semibold">
                          Próximo Passo
                        </span>
                      )}

                      {isCompleted && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Realizado
                        </span>
                      )}
                    </div>

                    {st.duration && (
                      <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                        <Clock className="size-3 text-neutral-500" aria-hidden="true" />
                        {st.duration}
                      </span>
                    )}
                  </div>

                  {/* Título e Descrição */}
                  <h3 className="text-base sm:text-lg font-display font-semibold text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                {isCurrentAction && (
                  <div className="mt-5 pt-4 border-t border-primary/20">
                    <a
                      href="#aceite"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-accent font-semibold hover:underline"
                    >
                      Avançar para seleção e manifestação de interesse
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
