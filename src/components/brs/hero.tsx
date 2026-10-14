import hero from "@/assets/brs-hero.jpg";
import { AnimatedHero } from "./animated-hero";

export function Hero() {
  return (
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
        text: "Ver especialidades",
        href: "#especialidades",
      }}
      showTelemetryMetrics={false}
      bottomContent={
        <div className="page-width flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/10">
          <span className="text-[11px] text-neutral-500 font-mono tracking-wider">
            OFICINA TÉCNICA
          </span>
          <span className="image-note text-[11px] text-neutral-400">Fotografia ilustrativa</span>
        </div>
      }
    />
  );
}
