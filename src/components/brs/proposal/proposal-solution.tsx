import { Zap, ShieldCheck, Smartphone, Eye, Code2 } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalSolutionProps {
  proposal: CommercialProposal;
}

const FEATURE_ICONS = [Code2, Eye, ShieldCheck, Smartphone, Zap];

export function ProposalSolution({ proposal }: ProposalSolutionProps) {
  const { solutionOverview } = proposal;

  return (
    <section id="solucao" className="section-space border-b border-border/80 bg-neutral-950/40">
      <div className="page-width">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Engenharia Sob Medida</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            {solutionOverview.title}
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            {solutionOverview.description}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutionOverview.highlights.map((highlight, idx) => {
              const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-lg bg-card/60 border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="size-10 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
                      Diferencial #{idx + 1}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {highlight}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
