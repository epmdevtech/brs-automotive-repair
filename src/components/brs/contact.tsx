import * as React from "react";
import { ArrowUpRight, Phone, Instagram, MapPin } from "lucide-react";
import { company } from "@/lib/brs";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ContactForm } from "./contact-form";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function Contact({
  partner,
  headingAs: Heading = "h2",
}: {
  partner: boolean;
  /** Em `/contato` o título da seção é o `h1` da página. */
  headingAs?: "h1" | "h2";
}) {
  return (
    <section id="contato" className="section-space">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-24">
        <ScrollReveal
          data-reveal=""
          style={{ "--i": 0 } as React.CSSProperties}
          direction="up"
          delay={0.05}
        >
          <p className="eyebrow mb-5">Atendimento</p>
          <Heading className="section-title">
            O primeiro passo é um
            <br />
            diagnóstico transparente.
          </Heading>
          <p className="body-copy mt-5 max-w-[380px]">
            Conte à equipe da BRS o que ocorreu com seu veículo e solicite orientações sobre o
            método ideal de reparo.
          </p>

          <div className="mt-10 pt-8 border-t border-border/60 space-y-6">
            <a
              href={company.phoneHref}
              className="group block text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                <Phone size={14} className="text-primary" aria-hidden="true" />
                <span>Central de Atendimento</span>
              </div>
              <span className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white group-hover:text-primary transition-colors">
                {company.phone}
              </span>
            </a>

            <a
              href={company.instagram}
              {...external}
              className="group block text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                <Instagram size={14} className="text-primary" aria-hidden="true" />
                <span>Instagram Oficial</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-white group-hover:text-primary transition-colors inline-flex items-center gap-1">
                @brsreparacoes
                <ArrowUpRight
                  size={14}
                  className="text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>

            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
              <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
              <span>Toledo, Paraná · Atendimento presencial e serviço Leva e Traz</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal
          data-reveal=""
          style={{ "--i": 1 } as React.CSSProperties}
          direction="up"
          delay={0.15}
        >
          <ContactForm partner={partner} />
        </ScrollReveal>
      </div>
    </section>
  );
}
