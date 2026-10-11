import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  dotsColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CardSpotlight({
  radius = 320,
  color = "oklch(0.73 0.1 82 / 0.16)",
  dotsColor = "oklch(0.73 0.1 82 / 0.25)",
  className,
  children,
  ...props
}: CardSpotlightProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const [isHovered, setIsHovered] = React.useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || shouldReduceMotion) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  // Gradiente radial guiado dinamicamente pelas coordenadas do cursor
  const background = useMotionTemplate`radial-gradient(
    ${radius}px circle at ${mouseX}px ${mouseY}px,
    ${color},
    transparent 80%
  )`;

  // Máscara para revelação sutil da matriz de micro-pontos da chapa automotiva
  const maskImage = useMotionTemplate`radial-gradient(
    ${radius * 0.75}px circle at ${mouseX}px ${mouseY}px,
    black,
    transparent 75%
  )`;

  return (
    <div
      className={cn(
        "group/spotlight relative overflow-hidden rounded-sm bg-card border border-border/80 transition-colors duration-300 hover:border-primary/50",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {/* Camada 1: Glow radial âmbar suave sob o cursor */}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
          style={{ background }}
          aria-hidden="true"
        />
      )}

      {/* Camada 2: Matriz de micro-pontos automotivos (efeito reveal discreto) */}
      {!shouldReduceMotion && isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-80"
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
          }}
          aria-hidden="true"
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="spotlight-dots-pattern"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill={dotsColor} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#spotlight-dots-pattern)" />
          </svg>
        </motion.div>
      )}

      {/* Conteúdo do card */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
