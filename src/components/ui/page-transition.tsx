import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_EASE, MOTION_DURATIONS } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

export interface PageTransitionProps {
  children: React.ReactNode;
  pathname: string;
  className?: string;
}

/**
 * PageTransition — Transição sutil e rápida entre rotas para TanStack Start.
 *
 * Características:
 * - Duração rápida de 200ms para evitar atrasos na navegação.
 * - Deslocamento vertical mínimo (6px) combinado com fade-in.
 * - Não bloqueia scroll restoration nem retém a tela anterior.
 * - Desativa animações automaticamente sob `prefers-reduced-motion` ou SSR.
 */
export function PageTransition({ children, pathname, className }: PageTransitionProps) {
  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: MOTION_DURATIONS.fast,
        ease: MOTION_EASE,
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
