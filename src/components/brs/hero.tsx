import { ArrowDown, MapPin, ShieldCheck, Wrench, Handshake, Truck } from "lucide-react";
import hero from "@/assets/brs-hero.jpg";
import { AnimatedHero } from "./animated-hero";

export function Hero() {
  return (
    <>
      <AnimatedHero
        id="inicio"
        backgroundImageUrl={hero}
        eyebrow={
          <span className="eyebrow tracking-widest text-primary font-medium block">
            Oficina Técnica Especializada • Toledo, PR
          </span>
        }
        title={
          <>
            <span className="text-white font-semibold">BRS Reparações</span>{" "}
            <span className="text-primary font-semibold">Automotivas.</span>
          </>
        }
        description={
          <p className="text-neutral-400">
            Funilaria automotiva, pintura em estufa e martelinho de ouro em Toledo, Paraná. Atenção
            aos detalhes, diagnóstico honesto e acabamento técnico com recuperação de padrão de
            fábrica.
          </p>
        }
        ctaButton={{
          text: "Solicitar avaliação",
          href: "/contato",
        }}
        secondaryCta={{
          text: "Conhecer os serviços",
          href: "/servicos",
        }}
        showTelemetryMetrics={false}
        bottomContent={
          <div className="page-width flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/10">
            <span className="flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-primary" aria-hidden="true" /> Toledo, Paraná
            </span>
            <a
              href="#servicos"
              aria-label="Rolar para a seção de serviços"
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-neutral-300 hover:text-white transition-colors font-medium group"
            >
              Ver especialidades{" "}
              <ArrowDown
                size={14}
                aria-hidden="true"
                className="group-hover:translate-y-0.5 transition-transform"
              />
            </a>
            <span className="image-note text-[11px] text-neutral-400">Fotografia ilustrativa</span>
          </div>
        }
      />

      <div className="trust-strip">
        <div className="page-width grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-8">
          {[
            [Wrench, "Reparação e pintura técnica de precisão"],
            [Handshake, "Diagnóstico honesto e transparente"],
            [Truck, "Serviço de leva e traz em Toledo-PR"],
          ].map(([Icon, text], i) => {
            const ItemIcon = Icon as typeof Wrench;
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
