import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "./breadcrumbs";
import { isReducedMotionPreferred } from "@/lib/motion-system";
import { cn } from "@/lib/utils";

export interface TelemetryBadge {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  label: string;
  detail?: string;
}

export interface PageHeroAction {
  label: string;
  to?: string;
  search?: Record<string, unknown>;
  href?: string;
  variant?: "primary" | "secondary";
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  target?: string;
  rel?: string;
}

export interface PageHeroProps {
  breadcrumbs?: Array<{ name: string; path?: string }>;
  codeIndex?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description: React.ReactNode;
  telemetryBadges?: TelemetryBadge[];
  actions?: PageHeroAction[];
  asideContent?: React.ReactNode;
  className?: string;
  footerContent?: React.ReactNode;
}

/**
 * PageHero — Hero cinemático reutilizável para páginas internas (SPEC-034).
 * Padrão Awwwards Site of the Day: tipografia de alta precisão (Sora + Manrope),
 * telemetria técnica, iluminação ambiente especular e coreografia de entrada GSAP.
 */
export function PageHero({
  breadcrumbs,
  codeIndex,
  eyebrow,
  title,
  description,
  telemetryBadges,
  actions,
  asideContent,
  className,
  footerContent,
}: PageHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const descRef = React.useRef<HTMLDivElement>(null);
  const badgesRef = React.useRef<HTMLDivElement>(null);
  const actionsRef = React.useRef<HTMLDivElement>(null);
  const asideRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || isReducedMotionPreferred()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (titleRef.current) {
        tl.from(titleRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.7,
        });
      }

      if (descRef.current) {
        tl.from(
          descRef.current,
          {
            y: 18,
            opacity: 0,
            duration: 0.65,
          },
          "-=0.45",
        );
      }

      if (badgesRef.current) {
        tl.from(
          badgesRef.current.children,
          {
            y: 14,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.4",
        );
      }

      if (actionsRef.current) {
        tl.from(
          actionsRef.current,
          {
            y: 14,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.35",
        );
      }

      if (asideRef.current) {
        tl.from(
          asideRef.current,
          {
            y: 28,
            scale: 0.98,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-page-hero=""
      className={cn(
        "relative overflow-hidden mb-12 border-b border-white/8 pb-12 sm:pb-16",
        className,
      )}
    >
      {/* Halo de iluminação ambiente automotiva de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-1/3 -translate-x-1/2 size-[650px] rounded-full bg-primary/6 blur-[140px] -z-10"
      />

      <div className="page-width relative z-10">
        {/* Barra superior de telemetria e breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pt-2">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-0" />}

          {codeIndex && (
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              <span
                className="size-1.5 rounded-full bg-primary led-status-pulse"
                aria-hidden="true"
              />
              <span className="text-primary font-medium">{codeIndex}</span>
              <span className="text-white/20">|</span>
              <span className="text-neutral-400">COORD: 24°43'S 53°44'W</span>
            </div>
          )}
        </div>

        {/* Grade principal do Hero */}
        <div
          className={cn(
            "grid gap-8 lg:gap-14 items-center",
            asideContent ? "lg:grid-cols-12" : "max-w-4xl",
          )}
        >
          <div className={asideContent ? "lg:col-span-7" : "w-full"}>
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}

            <h1
              ref={titleRef}
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-white mb-6 leading-tight text-balance"
            >
              {title}
            </h1>

            <div
              ref={descRef}
              className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 font-body text-pretty"
            >
              {description}
            </div>

            {/* Badges de telemetria técnica de contexto */}
            {telemetryBadges && telemetryBadges.length > 0 && (
              <div
                ref={badgesRef}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-6 pt-2 border-t border-white/8"
              >
                {telemetryBadges.map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col p-2.5 rounded-sm bg-white/[0.02] border border-white/8 backdrop-blur-xs transition-colors hover:border-primary/40 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                        <Icon size={13} className="shrink-0" aria-hidden="true" />
                        <span className="font-display tracking-tight text-[11px] truncate">
                          {badge.label}
                        </span>
                      </div>
                      {badge.detail && (
                        <span className="text-[10px] text-neutral-400 mt-0.5 leading-snug font-body">
                          {badge.detail}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Ações (CTAs com suporte estrito a Link para rotas internas) */}
            {actions && actions.length > 0 && (
              <div ref={actionsRef} className="flex flex-wrap items-center gap-4 pt-2">
                {actions.map((action, idx) => {
                  const Icon = action.icon || ArrowUpRight;
                  if (action.to) {
                    return (
                      <Button
                        key={idx}
                        variant={action.variant || "primary"}
                        asChild
                        className="h-11 px-6 text-xs font-semibold cursor-pointer"
                      >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Link to={action.to} search={action.search as any}>
                          {action.label}
                          <Icon className="ml-1.5 shrink-0" size={14} aria-hidden="true" />
                        </Link>
                      </Button>
                    );
                  }
                  return (
                    <Button
                      key={idx}
                      variant={action.variant || "secondary"}
                      asChild
                      className="h-11 px-6 text-xs font-medium cursor-pointer"
                    >
                      <a href={action.href} target={action.target} rel={action.rel}>
                        {action.label}
                        <Icon className="ml-1.5 shrink-0" size={14} aria-hidden="true" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coluna visual auxiliar (se fornecida) */}
          {asideContent && (
            <div ref={asideRef} className="lg:col-span-5">
              {asideContent}
            </div>
          )}
        </div>

        {footerContent && <div className="mt-8 pt-4 border-t border-white/8">{footerContent}</div>}
      </div>
    </section>
  );
}
