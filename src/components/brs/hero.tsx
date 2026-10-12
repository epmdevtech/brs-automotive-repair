import { ArrowDown, MapPin, ShieldCheck, Wrench, Handshake, Truck } from "lucide-react";
import hero from "@/assets/brs-hero.jpg";
import { AnimatedHero } from "./animated-hero";

export function Hero() {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
    });
  };

  return (
    <>
      <AnimatedHero
        id="inicio"
        backgroundImageUrl={hero}
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 backdrop-blur-xs">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Precisão no reparo • Cuidado no atendimento
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
        ctaButton={{
          text: "Solicitar avaliação",
          href: "#contato",
          onClick: () => handleScrollTo("contato"),
        }}
        secondaryCta={{
          text: "Conhecer os serviços",
          href: "#servicos",
          onClick: () => handleScrollTo("servicos"),
        }}
        bottomContent={
          <div className="page-width flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/10">
            <span className="flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-primary" aria-hidden="true" /> Toledo, Paraná
            </span>
            <a
              href="#servicos"
              onClick={() => handleScrollTo("servicos")}
              aria-label="Rolar para a seção de serviços"
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-neutral-300 hover:text-white transition-colors font-medium"
            >
              Conheça a BRS <ArrowDown size={14} aria-hidden="true" />
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
