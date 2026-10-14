import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { company } from "@/lib/brs";
import carFinish from "@/assets/funilaria-depois.jpg";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function FinalCTA() {
  return (
    <section className="final-band border-t border-border">
      <img
        src={carFinish}
        alt="Acabamento e reflexo automotivo de alta precisão (fotografia ilustrativa)"
        loading="lazy"
        width={1920}
        height={1088}
      />
      <ScrollReveal direction="up" delay={0.05} className="page-width relative z-10 text-center">
        <p className="eyebrow justify-center mb-5">Seu veículo · Nosso compromisso</p>
        <h2 className="section-title">
          Vamos definir a melhor
          <br />
          solução técnica para o seu veículo?
        </h2>
        <p className="body-copy mt-5">
          Converse com a equipe técnica da BRS em Toledo-PR para tirar dúvidas e agendar sua
          avaliação sem compromisso.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Button variant="primary" asChild className="h-12 px-7 text-xs font-semibold">
            <Link to="/contato">
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="secondary" asChild className="h-12 px-6 text-xs font-medium">
            <a href={company.instagram} {...external}>
              <Instagram className="mr-1" size={14} aria-hidden="true" /> Conhecer o Instagram
            </a>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
