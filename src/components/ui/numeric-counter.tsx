import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotionPreferred } from "@/lib/motion-system";
import { cn } from "@/lib/utils";

export interface NumericCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  target: number;
  from?: number;
  duration?: number;
  ease?: string;
  padZero?: boolean;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
  className?: string;
}

/**
 * NumericCounter — Contador numérico animado acionado por GSAP ScrollTrigger (SPEC-036).
 *
 * Características:
 * - Conteúdo inicial sempre completo e acessível (SEO, bots, SSR, testes unitários).
 * - Acionado de forma inercial ao atingir a viewport (`ScrollTrigger.create({ once: true, onEnter })`).
 * - Números tabulares sem jitter de layout (`font-mono` / `tabular-nums`).
 * - Acessibilidade WCAG: `aria-label` fixo com o valor final anunciado a leitores de tela.
 * - Desativação instantânea e renderização estática sob `prefers-reduced-motion` ou SSR.
 */
export function NumericCounter({
  target,
  from = 0,
  duration = 1.4,
  ease = "power2.out",
  padZero = false,
  prefix = "",
  suffix = "",
  format,
  className,
  ...props
}: NumericCounterProps) {
  const spanRef = React.useRef<HTMLSpanElement>(null);

  const formatVal = React.useCallback(
    (val: number) => {
      if (format) return format(val);
      return padZero ? String(val).padStart(2, "0") : String(val);
    },
    [format, padZero],
  );

  const [displayValue, setDisplayValue] = React.useState(() => formatVal(target));

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      isReducedMotionPreferred() ||
      process.env.NODE_ENV === "test"
    ) {
      setDisplayValue(formatVal(target));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const el = spanRef.current;
    if (!el) return;

    const counterObj = { value: from };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            counterObj,
            { value: from },
            {
              value: target,
              duration,
              ease,
              onUpdate: () => {
                setDisplayValue(formatVal(Math.round(counterObj.value)));
              },
              onComplete: () => {
                setDisplayValue(formatVal(target));
              },
            },
          );
        },
      });
    }, el);

    return () => ctx.revert();
  }, [target, from, duration, ease, formatVal]);

  return (
    <span
      ref={spanRef}
      className={cn("tabular-nums inline-block font-mono", className)}
      aria-label={`${prefix}${formatVal(target)}${suffix}`}
      {...props}
    >
      <span aria-hidden="true">
        {prefix}
        {displayValue}
        {suffix}
      </span>
    </span>
  );
}
