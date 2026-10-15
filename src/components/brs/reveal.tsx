import * as React from "react";
import { motion } from "framer-motion";
import { MOTION_TOKENS } from "@/lib/motion-system";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  staggerIndex?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
  viewportMargin?: string;
  as?: "div" | "article" | "li" | "span";
}

/**
 * Componente primitivo de revelação suave com fade + subida vertical.
 * Segue rigorosamente os tokens normativos de SPEC-015:
 * - Curva: cubic-bezier(0.22, 1, 0.36, 1)
 * - Duração padrão: 700ms
 * - Deslocamento padrão: 20px
 * - Disparo único: once: true, margin: "-80px"
 * - Resiliência SSR e acessibilidade delegadas ao MotionConfig global em __root.tsx.
 */
export function Reveal({
  children,
  delay = 0,
  staggerIndex = 0,
  yOffset = MOTION_TOKENS.distance.desktop,
  duration = MOTION_TOKENS.duration.base,
  className,
  viewportMargin = MOTION_TOKENS.viewport.margin,
  as = "div",
  style,
  ...props
}: RevealProps) {
  const effectiveDelay = delay + staggerIndex * MOTION_TOKENS.stagger;

  const MotionComponent =
    as === "article"
      ? motion.article
      : as === "li"
        ? motion.li
        : as === "span"
          ? motion.span
          : motion.div;

  const mergedStyle: React.CSSProperties = {
    "--i": staggerIndex,
    ...style,
  };

  return (
    <MotionComponent
      data-reveal=""
      className={cn(className)}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        ease: MOTION_TOKENS.ease,
        delay: effectiveDelay,
      }}
      style={{
        willChange: "opacity, transform",
        ...mergedStyle,
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
