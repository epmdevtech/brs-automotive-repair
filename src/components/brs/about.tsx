import { ArrowUpRight, Phone, MapPin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";
import { reveal } from "@/lib/motion";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function About() {
  return (
    <section id="sobre" className="section-space">
      <div className="page-width grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-24 items-center">
        <div {...reveal(0)}>
          <p className="eyebrow mb-5">BRS · Toledo / PR</p>
          <h2 className="section-title">
            Oficina técnica especializada.
            <br />
            <span className="text-muted-foreground">Respeito pela sua confiança.</span>
          </h2>
          <p className="body-copy mt-6">
            A BRS Reparações Automotivas atua em Toledo, Paraná, com foco exclusivo em funilaria,
            pintura automotiva e martelinho de ouro. Nossa proposta combina domínio técnico,
            equipamentos adequados e atendimento responsável.
          </p>
          <p className="body-copy mt-4">
            Seja você proprietário particular em busca de um acabamento original ou um corretor de
            seguros estruturando atendimentos para seus segurados, estamos à disposição para uma
            conversa profissional.
          </p>
          <Button variant="editorial" asChild className="mt-5 text-xs">
            <a href={company.instagram} {...external}>
              Acompanhar a BRS no Instagram{" "}
              <ArrowUpRight className="ml-1" size={13} aria-hidden="true" />
            </a>
          </Button>
        </div>
        <div className="border-l border-primary pl-8 md:pl-12 py-6" {...reveal(1)}>
          <p className="font-display text-[80px] italic font-bold leading-none tracking-tight">
            BRS<span className="text-primary">.</span>
          </p>
          <p className="text-[11px] mt-4 text-muted-foreground uppercase tracking-[2px]">
            Reparações automotivas
          </p>
          <div className="mt-9 grid gap-4">
            <a
              href={company.phoneHref}
              className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
            >
              <Phone size={16} className="text-primary" aria-hidden="true" />
              {company.phone}
            </a>
            <span className="flex items-center gap-3 text-sm text-foreground">
              <MapPin size={16} className="text-primary" aria-hidden="true" />
              {company.city}
            </span>
            <a
              href={company.instagram}
              {...external}
              className="flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary"
            >
              <Instagram size={16} className="text-primary" aria-hidden="true" />
              @brsreparacoes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
