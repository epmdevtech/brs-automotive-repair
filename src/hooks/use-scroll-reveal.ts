import { useEffect } from "react";
import { shouldSimplifyMotion } from "@/lib/motion";

/**
 * Revela uma única vez os elementos marcados com `data-reveal` ao entrarem na viewport.
 *
 * Melhoria progressiva:
 * - sem JavaScript (ou com movimento simplificado) o conteúdo permanece visível;
 * - elementos já visíveis na carga inicial não são escondidos (sem flash);
 * - apenas elementos abaixo da dobra recebem o estado inicial oculto.
 *
 * `routeKey` (ex.: o pathname atual) reexecuta a varredura quando a rota muda, de modo que o
 * layout compartilhado inicialize um único observer por página.
 */
export function useScrollReveal(selector = "[data-reveal]", routeKey?: string) {
  useEffect(() => {
    if (shouldSimplifyMotion() || typeof IntersectionObserver === "undefined") return;

    const viewportHeight = window.innerHeight;
    const pending = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
      (element) => element.getBoundingClientRect().top > viewportHeight * 0.9,
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    pending.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      pending.forEach((element) => element.setAttribute("data-reveal", "shown"));
    };
  }, [selector, routeKey]);
}
