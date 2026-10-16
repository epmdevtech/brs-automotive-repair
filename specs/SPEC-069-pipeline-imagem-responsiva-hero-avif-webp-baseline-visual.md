# SPEC-069 — Pipeline de Imagem Responsiva do Hero (AVIF/WebP + srcset/sizes) e Baseline Visual Playwright

| Campo       | Valor                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ID          | `SPEC-069`                                                                                                                           |
| Título      | Pipeline de Imagem Responsiva do Hero (AVIF/WebP + srcset/sizes) e Baseline Visual Playwright                                        |
| Status      | Approved                                                                                                                             |
| Data        | 2026-10-16                                                                                                                           |
| Autor       | Senior Frontend & Motion Design Engineer (Universal SDD)                                                                             |
| Escopo      | Pipeline de imagem do Hero da página inicial (`/`), `src/lib/hero-config.ts`, `<picture>` em `animated-hero.tsx`, preload em `src/routes/index.tsx`, e2e visual, guia e testes |
| Refs        | SPEC-067 (abertura cinematográfica); SPEC-068 (desacoplamento da foto e configuração centralizada)                                   |

---

## 1. Contexto e Motivação

A `SPEC-068` desacoplou a animação do Hero da fotografia, centralizando enquadramento, overlay, reflexo e aviso de ilustrativa em `src/lib/hero-config.ts`, e introduziu o elemento `<picture>` com art direction. Entretanto, a entrega parou no mínimo funcional:

1. **Formatos modernos não concretizados**: os campos `avifSrc`/`webpSrc` existem na tipagem, mas nunca foram populados. O Hero serve apenas o JPG original. Não há `<source>` de AVIF/WebP em produção.
2. **Sem `srcset`/`sizes` responsivos**: o `<picture>` referencia um único arquivo por breakpoint, sem descritores de largura nem dica `sizes`, obrigando o navegador a baixar uma resolução única para qualquer viewport.
3. **Metadados intrínsecos incorretos (risco de CLS e de reflow de LCP)**: a configuração declara `desktop 2560×1440` e `mobile 1280×1600`, mas o asset real `src/assets/brs-hero.jpg` é **1920×1088**. A proporção mobile declarada (`4:5`) não corresponde à imagem servida (`16:9`), o que produz um `aspect-ratio` de reserva incorreto.
4. **Preload potencialmente divergente**: o preload aponta para `defaultHeroConfig.image.desktop.src` (JPG). Ao introduzir AVIF/WebP, um navegador que escolha AVIF baixaria o AVIF e o JPG preloadado — dois downloads para o mesmo LCP.
5. **Ausência de trava anti-regressão visual**: não há baseline de screenshot que impeça regressões futuras de enquadramento/overlay/reflexo no perfil padrão.

Esta especificação fecha essas lacunas sem tocar na lógica de animação, tempos, ordem de entrada, SSR, reduced-motion ou flag de execução única.

---

## 2. Princípios Arquiteturais e Diretrizes Estritas

1. **Zero Regressão Visual no Perfil Padrão**: a composição renderizada com o perfil `"veiculo-inteiro"` deve permanecer visualmente idêntica (dentro de tolerância de compressão) ao estado anterior.
2. **Sem Novas Dependências**: nenhuma biblioteca de build/otimização deve ser adicionada. As variantes são geradas por CLI documentada (ImageMagick `convert`, já disponível no ambiente) e versionadas em `public/hero/` para URL estável.
3. **Pipeline Responsivo Real**: o `<picture>` deve emitir `<source>` de AVIF e WebP com `srcset` (descritores `w`) e `sizes`, mantendo o JPG como fallback universal.
4. **Preload Casado com o `<picture>`**: o preload do LCP deve resolver para o mesmo candidato escolhido pelo `<picture>` (`imagesrcset`/`imagesizes` + `type="image/avif"`), evitando download duplicado.
5. **Intrínsecos Verídicos**: `width`/`height` declarados devem corresponder à resolução real das variantes, eliminando CLS e reserva de proporção incorreta.
6. **Arquitetura Centralizada Preservada**: todas as novas dependências de imagem continuam em `src/lib/hero-config.ts`; trocar a foto real segue exigindo apenas configuração.
7. **Compatibilidade Estrita Preservada**: SSR, `prefers-reduced-motion`, skip antecipado por interação, flag de sessão e ausência de erros de hidratação permanecem intactos.
8. **Trava Anti-Regressão Visual**: baseline Playwright por viewport (desktop, mobile, reduced-motion) versionado, com tolerância explícita para diferenças de compressão inter-formatos.

---

## 3. Escopo

### No escopo

- Geração de variantes AVIF/WebP (desktop 1920w e 1280w; mobile 1280w e 960w) a partir de `src/assets/brs-hero.jpg`.
- Extensão de `HeroImageVariant` com `avifSrcSet`, `webpSrcSet`, `sizes` e ajuste das dimensões intrínsecas ao asset real.
- Atualização do `<picture>` em `animated-hero.tsx` com `srcset`/`sizes` para AVIF, WebP e fallback.
- Helper de preload de LCP em `hero-config.ts` e uso em `src/routes/index.tsx`.
- Testes unitários das novas invariantes e baseline visual Playwright `before/after`.
- Atualização do guia operacional, matriz de rastreabilidade e `PROJECT.md`.

### Fora do escopo

- Correção de `og:image`/`twitter:image` e do domínio `brs.localhost` nos metadados (registrado como pendência).
- Substituição da foto ilustrativa por foto real definitiva.
- Qualquer alteração de animação, tempos, ordem de abertura, textos ou outras rotas.
- Instalação de bibliotecas de otimização de imagem.

---

## 4. Requisitos Não-Funcionais

- **Desempenho:** um único download de LCP; AVIF/WebP reduzidos; zero CLS (intrínsecos corretos). A foto-fonte deve ter folga de resolução ≥ 10 % sobre o tamanho exibido para suportar o zoom de 1.10.
- **Acessibilidade:** `alt`/`decorative` inalterados; contraste WCAG AA preservado.
- **Compatibilidade:** fallback JPG para navegadores sem AVIF/WebP.
- **Observabilidade:** relatório de pesos reais dos arquivos gerados.

---

## 5. Critérios de Aceite (Acceptance Criteria)

- **AC-069-01**: `defaultHeroConfig` popula `avifSrcSet`, `webpSrcSet` e `sizes` para desktop e mobile, e o `<picture>` renderiza `<source>` AVIF/WebP com `srcset`/`sizes`.
- **AC-069-02**: o preload do LCP usa `imagesrcset`/`imagesizes` com `type="image/avif"`, resolvendo para o mesmo candidato do `<picture>`.
- **AC-069-03**: `width`/`height` declarados correspondem às dimensões reais (desktop `1920×1088`; mobile `1280×725`).
- **AC-069-04**: nenhuma dependência nova; variantes versionadas em `public/hero/` e geração documentada por CLI.
- **AC-069-05**: baseline visual Playwright capturado antes e comparado depois, sem divergência no perfil `veiculo-inteiro` (desktop, mobile, reduced-motion).
- **AC-069-06**: SSR, reduced-motion, skip antecipado, flag de sessão e ausência de erros de hidratação permanecem verificados.
- **AC-069-07**: `bun run lint`, `bun run test` e `bun run build` sem novas falhas; nenhuma imagem temporária de teste permanece.

---

## 6. Abordagem Técnica

- **Configuração (`src/lib/hero-config.ts`)**: adicionar `avifSrcSet`, `webpSrcSet`, `srcSet` e `sizes` a `HeroImageVariant`; popular o `defaultHeroConfig`; adicionar `getHeroLcpPreload(config)` que devolve o descritor de `<link rel="preload">` correto (AVIF por `imagesrcset`, com fallback para `href`).
- **Componente (`animated-hero.tsx`)**: emitir `srcSet`/`sizes` nos `<source>` de AVIF/WebP e no fallback; preservar `fetchPriority="high"`, `loading="eager"`, `decoding="async"`.
- **Rota (`src/routes/index.tsx`)**: consumir `getHeroLcpPreload(defaultHeroConfig)`.
- **Assets**: gerar variantes via `convert` e versionar em `public/hero/` (URLs estáveis para o preload).
- **Testes**: unitários para invariantes de config e render; Playwright com baseline de screenshot.

---

## 7. Riscos e Dependências

| Risco ou dependência | Impacto | Probabilidade | Mitigação | Responsável |
| -------------------- | ------- | ------------- | --------- | ----------- |
| Diferenças de pixel AVIF vs JPG no baseline | Médio | Alta | Tolerância `maxDiffPixelRatio` documentada | Engenharia |
| Ausência de `sharp`/build-tools de imagem | Baixo | Média | CLI `convert` (ImageMagick) disponível e documentada | Engenharia |
| Preload divergente do `<picture>` | Médio | Baixa | `imagesrcset`/`imagesizes` com `type=image/avif` | Engenharia |
| Suporte de `imageSrcSet` no head do TanStack Start | Médio | Baixa | Verificação no HTML SSR renderizado | Engenharia |

---

## 8. Aprovação

| Papel      | Nome                                             | Decisão  | Data       | Notas                                   |
| ---------- | ------------------------------------------------ | -------- | ---------- | --------------------------------------- |
| Engenharia | Senior Frontend & Motion Design Engineer (SDD)   | Approved | 2026-10-16 | Instrução humana explícita (opção 2)    |
