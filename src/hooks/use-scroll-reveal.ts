import { useEffect } from "react";
import { shouldSimplifyMotion } from "@/lib/motion";

/**
 * Revela uma única vez os elementos marcados com `data-reveal` ao entrarem na viewport.
 *
 * Melhoria progressiva:
 * - sem JavaScript (ou com movimento simplificado) o conteúdo permanece visível;
 * - elementos já visíveis na carga inicial não são escondidos (sem flash);
 * - apenas elementos abaixo da dobra recebem o estado inicial oculto.
 */
export function useScrollReveal(selector = "[data-reveal]") {
  useEffect(() => {
    if (shouldSimplifyMotion() || typeof IntersectionObserver === "undefined") return;

    const viewportHeight = window.innerHeight;
    const pending = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
      (element) => element.getBoundingClientRect().top > viewportHeight * 0.92,
    );

    pending.forEach((element) => element.setAttribute("data-reveal", "hidden"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal", "shown");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    pending.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      pending.forEach((element) => element.setAttribute("data-reveal", "shown"));
    };
  }, [selector]);
}
