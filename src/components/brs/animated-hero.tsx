import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroAction {
  text: string;
  onClick?: () => void;
  href?: string;
}

export interface AnimatedHeroProps {
  id?: string;
  backgroundImageUrl: string;
  logo?: React.ReactNode;
  navLinks?: NavLink[];
  topRightAction?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description: React.ReactNode;
  ctaButton: HeroAction;
  secondaryCta?: HeroAction;
  bottomContent?: React.ReactNode;
  className?: string;
}

// Variantes de transição do Framer Motion
const getContainerVariants = (reduced: boolean) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: reduced ? 0 : 0.12,
      delayChildren: reduced ? 0 : 0.15,
    },
  },
});

const getItemVariants = (reduced: boolean) => ({
  hidden: { y: reduced ? 0 : 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: reduced ? 0.01 : 0.6,
      ease: "easeOut",
    },
  },
});

export const AnimatedHero = ({
  id = "inicio",
  backgroundImageUrl,
  eyebrow,
  title,
  description,
  ctaButton,
  secondaryCta,
  bottomContent,
  className,
}: AnimatedHeroProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const containerVariants = getContainerVariants(shouldReduceMotion);
  const itemVariants = getItemVariants(shouldReduceMotion);

  return (
    <section
      id={id}
      className={cn(
        "relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-background text-foreground pt-28 pb-24",
        className,
      )}
    >
      {/* Background com fotografia e overlay de alto contraste para conformidade WCAG AA+ */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/60" />
      </div>

      {/* Conteúdo principal animado do Hero */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="page-width relative z-10 flex flex-col items-start justify-center text-left py-8"
      >
        {/* Overline / Badge Superior */}
        <motion.div variants={itemVariants} className="mb-4">
          {eyebrow || (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 backdrop-blur-xs">
              <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-widest text-amber-400/90">
                Precisão no reparo • Cuidado no atendimento
              </span>
            </div>
          )}
        </motion.div>

        {/* Título Principal (H1) com forte contraste */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem] font-display leading-[1.12] max-w-4xl text-balance"
        >
          {title || (
            <>
              <span className="text-white font-semibold">BRS Reparações</span>{" "}
              <span className="text-amber-500 font-semibold">Automotivas.</span>
            </>
          )}
        </motion.h1>

        {/* Subtítulo Confortável e Nítido */}
        <motion.div
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-300 text-pretty"
        >
          {description}
        </motion.div>

        {/* Chamadas para Ação (CTAs) */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
          {/* Botão Primário */}
          {ctaButton.href ? (
            <Button
              asChild
              size="lg"
              className="h-12 px-7 text-xs font-semibold tracking-wide rounded-sm bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <a href={ctaButton.href} onClick={ctaButton.onClick}>
                {ctaButton.text}
              </a>
            </Button>
          ) : (
            <Button
              onClick={ctaButton.onClick}
              size="lg"
              className="h-12 px-7 text-xs font-semibold tracking-wide rounded-sm bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              {ctaButton.text}
            </Button>
          )}

          {/* Botão Secundário */}
          {secondaryCta &&
            (secondaryCta.href ? (
              <Button
                asChild
                size="lg"
                className="h-12 px-7 text-xs font-medium tracking-wide rounded-sm border border-neutral-700 bg-neutral-900/70 hover:bg-neutral-800 text-neutral-200 active:scale-[0.98] transition-all backdrop-blur-xs cursor-pointer"
              >
                <a href={secondaryCta.href} onClick={secondaryCta.onClick}>
                  {secondaryCta.text}
                </a>
              </Button>
            ) : (
              <Button
                onClick={secondaryCta.onClick}
                size="lg"
                className="h-12 px-7 text-xs font-medium tracking-wide rounded-sm border border-neutral-700 bg-neutral-900/70 hover:bg-neutral-800 text-neutral-200 active:scale-[0.98] transition-all backdrop-blur-xs cursor-pointer"
              >
                {secondaryCta.text}
              </Button>
            ))}
        </motion.div>
      </motion.div>

      {/* Rodapé do Hero / Microdados e Navegação de Scroll */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        {bottomContent || (
          <div className="page-width flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/10">
            <span className="flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-amber-500" aria-hidden="true" /> Toledo, Paraná
            </span>
            <a
              href="#servicos"
              aria-label="Rolar para a seção de serviços"
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-neutral-300 hover:text-white transition-colors font-medium"
            >
              Conheça a BRS <ArrowDown size={14} aria-hidden="true" />
            </a>
            <span className="image-note text-[11px] text-neutral-400">Fotografia ilustrativa</span>
          </div>
        )}
      </div>
    </section>
  );
};
