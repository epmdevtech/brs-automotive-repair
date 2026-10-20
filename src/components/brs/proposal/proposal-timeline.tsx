import { Clock, ArrowRight } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalTimelineProps {
  proposal: CommercialProposal;
}

export function ProposalTimeline({ proposal }: ProposalTimelineProps) {
  const { developmentPhases, estimatedTimeline } = proposal;

  return (
    <section id="cronograma" className="section-space border-b border-border/80 bg-neutral-950/40">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Processo de Engenharia</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Etapas de Desenvolvimento & Entrega
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Metodologia ágil e estruturada do alinhamento inicial à publicação definitiva. O
            briefing detalhado é conduzido na etapa 1, sem formulários cansativos prévios.
          </p>

          {estimatedTimeline && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-xs text-brand-accent font-mono">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>Prazo Estimado Global: {estimatedTimeline}</span>
            </div>
          )}
        </div>

        <div className="relative border-l border-white/15 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-10">
          {developmentPhases.map((phase) => (
            <div key={phase.step} className="relative group">
              {/* Marcador Numérico na Linha */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-0 size-7 sm:size-8 rounded-full bg-neutral-900 border-2 border-primary text-brand-accent flex items-center justify-center text-xs font-bold font-mono shadow-md">
                {phase.step}
              </div>

              <div className="pt-0.5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-display font-semibold text-white">
                    {phase.title}
                  </h3>

                  {phase.estimatedDuration && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-brand-accent">
                      {phase.estimatedDuration}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl">
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-white/[0.02] border border-white/10 flex items-start sm:items-center gap-4 text-xs sm:text-sm text-neutral-300">
          <ArrowRight className="size-5 text-brand-accent shrink-0" aria-hidden="true" />
          <span>
            <strong>Garantia de Iteração:</strong> A fase de homologação inclui rodada de revisão e
            refinamentos pontuais antes do apontamento do domínio público.
          </span>
        </div>
      </div>
    </section>
  );
}
