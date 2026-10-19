/**
 * Sistema Centralizado de Motion Design — Master Chapeação e Pinturas
 * Conforme especificado em SPEC-015:
 * - Duração: 600 a 800ms (máscaras de imagem até 1000ms)
 * - Curva: cubic-bezier(0.22, 1, 0.36, 1) — desaceleração suave, sem bounce
 * - Deslocamento: 16-24px desktop, 12px mobile
 * - Stagger: 80 a 120ms
 * - Viewport: once: true, margin: "-80px"
 * - Propriedades: estritamente opacity, transform e clip-path
 */

export const MOTION_TOKENS = {
  duration: {
    base: 0.7, // 700ms
    fast: 0.3, // 300ms
    slow: 0.8, // 800ms
    imageMask: 0.95, // 950ms (máscara de revelação de imagem)
    heroZoom: 0.85, // 850ms
  },
  ease: [0.22, 1, 0.36, 1] as const,
  easeCss: "cubic-bezier(0.22, 1, 0.36, 1)",
  distance: {
    desktop: 20, // 20px
    mobile: 12, // 12px
  },
  stagger: 0.09, // 90ms
  viewport: {
    once: true,
    margin: "-80px",
  },
} as const;

/**
 * Retorna se o ambiente do cliente solicita movimento reduzido.
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
