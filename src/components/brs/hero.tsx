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
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm border border-white/10 bg-black/45 backdrop-blur-md">
            <span className="size-2 rounded-full bg-primary led-status-pulse" aria-hidden="true" />
            <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-neutral-300 font-medium">
              Oficina Técnica Especializada • Toledo, PR
            </span>
          </div>
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
        secondaryCta={{
          text: "Conhecer os serviços",
          href: "/servicos",
        }}
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
