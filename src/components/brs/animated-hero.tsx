import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, MapPin, Sparkles, Wrench, ShieldCheck } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { getHasPlayedHeroIntro, setHasPlayedHeroIntro } from "@/lib/hero-cinematic-state";
import {
  type HeroConfig,
  defaultHeroConfig,
  resolveHeroProfile,
  getHeroStyleVariables,
} from "@/lib/hero-config";

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
  config?: HeroConfig;
  /** @deprecated Use `config.image` para controle completo de picture/art-direction */
  backgroundImageUrl?: string;
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
  debugMode?: boolean;
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

export const AnimatedHero = ({
  id = "inicio",
  config: configProp,
  backgroundImageUrl,
  eyebrow,
  title,
  description,
  ctaButton,
  secondaryCta,
  bottomContent,
  className,
  showTelemetryMetrics = true,
  debugMode = false,
}: AnimatedHeroProps) => {
  const heroRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);

  // Resolução da configuração da foto do Hero (SPEC-068)
  const resolvedConfig: HeroConfig = React.useMemo(() => {
    if (configProp) return configProp;
    if (backgroundImageUrl) {
      return {
        ...defaultHeroConfig,
        image: {
          ...defaultHeroConfig.image,
          desktop: { ...defaultHeroConfig.image.desktop, src: backgroundImageUrl },
          mobile: { ...defaultHeroConfig.image.mobile, src: backgroundImageUrl },
        },
      };
    }
    return defaultHeroConfig;
  }, [configProp, backgroundImageUrl]);

  const resolvedProfile = React.useMemo(() => resolveHeroProfile(resolvedConfig), [resolvedConfig]);

  const heroStyleVariables = React.useMemo(
    () => getHeroStyleVariables(resolvedConfig),
    [resolvedConfig],
  );

  // Estado determinístico de conclusão da introdução cinematográfica (SPEC-067)
  const [introComplete, setIntroComplete] = React.useState(() => getHasPlayedHeroIntro());

  // Ciclo de vida da abertura, antecipação por interação e page visibility
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || getHasPlayedHeroIntro()) {
      setIntroComplete(true);
      setHasPlayedHeroIntro(true);
      return;
    }

    const completeIntro = () => {
      setIntroComplete(true);
      setHasPlayedHeroIntro(true);
      window.dispatchEvent(new CustomEvent("brs:hero-intro-skip"));
    };

    // Antecipação imediata por qualquer interação real do usuário com o conteúdo
    const handleEarlyInteraction = () => {
      completeIntro();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora teclas modificadoras e atalhos de reload do navegador (F5, Ctrl+R, etc.)
      if (
        e.key === "Control" ||
        e.key === "Shift" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "F5" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "r" || e.key === "R"))
      ) {
        return;
      }
      completeIntro();
    };

    // Monitoramento de visibilidade da página: pausar/concluir se em background
    const handleVisibilityChange = () => {
      if (document.hidden) {
        completeIntro();
      }
    };

    window.addEventListener("wheel", handleEarlyInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", handleEarlyInteraction, { passive: true, once: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleEarlyInteraction, { once: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Conclusão natural após a sequência completa de UI e reflexo de luz
    const isMobile = window.innerWidth <= 768;
    const introTotalMs = isMobile ? 4800 : 7000;
    const timer = setTimeout(() => {
      completeIntro();
    }, introTotalMs);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", handleEarlyInteraction);
      window.removeEventListener("touchstart", handleEarlyInteraction);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleEarlyInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Micro-parallax responsivo com GSAP quickTo no conteúdo de texto
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;
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
      style={heroStyleVariables}
      className={cn(
        "relative flex min-h-screen w-full max-w-full flex-col justify-center overflow-x-clip overflow-y-hidden bg-background text-foreground pt-28 pb-24",
        introComplete && "hero-intro-complete",
        className,
      )}
    >
      {/* CAMADA 1: Fotografia LCP com Picture, Art Direction e Zoom Lento (SPEC-068) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <picture>
          {resolvedConfig.image.mobile.avifSrc && (
            <source
              media="(max-width: 768px)"
              type="image/avif"
              srcSet={resolvedConfig.image.mobile.avifSrc}
            />
          )}
          {resolvedConfig.image.mobile.webpSrc && (
            <source
              media="(max-width: 768px)"
              type="image/webp"
              srcSet={resolvedConfig.image.mobile.webpSrc}
            />
          )}
          <source
            media="(max-width: 768px)"
            srcSet={resolvedConfig.image.mobile.src}
            width={resolvedConfig.image.mobile.width}
            height={resolvedConfig.image.mobile.height}
          />
          {resolvedConfig.image.desktop.avifSrc && (
            <source type="image/avif" srcSet={resolvedConfig.image.desktop.avifSrc} />
          )}
          {resolvedConfig.image.desktop.webpSrc && (
            <source type="image/webp" srcSet={resolvedConfig.image.desktop.webpSrc} />
          )}
          <img
            src={resolvedConfig.image.desktop.src}
            alt={resolvedConfig.image.alt}
            aria-hidden={resolvedConfig.image.decorative ? "true" : undefined}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={resolvedConfig.image.desktop.width}
            height={resolvedConfig.image.desktop.height}
            className="hero-photo-cinematic absolute inset-0 h-full w-full object-cover pointer-events-none"
          />
        </picture>
      </div>

      {/* CAMADA 2: Reflexo de Luz Único na Lataria (sob o overlay e sob a UI, se ativo no perfil) */}
      {!introComplete && resolvedProfile.flare.enabled && (
        <div aria-hidden="true" className="hero-light-flare pointer-events-none" />
      )}

      {/* CAMADA 3: Gradientes de Legibilidade desacoplados por perfil de overlay */}
      <div
        aria-hidden="true"
        className="hero-overlay-cinematic pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40"
      />

      {/* Modo de Depuração e Calibração Visual (apenas em DEV, zero impacto em produção) */}
      {import.meta.env.DEV && debugMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 border-2 border-dashed border-emerald-400/40"
        >
          {resolvedProfile.flare.enabled && (
            <div
              className="absolute border border-amber-400/70 bg-amber-400/10 text-[10px] text-amber-200 px-1 font-mono rounded"
              style={{
                top: `${resolvedProfile.flare.top}%`,
                left: `${resolvedProfile.flare.left}%`,
                width: `${resolvedProfile.flare.width}%`,
                height: `${resolvedProfile.flare.height}%`,
              }}
            >
              Flare Zone ({resolvedProfile.flare.angle}°)
            </div>
          )}
          <div className="absolute top-24 right-4 bg-black/80 text-emerald-400 text-xs px-2 py-1 rounded font-mono border border-emerald-500/30">
            PROFILE: {resolvedConfig.profile} | FLARE:{" "}
            {resolvedProfile.flare.enabled ? "ACTIVE" : "OFF"}
          </div>
        </div>
      )}

      {/* Halo de luz ambiente dourada interativo via GSAP */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-primary/8 blur-[140px] will-change-transform"
      />

      {/* CAMADA 4: Conteúdo principal de UI com entrada faseada suave */}
      <div
        ref={contentRef}
        className="page-width relative z-10 flex flex-col items-start justify-center text-left py-8 will-change-transform w-full max-w-full overflow-hidden"
      >
        {/* Overline / Eyebrow (entra aos 1.5s) */}
        {eyebrow && <div className="mb-4 max-w-full hero-intro-eyebrow">{eyebrow}</div>}

        {/* Título Principal H1 (entra aos 1.8s) com text-wrap: balance */}
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem] font-display leading-[1.12] max-w-4xl text-balance text-white break-words hero-intro-title hero-intro-h1">
          {title || "BRS Reparações Automotivas."}
        </h1>

        {/* Subtítulo Confortável e Nítido (entra aos 2.4s) */}
        <div className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-400 text-pretty hero-intro-desc hero-intro-lead">
          {description}
        </div>

        {/* Chamadas para Ação (CTAs) (entram aos 2.9s) */}
        {(ctaButton || secondaryCta) && (
          <div
            className={cn(
              "mt-8 flex flex-wrap items-center hero-cta-group hero-intro-cta",
              ctaButton && secondaryCta && "gap-4",
            )}
          >
            {/* Botão Primário */}
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

            {/* Botão Secundário */}
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
          </div>
        )}

        {/* Indicadores de Telemetria e Precisão Técnica da Oficina */}
        {showTelemetryMetrics && (
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl hero-intro-cta">
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
          </div>
        )}
      </div>

      {/* Rodapé do Hero / Microdados e Navegação (entra aos 3.4s) */}
      <div className="absolute bottom-6 left-0 right-0 z-10 w-full overflow-hidden hero-intro-bottom hero-intro-foot">
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
            {resolvedConfig.isIllustrative && (
              <span className="image-note text-[11px] text-neutral-400">
                Fotografia ilustrativa
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
