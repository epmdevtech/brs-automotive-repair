import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin, Sparkles, Wrench, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";
import { MOTION_TOKENS } from "@/lib/motion-system";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

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
  ctaButton?: HeroAction;
  secondaryCta?: HeroAction;
  bottomContent?: React.ReactNode;
  className?: string;
  showTelemetryMetrics?: boolean;
}

/**
 * Rotas internas usam navegação client-side; âncoras (#) e URLs externas seguem como `<a>`.
 * Repassa as props injetadas por `Button asChild` (className, ref, handlers) ao elemento final.
 */
function HeroLink({
  action,
  children,
  ...props
}: { action: HeroAction; children: React.ReactNode } & React.ComponentPropsWithRef<"a">) {
  const { href, onClick } = action;
  const { scrollTo } = useSmoothScroll();

  if (href?.startsWith("/")) {
    // O destino vem de props genéricas; o roteador valida a rota em tempo de execução.
    return (
      <Link {...props} to={href as "/"} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();
    if (href?.startsWith("#")) {
      e.preventDefault();
      scrollTo(href);
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <a {...props} href={href} onClick={handleAnchorClick}>
      {children}
    </a>
  );
}

// Variantes de transição normativas do Framer Motion (SPEC-015, SPEC-032)
// A supressão de movimento é orquestrada nativamente pelo MotionConfig em __root.tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION_TOKENS.stagger,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: MOTION_TOKENS.duration.base,
      ease: MOTION_TOKENS.ease,
    },
  },
};

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
  showTelemetryMetrics = true,
}: AnimatedHeroProps) => {
  const heroRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);

  // Micro-parallax responsivo com GSAP quickTo para 60/120fps sem re-render (SPEC-032)
  React.useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof window === "undefined" || isReduced) return;
    const heroEl = heroRef.current;
    if (!heroEl) return;

    if (!window.matchMedia("(pointer: fine)").matches) return;

    let setContentX: (val: number) => void;
    let setContentY: (val: number) => void;
    let setGlowX: (val: number) => void;
    let setGlowY: (val: number) => void;

    try {
      setContentX = gsap.quickTo(contentRef.current, "x", { duration: 0.8, ease: "power3.out" });
      setContentY = gsap.quickTo(contentRef.current, "y", { duration: 0.8, ease: "power3.out" });
      if (glowRef.current) {
        setGlowX = gsap.quickTo(glowRef.current, "x", { duration: 0.6, ease: "power2.out" });
        setGlowY = gsap.quickTo(glowRef.current, "y", { duration: 0.6, ease: "power2.out" });
      }
    } catch {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      setContentX(relX * 0.012);
      setContentY(relY * 0.012);

      if (glowRef.current && setGlowX && setGlowY) {
        setGlowX(relX * 0.25);
        setGlowY(relY * 0.25);
      }
    };

    heroEl.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      heroEl.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id={id}
      className={cn(
        "relative flex min-h-screen w-full max-w-full flex-col justify-center overflow-x-clip overflow-y-hidden bg-background text-foreground pt-28 pb-24",
        className,
      )}
    >
      {/* Background com fotografia LCP prioritária e overlay de alto contraste */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{
          duration: MOTION_TOKENS.duration.slow,
          ease: MOTION_TOKENS.ease,
        }}
      >
        <img
          src={backgroundImageUrl}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/60" />
      </motion.div>

      {/* Halo de luz ambiente dourada interativo via GSAP */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/8 blur-[140px] will-change-transform"
      />

      {/* Conteúdo principal animado do Hero */}
      <motion.div
        ref={contentRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="page-width relative z-10 flex flex-col items-start justify-center text-left py-8 will-change-transform w-full max-w-full overflow-hidden"
      >
        {/* Overline / Badge Superior */}
        {eyebrow && (
          <motion.div variants={itemVariants} className="mb-4 max-w-full">
            {eyebrow}
          </motion.div>
        )}

        {/* Título Principal (H1) com forte contraste */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem] font-display leading-[1.12] max-w-4xl text-balance text-white break-words"
        >
          {title || "BRS Reparações Automotivas."}
        </motion.h1>

        {/* Subtítulo Confortável e Nítido */}
        <motion.div
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-400 text-pretty"
        >
          {description}
        </motion.div>

        {/* Chamadas para Ação (CTAs) */}
        {(ctaButton || secondaryCta) && (
          <motion.div
            variants={itemVariants}
            className={cn(
              "mt-8 flex flex-wrap items-center hero-cta-group",
              ctaButton && secondaryCta && "gap-4",
            )}
          >
            {/* Botão Primário (se fornecido) */}
            {ctaButton && (
              <MagneticButton>
                {ctaButton.href ? (
                  <Button variant="primary" asChild className="cursor-pointer min-h-[44px]">
                    <HeroLink action={ctaButton}>
                      {ctaButton.text}{" "}
                      <ArrowUpRight className="ml-1.5" size={16} aria-hidden="true" />
                    </HeroLink>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={ctaButton.onClick}
                    className="cursor-pointer min-h-[44px]"
                  >
                    {ctaButton.text}{" "}
                    <ArrowUpRight className="ml-1.5" size={16} aria-hidden="true" />
                  </Button>
                )}
              </MagneticButton>
            )}

            {/* Botão Secundário / Descoberta de Serviços */}
            {secondaryCta &&
              (secondaryCta.href ? (
                <Button
                  variant="secondary"
                  asChild
                  className="cursor-pointer min-h-[44px] px-6 text-xs group"
                >
                  <HeroLink action={secondaryCta}>
                    {secondaryCta.text}{" "}
                    <ArrowDown
                      size={14}
                      className="ml-2 transition-transform duration-300 group-hover:translate-y-1 text-primary"
                      aria-hidden="true"
                    />
                  </HeroLink>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={secondaryCta.onClick}
                  className="cursor-pointer min-h-[44px] px-6 text-xs group"
                >
                  {secondaryCta.text}{" "}
                  <ArrowDown
                    size={14}
                    className="ml-2 transition-transform duration-300 group-hover:translate-y-1 text-primary"
                    aria-hidden="true"
                  />
                </Button>
              ))}
          </motion.div>
        )}

        {/* Indicadores de Telemetria e Precisão Técnica da Oficina (SPEC-032) */}
        {showTelemetryMetrics && (
          <motion.div
            variants={itemVariants}
            className="mt-10 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl"
          >
            {[
              {
                icon: Sparkles,
                label: "Colorimetria Espectrofotométrica",
                detail: "Ajuste digital e verniz de alto sólidos",
              },
              {
                icon: Wrench,
                label: "Alinhamento Estrutural",
                detail: "Gaps milimétricos com padrão de fábrica",
              },
              {
                icon: ShieldCheck,
                label: "Diagnóstico Transparente",
                detail: "Reparo técnico preservando a geometria original",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="flex flex-col p-3 rounded-sm bg-white/[0.02] border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                  <metric.icon size={14} aria-hidden="true" />
                  <span className="font-display tracking-tight text-[12px]">{metric.label}</span>
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 leading-snug font-body">
                  {metric.detail}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Rodapé do Hero / Microdados e Navegação de Scroll */}
      <div className="absolute bottom-6 left-0 right-0 z-10 w-full overflow-hidden">
        {bottomContent || (
          <div className="page-width flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-white/10 w-full">
            <span className="flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-primary" aria-hidden="true" /> Toledo, Paraná
            </span>
            <a
              href="#servicos"
              aria-label="Rolar para a seção de serviços"
              className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-neutral-300 hover:text-white transition-colors font-medium group"
            >
              Conheça a BRS{" "}
              <ArrowDown
                size={14}
                aria-hidden="true"
                className="group-hover:translate-y-0.5 transition-transform"
              />
            </a>
            <span className="image-note text-[11px] text-neutral-400">Fotografia ilustrativa</span>
          </div>
        )}
      </div>
    </section>
  );
};
