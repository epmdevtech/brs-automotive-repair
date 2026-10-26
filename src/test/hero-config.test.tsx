import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  HERO_PROFILE_PRESETS,
  type HeroConfig,
  type HeroProfileType,
  defaultHeroConfig,
  getHeroLcpPreload,
  getHeroStyleVariables,
  resolveHeroProfile,
} from "@/lib/hero-config";
import { Hero } from "@/components/brs/hero";
import { AnimatedHero } from "@/components/brs/animated-hero";

describe("SPEC-068: Desacoplamento da Animação do Hero e Configuração Centralizada", () => {
  describe("1. Validação de Esquema e Perfis Industriais", () => {
    const profiles: HeroProfileType[] = ["veiculo-inteiro", "detalhe-lataria", "oficina-equipe"];

    it("assegura que todos os 3 perfis obrigatórios existem com campos estruturados", () => {
      for (const profileName of profiles) {
        const preset = HERO_PROFILE_PRESETS[profileName];
        expect(preset).toBeDefined();
        expect(preset.name).toBe(profileName);
        expect(preset.label).toBeTruthy();
        expect(preset.description).toBeTruthy();

        // Composição
        expect(preset.composition.desktop.objectPosition).toBeTruthy();
        expect(preset.composition.desktop.transformOrigin).toBeTruthy();
        expect(preset.composition.mobile.objectPosition).toBeTruthy();
        expect(preset.composition.mobile.transformOrigin).toBeTruthy();

        // Overlay
        expect(preset.overlay.textSide).toMatch(/^(left|right)$/);
        expect(preset.overlay.desktop.fromGradient).toBeTruthy();
        expect(preset.overlay.mobile.fromGradient).toBeTruthy();

        // Flare
        expect(typeof preset.flare.enabled).toBe("boolean");
      }
    });

    it("valida que valores numéricos do flare estão dentro de limites físicos razoáveis", () => {
      for (const profileName of profiles) {
        const { flare } = HERO_PROFILE_PRESETS[profileName];
        expect(flare.top).toBeGreaterThanOrEqual(0);
        expect(flare.top).toBeLessThanOrEqual(100);
        expect(flare.left).toBeGreaterThanOrEqual(0);
        expect(flare.left).toBeLessThanOrEqual(100);
        expect(flare.width).toBeGreaterThanOrEqual(0);
        expect(flare.width).toBeLessThanOrEqual(100);
        expect(flare.height).toBeGreaterThanOrEqual(0);
        expect(flare.height).toBeLessThanOrEqual(100);
        expect(flare.angle).toBeGreaterThanOrEqual(0);
        expect(flare.angle).toBeLessThanOrEqual(360);
        expect(flare.maxOpacity).toBeGreaterThanOrEqual(0);
        expect(flare.maxOpacity).toBeLessThanOrEqual(1);
      }
    });

    it("garante que o perfil 'oficina-equipe' possui o reflexo de luz estritamente DESATIVADO", () => {
      const preset = HERO_PROFILE_PRESETS["oficina-equipe"];
      expect(preset.flare.enabled).toBe(false);
      expect(preset.flare.maxOpacity).toBe(0);
    });

    it("garante que o perfil 'veiculo-inteiro' mantém o reflexo de luz e zoom calibrados da SPEC-067", () => {
      const preset = HERO_PROFILE_PRESETS["veiculo-inteiro"];
      expect(preset.flare.enabled).toBe(true);
      expect(preset.flare.angle).toBe(115);
      expect(preset.flare.maxOpacity).toBe(0.32);
      expect(preset.composition.desktop.transformOrigin).toBe("75% 50%");
    });
  });

  it("usa o rótulo de divulgação no hero canônico", () => {
    render(<Hero />);

    expect(defaultHeroConfig.isIllustrative).toBe(true);
    expect(defaultHeroConfig.mediaLabel).toBe("Imagem de divulgação");
    expect(screen.getByText("Imagem de divulgação")).toBeInTheDocument();
    expect(screen.queryByText("Fotografia ilustrativa")).toBeNull();
  });

  describe("2. Renderização Condicional do Aviso 'Fotografia ilustrativa'", () => {
    it("renderiza o aviso quando isIllustrative === true", () => {
      const config: HeroConfig = {
        ...defaultHeroConfig,
        isIllustrative: true,
        mediaLabel: undefined,
      };

      render(<Hero config={config} />);
      expect(screen.getByText("Fotografia ilustrativa")).toBeInTheDocument();
    });

    it("NÃO renderiza o aviso quando isIllustrative === false (foto real da oficina)", () => {
      const config: HeroConfig = {
        ...defaultHeroConfig,
        isIllustrative: false,
      };

      render(<Hero config={config} />);
      expect(screen.queryByText("Fotografia ilustrativa")).toBeNull();
    });
  });

  describe("3. Pipeline de Imagem com <picture> e Art Direction", () => {
    it("renderiza elemento <picture> com sources responsivas e imagem LCP", () => {
      const { container } = render(<Hero />);

      const picture = container.querySelector("picture");
      expect(picture).toBeInTheDocument();

      const mobileSource = container.querySelector("source[media='(max-width: 768px)']");
      expect(mobileSource).toBeInTheDocument();

      const img = container.querySelector("img.hero-photo-cinematic");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("fetchpriority", "high");
      expect(img).toHaveAttribute("loading", "eager");
    });

    it("não renderiza hero-light-flare quando o perfil tem flare.enabled === false", () => {
      const configEquipe: HeroConfig = {
        ...defaultHeroConfig,
        profile: "oficina-equipe",
        isIllustrative: false,
      };

      const { container } = render(<AnimatedHero config={configEquipe} description="Teste" />);
      const flare = container.querySelector(".hero-light-flare");
      expect(flare).toBeNull();
    });

    it("renderiza hero-light-flare quando o perfil tem flare.enabled === true", () => {
      const configCarro: HeroConfig = {
        ...defaultHeroConfig,
        profile: "veiculo-inteiro",
        isIllustrative: true,
      };

      const { container } = render(<AnimatedHero config={configCarro} description="Teste" />);
      const flare = container.querySelector(".hero-light-flare");
      expect(flare).toBeInTheDocument();
    });
  });

  describe("4. Resolução de Variáveis CSS e Injeção Dinâmica", () => {
    it("gera variáveis CSS consistentes com o perfil selecionado", () => {
      const vars = getHeroStyleVariables(defaultHeroConfig);
      expect(vars["--hero-object-position" as keyof typeof vars]).toBe("center 48%");
      expect(vars["--hero-transform-origin" as keyof typeof vars]).toBe("75% 50%");
      expect(vars["--hero-flare-angle" as keyof typeof vars]).toBe("115deg");
      expect(vars["--hero-flare-opacity" as keyof typeof vars]).toBe("0.32");
    });

    it("gera variáveis adaptadas para o perfil detalhe-lataria", () => {
      const config: HeroConfig = {
        ...defaultHeroConfig,
        profile: "detalhe-lataria",
      };
      const vars = getHeroStyleVariables(config);
      expect(vars["--hero-object-position" as keyof typeof vars]).toBe("center center");
      expect(vars["--hero-transform-origin" as keyof typeof vars]).toBe("60% 50%");
      expect(vars["--hero-flare-angle" as keyof typeof vars]).toBe("120deg");
      expect(vars["--hero-flare-opacity" as keyof typeof vars]).toBe("0.25");
      expect(vars["--hero-flare-width" as keyof typeof vars]).toBe("70%");
    });

    it("aplica sobrescritas pontuais customProfiles preservando o restante do preset", () => {
      const config: HeroConfig = {
        ...defaultHeroConfig,
        profile: "detalhe-lataria",
        customProfiles: {
          "detalhe-lataria": {
            flare: {
              enabled: true,
              top: 20,
              left: 10,
              width: 80,
              height: 40,
              angle: 135,
              maxOpacity: 0.28,
            },
          },
        },
      };

      const resolved = resolveHeroProfile(config);
      expect(resolved.flare.angle).toBe(135);
      expect(resolved.flare.maxOpacity).toBe(0.28);
      expect(resolved.flare.width).toBe(80);
      expect(resolved.composition.desktop.transformOrigin).toBe("60% 50%"); // herdado do preset base
    });
  });

  describe("5. Prova de Conceito: Simulação de Troca de Foto e Perfis (Seção 8)", () => {
    const mockImageSwapConfig: HeroConfig = {
      profile: "detalhe-lataria",
      isIllustrative: false,
      image: {
        desktop: {
          src: "/assets/test-real-workshop-lataria.webp",
          width: 2560,
          height: 1440,
        },
        mobile: {
          src: "/assets/test-real-workshop-lataria-mobile.webp",
          width: 1200,
          height: 1600,
        },
        alt: "Close técnico de pintura espelhada na cabine de repintura",
        decorative: false,
      },
    };

    it("comporta-se perfeitamente com nova imagem no perfil detalhe-lataria", () => {
      const { container } = render(
        <AnimatedHero config={mockImageSwapConfig} description="Teste" />,
      );
      const img = container.querySelector("img.hero-photo-cinematic");
      expect(img).toHaveAttribute("src", "/assets/test-real-workshop-lataria.webp");
      expect(img).toHaveAttribute(
        "alt",
        "Close técnico de pintura espelhada na cabine de repintura",
      );

      // Flare deve estar presente com valores do perfil detalhe-lataria
      const flare = container.querySelector(".hero-light-flare");
      expect(flare).toBeInTheDocument();
    });

    it("ao trocar para oficina-equipe com foto real, suprime o flare e o selo ilustrativo", () => {
      const equipeSwapConfig: HeroConfig = {
        ...mockImageSwapConfig,
        profile: "oficina-equipe",
        isIllustrative: false,
      };

      const { container } = render(<AnimatedHero config={equipeSwapConfig} description="Teste" />);
      // Sem flare
      expect(container.querySelector(".hero-light-flare")).toBeNull();
      // Sem selo ilustrativo no container principal Hero
      const heroRender = render(<Hero config={equipeSwapConfig} />);
      expect(heroRender.queryByText("Fotografia ilustrativa")).toBeNull();
    });
  });

  describe("SPEC-069: Pipeline de Imagem Responsiva, Intrínsecos e Preload Casado", () => {
    it("AC-069-01: popula avifSrcSet, webpSrcSet e sizes no perfil padrão (desktop e mobile)", () => {
      const { desktop, mobile } = defaultHeroConfig.image;

      for (const variant of [desktop, mobile]) {
        expect(variant.avifSrcSet).toContain(".avif");
        expect(variant.avifSrcSet).toMatch(/\b\d+w/);
        expect(variant.webpSrcSet).toContain(".webp");
        expect(variant.webpSrcSet).toMatch(/\b\d+w/);
        expect(variant.sizes).toBe("100vw");
      }

      // Os srcset de AVIF e WebP devem conter o mesmo conjunto de larguras
      const widths = (set: string) =>
        set
          .split(",")
          .map((entry) => entry.trim().split(" ")[1])
          .sort();
      expect(widths(desktop.avifSrcSet!)).toEqual(widths(desktop.webpSrcSet!));
    });

    it("AC-069-01: o <picture> renderiza sources AVIF e WebP com srcset e sizes", () => {
      const { container } = render(<Hero />);

      const avifSource = container.querySelector("source[type='image/avif']");
      const webpSource = container.querySelector("source[type='image/webp']");
      expect(avifSource).toBeInTheDocument();
      expect(webpSource).toBeInTheDocument();
      expect(avifSource).toHaveAttribute("srcset", expect.stringContaining(".avif"));
      expect(webpSource).toHaveAttribute("srcset", expect.stringContaining(".webp"));
      expect(avifSource).toHaveAttribute("sizes", "100vw");

      const img = container.querySelector("img.hero-photo-cinematic");
      expect(img).toHaveAttribute("sizes", "100vw");
    });

    it("AC-069-03: as dimensões intrínsecas refletem a resolução real do asset (1280×720 / 900×964)", () => {
      expect(defaultHeroConfig.image.desktop.width).toBe(1280);
      expect(defaultHeroConfig.image.desktop.height).toBe(720);
      expect(defaultHeroConfig.image.mobile.width).toBe(900);
      expect(defaultHeroConfig.image.mobile.height).toBe(964);

      // Recorte mobile é retrato (art direction), portanto mais alto que o desktop
      const desktopRatio =
        defaultHeroConfig.image.desktop.width / defaultHeroConfig.image.desktop.height;
      const mobileRatio =
        defaultHeroConfig.image.mobile.width / defaultHeroConfig.image.mobile.height;
      expect(mobileRatio).toBeLessThan(desktopRatio);
    });

    it("AC-069-02: o preload de LCP usa imagesrcset + imagesizes com type image/avif", () => {
      const preload = getHeroLcpPreload(defaultHeroConfig);

      expect(preload.rel).toBe("preload");
      expect(preload.as).toBe("image");
      expect(preload.type).toBe("image/avif");
      expect(preload.fetchPriority).toBe("high");
      expect(preload.imageSrcSet).toContain(".avif");
      expect(preload.imageSizes).toBe("100vw");
      expect(preload.href).toBeUndefined();
    });

    it("AC-069-02: o preload cai para href quando não há avifSrcSet (compatibilidade)", () => {
      const legacyConfig: HeroConfig = {
        ...defaultHeroConfig,
        image: {
          ...defaultHeroConfig.image,
          desktop: {
            src: "/assets/brs-hero.jpg",
            width: 1920,
            height: 1088,
          },
        },
      };

      const preload = getHeroLcpPreload(legacyConfig);
      expect(preload.href).toBe("/assets/brs-hero.jpg");
      expect(preload.imageSrcSet).toBeUndefined();
      expect(preload.type).toBeUndefined();
    });
  });
});
