import { Calendar, CheckCircle, Shield, Sparkles } from "lucide-react";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalHeroProps {
  proposal: CommercialProposal;
}

export function ProposalHero({ proposal }: ProposalHeroProps) {
  return (
    <section
      id="visao-geral"
      className="relative pt-32 pb-16 md:pt-36 md:pb-20 border-b border-border/80"
    >
      {/* Luz ambiente de destaque suave */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary/8 rounded-full blur-[120px] -z-10"
        aria-hidden="true"
      />

      <div className="page-width">
        {/* Identificação de autoria e confidencialidade */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-primary/10 border border-primary/25 text-primary text-[11px] font-medium tracking-wide">
            <Sparkles className="size-3" aria-hidden="true" />
            <span>Proposta Comercial Exclusiva</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Shield className="size-3 text-primary/70" aria-hidden="true" />
            <span>Autoria: {proposal.author}</span>
            <span className="text-white/20">|</span>
            <span>Ref: {proposal.slug}</span>
          </div>
        </div>

        {/* Nome da empresa cliente e chamada editorial */}
        <p className="eyebrow mb-3">Preparada para {proposal.companyName}</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white max-w-4xl leading-[1.15]">
          {proposal.projectTitle}
        </h1>

        {proposal.projectSubtitle && (
          <p className="mt-5 text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            {proposal.projectSubtitle}
          </p>
        )}

        {/* Metadados comerciais: Cliente, Emissão, Validade */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
              Cliente
            </span>
            <span className="text-white font-medium">{proposal.clientName}</span>
          </div>

          {proposal.issueDate && (
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
                Emissão
              </span>
              <span className="text-neutral-200 flex items-center gap-1.5 font-mono">
                <Calendar className="size-3 text-primary" aria-hidden="true" />
                {proposal.issueDate}
              </span>
            </div>
          )}

          {proposal.validUntil && (
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
                Validade da Proposta
              </span>
              <span className="text-neutral-200 flex items-center gap-1.5 font-mono">
                <Calendar className="size-3 text-primary" aria-hidden="true" />
                {proposal.validUntil}
              </span>
            </div>
          )}

          <div>
            <span className="text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
              Status
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle className="size-3" aria-hidden="true" />
              {proposal.status === "ready"
                ? "Pronta para Análise"
                : proposal.status === "accepted"
                  ? "Interesse Manifestado"
                  : "Em Elaboração"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
