import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { company } from "@/lib/brs";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-secondary/20 border-t border-border">
      <ScrollReveal direction="up" delay={0.05} className="page-width text-center max-w-3xl">
        <p className="eyebrow justify-center mb-4">Avaliação presencial</p>
        <h2 className="section-title">Precisa avaliar um reparo no seu veículo?</h2>
        <p className="body-copy mt-4 max-w-xl mx-auto">
          Envie as informações do veículo para agendar uma avaliação técnica na oficina em Toledo-PR
          ou fale diretamente pelo telefone oficial.
        </p>

        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            asChild
            className="h-12 px-8 text-xs font-semibold min-h-[44px]"
          >
            <Link to="/contato">
              Solicitar avaliação <ArrowUpRight className="ml-1.5" size={14} aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {/* Canais confirmados: telefone, endereço e horário */}
        <div className="mt-10 pt-8 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground text-left sm:text-center">
          <a
            href={company.phoneHref}
            className="flex sm:flex-col items-center justify-start sm:justify-center gap-2 hover:text-brand-accent transition-colors py-1"
          >
            <Phone size={15} className="text-brand-accent shrink-0" aria-hidden="true" />
            <span className="font-medium text-foreground">{company.phone}</span>
          </a>

          <div className="flex sm:flex-col items-center justify-start sm:justify-center gap-2 py-1">
            <MapPin size={15} className="text-brand-accent shrink-0" aria-hidden="true" />
            <span>{company.address.full}</span>
          </div>

          <div className="flex sm:flex-col items-center justify-start sm:justify-center gap-2 py-1">
            <Clock size={15} className="text-brand-accent shrink-0" aria-hidden="true" />
            <span>{company.openingHours}</span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
