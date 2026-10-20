import { ShieldAlert, Globe, Server, Database, MessageSquare, Wrench } from "lucide-react";
import { type RecurringCostItem } from "@/lib/proposta";

interface ProposalRecurringCostsProps {
  recurringCosts: RecurringCostItem[];
}

export function ProposalRecurringCosts({ recurringCosts }: ProposalRecurringCostsProps) {
  // Ícones por categoria ou tipo
  const getCategoryIcon = (category: string) => {
    const catLower = category.toLowerCase();
    if (catLower.includes("domínio") || catLower.includes("endereçamento"))
      return <Globe className="size-5 text-brand-accent" aria-hidden="true" />;
    if (catLower.includes("hospedagem") || catLower.includes("cloud"))
      return <Server className="size-5 text-brand-accent" aria-hidden="true" />;
    if (catLower.includes("armazenamento") || catLower.includes("storage"))
      return <Database className="size-5 text-brand-accent" aria-hidden="true" />;
    if (catLower.includes("mensageria") || catLower.includes("whatsapp"))
      return <MessageSquare className="size-5 text-brand-accent" aria-hidden="true" />;
    return <Wrench className="size-5 text-brand-accent" aria-hidden="true" />;
  };

  const getStatusBadge = (status: RecurringCostItem["status"]) => {
    switch (status) {
      case "third_party":
        return {
          label: "Conta Direta do Cliente / Terceiro",
          className: "bg-primary/10 text-brand-accent border-primary/30",
        };
      case "included":
        return {
          label: "Incluso no Projeto",
          className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        };
      case "on_demand":
        return {
          label: "Sem Mensalidade Obrigatória / Sob Demanda",
          className: "bg-sky-500/10 text-sky-300 border-sky-500/30",
        };
      case "optional_future":
      default:
        return {
          label: "Opcional Futuro",
          className: "bg-neutral-500/10 text-neutral-300 border-white/10",
        };
    }
  };

  return (
    <section
      id="custos-recorrentes"
      className="section-space border-b border-border/80 bg-neutral-950/60"
    >
      <div className="page-width">
        <div className="max-w-3xl mb-12">
          <p className="eyebrow mb-3">Transparência Comercial & Infraestrutura</p>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl text-white">
            Custos Recorrentes e Serviços de Terceiros
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Diferente de agências tradicionais que criam dependência com mensalidades embutidas, a
            EPM DevTech separa o valor de implantação da infraestrutura. O cliente mantém a
            titularidade e autonomia das suas contas oficiais.
          </p>
        </div>

        {/* Lista de custos discriminados */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recurringCosts.map((item) => {
            const badge = getStatusBadge(item.status);

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-card/40 p-6 sm:p-7 transition-colors hover:border-white/20"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-wider text-right ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-display font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-auto">
                  <span className="text-[11px] font-mono text-neutral-400 block uppercase tracking-wider">
                    Estimativa de Custo
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-brand-accent block mt-1">
                    {item.estimatedValueText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nota explicativa de segurança e governança */}
        <div className="mt-8 p-5 sm:p-6 rounded-xl border border-primary/20 bg-primary/[0.03] flex items-start gap-3.5">
          <ShieldAlert className="size-5 text-brand-accent shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <strong className="text-white block mb-1">
              Princípio de Independência e Titularidade EPM DevTech:
            </strong>
            Todos os domínios, contas de hospedagem e acessos oficiais de API são configurados em
            nome da <strong>Master Chapeação e Pinturas</strong>. Caso o cliente decida no futuro
            não contratar suporte contínuo, a posse e o controle da operação digital permanecem 100%
            sob gestão da Master, sem lock-in.
          </div>
        </div>
      </div>
    </section>
  );
}
