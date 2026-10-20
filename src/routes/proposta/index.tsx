import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, FileCheck, Shield, Sparkles, Layers } from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/proposta/")({
  component: ProposalIndexPage,
  head: () =>
    buildRouteHead({
      title: "Acesso à Proposta Comercial | EPM DevTech",
      description:
        "Portal de acesso a propostas comerciais personalizadas e projetos digitais da EPM DevTech.",
      path: "/proposta",
      noindex: true,
    }),
});

function ProposalIndexPage() {
  const [slugInput, setSlugInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanSlug = slugInput.trim().toLowerCase();
    if (cleanSlug) {
      navigate({
        to: "/proposta/$slug",
        params: { slug: cleanSlug },
      });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-24 px-4 bg-background">
      <div className="max-w-md w-full text-center p-8 rounded-xl border border-white/10 bg-card/40">
        <div className="size-12 rounded-full bg-primary/10 text-brand-accent flex items-center justify-center mx-auto mb-4">
          <FileCheck className="size-6" aria-hidden="true" />
        </div>

        <p className="eyebrow justify-center mb-2">EPM DevTech</p>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">
          Proposta Comercial
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Proposta comercial personalizada desenvolvida para a Master Chapeação e Pinturas.
        </p>

        {/* Atalho Proeminente para a Proposta Modular Ativa da Master */}
        <div className="mt-6 p-5 rounded-xl border border-primary/40 bg-gradient-to-b from-primary/10 to-transparent text-left">
          <div className="flex items-center gap-2 text-brand-accent text-[11px] font-semibold uppercase tracking-wider mb-1.5">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Proposta Oficial Modular</span>
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Master Chapeação e Pinturas</h2>
          <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
            Portfólio Modular de Software Automotivo (6 Soluções Sob Medida)
          </p>
          <Button variant="primary" asChild size="default" className="w-full text-xs font-semibold">
            <Link to="/proposta/$slug" params={{ slug: "master-chapeacao-pinturas" }}>
              <Layers className="mr-1.5 size-4" aria-hidden="true" />
              <span>Abrir Proposta Modular Master</span>
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Atalho Secundário para Presença Digital */}
        <div className="mt-3 p-3.5 rounded-lg border border-white/10 bg-white/[0.02] text-left flex items-center justify-between">
          <div className="truncate mr-2">
            <span className="text-[11px] font-mono text-neutral-400 block">
              Alternativa Clássica:
            </span>
            <span className="text-xs text-white truncate font-medium">
              Presença Digital Inicial
            </span>
          </div>
          <Button variant="ghost" asChild size="sm" className="text-xs text-brand-accent shrink-0">
            <Link to="/proposta/$slug" params={{ slug: "master-digital-presence" }}>
              Ver versão clássica
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-left">
          <p className="text-xs text-neutral-400 mb-3">
            Para acessar outra proposta por código ou referência:
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="proposal-ref-input"
                className="block text-xs font-medium text-neutral-300 mb-1.5"
              >
                Referência da proposta (slug)
              </label>
              <input
                id="proposal-ref-input"
                type="text"
                placeholder="ex: master-chapeacao-pinturas"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary font-mono placeholder:text-neutral-600"
              />
            </div>

            <Button type="submit" variant="secondary" className="w-full text-xs">
              <span>Acessar Referência</span>
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-mono">
          <Shield className="size-3.5 text-brand-accent/70" aria-hidden="true" />
          <span>Acesso individualizado · Documento confidencial</span>
        </div>
      </div>
    </div>
  );
}
