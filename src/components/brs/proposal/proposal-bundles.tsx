import { Check, Sparkles, ArrowRight, Layers } from "lucide-react";
import { type ModuleBundle, type ProposalModule, formatCurrencyBRL } from "@/lib/proposta";

interface ProposalBundlesProps {
  bundles: ModuleBundle[];
  modules: ProposalModule[];
  selectedModuleIds: string[];
  onSelectBundle: (moduleIds: string[]) => void;
}

export function ProposalBundles({
  bundles,
  modules,
  selectedModuleIds,
  onSelectBundle,
}: ProposalBundlesProps) {
  // Helper para mapear IDs para nomes legíveis
  const moduleMap = new Map(modules.map((m) => [m.id, m.name]));

  // Verifica se um bundle corresponde exatamente aos módulos selecionados
  const isBundleActive = (bundleModuleIds: string[]) => {
    if (bundleModuleIds.length !== selectedModuleIds.length) return false;
    return bundleModuleIds.every((id) => selectedModuleIds.includes(id));
  };

  return (
    <section id="pacotes" className="section-space border-b border-border/80 bg-neutral-950/80">
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Combinações Estratégicas</p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl text-white">
            Pacotes Sugeridos com Seleção em 1 Clique
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Estruturamos 5 combinações recomendadas baseadas nas fases de maturidade digital da
            oficina. Clique em qualquer pacote para carregar os módulos correspondentes no simulador
            de investimento.
          </p>
        </div>

        {/* Grid com 5 pacotes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {bundles.map((bundle) => {
            const active = isBundleActive(bundle.moduleIds);
            const isHighlight = bundle.highlight;

            return (
              <div
                key={bundle.id}
                className={`flex flex-col justify-between rounded-xl border transition-all duration-200 p-6 sm:p-7 relative ${
                  active
                    ? "border-primary bg-gradient-to-b from-primary/[0.08] to-neutral-950 shadow-xl shadow-primary/10 ring-1 ring-primary/40"
                    : isHighlight
                      ? "border-primary/30 bg-card/60 shadow-lg shadow-black/40"
                      : "border-white/10 bg-card/30 hover:border-white/20"
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    {bundle.badge && (
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-sm border uppercase tracking-wider font-semibold ${
                          active
                            ? "bg-primary text-white border-primary"
                            : isHighlight
                              ? "bg-primary/20 text-brand-accent border-primary/40"
                              : "bg-white/5 text-neutral-300 border-white/10"
                        }`}
                      >
                        {bundle.badge}
                      </span>
                    )}

                    {isHighlight && !active && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-accent">
                        <Sparkles className="size-3" aria-hidden="true" />
                        Destaque
                      </span>
                    )}

                    {active && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-accent font-semibold">
                        <Check className="size-3.5" aria-hidden="true" />
                        Ativo no Simulador
                      </span>
                    )}
                  </div>

                  {/* Nome e Descrição */}
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-white mb-2">
                    {bundle.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {bundle.description}
                  </p>

                  {/* Módulos inclusos no Pacote */}
                  <div className="mb-6 pt-4 border-t border-white/10">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                      <Layers className="size-3 text-brand-accent" aria-hidden="true" />
                      Módulos Inclusos ({bundle.moduleIds.length}):
                    </p>
                    <ul className="space-y-2">
                      {bundle.moduleIds.map((mId) => {
                        const mName = moduleMap.get(mId) || mId;
                        return (
                          <li
                            key={mId}
                            className="flex items-center gap-2 text-xs sm:text-sm text-neutral-200"
                          >
                            <div className="size-4 rounded-full bg-primary/20 text-brand-accent flex items-center justify-center shrink-0">
                              <Check className="size-2.5" aria-hidden="true" />
                            </div>
                            <span>{mName}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Preço e Botão de Ação */}
                <div className="pt-6 border-t border-white/10 mt-auto">
                  <div className="mb-4">
                    <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
                      Investimento de Implantação
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      {bundle.isStartingPrice && (
                        <span className="text-xs text-neutral-400 font-mono">A partir de</span>
                      )}
                      <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                        {formatCurrencyBRL(bundle.referencePrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectBundle(bundle.moduleIds);
                      const acceptanceElem = document.getElementById("aceite");
                      if (acceptanceElem) {
                        acceptanceElem.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`btn w-full justify-center text-xs sm:text-sm py-2.5 font-semibold transition-all cursor-pointer ${
                      active
                        ? "btn-primary shadow-lg shadow-primary/20"
                        : "btn-secondary hover:border-primary/50 hover:text-white"
                    }`}
                  >
                    {active ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="size-4" aria-hidden="true" />
                        Pacote Selecionado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        Selecionar esta Combinação
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl border border-white/10 bg-card/20 text-center text-xs text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          <p>
            Valores de referência antes de eventual condição especial acordada. Nada exige a
            contratação do portfólio completo: a Master tem total autonomia para iniciar pelo módulo
            essencial e evoluir conforme a demanda de sua operação. Implantações conjuntas podem
            exigir alinhamento técnico prévio.
          </p>
        </div>
      </div>
    </section>
  );
}
