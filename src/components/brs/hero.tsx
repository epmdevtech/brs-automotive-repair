import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  MapPin,
  ShieldCheck,
  Wrench,
  Handshake,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { indexStyle } from "@/lib/motion";
import hero from "@/assets/brs-hero.jpg";

export function Hero() {
  return (
    <>
      <section id="inicio" className="hero">
        <img
          src={hero}
          alt="Veículo esportivo prateado em ambiente de reparação (fotografia ilustrativa)"
          className="hero-photo"
          width={1920}
          height={1088}
          decoding="async"
          fetchPriority="high"
        />
        <div className="page-width hero-content">
          <p className="eyebrow hero-in" style={indexStyle(0)}>
            Precisão no reparo · Cuidado no atendimento
          </p>
          <h1>
            <span className="hero-line">
              <span className="hero-line-inner" style={indexStyle(1)}>
                BRS Reparações
              </span>
            </span>{" "}
            <span className="hero-line">
              <span className="hero-line-inner text-primary" style={indexStyle(2)}>
                Automotivas.
              </span>
            </span>
          </h1>
          <p className="hero-subtitle hero-in" style={indexStyle(3)}>
            Seu veículo com recuperação estética e estrutural de fábrica.
          </p>
          <p className="hero-copy hero-in" style={indexStyle(4)}>
            Funilaria automotiva, pintura em estufa e martelinho de ouro em Toledo, Paraná. Atenção
            aos detalhes, diagnóstico honesto e acabamento técnico de alto padrão.
          </p>
          <div className="flex flex-wrap gap-3 mt-7 hero-in" style={indexStyle(5)}>
            <Button variant="automotive" asChild className="h-12 px-6 text-xs">
              <a href="#contato">
                Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
              </a>
            </Button>
            <Button variant="automotiveOutline" asChild className="h-12 px-6 text-xs">
              <a href="#servicos">
                Conhecer os serviços <ArrowRight className="ml-1" size={14} aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <div className="page-width hero-bottom hero-in" style={indexStyle(6)}>
          <span className="hero-location">
            <MapPin size={13} aria-hidden="true" /> Toledo, Paraná
          </span>
          <a
            href="#servicos"
            aria-label="Rolar para a seção de serviços"
            className="hidden sm:flex items-center gap-3 text-[9px] uppercase tracking-[2px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Conheça a BRS <ArrowDown size={14} aria-hidden="true" />
          </a>
          <span className="image-note">Fotografia ilustrativa</span>
        </div>
      </section>
      <div className="trust-strip">
        <div className="page-width grid grid-cols-2 md:grid-cols-4 gap-y-5">
          {[
            [ShieldCheck, "Cuidado em cada detalhe"],
            [Wrench, "Reparação especializada"],
            [Handshake, "Atendimento direto e transparente"],
            [Truck, "Serviço de leva e traz em Toledo"],
          ].map(([Icon, text], i) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div className="trust-item" key={i}>
                <ItemIcon strokeWidth={1.5} size={18} aria-hidden="true" />
                <span>{text as string}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
