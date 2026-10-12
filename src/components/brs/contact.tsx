import { ArrowUpRight, Phone, Instagram, MapPin } from "lucide-react";
import { company } from "@/lib/brs";
import { Reveal } from "./reveal";
import { ContactForm } from "./contact-form";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function Contact({ partner }: { partner: boolean }) {
  return (
    <section id="contato" className="section-space">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-24">
        <Reveal staggerIndex={0}>
          <p className="eyebrow mb-5">Atendimento</p>
          <h2 className="section-title">
            O primeiro passo é um
            <br />
            diagnóstico transparente.
          </h2>
          <p className="body-copy mt-5 max-w-[380px]">
            Conte à equipe da BRS o que ocorreu com seu veículo e solicite orientações sobre o
            método ideal de reparo.
          </p>

          <a
            href={company.phoneHref}
            className="flex items-center gap-4 mt-9 group text-foreground hover:text-primary transition-colors"
          >
            <span className="border border-border p-3 rounded-sm group-hover:border-primary transition-colors">
              <Phone size={20} className="text-primary" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Central de atendimento
              </span>
              <span className="font-display text-3xl">{company.phone}</span>
            </span>
          </a>

          <a
            href={company.instagram}
            {...external}
            className="flex items-center gap-4 mt-6 group text-foreground hover:text-primary transition-colors"
          >
            <span className="border border-border p-3 rounded-sm group-hover:border-primary transition-colors">
              <Instagram size={20} className="text-primary" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Instagram oficial
              </span>
              <span className="text-sm font-medium">
                @brsreparacoes{" "}
                <ArrowUpRight size={13} className="inline ml-0.5" aria-hidden="true" />
              </span>
            </span>
          </a>

          <p className="text-[11px] text-muted-foreground mt-8 flex gap-2 items-center">
            <MapPin size={14} className="text-primary" aria-hidden="true" /> Toledo, Paraná
          </p>
        </Reveal>
        <div data-reveal="" style={{ "--i": 1 } as React.CSSProperties}>
          {/* Sem animação de scroll no formulário: renderização direta e estável sem distrações */}
          <ContactForm partner={partner} />
        </div>
      </div>
    </section>
  );
}
