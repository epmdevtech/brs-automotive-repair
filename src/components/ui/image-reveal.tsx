import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION_EASE, MOTION_DURATIONS, MOTION_VIEWPORT } from "@/lib/motion-tokens";

export interface ImageRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}

/**
 * ImageReveal — Container de revelação cinematográfica de imagens automotivas.
 *
 * Características:
 * - Container com `overflow-hidden`.
 * - Efeito suave de zoom reverso (padrão scale: 1.08 -> 1.00) e fade-in (opacity: 0 -> 1).
 * - Duração calibrada de 0.95s com bezier [0.21, 0.47, 0.32, 0.98].
 * - Preserva proporções de aspecto (aspect-16/10, aspect-4/3), object-fit e responsividade sem layout shift.
 * - Resiliência SSR e acessibilidade delegada ao MotionConfig global em __root.tsx.
 */
export function ImageReveal({
  children,
  delay = 0,
  duration = MOTION_DURATIONS.image,
  scale = 1.08,
  className,
  viewportMargin = MOTION_VIEWPORT.margin,
  once = MOTION_VIEWPORT.once,
  style,
  ...props
}: ImageRevealProps) {
  return (
    <div className={cn("overflow-hidden", className)} style={style} {...props}>
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, scale }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once, margin: viewportMargin }}
        transition={{
          duration,
          delay,
          ease: MOTION_EASE,
        }}
        style={{
          willChange: "opacity, transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
