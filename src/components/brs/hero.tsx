import hero from "@/assets/brs-hero.jpg";
import { company } from "@/lib/brs";
import { AnimatedHero } from "./animated-hero";

export function Hero() {
  return (
    <AnimatedHero
      id="inicio"
      backgroundImageUrl={hero}
      eyebrow={
        <span className="eyebrow tracking-widest text-primary font-medium flex flex-wrap max-w-full">
          Oficina Técnica Especializada • Toledo, PR
        </span>
      }
      title="Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR."
      description={
        <p className="text-neutral-300">
          Reparação de lataria, pintura automotiva em cabine e desamassamento sem pintura.
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
        <div className="page-width flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 pt-3 border-t border-white/10 w-full">
          <span className="text-[11px] text-neutral-300">
            {company.address.street} · {company.address.neighborhood} · {company.openingHours}
          </span>
          <span className="image-note text-[11px] text-neutral-400">Fotografia ilustrativa</span>
        </div>
      }
    />
  );
}
