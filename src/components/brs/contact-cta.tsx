import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

export interface ContactCTAProps {
  title: string;
  description: string;
  label: string;
  /** Pré-seleciona o público no formulário de `/contato` (ex.: "corretor"). */
  audience?: string;
  className?: string;
}

/**
 * CTA final de páginas internas: mensagem contextual configurável e destino único (`/contato`).
 * Entrada vertical suave com ScrollReveal direction="up".
 */
export function ContactCTA({ title, description, label, audience, className }: ContactCTAProps) {
  return (
    <section className={cn("page-width mt-16 pt-12 border-t border-border text-center", className)}>
      <ScrollReveal direction="up" className="max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold font-display text-white mb-4">{title}</h2>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6">{description}</p>
        <Button variant="primary" asChild className="h-11 px-8 text-xs font-semibold">
          <Link to="/contato" {...(audience ? { search: { audience } } : {})}>
            {label} <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
          </Link>
        </Button>
      </ScrollReveal>
    </section>
  );
}
