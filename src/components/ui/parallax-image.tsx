import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotionPreferred } from "@/lib/motion-system";
import { cn } from "@/lib/utils";

export interface ParallaxImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  speed?: number; // percentual de deslocamento (padrão 8: de -8% a +8%)
  className?: string;
  imageClassName?: string;
  aspectRatioClassName?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * ParallaxImage — Imagem com deslocamento sutil de parallax impulsionado por GSAP ScrollTrigger (SPEC-036).
 *
 * Características:
 * - Movimento óptico scrubbed calibrado em relação ao scroll da viewport.
 * - Container com `overflow-hidden` para não gerar overflow horizontal ou vertical.
 * - Sem layout shifts: aspecto mantido rigorosamente por classes CSS.
 * - Suporte a badges ou marcações técnicas sobrepostas via children.
 * - Fallback instantâneo estático sob `prefers-reduced-motion` ou SSR.
 */
export function ParallaxImage({
  src,
  alt,
  width,
  height,
  speed = 8,
  className,
  imageClassName,
  aspectRatioClassName = "aspect-16/10",
  priority = false,
  children,
  ...props
}: ParallaxImageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || isReducedMotionPreferred()) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", aspectRatioClassName, className)}
      {...props}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={cn(
          "w-full h-[120%] -top-[10%] absolute left-0 object-cover will-change-transform",
          imageClassName,
        )}
      />
      {children}
    </div>
  );
}
