import { useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { type CommercialProposal, generateAcceptanceMessage } from "@/lib/proposta";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProposalAcceptanceProps {
  proposal: CommercialProposal;
}

export function ProposalAcceptance({ proposal }: ProposalAcceptanceProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const formattedMessage = generateAcceptanceMessage(proposal, {
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
    `Interesse na Proposta Comercial - ${proposal.projectTitle} (${proposal.slug})`,
  )}&body=${encodedMessage}`;

  return (
    <section id="manifestar-interesse" className="section-space border-b border-border/80 relative">
      <div className="page-width">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/25 text-brand-accent text-xs font-medium mb-4">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Próxima Etapa</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-white tracking-tight">
            Pronto para transformar a presença digital da {proposal.companyName}?
          </h2>

          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Manifeste seu interesse para alinharmos os detalhes e iniciarmos a etapa de briefing
            guiado com a equipe de engenharia da EPM DevTech.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto text-xs sm:text-sm font-semibold tracking-wide"
            >
              <span>Tenho interesse nesta proposta</span>
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
                <span>Quero esclarecer uma dúvida</span>
              </a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldAlert className="size-3.5 text-brand-accent/70 shrink-0" aria-hidden="true" />
            <span>
              Esta manifestação representa interesse em avançar ao briefing e não constitui contrato
              jurídico irrevogável.
            </span>
          </p>
        </div>
      </div>

      {/* Modal Acessível de Confirmação e Próximos Passos */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl bg-neutral-950 border-white/15 text-foreground sm:rounded-xl">
          <DialogHeader className="text-left pb-3 border-b border-white/10">
            <DialogTitle className="text-lg sm:text-xl font-display font-semibold text-white">
              Manifestação de Interesse Comercial
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-neutral-400 mt-1">
              Ref: {proposal.slug} · {proposal.projectTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-xs sm:text-sm text-neutral-300">
              <p className="font-semibold text-brand-accent mb-1">Como funciona a transição:</p>
              <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-xs leading-relaxed">
                <li>Recebemos sua manifestação comercial e confirmamos os termos;</li>
                <li>Emitimos o Contrato de Prestação de Serviços Digitais para formalização;</li>
                <li>Agendamos a sessão de briefing guiado para coletar os insumos da oficina.</li>
              </ol>
            </div>

            {/* Campos Opcionais de Contato */}
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="prop-contact-name"
                  className="block text-xs font-medium text-neutral-300 mb-1"
                >
                  Seu nome ou cargo (opcional)
                </label>
                <input
                  id="prop-contact-name"
                  type="text"
                  placeholder={proposal.clientName}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-card/60 border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="prop-notes"
                  className="block text-xs font-medium text-neutral-300 mb-1"
                >
                  Dúvidas ou observações iniciais (opcional)
                </label>
                <textarea
                  id="prop-notes"
                  rows={2}
                  placeholder="Ex.: Gostaria de alinhar a data de início para a próxima semana..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-card/60 border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            {/* Prévia da Mensagem Formatada */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-neutral-400">Mensagem estruturada:</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-[11px] text-brand-accent hover:underline cursor-pointer border-0 bg-transparent p-0"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" aria-hidden="true" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 rounded-lg bg-neutral-900 border border-white/10 text-[11px] text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                {formattedMessage}
              </pre>
            </div>

            {/* Ações de Envio */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              {whatsappUrl && (
                <Button variant="primary" asChild className="flex-1 text-xs">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="size-4 mr-1.5" aria-hidden="true" />
                    <span>Enviar via WhatsApp EPM DevTech</span>
                  </a>
                </Button>
              )}

              <Button variant="secondary" asChild className="flex-1 text-xs">
                <a href={mailtoUrl}>
                  <span>Enviar por E-mail</span>
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
