import { ArrowUpRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";
import { reveal } from "@/lib/motion";
import hero from "@/assets/brs-hero.jpg";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function FinalCTA() {
  return (
    <section className="final-band border-t border-border">
      <img
        src={hero}
        alt="Acabamento automotivo (fotografia ilustrativa)"
        loading="lazy"
        width={1920}
        height={1088}
      />
      <div className="page-width relative z-10 text-center" {...reveal(0)}>
        <p className="eyebrow justify-center mb-5">Seu veículo · Nosso compromisso</p>
        <h2 className="section-title">
          Vamos definir a melhor
          <br />
          solução técnica para o seu veículo?
        </h2>
        <p className="body-copy mt-5">
          Converse com a equipe da BRS para tirar dúvidas e agendar sua avaliação em Toledo.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Button variant="automotive" asChild className="h-12 px-6 text-xs font-semibold">
            <a href="/contato">
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
          <Button variant="automotiveOutline" asChild className="h-12 px-6 text-xs font-medium">
            <a href={company.instagram} {...external}>
              <Instagram className="mr-1" size={14} aria-hidden="true" /> Conhecer o Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
