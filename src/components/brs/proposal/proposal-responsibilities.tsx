import { Shield, UserCheck, Check } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalResponsibilitiesProps {
  proposal: CommercialProposal;
}

export function ProposalResponsibilities({ proposal }: ProposalResponsibilitiesProps) {
  const { responsibilities } = proposal;

  return (
    <section id="responsabilidades" className="section-space border-b border-border/80">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Compromisso Mútuo</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Papéis & Responsabilidades
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            O sucesso e a pontualidade da entrega dependem da cooperação transparente entre a equipe
            técnica da EPM DevTech e a equipe da BRS.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Responsabilidades da EPM DevTech */}
          <div className="p-7 rounded-xl border border-white/10 bg-card/40">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10">
              <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Shield className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-display font-semibold text-white">
                  Responsabilidades EPM DevTech
                </h3>
                <span className="text-xs text-muted-foreground">
                  Engenharia, arquitetura e execução
                </span>
              </div>
            </div>

            <ul className="space-y-3.5">
              {responsibilities.epmDevTech.map((resp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300 leading-relaxed"
                >
                  <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsabilidades do Cliente (BRS) */}
          <div className="p-7 rounded-xl border border-white/10 bg-white/[0.01]">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/10">
              <div className="size-8 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                <UserCheck className="size-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-display font-semibold text-neutral-200">
                  Responsabilidades do Cliente (BRS)
                </h3>
                <span className="text-xs text-muted-foreground">Insumos, validação e acessos</span>
              </div>
            </div>

            <ul className="space-y-3.5">
              {responsibilities.client.map((resp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm text-neutral-400 leading-relaxed"
                >
                  <Check className="size-4 text-neutral-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
