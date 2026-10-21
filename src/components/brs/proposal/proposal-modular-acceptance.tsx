import { useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Layers,
  X,
  AlertCircle,
} from "lucide-react";
import {
  type CommercialProposal,
  type ProposalModule,
  calculateSelectedModulesTotal,
  generateModularAcceptanceMessage,
  formatCurrencyBRL,
} from "@/lib/proposta";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProposalModularAcceptanceProps {
  proposal: CommercialProposal;
  selectedModuleIds: string[];
  onToggleModule: (moduleId: string) => void;
  onSelectBundle: (moduleIds: string[]) => void;
}

export function ProposalModularAcceptance({
  proposal,
  selectedModuleIds,
  onToggleModule,
  onSelectBundle,
}: ProposalModularAcceptanceProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [contactName, setContactName] = useState(proposal.clientName || "");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const modules = proposal.modulesCatalog || [];
  const { totalValue, hasVariableStartingPrice, selectedModules } = calculateSelectedModulesTotal(
    selectedModuleIds,
    modules,
  );

  const formattedMessage = generateModularAcceptanceMessage(proposal, selectedModuleIds, {
    name: contactName,
    notes,
  });

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(formattedMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error("Falha ao copiar mensagem", err);
    }
  };

  const encodedMessage = encodeURIComponent(formattedMessage);
  const whatsappUrl = proposal.authorContact.whatsappNumber
    ? `https://wa.me/${proposal.authorContact.whatsappNumber}?text=${encodedMessage}`
    : null;

  const mailtoUrl = `mailto:${proposal.authorContact.email}?subject=${encodeURIComponent(
    `Manifestação de Interesse - Proposta Comercial Modular Master (${proposal.slug})`,
  )}&body=${encodedMessage}`;

  return (
    <section
      id="aceite"
      className="section-space border-b border-border/80 bg-neutral-950/90 relative"
    >
      <div className="page-width">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/25 text-brand-accent text-xs font-medium mb-4">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Fechamento & Próximo Passo</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-white tracking-tight">
            Resumo do Orçamento & Manifestação de Interesse
          </h2>

          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Revise a seleção de módulos abaixo. Você pode ajustar os itens a qualquer momento antes
            de compartilhar seu interesse para iniciarmos a etapa de alinhamento com a EPM DevTech.
          </p>
        </div>

        {/* Card do Resumo Dinâmico */}
        <div className="max-w-3xl mx-auto rounded-xl border border-white/10 bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Composição Atual
              </span>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-white flex items-center gap-2">
                <Layers className="size-5 text-brand-accent" aria-hidden="true" />
                {selectedModules.length} de {modules.length} Módulos Selecionados
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Investimento de Implantação
              </span>
              <div className="flex items-baseline gap-1 sm:justify-end">
                {hasVariableStartingPrice && (
                  <span className="text-xs text-neutral-400 font-mono">A partir de</span>
                )}
                <span className="text-2xl sm:text-3xl font-display font-bold text-brand-accent">
                  {formatCurrencyBRL(totalValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Listagem dos Módulos Selecionados */}
          <div className="py-6 border-b border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-3">
              Módulos Inclusos na Simulação:
            </span>

            {selectedModules.length === 0 ? (
              <div className="p-4 rounded-lg bg-neutral-900/60 border border-primary/30 text-brand-accent text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Nenhum módulo selecionado no momento. Escolha os módulos desejados no{" "}
                  <a href="#modulos" className="underline font-semibold hover:text-white">
                    Catálogo de Soluções
                  </a>{" "}
                  ou selecione uma das{" "}
                  <a href="#pacotes" className="underline font-semibold hover:text-white">
                    Combinações Sugeridas
                  </a>
                  .
                </span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-neutral-900/70 border border-white/5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-5 rounded-full bg-primary/20 text-brand-accent flex items-center justify-center shrink-0">
                        <Check className="size-3" aria-hidden="true" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                          {mod.name}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {mod.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-mono font-medium text-neutral-200">
                        {mod.isStartingPrice && (
                          <span className="text-[11px] text-neutral-400 mr-1">A partir de</span>
                        )}
                        {formatCurrencyBRL(mod.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleModule(mod.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 rounded-sm transition-colors"
                        title="Remover módulo da simulação"
                        aria-label={`Remover módulo ${mod.name}`}
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atalhos Rápidos para Pacotes */}
          <div className="py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-neutral-400 font-mono text-[11px]">Atalhos de Pacotes:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectBundle(["epm-web"])}
                className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-mono transition-colors"
              >
                Presença Digital
              </button>
              <button
                type="button"
                onClick={() => onSelectBundle(["epm-web", "epm-booking"])}
                className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-mono transition-colors"
              >
                Captação + Agendamento
              </button>
              <button
                type="button"
                onClick={() => onSelectBundle(["epm-web", "epm-booking", "epm-crm", "epm-oficina"])}
                className="px-2.5 py-1 rounded-sm bg-primary/10 hover:bg-primary/20 text-brand-accent border border-primary/20 text-[11px] font-mono font-semibold transition-colors"
              >
                Operação Completa (Destaque)
              </button>
              <button
                type="button"
                onClick={() =>
                  onSelectBundle([
                    "epm-web",
                    "epm-booking",
                    "epm-crm",
                    "epm-oficina",
                    "epm-connect",
                    "epm-insights",
                  ])
                }
                className="px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-mono transition-colors"
              >
                Todos os 6 Módulos
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto text-xs sm:text-sm font-semibold tracking-wide"
            >
              <span>Manifestar interesse na seleção</span>
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              asChild
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <a href={mailtoUrl}>
                <HelpCircle className="mr-2 size-4 text-brand-accent" aria-hidden="true" />
                <span>Tirar dúvidas por e-mail</span>
              </a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-neutral-400 text-center flex items-center justify-center gap-1.5">
            <ShieldAlert className="size-3.5 text-brand-accent/70 shrink-0" aria-hidden="true" />
            <span>
              A manifestação não constitui obrigação contratual imediata. O escopo e valores serão
              ratificados em reunião técnica e formalizados em contrato antes do início.
            </span>
          </p>
        </div>
      </div>

      {/* Modal / Dialog de Manifestação de Interesse */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-xl bg-neutral-950 border border-white/15 text-white p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-display font-semibold text-white">
              Manifestação de Interesse Comercial
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-neutral-300 mt-2">
              Confirme seus dados para preparar a mensagem de alinhamento com a EPM DevTech para a{" "}
              <strong>{proposal.companyName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="mod-contact-name"
                className="block text-xs font-mono text-neutral-300 mb-1.5"
              >
                Nome do Responsável na Master:
              </label>
              <input
                id="mod-contact-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Responsável Comercial / Direção Master"
                className="w-full px-3.5 py-2.5 rounded-md bg-neutral-900 border border-white/10 text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="mod-notes"
                className="block text-xs font-mono text-neutral-300 mb-1.5"
              >
                Observações, Dúvidas ou Prioridades (Opcional):
              </label>
              <textarea
                id="mod-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Temos urgência na captação online; gostaríamos de iniciar pelo formulário de agendamento."
                className="w-full px-3.5 py-2 rounded-md bg-neutral-900 border border-white/10 text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Prévia da Mensagem */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  Prévia da Mensagem Formatada:
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-accent hover:underline cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-md bg-neutral-900 border border-white/10 text-neutral-300 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed select-all">
                {formattedMessage}
              </div>
            </div>

            {/* Botões de Ação do Modal */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              {whatsappUrl && (
                <Button
                  variant="primary"
                  asChild
                  className="flex-1 text-xs sm:text-sm font-semibold"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 size-4" aria-hidden="true" />
                    Enviar pelo WhatsApp
                  </a>
                </Button>
              )}

              <Button variant="secondary" asChild className="flex-1 text-xs sm:text-sm">
                <a href={mailtoUrl}>
                  <span>Enviar por E-mail</span>
                </a>
              </Button>
            </div>

            <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
              Ao clicar, você será direcionado ao canal oficial da EPM DevTech com a mensagem
              pronta. Nenhuma informação é transmitida sem a sua confirmação.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
