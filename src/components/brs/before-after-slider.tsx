import * as React from "react";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  className?: string;
  aspectRatioClassName?: string;
  beforeImageClassName?: string;
  afterImageClassName?: string;
  onPositionChange?: (position: number) => void;
  showLabels?: boolean;
  priority?: boolean;
  hint?: string;
  title?: string;
  description?: string;
  category?: string;
  linkUrl?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Estado anterior ao reparo",
  afterAlt = "Resultado concluído após reparo",
  beforeLabel = "Antes",
  afterLabel = "Depois",
  initialPosition = 50,
  className,
  aspectRatioClassName = "aspect-16/10",
  beforeImageClassName,
  afterImageClassName,
  onPositionChange,
  showLabels = true,
  priority = false,
  hint = "Arraste para comparar",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = React.useState(Math.max(0, Math.min(100, initialPosition)));
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasInteractedRef = React.useRef(false);
  const teaserAnimationRef = React.useRef<number | null>(null);

  const cancelTeaser = React.useCallback(() => {
    hasInteractedRef.current = true;
    if (teaserAnimationRef.current !== null) {
      cancelAnimationFrame(teaserAnimationRef.current);
      teaserAnimationRef.current = null;
    }
  }, []);

  // Convite de interação ao entrar na viewport pela primeira vez (~10% e volta)
  React.useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced || typeof IntersectionObserver === "undefined") return;
    const element = containerRef.current;
    if (!element) return;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasTriggered && !hasInteractedRef.current) {
          hasTriggered = true;
          observer.disconnect();

          const startPos = position;
          const targetPos = Math.min(100, startPos + 10);
          const startTime = performance.now();
          const forwardDuration = 350;
          const returnDuration = 400;
          const totalDuration = forwardDuration + returnDuration;

          const animateTeaser = (currentTime: number) => {
            if (hasInteractedRef.current) return;

            const elapsed = currentTime - startTime;
            if (elapsed < forwardDuration) {
              const progress = elapsed / forwardDuration;
              const easeProgress = 1 - Math.pow(1 - progress, 2);
              const current = startPos + (targetPos - startPos) * easeProgress;
              setPosition(Math.round(current * 10) / 10);
              teaserAnimationRef.current = requestAnimationFrame(animateTeaser);
            } else if (elapsed < totalDuration) {
              const progress = (elapsed - forwardDuration) / returnDuration;
              const easeProgress = Math.pow(progress, 2);
              const current = targetPos - (targetPos - startPos) * easeProgress;
              setPosition(Math.round(current * 10) / 10);
              teaserAnimationRef.current = requestAnimationFrame(animateTeaser);
            } else {
              setPosition(startPos);
              teaserAnimationRef.current = null;
            }
          };

          teaserAnimationRef.current = requestAnimationFrame(animateTeaser);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (teaserAnimationRef.current !== null) {
        cancelAnimationFrame(teaserAnimationRef.current);
      }
    };
  }, [position]);

  const updatePosition = React.useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (rawX / rect.width) * 100));
      const rounded = Math.round(percent * 10) / 10;
      setPosition(rounded);
      onPositionChange?.(rounded);
    },
    [onPositionChange],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    cancelTeaser();
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignora erro se pointer já foi capturado
    }
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignora erro se pointer já foi liberado
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    cancelTeaser();
    let next = position;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      next = Math.max(0, position - 5);
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      next = Math.min(100, position + 5);
      e.preventDefault();
    } else if (e.key === "PageDown") {
      next = Math.max(0, position - 10);
      e.preventDefault();
    } else if (e.key === "PageUp") {
      next = Math.min(100, position + 10);
      e.preventDefault();
    } else if (e.key === "Home") {
      next = 0;
      e.preventDefault();
    } else if (e.key === "End") {
      next = 100;
      e.preventDefault();
    }
    if (next !== position) {
      setPosition(next);
      onPositionChange?.(next);
    }
  };

  // Fade suave dos badges conforme o divisor se aproxima das bordas
  const beforeOpacity = Math.max(0, Math.min(1, (position - 12) / 12));
  const afterOpacity = Math.max(0, Math.min(1, (88 - position) / 12));

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none overflow-hidden rounded-sm bg-card border border-border/80 cursor-ew-resize touch-pan-y group",
        "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        aspectRatioClassName,
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-label="Controle deslizante de comparação antes e depois"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
    >
      {/* Imagem "Depois" (fundo completo) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className={cn(
          "absolute inset-0 h-full w-full object-cover pointer-events-none",
          afterImageClassName,
        )}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        draggable={false}
      />

      {/* Imagem "Antes" (recortada via clipPath acelerado por GPU) */}
      <div
        className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden will-change-[clip-path]"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover pointer-events-none",
            beforeImageClassName,
          )}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          draggable={false}
        />
      </div>

      {/* Dica visual discreta de affordance */}
      {hint && (
        <div
          className={cn(
            "absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none",
            "px-2.5 py-0.5 rounded-xs bg-neutral-950/80 backdrop-blur-xs border border-white/10",
            "text-[9px] font-medium tracking-wide text-neutral-300 uppercase",
            "transition-opacity duration-300",
            isDragging ? "opacity-0" : "opacity-90",
          )}
        >
          {hint}
        </div>
      )}

      {/* Badges indicativos com fade suave */}
      {showLabels && (
        <>
          <span
            className="absolute top-3 left-3 z-10 text-[9px] font-semibold tracking-wider uppercase px-2 py-1 rounded-sm bg-background/85 text-muted-foreground border border-border/60 pointer-events-none transition-opacity duration-150 backdrop-blur-xs"
            style={{ opacity: beforeOpacity }}
          >
            {beforeLabel}
          </span>
          <span
            className="absolute top-3 right-3 z-10 text-[9px] font-semibold tracking-wider uppercase px-2 py-1 rounded-sm bg-background/85 text-brand-accent border border-primary/40 pointer-events-none transition-opacity duration-150 backdrop-blur-xs"
            style={{ opacity: afterOpacity }}
          >
            {afterLabel}
          </span>
        </>
      )}

      {/* Divisor vertical (Handle) */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-primary/90 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.8)]"
        style={{ left: `${position}%` }}
      >
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 rounded-sm bg-background/95 border border-primary/70 text-brand-accent shadow-xl shadow-black/80 flex items-center justify-center transition-transform duration-150",
            isDragging ? "scale-110 border-primary shadow-primary/20" : "group-hover:scale-105",
          )}
          aria-hidden="true"
        >
          <ChevronsLeftRight size={14} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
