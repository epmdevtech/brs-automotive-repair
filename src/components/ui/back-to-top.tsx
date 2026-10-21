import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botão acessível e refinado de retorno ao topo da página (SPEC-024).
 * Surge de forma suave quando a rolagem ultrapassa 400px e executa
 * rolagem suave respeitando a preferência de movimento reduzido.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-6 z-40 size-11 flex items-center justify-center cursor-pointer",
        "bg-neutral-900/85 hover:bg-neutral-800 text-neutral-300 hover:text-brand-accent",
        "border border-white/10 hover:border-primary/50 shadow-lg shadow-black/50 backdrop-blur-md",
        "transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        "active:scale-95",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto visible"
          : "opacity-0 translate-y-3 pointer-events-none invisible",
      )}
      style={{ borderRadius: "var(--radius-sm)" }}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
