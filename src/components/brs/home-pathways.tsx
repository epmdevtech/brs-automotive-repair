import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/**
 * Faixa horizontal discreta para corretores de seguros na Home (SPEC-064).
 * Encaminha corretores e parceiros para `/para-corretores` sem poluir o fluxo principal B2C.
 */
export function HomePathways() {
  return (
    <section
      id="corretores-parceiros"
      className="py-12 md:py-16 bg-background border-b border-border"
    >
      <div className="page-width">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 px-6 md:px-8 rounded-xs border border-border/80 bg-secondary/10">
          <ScrollReveal
            data-reveal=""
            style={{ "--i": 0 } as React.CSSProperties}
            direction="up"
            className="max-w-2xl"
          >
            <p className="eyebrow mb-2">Para corretores de seguros</p>
            <h2 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground">
              É corretor de seguros?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Veja como atendemos segurados por livre escolha e apoiamos vistorias de sinistro em
              Toledo-PR.
            </p>
          </ScrollReveal>

          <ScrollReveal
            data-reveal=""
            style={{ "--i": 1 } as React.CSSProperties}
            direction="up"
            delay={0.08}
            className="shrink-0"
          >
            <Link
              to="/para-corretores"
              className="group/link inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-foreground transition-colors border border-primary/40 hover:border-primary px-5 py-3 rounded-xs min-h-[44px]"
            >
              <span>Atendimento para corretores</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 text-primary"
                aria-hidden="true"
              />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
