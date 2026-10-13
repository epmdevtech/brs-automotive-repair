import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export interface MagneticButtonProps {
  children: React.ReactNode;
  maxDistance?: number;
  strength?: number;
  className?: string;
}

/**
 * MagneticButton — Microinteração de atração magnética sutil para CTAs principais.
 *
 * Restrições e Governança de Luxo (SPEC-021):
 * - Ativo exclusivamente em dispositivos com ponteiro fino e hover (`(hover: hover) and (pointer: fine)`).
 * - Totalmente desativado em dispositivos móveis/touch.
 * - Respeita rigorosamente `prefers-reduced-motion`.
 * - Deslocamento restrito a no máximo 4-6px por eixo (padrão: 5px).
 * - Retorno suave à posição neutra ao sair da área interativa.
 * - Não distorce o fluxo de layout nem elementos adjacentes.
 */
export function MagneticButton({
  children,
  maxDistance = 5,
  strength = 0.2,
  className,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [canHover, setCanHover] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(media.matches);

    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 240, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!canHover || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
