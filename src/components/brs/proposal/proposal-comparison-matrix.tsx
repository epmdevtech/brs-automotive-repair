import { Table, CheckCircle2, ArrowRight } from "lucide-react";
import { type ProposalModule, formatCurrencyBRL } from "@/lib/proposta";

interface ProposalComparisonMatrixProps {
  modules: ProposalModule[];
}

export function ProposalComparisonMatrix({ modules }: ProposalComparisonMatrixProps) {
  return (
    <section id="comparativo" className="section-space border-b border-border/80">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Visão Comparativa</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Matriz Comparativa das Soluções
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Compare o objetivo, complexidade de implantação e dependências de cada módulo para
            identificar a combinação mais assertiva para a Master.
          </p>
        </div>

        {/* Visualização Desktop / Tablet (Tabela Estruturada) */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10 bg-card/30">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-900/90 border-b border-white/10 text-neutral-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th scope="col" className="p-4 sm:px-6">
                  Solução
                </th>
                <th scope="col" className="p-4 sm:px-6">
                  Finalidade Comercial
                </th>
                <th scope="col" className="p-4 sm:px-6">
                  Investimento
                </th>
                <th scope="col" className="p-4 sm:px-6">
                  Dependências Técnicas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {modules.map((mod) => (
                <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 sm:px-6 font-semibold text-white whitespace-nowrap">
                    <span className="block font-display text-sm sm:text-base">{mod.name}</span>
                    <span className="text-[11px] font-normal text-muted-foreground font-mono">
                      {mod.category}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-neutral-300 max-w-xs">{mod.summary}</td>
                  <td className="p-4 sm:px-6 font-mono whitespace-nowrap">
                    <span className="text-brand-accent font-semibold text-sm sm:text-base">
                      {mod.isStartingPrice ? "A partir de " : ""}
                      {formatCurrencyBRL(mod.price)}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">implantação</span>
                  </td>
                  <td className="p-4 sm:px-6 text-neutral-400 text-xs">
                    {mod.dependencies.length > 0 ? mod.dependencies.join("; ") : "Independente"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visualização Mobile Otimizada (Cartões Comparativos para não quebrar layout de tela estreita) */}
        <div className="md:hidden space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="p-5 rounded-xl border border-white/10 bg-card/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-display font-semibold text-white text-base">{mod.name}</h3>
                  <span className="text-[10px] text-brand-accent uppercase font-mono">
                    {mod.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-display font-bold text-brand-accent block">
                    {mod.isStartingPrice ? "A partir de " : ""}
                    {formatCurrencyBRL(mod.price)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">implantação</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1">
                  Finalidade
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">{mod.summary}</p>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-neutral-400">
                <span className="text-muted-foreground">Dependências: </span>
                <span>
                  {mod.dependencies.length > 0 ? mod.dependencies.join("; ") : "Independente"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
