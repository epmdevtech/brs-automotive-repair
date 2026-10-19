import type { CSSProperties } from "react";

/**
 * Sistema de movimento da Master: utilitários puros e sem dependências externas.
 * Os valores visuais (duração, easing, distância) vivem em `src/styles.css`
 * como tokens (`--dur-*`, `--ease-out`, `--distance`, `--stagger`).
 */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

type NetworkInformationLike = { saveData?: boolean };
type NavigatorLike = { connection?: NetworkInformationLike; deviceMemory?: number };

/**
 * Indica se os efeitos vinculados à rolagem devem ser simplificados:
 * movimento reduzido, economia de dados ou dispositivo com pouca memória.
 */
export function shouldSimplifyMotion(): boolean {
  if (prefersReducedMotion()) return true;
  if (typeof navigator === "undefined") return false;
  const nav = navigator as unknown as NavigatorLike;
  return nav.connection?.saveData === true || (nav.deviceMemory ?? 8) <= 2;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Progresso de rolagem de 0 a 1.
 * 0 quando o topo do elemento está em `start` (fração da altura da viewport)
 * e 1 quando chega em `end`. Sempre determinístico e limitado ao intervalo.
 */
export function progressFromRect(top: number, viewportHeight: number, start = 0.95, end = 0.2) {
  if (viewportHeight <= 0) return 1;
  const from = viewportHeight * start;
  const to = viewportHeight * end;
  if (from === to) return 1;
  return clamp01((from - top) / (from - to));
}

/** Índice de sequência usado por CSS (`calc(var(--stagger) * var(--i))`). */
export function indexStyle(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

/** Props para marcar um elemento como entrada de seção (revelada uma única vez). */
export function reveal(index = 0): { "data-reveal": string; style: CSSProperties } {
  return { "data-reveal": "", style: indexStyle(Math.min(index, 5)) };
}

type PointerLike = {
  pointerType: string;
  clientX: number;
  clientY: number;
  currentTarget: HTMLElement;
};

export function pointerOffset(rect: { left: number; top: number }, x: number, y: number) {
  return { x: x - rect.left, y: y - rect.top };
}

/**
 * Posiciona o spotlight do card (`--mx`/`--my`). Ignora toque e caneta:
 * em dispositivos sem hover o efeito não existe e o conteúdo permanece completo.
 */
export function trackPointer(event: PointerLike): void {
  if (event.pointerType !== "mouse") return;
  const target = event.currentTarget;
  const { x, y } = pointerOffset(target.getBoundingClientRect(), event.clientX, event.clientY);
  target.style.setProperty("--mx", `${Math.round(x)}px`);
  target.style.setProperty("--my", `${Math.round(y)}px`);
}
