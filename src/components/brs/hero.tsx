import { company } from "@/lib/brs";
import { type HeroConfig, defaultHeroConfig } from "@/lib/hero-config";
import { AnimatedHero } from "./animated-hero";

export interface HeroProps {
  config?: HeroConfig;
  debugMode?: boolean;
}

export function Hero({ config = defaultHeroConfig, debugMode = false }: HeroProps = {}) {
  return (
    <AnimatedHero
      id="inicio"
      config={config}
      debugMode={debugMode}
      eyebrow={
        <span className="eyebrow tracking-widest text-primary font-medium flex flex-wrap max-w-full">
          Oficina Técnica Especializada • Toledo, PR
        </span>
      }
      title="Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR."
      description={
        <p className="text-neutral-300">
          Reparação de lataria, pintura automotiva em estufa e desamassamento sem pintura.
          Atendimento para proprietários e segurados com diagnóstico claro e orçamento alinhado
          antes do serviço.
        </p>
      }
      ctaButton={{
        text: "Solicitar avaliação",
        href: "/contato",
      }}
      showTelemetryMetrics={false}
      bottomContent={
        <div className="page-width flex flex-wrap items-center justify-between gap-3 text-xs pt-4 border-t border-white/15 w-full">
          <span className="text-xs sm:text-[13px] text-neutral-200 font-medium tracking-wide">
            {company.address.street} · {company.address.neighborhood} · {company.openingHours}
          </span>
          {config.isIllustrative && (
            <span className="image-note text-xs text-neutral-200 font-medium px-2 py-0.5 rounded bg-black/50 border border-white/15">
              Fotografia ilustrativa
            </span>
          )}
        </div>
      }
    />
  );
}
