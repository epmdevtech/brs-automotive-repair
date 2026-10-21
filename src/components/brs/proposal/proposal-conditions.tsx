import { ShieldCheck, FileCheck2 } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalConditionsProps {
  proposal: CommercialProposal;
}

export function ProposalConditions({ proposal }: ProposalConditionsProps) {
  const { paymentConditions } = proposal;

  return (
    <section id="condicoes" className="section-space border-b border-border/80">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Termos & Garantias</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Condições Comerciais & Pagamento
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Critérios para início, validação e entrega. Transparência jurídica e alinhamento mútuo
            antes do início da implementação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {paymentConditions.map((cond, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-xl border transition-all ${
                cond.highlight
                  ? "border-primary/40 bg-primary/[0.03]"
                  : "border-white/10 bg-card/30"
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-brand-accent mb-3">
                {cond.highlight ? (
                  <FileCheck2 className="size-4" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="size-4" aria-hidden="true" />
                )}
                <span>{cond.title}</span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {cond.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
