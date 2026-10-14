import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NumericCounter } from "@/components/ui/numeric-counter";

function TimelineStep({
  title,
  copy,
  index,
  total,
  scrollYProgress,
  shouldReduceMotion,
}: {
  title: string;
  copy: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  const threshold = index / total;
  const isPast = useTransform(scrollYProgress, (v) => shouldReduceMotion || v >= threshold);
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.15), threshold],
    [0.45, 1],
    { clamp: true },
  );

  const [active, setActive] = React.useState(shouldReduceMotion);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setActive(true);
      return;
    }
    const unsubscribe = isPast.on("change", (latest) => {
      setActive(latest);
    });
    return () => unsubscribe();
  }, [isPast, shouldReduceMotion]);

  return (
    <motion.div
      className="relative pl-10 sm:pl-14 py-2"
      style={{
        opacity: shouldReduceMotion ? 1 : opacity,
        willChange: "opacity",
      }}
    >
      {/* Marcador luminoso no eixo da linha com contador animado */}
      <div
        className={`absolute left-0 top-3 size-7 sm:size-8 -translate-x-1/2 rounded-sm border flex items-center justify-center transition-all duration-300 ${
          active
            ? "border-primary bg-primary/20 text-primary shadow-[0_0_12px_rgba(218,165,32,0.35)]"
            : "border-border/80 bg-card text-muted-foreground"
        }`}
      >
        <NumericCounter
          target={index + 1}
          padZero
          className="text-[11px] font-semibold font-mono"
        />
      </div>

      <div className="grid md:grid-cols-[1.2fr_2fr] gap-2 md:gap-8 items-baseline">
        <div>
          <span className="text-primary text-[11px] font-semibold tracking-wider uppercase">
            Etapa 0{index + 1}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold font-display tracking-tight text-foreground mt-1 mb-2 text-balance">
            {title}
          </h3>
        </div>
        <p className="body-copy text-xs text-pretty">{copy}</p>
      </div>
    </motion.div>
  );
}

export function ProcessTimeline() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 60%"],
  });

  const steps = [
    [
      "Primeiro contato",
      "Informe os dados do veículo e descreva o ocorrido para receber as orientações iniciais.",
    ],
    [
      "Avaliação técnica",
      "Inspeção minuciosa dos danos na lataria e pintura para diagnóstico da melhor abordagem.",
    ],
    [
      "Orçamento e alinhamento",
      "Definição clara do escopo do serviço, materiais aplicados e previsão de prazo para execução.",
    ],
    [
      "Reparação e conferência",
      "Execução do serviço com controle rigoroso de qualidade e alinhamento para a entrega do veículo.",
    ],
  ];

  return (
    <section id="processo" className="pt-4 pb-16 bg-secondary/20 border-b border-border">
      <div className="page-width">
        <ScrollReveal direction="up" delay={0.05} className="mb-10">
          <p className="eyebrow mb-3">Etapas do atendimento</p>
          <h2 className="section-title">
            Fluxo estruturado e
            <br />
            <span className="text-muted-foreground">decisão com total segurança.</span>
          </h2>
        </ScrollReveal>

        <div ref={containerRef} className="relative my-8">
          {/* Linha guia estática de fundo */}
          <div className="absolute left-0 top-3 bottom-6 w-0.5 -translate-x-1/2 bg-border/60 pointer-events-none" />

          {/* Linha vertical dinâmica de progresso com scaleY orientada por rolagem nativa */}
          <motion.div
            className="absolute left-0 top-3 bottom-6 w-0.5 -translate-x-1/2 bg-primary origin-top pointer-events-none"
            style={{
              scaleY: shouldReduceMotion ? 1 : scrollYProgress,
              willChange: "transform",
            }}
          />

          <div className="space-y-8 sm:space-y-10">
            {steps.map(([title, copy], i) => (
              <TimelineStep
                key={title}
                title={title}
                copy={copy}
                index={i}
                total={steps.length}
                scrollYProgress={scrollYProgress}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground mt-8">
          Etapas padrão do processo de reparo. Condições específicas e prazos são definidos após a
          avaliação técnica de cada veículo.
        </p>
      </div>
    </section>
  );
}
