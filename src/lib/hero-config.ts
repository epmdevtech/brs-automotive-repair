import heroCarImage from "@/assets/brs-hero.jpg";

/**
 * Perfis disponíveis para caracterização visual da fotografia do Hero.
 * - `veiculo-inteiro`: Carro completo, zoom ancorado no veículo e reflexo de luz ativo sobre o capô/lataria.
 * - `detalhe-lataria`: Close-up em pintura, polimento ou painel; reflexo mais largo e suave.
 * - `oficina-equipe`: Pessoas, maquinários, estufa e ferramentas; reflexo desativado por padrão.
 */
export type HeroProfileType = "veiculo-inteiro" | "detalhe-lataria" | "oficina-equipe";

export interface HeroImageVariant {
  /** Caminho ou URL de importação da imagem (JPG / WebP / AVIF) */
  src: string;
  /** Largura intrínseca para cálculo de proporção sem layout shift */
  width: number;
  /** Altura intrínseca para cálculo de proporção sem layout shift */
  height: number;
  /** Caminho opcional para variante ultra-compacta em formato AVIF */
  avifSrc?: string;
  /** Caminho opcional para variante moderna em formato WebP */
  webpSrc?: string;
}

export interface HeroImageConfig {
  /** Variante otimizada para telas desktop (proporção 16:9, min 2560px de largura) */
  desktop: HeroImageVariant;
  /** Variante vertical/otimizada para telas móveis (proporção 4:5 ou 3:4, min 1200px) */
  mobile: HeroImageVariant;
  /** Texto alternativo para acessibilidade. Vazio quando `decorative: true`. */
  alt: string;
  /** Se `true`, a imagem é tratada como plano de fundo decorativo com `alt=""` */
  decorative: boolean;
}

export interface HeroCompositionConfig {
  desktop: {
    /** Posição do recorte da imagem (CSS object-position) */
    objectPosition: string;
    /** Ponto de ancoragem do zoom lento (CSS transform-origin) */
    transformOrigin: string;
  };
  mobile: {
    /** Posição do recorte no mobile preservando o assunto principal */
    objectPosition: string;
    /** Ponto de ancoragem do zoom no mobile */
    transformOrigin: string;
  };
}

export interface HeroOverlayConfig {
  /** Lado em que a tipografia se concentra ('left' padrão) */
  textSide: "left" | "right";
  desktop: {
    fromGradient: string;
    viaGradient: string;
    toGradient: string;
  };
  mobile: {
    fromGradient: string;
    viaGradient: string;
    toGradient: string;
  };
}

export interface HeroFlareConfig {
  /** Se o reflexo luminoso deve ser renderizado */
  enabled: boolean;
  /** Posição vertical inicial do reflexo em porcentagem (0-100) */
  top: number;
  /** Posição horizontal inicial do reflexo em porcentagem (0-100) */
  left: number;
  /** Largura da faixa de reflexo em porcentagem relativa ao Hero (0-100) */
  width: number;
  /** Altura da faixa de reflexo em porcentagem relativa ao Hero (0-100) */
  height: number;
  /** Ângulo de inclinação da faixa diagonal de luz em graus (ex: 115deg) */
  angle: number;
  /** Intensidade máxima de pico do reflexo (0.0 a 1.0, tipicamente 0.20 a 0.35) */
  maxOpacity: number;
}

export interface HeroProfilePreset {
  name: HeroProfileType;
  label: string;
  description: string;
  composition: HeroCompositionConfig;
  overlay: HeroOverlayConfig;
  flare: HeroFlareConfig;
}

export interface HeroConfig {
  /** Perfil ativo de calibração */
  profile: HeroProfileType;
  /**
   * Flag de controle estrito:
   * - `true`: renderiza o microdado "Fotografia ilustrativa" no rodapé do Hero.
   * - `false`: suprime o selo para fotos reais de instalações e serviços da oficina.
   */
  isIllustrative: boolean;
  /** Configuração das fontes de imagem desktop e mobile */
  image: HeroImageConfig;
  /** Sobrescritas pontuais por perfil (opcional) */
  customProfiles?: Partial<Record<HeroProfileType, Partial<HeroProfilePreset>>>;
}

/**
 * Perfis pré-definidos calibrados visualmente para cada tipo de imagem.
 * Os valores numéricos são pontos de partida razoáveis e ajustáveis por perfil.
 */
export const HERO_PROFILE_PRESETS: Record<HeroProfileType, HeroProfilePreset> = {
  "veiculo-inteiro": {
    name: "veiculo-inteiro",
    label: "Veículo Inteiro",
    description: "Carro completo, zoom ancorado no lado direito e reflexo de luz na lataria/capô.",
    composition: {
      desktop: {
        objectPosition: "center 48%",
        transformOrigin: "75% 50%",
      },
      mobile: {
        objectPosition: "70% center",
        transformOrigin: "70% 50%",
      },
    },
    overlay: {
      textSide: "left",
      desktop: {
        fromGradient: "rgba(0, 0, 0, 0.95)",
        viaGradient: "rgba(0, 0, 0, 0.75)",
        toGradient: "rgba(0, 0, 0, 0.0)",
      },
      mobile: {
        fromGradient: "rgba(0, 0, 0, 0.95)",
        viaGradient: "rgba(0, 0, 0, 0.85)",
        toGradient: "rgba(0, 0, 0, 0.35)",
      },
    },
    flare: {
      enabled: true,
      top: 32,
      left: 20,
      width: 55,
      height: 28,
      angle: 115,
      maxOpacity: 0.32,
    },
  },

  "detalhe-lataria": {
    name: "detalhe-lataria",
    label: "Detalhe de Lataria e Pintura",
    description:
      "Close-up de verniz, reflexo e acabamento; reflexo mais largo com opacidade moderada.",
    composition: {
      desktop: {
        objectPosition: "center center",
        transformOrigin: "60% 50%",
      },
      mobile: {
        objectPosition: "center center",
        transformOrigin: "50% 50%",
      },
    },
    overlay: {
      textSide: "left",
      desktop: {
        fromGradient: "rgba(0, 0, 0, 0.92)",
        viaGradient: "rgba(0, 0, 0, 0.70)",
        toGradient: "rgba(0, 0, 0, 0.10)",
      },
      mobile: {
        fromGradient: "rgba(0, 0, 0, 0.95)",
        viaGradient: "rgba(0, 0, 0, 0.80)",
        toGradient: "rgba(0, 0, 0, 0.30)",
      },
    },
    flare: {
      enabled: true,
      top: 25,
      left: 15,
      width: 70,
      height: 35,
      angle: 120,
      maxOpacity: 0.25,
    },
  },

  "oficina-equipe": {
    name: "oficina-equipe",
    label: "Oficina, Maquinários e Equipe",
    description:
      "Espaço físico, estufa e profissionais; reflexo DESATIVADO para evitar brilhos artificiais.",
    composition: {
      desktop: {
        objectPosition: "center center",
        transformOrigin: "50% 50%",
      },
      mobile: {
        objectPosition: "center center",
        transformOrigin: "50% 50%",
      },
    },
    overlay: {
      textSide: "left",
      desktop: {
        fromGradient: "rgba(0, 0, 0, 0.96)",
        viaGradient: "rgba(0, 0, 0, 0.80)",
        toGradient: "rgba(0, 0, 0, 0.15)",
      },
      mobile: {
        fromGradient: "rgba(0, 0, 0, 0.98)",
        viaGradient: "rgba(0, 0, 0, 0.88)",
        toGradient: "rgba(0, 0, 0, 0.40)",
      },
    },
    flare: {
      enabled: false,
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      angle: 0,
      maxOpacity: 0,
    },
  },
};

/**
 * Configuração canônica ativa do Hero da BRS Reparações Automotivas.
 * Para substituir a imagem por uma foto real, altere apenas este objeto.
 */
export const defaultHeroConfig: HeroConfig = {
  profile: "veiculo-inteiro",
  isIllustrative: true,
  image: {
    desktop: {
      src: heroCarImage,
      width: 2560,
      height: 1440,
    },
    mobile: {
      src: heroCarImage,
      width: 1280,
      height: 1600,
    },
    alt: "",
    decorative: true,
  },
};

/**
 * Resolve e funde o perfil ativo com quaisquer sobrescritas customizadas.
 */
export function resolveHeroProfile(config: HeroConfig = defaultHeroConfig): HeroProfilePreset {
  const basePreset =
    HERO_PROFILE_PRESETS[config.profile] ?? HERO_PROFILE_PRESETS["veiculo-inteiro"];
  const customOverride = config.customProfiles?.[config.profile];

  if (!customOverride) {
    return basePreset;
  }

  return {
    ...basePreset,
    ...customOverride,
    composition: {
      desktop: { ...basePreset.composition.desktop, ...customOverride.composition?.desktop },
      mobile: { ...basePreset.composition.mobile, ...customOverride.composition?.mobile },
    },
    overlay: {
      ...basePreset.overlay,
      ...customOverride.overlay,
      desktop: { ...basePreset.overlay.desktop, ...customOverride.overlay?.desktop },
      mobile: { ...basePreset.overlay.mobile, ...customOverride.overlay?.mobile },
    },
    flare: {
      ...basePreset.flare,
      ...customOverride.flare,
    },
  };
}

/**
 * Gera as variáveis CSS em formato string/objeto para injeção no container do Hero.
 */
export function getHeroStyleVariables(
  config: HeroConfig = defaultHeroConfig,
  isMobile = false,
): React.CSSProperties {
  const profile = resolveHeroProfile(config);
  const comp = isMobile ? profile.composition.mobile : profile.composition.desktop;
  const overlay = isMobile ? profile.overlay.mobile : profile.overlay.desktop;

  return {
    ["--hero-object-position" as string]: comp.objectPosition,
    ["--hero-transform-origin" as string]: comp.transformOrigin,
    ["--hero-overlay-from" as string]: overlay.fromGradient,
    ["--hero-overlay-via" as string]: overlay.viaGradient,
    ["--hero-overlay-to" as string]: overlay.toGradient,
    ["--hero-flare-top" as string]: `${profile.flare.top}%`,
    ["--hero-flare-left" as string]: `${profile.flare.left}%`,
    ["--hero-flare-width" as string]: `${profile.flare.width}%`,
    ["--hero-flare-height" as string]: `${profile.flare.height}%`,
    ["--hero-flare-angle" as string]: `${profile.flare.angle}deg`,
    ["--hero-flare-opacity" as string]: `${profile.flare.maxOpacity}`,
  } as React.CSSProperties;
}
