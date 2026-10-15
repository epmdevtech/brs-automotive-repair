import * as React from "react";
import { ArrowUpRight, Phone, Instagram, MapPin, Calendar } from "lucide-react";
import { company } from "@/lib/brs";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ContactForm } from "./contact-form";
import { BookingDialog } from "@/features/booking/ui/booking-dialog";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function Contact({
  partner,
  headingAs: Heading = "h2",
}: {
  partner: boolean;
  /** Em `/contato` o título da seção é o `h1` da página. */
  headingAs?: "h1" | "h2";
}) {
  const [bookingOpen, setBookingOpen] = React.useState(false);

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

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="w-full p-4 rounded-lg border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent hover:border-primary text-left transition-all group flex items-center justify-between shadow-sm cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-primary uppercase tracking-wider mb-1">
                  <Calendar size={13} />
                  <span>Agendamento Online</span>
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                  Agendar Vistoria ou Leva e Traz (Pré-OS)
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Informe as avarias do veículo e reserve um horário exclusivo em Toledo-PR.
                </p>
              </div>
              <ArrowUpRight
                size={18}
                className="text-primary shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-border/60 space-y-6">
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

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </section>
  );
}
