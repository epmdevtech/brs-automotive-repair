import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MOTION_EASE,
  MOTION_DURATIONS,
  MOTION_DISTANCES,
  MOTION_VIEWPORT,
} from "@/lib/motion-tokens";

export type ScrollRevealDirection = "up" | "down" | "left" | "right" | "none";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: ScrollRevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
  amount?: "some" | "all" | number;
  as?: "div" | "article" | "section" | "li" | "span" | "header" | "footer" | "nav";
}

/**
 * ScrollReveal — Wrapper global e polimórfico de revelação no scroll com Framer Motion.
 *
 * Diretrizes Premium:
 * - Deslocamentos contidos: padrão 24px (faixa de 16px a 30px, sem saltos bruscos).
 * - Curva suave: bezier [0.21, 0.47, 0.32, 0.98].
 * - Duração: padrão 0.7s (faixa de 0.65s a 0.85s).
 * - Execução única: viewport={{ once: true, margin: "-60px" }}.
 * - Resiliência SSR & Acessibilidade: fallback limpo se IntersectionObserver estiver ausente ou sob prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = MOTION_DURATIONS.base,
  distance = MOTION_DISTANCES.default,
  className,
  viewportMargin = MOTION_VIEWPORT.margin,
  once = MOTION_VIEWPORT.once,
  amount = "some",
  as = "div",
  style,
  ...props
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  // Mapeamento dinâmico do elemento semântico
  const MotionComponent =
    as === "article"
      ? motion.article
      : as === "section"
        ? motion.section
        : as === "li"
          ? motion.li
          : as === "span"
            ? motion.span
            : as === "header"
              ? motion.header
              : as === "footer"
                ? motion.footer
                : as === "nav"
                  ? motion.nav
                  : motion.div;

  if (shouldReduceMotion) {
    return (
      <MotionComponent className={cn(className)} style={style} {...props}>
        {children}
      </MotionComponent>
    );
  }

  // Cálculo de deslocamento vetorial
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0 };
      case "down":
        return { opacity: 0, y: -distance, x: 0 };
      case "left":
        return { opacity: 0, x: distance, y: 0 };
      case "right":
        return { opacity: 0, x: -distance, y: 0 };
      case "none":
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  };

  const initial = getInitialPosition();

  return (
    <MotionComponent
      className={cn(className)}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: viewportMargin, amount }}
      transition={{
        duration,
        delay,
        ease: MOTION_EASE,
      }}
      style={{
        willChange: "opacity, transform",
        ...style,
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
