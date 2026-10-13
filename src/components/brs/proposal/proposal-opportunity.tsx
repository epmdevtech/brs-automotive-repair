import { Target, Check } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalOpportunityProps {
  proposal: CommercialProposal;
}

export function ProposalOpportunity({ proposal }: ProposalOpportunityProps) {
  const opportunity = proposal.diagnosisAndOpportunity;
  if (!opportunity) return null;

  return (
    <section id="diagnostico" className="section-space border-b border-border/80">
      <div className="page-width">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Diagnóstico Estratégico</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">{opportunity.title}</h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            {opportunity.description}
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-6 flex items-center gap-2">
            <Target className="size-4" aria-hidden="true" />
            <span>Objetivos Pretendidos com a Solução Digital</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {opportunity.objectives.map((objective, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
              >
                <div className="size-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="size-3" aria-hidden="true" />
                </div>
                <span className="text-sm text-neutral-200 leading-normal">{objective}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
