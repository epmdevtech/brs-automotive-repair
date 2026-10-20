import { CheckCircle2, XCircle } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalScopeProps {
  proposal: CommercialProposal;
}

export function ProposalScope({ proposal }: ProposalScopeProps) {
  const { scopeIncluded, scopeExcluded } = proposal;

  return (
    <section id="escopo" className="section-space border-b border-border/80">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Transparência Técnica</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Escopo Discriminado & Entregáveis
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Definição minuciosa dos entregáveis acordados para o projeto. Sem surpresas ou
            ambiguidades: o que está contratado e o que é tratado à parte de forma transparente.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Coluna 1: Incluído no Projeto */}
          <div className="rounded-xl border border-primary/30 bg-primary/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-primary/20">
              <div className="size-8 rounded-full bg-primary/20 text-brand-accent flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-semibold text-white">
                  Incluído no Projeto
                </h3>
                <p className="text-xs text-brand-accent/80">
                  Entregáveis cobertos integralmente pelo investimento
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {scopeIncluded.map((item) => (
                <div key={item.id} className="flex items-start gap-3.5 group">
                  <CheckCircle2
                    className="size-4 text-brand-accent shrink-0 mt-1 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      {item.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 text-neutral-400 font-mono">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 2: Não Incluído / Contratado Separadamente */}
          <div className="rounded-xl border border-white/10 bg-white/[0.01] p-6 sm:p-8">
            <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/10">
              <div className="size-8 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center shrink-0">
                <XCircle className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-semibold text-neutral-300">
                  Não Incluído no Projeto
                </h3>
                <p className="text-xs text-neutral-500">
                  Serviços adicionais ou cotados separadamente
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {scopeExcluded.map((item) => (
                <div key={item.id} className="flex items-start gap-3.5 opacity-80 group">
                  <XCircle className="size-4 text-neutral-500 shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-neutral-300">{item.title}</h4>
                      {item.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 text-neutral-500 font-mono">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
