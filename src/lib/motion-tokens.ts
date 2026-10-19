/**
 * Tokens e Variantes Globais de Motion Design — Master Chapeação e Pinturas
 *
 * Princípios de Design:
 * - Precisão e acabamento artesanal
 * - Deslocamentos contidos (16px - 24px, máximo 30px)
 * - Curva bezier suave e refinada: [0.21, 0.47, 0.32, 0.98]
 * - Execução única no scroll: viewport={{ once: true, margin: "-60px" }}
 * - Resiliência total para SSR e acessibilidade com prefers-reduced-motion
 */

export const MOTION_EASE = [0.21, 0.47, 0.32, 0.98] as const;

export const MOTION_DURATIONS = {
  /** Transições rápidas entre rotas e microinterações de clique (150-220ms) */
  fast: 0.2,
  /** Duração padrão de entrada de blocos textuais e headers (650-750ms) */
  base: 0.7,
  /** Duração de ênfase para cards principais e seções de destaque (800-850ms) */
  emphasis: 0.85,
  /** Duração para revelação cinematográfica de imagens automotivas (900-950ms) */
  image: 0.95,
} as const;

export const MOTION_DISTANCES = {
  /** Deslocamentos curtos para subtítulos e pequenas tags */
  short: 16,
  /** Deslocamento padrão para títulos, parágrafos e cards */
  default: 24,
  /** Deslocamento máximo permitido para preservar a sobriedade */
  max: 30,
} as const;

export const MOTION_STAGGER = 0.1;

export const MOTION_VIEWPORT = {
  once: true,
  margin: "0px 0px -60px 0px",
} as const;

/** Variantes compartilhadas para Framer Motion */
export const createFadeUpVariants = (
  distance = MOTION_DISTANCES.default,
  duration = MOTION_DURATIONS.base,
) => ({
  hidden: { opacity: 0, y: distance },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: MOTION_EASE,
    },
  }),
});

export const createFadeInVariants = (duration = MOTION_DURATIONS.base) => ({
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: {
      duration,
      delay,
      ease: MOTION_EASE,
    },
  }),
});

export const createStaggerContainerVariants = (
  staggerChildren = MOTION_STAGGER,
  delayChildren = 0.05,
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    },
  },
};
