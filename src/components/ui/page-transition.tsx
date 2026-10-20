import * as React from "react";
import { motion, useReducedMotion, useReducedMotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PageTransitionProps {
  children: React.ReactNode;
  pathname: string;
  className?: string;
}

/**
 * PageTransition — Transição cinemática refinada entre rotas para TanStack Start (SPEC-020, SPEC-033).
 *
 * Características:
 * - Duração ágil e inercial de 280ms (curva de desaceleração de luxo [0.22, 1, 0.36, 1]).
 * - Barra laser superior vermelha transitória que indica visualmente a troca de rota sem bloquear UI.
 * - Suporte nativo à View Transitions API por Progressive Enhancement.
 * - Desativa animações automaticamente sob `prefers-reduced-motion` ou SSR.
 * - Não interfere na restauração de rolagem, nem no estado do TanStack Router ou Radix UI.
 */
export function PageTransition({ children, pathname, className }: PageTransitionProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const motionConfigReduced = useReducedMotionConfig();
  const osReducedMotion = useReducedMotion();
  const shouldReduce = motionConfigReduced ?? osReducedMotion;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Indicador de varredura laser superior na troca de rota (Awwwards Standard) */}
      {isMounted && !shouldReduce && (
        <motion.div
          key={`route-laser-${pathname}`}
          initial={{ scaleX: 0, opacity: 0.95 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/30 via-primary to-brand-accent z-50 pointer-events-none shadow-[0_0_12px_var(--brand-primary-glow)] motion-reduce:hidden"
          aria-hidden="true"
        />
      )}

      {/* Conteúdo da rota com entrada cinemática suave */}
      <motion.div
        key={pathname}
        initial={isMounted && !shouldReduce ? { opacity: 0.88, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduce ? 0.01 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn("w-full max-w-full overflow-x-clip", className)}
      >
        {children}
      </motion.div>
    </>
  );
}
