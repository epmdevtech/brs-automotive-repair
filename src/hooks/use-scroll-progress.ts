import { useEffect, useRef } from "react";
import { progressFromRect, shouldSimplifyMotion } from "@/lib/motion";

/**
 * Expõe o progresso de rolagem (0 a 1) do elemento como a variável CSS `--p`.
 *
 * - Usa a rolagem nativa: listener passivo, atualizado em `requestAnimationFrame`.
 * - Só escuta enquanto o elemento está próximo da viewport.
 * - Com movimento reduzido, economia de dados ou pouca memória, fixa `--p: 1`
 *   (estado final, sem animação). Sem JavaScript, o CSS também assume `--p: 1`.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (shouldSimplifyMotion() || typeof IntersectionObserver === "undefined") {
      element.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const { top } = element.getBoundingClientRect();
      element.style.setProperty("--p", progressFromRect(top, window.innerHeight).toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
    };
    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
        update();
      },
      { rootMargin: "20% 0px" },
    );

    update();
    observer.observe(element);

    return () => {
      observer.disconnect();
      stop();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
