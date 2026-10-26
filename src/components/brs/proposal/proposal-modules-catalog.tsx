import { Check, X, Layers, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { type ProposalModule, formatCurrencyBRL } from "@/lib/proposta";

interface ProposalModulesCatalogProps {
  modules: ProposalModule[];
  selectedModuleIds: string[];
  onToggleModule: (moduleId: string) => void;
}

export function ProposalModulesCatalog({
  modules,
  selectedModuleIds,
  onToggleModule,
}: ProposalModulesCatalogProps) {
  return (
    <section id="modulos" className="section-space border-b border-border/80 bg-neutral-950/60">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Portfólio de Soluções EPM DevTech</p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl text-white">
            Módulos de Software Sob Medida
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Cada solução atende a uma demanda operacional ou comercial bem delimitada da Master
            Reparações Automotivas. Escolha os módulos que deseja avaliar para compor o investimento
            sob medida para o seu momento.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-brand-accent font-mono">
            <Layers className="size-3.5" aria-hidden="true" />
            <span>Selecione os módulos abaixo para simular o investimento em tempo real</span>
          </div>
        </div>

        {/* Grade Responsiva dos 6 Módulos (1 col no celular, 2 em tablet/desktop, 3 em telas amplas) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {modules.map((mod) => {
            const isSelected = selectedModuleIds.includes(mod.id);

            return (
              <div
                key={mod.id}
                className={`flex flex-col justify-between rounded-xl border transition-all duration-200 p-6 sm:p-7 relative ${
                  isSelected
                    ? "border-primary/60 bg-gradient-to-b from-primary/[0.06] to-neutral-950 shadow-lg shadow-primary/5"
                    : "border-white/10 bg-card/40 hover:border-white/20"
                }`}
              >
                <div>
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-neutral-300 uppercase tracking-wider">
                        {mod.category}
                      </span>
                      {mod.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-wider font-semibold ${
                            mod.recommended
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                              : "bg-primary/10 border-primary/20 text-brand-accent"
                          }`}
                        >
                          {mod.badge}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleModule(mod.id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-sm transition-colors cursor-pointer border ${
                        isSelected
                          ? "bg-primary text-white border-primary hover:bg-primary-hover"
                          : "bg-white/5 text-neutral-300 border-white/15 hover:border-primary/50 hover:text-white"
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? "Remover" : "Selecionar"} módulo ${mod.name}`}
                    >
                      {isSelected ? "Selecionado ✓" : "+ Selecionar"}
                    </button>
                  </div>

                  {/* Nome e Preço */}
                  <h3 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">
                    {mod.name}
                  </h3>

                  <div className="mt-2 mb-4 flex items-baseline gap-1.5">
                    {mod.isStartingPrice && (
                      <span className="text-xs text-muted-foreground font-mono">a partir de</span>
                    )}
                    <span className="text-2xl sm:text-3xl font-display font-bold text-brand-accent">
                      {formatCurrencyBRL(mod.price)}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      implantação
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {mod.summary}
                  </p>

                  {/* Problema que resolve */}
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 mb-6 text-xs text-neutral-300 leading-relaxed">
                    <strong className="text-white block mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-brand-accent" aria-hidden="true" />
                      Problema que resolve:
                    </strong>
                    {mod.problemSolved}
                  </div>

                  {/* Entregáveis Incluídos */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-accent mb-2.5 flex items-center gap-1.5">
                        <Check className="size-3.5" aria-hidden="true" />
                        <span>Escopo-base incluído</span>
                      </h4>
                      <ul className="space-y-2">
                        {mod.deliverables.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed"
                          >
                            <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Fora do Escopo */}
                    <div className="pt-3 border-t border-white/10">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                        <X className="size-3.5 text-neutral-500" aria-hidden="true" />
                        <span>Fora do escopo-base</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {mod.exclusions.map((exc, idx) => (
                          <li
                            key={idx}
                            className="text-[11px] text-neutral-400 leading-relaxed pl-3.5 relative"
                          >
                            <span className="absolute left-0 top-1 text-neutral-600">•</span>
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Card: Dependências e Custos */}
                <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-neutral-400">
                  {mod.dependencies.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="size-3 text-brand-accent shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-neutral-300">Dependência:</strong>{" "}
                        {mod.dependencies.join("; ")}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] text-neutral-400 italic">* {mod.recurringCostsNote}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
