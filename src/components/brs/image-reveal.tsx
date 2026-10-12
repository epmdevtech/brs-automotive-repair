import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_TOKENS } from "@/lib/motion-system";
import { cn } from "@/lib/utils";

export interface ImageRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  viewportMargin?: string;
}

/**
 * Componente primitivo de revelação de imagem por máscara clip-path.
 * O recorte abre suavemente de baixo para cima, como uma cortina de pintura técnica.
 * - Duração: até 950ms conforme SPEC-015
 * - Curva: cubic-bezier(0.22, 1, 0.36, 1)
 * - Disparo único: once: true, margin: "-80px"
 * - Fallback imediato para prefers-reduced-motion
 */
export function ImageReveal({
  children,
  delay = 0,
  duration = MOTION_TOKENS.duration.imageMask,
  className,
  viewportMargin = MOTION_TOKENS.viewport.margin,
  style,
  ...props
}: ImageRevealProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const isObserverAvailable =
    typeof window === "undefined" || typeof window.IntersectionObserver !== "undefined";

  if (shouldReduceMotion || !isObserverAvailable) {
    return (
      <div className={cn("overflow-hidden", className)} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        ease: MOTION_TOKENS.ease,
        delay,
      }}
      style={{
        willChange: "clip-path",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
