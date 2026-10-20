import { Coins, Check, AlertCircle, Sparkles, CreditCard } from "lucide-react";
import { type CommercialProposal, formatCurrencyBRL } from "@/lib/proposta";

interface ProposalInvestmentProps {
  proposal: CommercialProposal;
}

export function ProposalInvestmentSection({ proposal }: ProposalInvestmentProps) {
  const { investment } = proposal;

  return (
    <section
      id="investimento"
      className="section-space border-b border-border/80 bg-neutral-950/60 relative"
    >
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Condições Financeiras</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Investimento & Condições Comerciais
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Valor fechado e transparente para a execução completa do projeto. Sem surpresas,
            cobranças ocultas ou taxas compulsórias recorrentes.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Bloco Principal de Valor: Destaque Nobre */}
          <div className="lg:col-span-7 rounded-xl border border-primary/40 bg-gradient-to-b from-card to-neutral-950 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Coins className="size-36 text-brand-accent" aria-hidden="true" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/15 border border-primary/30 text-brand-accent text-xs font-medium mb-6">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Valor Fechado de Implantação</span>
            </div>

            <span className="block text-xs uppercase tracking-wider text-muted-foreground font-mono">
              Investimento Total do Projeto
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight">
                {formatCurrencyBRL(investment.totalValue)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">pagamento único</span>
            </div>

            {/* Divisão Entrada / Saldo */}
            {(investment.entryValue !== undefined || investment.balanceValue !== undefined) && (
              <div className="mt-8 pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-6">
                {investment.entryValue !== undefined && (
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                      Entrada no Aceite
                    </span>
                    <span className="text-xl font-display font-semibold text-brand-accent">
                      {formatCurrencyBRL(investment.entryValue)}
                    </span>
                    <span className="text-xs text-neutral-400 block mt-1">
                      Início após alinhamento do briefing
                    </span>
                  </div>
                )}

                {investment.balanceValue !== undefined && (
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                      Saldo Final
                    </span>
                    <span className="text-xl font-display font-semibold text-white">
                      {formatCurrencyBRL(investment.balanceValue)}
                    </span>
                    <span className="text-xs text-neutral-400 block mt-1">
                      {investment.balanceMoment || "Após aprovação e publicação"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Informação de Parcelamento */}
            {investment.installmentsDescription && (
              <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 text-xs sm:text-sm text-neutral-300">
                <CreditCard
                  className="size-4 text-brand-accent shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{investment.installmentsDescription}</span>
              </div>
            )}
          </div>

          {/* Bloco Lateral: Recorrência & Custos de Terceiros */}
          <div className="lg:col-span-5 space-y-6">
            {/* Ausência de mensalidade obrigatória */}
            <div className="rounded-xl border border-white/10 bg-card/40 p-6 sm:p-7">
              <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Check className="size-4" aria-hidden="true" />
                <span>
                  {investment.hasRecurringMonthly
                    ? `Mensalidade: ${formatCurrencyBRL(investment.recurringMonthlyValue || 0)}/mês`
                    : "Sem Mensalidade Obrigatória"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {investment.recurringDescription ||
                  "Não há cobrança de taxa de manutenção mensal mandatória. A plataforma e o código pertencem à Master Chapeação e Pinturas."}
              </p>
            </div>

            {/* Custos diretos de terceiros */}
            {investment.thirdPartyCosts && (
              <div className="rounded-xl border border-white/10 bg-white/[0.01] p-6 sm:p-7">
                <div className="flex items-center gap-2 text-brand-accent text-xs font-semibold uppercase tracking-wider mb-3">
                  <AlertCircle className="size-4" aria-hidden="true" />
                  <span>Custos Diretos de Terceiros</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {investment.thirdPartyCosts}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
