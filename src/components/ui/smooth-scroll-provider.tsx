import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotionPreferred } from "@/lib/motion-system";
import { SmoothScrollContext, type SmoothScrollContextValue } from "@/hooks/use-smooth-scroll";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respeito normativo a acessibilidade (WCAG 2.1 AA / prefers-reduced-motion)
    if (isReducedMotionPreferred()) {
      return;
    }

    // Registra ScrollTrigger no GSAP de modo seguro
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis;
    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
      });
    } catch (e) {
      console.warn("Lenis could not be initialized in this environment:", e);
      return;
    }

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Sincroniza o evento de scroll do Lenis com os gatilhos do GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // Sincroniza o RAF do GSAP com o Lenis para coreografia de 60/120fps sem jitter
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerUpdate);
      lenis.off("scroll", handleScroll);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  // Reseta a rolagem imediatamente para o topo em transições de página
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const scrollTo: SmoothScrollContextValue["scrollTo"] = (target, options) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== "undefined") {
      if (typeof target === "number") {
        window.scrollTo({
          top: target,
          behavior: options?.immediate ? "auto" : "smooth",
        });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({
            behavior: options?.immediate ? "auto" : "smooth",
          });
        }
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({
          behavior: options?.immediate ? "auto" : "smooth",
        });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
