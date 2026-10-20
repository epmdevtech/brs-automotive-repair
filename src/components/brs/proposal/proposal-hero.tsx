import * as React from "react";
import { Calendar, CheckCircle, Shield, Sparkles } from "lucide-react";
import gsap from "gsap";
import type { CommercialProposal } from "@/lib/proposta";
import { isReducedMotionPreferred } from "@/lib/motion-system";

interface ProposalHeroProps {
  proposal: CommercialProposal;
}

export function ProposalHero({ proposal }: ProposalHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const metaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || isReducedMotionPreferred()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (headerRef.current) {
        tl.from(headerRef.current, {
          y: 16,
          opacity: 0,
          duration: 0.5,
        });
      }

      if (titleRef.current) {
        tl.from(
          titleRef.current,
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.3",
        );
      }

      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            y: 18,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.45",
        );
      }

      if (metaRef.current) {
        tl.from(
          metaRef.current.children,
          {
            y: 16,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.4",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="visao-geral"
      ref={containerRef}
      className="relative pt-32 pb-16 md:pt-36 md:pb-20 border-b border-border/80 overflow-hidden"
    >
      {/* Luz ambiente de destaque suave */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[760px] h-[380px] bg-primary/10 rounded-full blur-[140px] -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 right-1/4 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] -z-10"
        aria-hidden="true"
      />

      {/* Grid de fundo suave */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] opacity-70 -z-10"
        aria-hidden="true"
      />

      <div className="page-width">
        {/* Identificação de autoria, confidencialidade e coordenadas */}
        <div
          ref={headerRef}
          className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/8"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-brand-accent text-[11px] font-medium tracking-wide">
              <Sparkles className="size-3" aria-hidden="true" />
              <span>Proposta Comercial Exclusiva</span>
            </div>
            <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              PRO.08 // APRESENTAÇÃO COMERCIAL
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Shield className="size-3 text-brand-accent/70" aria-hidden="true" />
            <span>Autoria: {proposal.author}</span>
            <span className="text-white/20">|</span>
            <span>Ref: {proposal.slug}</span>
          </div>
        </div>

        {/* Nome da empresa cliente e chamada editorial */}
        <p className="eyebrow mb-3">Preparada para {proposal.companyName}</p>
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white max-w-4xl leading-[1.14]"
        >
          {proposal.projectTitle}
        </h1>

        {proposal.projectSubtitle && (
          <p
            ref={subtitleRef}
            className="mt-5 text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed"
          >
            {proposal.projectSubtitle}
          </p>
        )}

        {/* Metadados comerciais em matriz de cartões refinados */}
        <div
          ref={metaRef}
          className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
        >
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <span className="text-muted-foreground block text-[10px] font-mono uppercase tracking-wider mb-1.5">
              Cliente
            </span>
            <span className="text-white font-medium text-sm block truncate">
              {proposal.clientName}
            </span>
          </div>

          {proposal.issueDate && (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <span className="text-muted-foreground block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Emissão
              </span>
              <span className="text-neutral-200 flex items-center gap-1.5 font-mono text-sm">
                <Calendar className="size-3.5 text-brand-accent" aria-hidden="true" />
                {proposal.issueDate}
              </span>
            </div>
          )}

          {proposal.validUntil && (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <span className="text-muted-foreground block text-[10px] font-mono uppercase tracking-wider mb-1.5">
                Validade da Proposta
              </span>
              <span className="text-neutral-200 flex items-center gap-1.5 font-mono text-sm">
                <Calendar className="size-3.5 text-brand-accent" aria-hidden="true" />
                {proposal.validUntil}
              </span>
            </div>
          )}

          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <span className="text-muted-foreground block text-[10px] font-mono uppercase tracking-wider mb-1.5">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-sm">
              <CheckCircle className="size-3.5" aria-hidden="true" />
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
