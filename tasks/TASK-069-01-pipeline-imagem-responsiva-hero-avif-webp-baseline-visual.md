# TASK-069-01 — Pipeline AVIF/WebP com srcset/sizes, Preload Casado e Baseline Visual do Hero

| Campo       | Valor                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| ID          | `TASK-069-01`                                                           |
| SPEC        | `SPEC-069`                                                             |
| Status      | Completed                                                              |
| Data        | 2026-10-16                                                             |
| Responsável | Senior Frontend & Motion Design Engineer (Universal SDD)               |

---

## 1. Objetivo

Materializar os formatos modernos (AVIF/WebP) e a responsividade real do pipeline de imagem do Hero (`srcset`/`sizes`), corrigir os metadados intrínsecos do asset, alinhar o preload de LCP ao candidato escolhido pelo `<picture>` e adicionar uma trava anti-regressão visual Playwright — sem tocar em animação, tempos, SSR, reduced-motion ou flag de execução única.

---

## 2. Passos de Execução

1. **Captura de baseline visual "before"**:
   - Criar `e2e/hero-visual-baseline.spec.ts` (desktop, mobile, reduced-motion).
   - Gerar snapshots de referência a partir do estado atual (pré-mudança) via `--update-snapshots`.

2. **Geração de variantes (sem novas dependências)**:
   - Gerar `public/hero/hero-1920.{avif,webp}`, `hero-1280.{avif,webp}` e `hero-960.{avif,webp}` a partir de `src/assets/brs-hero.jpg` com ImageMagick (`convert`).
   - Registrar pesos reais.

3. **Extensão da configuração (`src/lib/hero-config.ts`)**:
   - Adicionar `avifSrcSet`, `webpSrcSet`, `srcSet`, `sizes` a `HeroImageVariant`.
   - Ajustar dimensões intrínsecas (desktop `1920×1088`; mobile `1280×725`).
   - Popular `avifSrc`/`webpSrc` e os `srcset`.
   - Adicionar `getHeroLcpPreload(config)`.

4. **Componente (`src/components/brs/animated-hero.tsx`)**:
   - Emitir `srcSet`/`sizes` nos `<source>` AVIF/WebP e no fallback, preservando `fetchPriority`, `loading` e `decoding`.

5. **Rota (`src/routes/index.tsx`)**:
   - Substituir o preload direto por `getHeroLcpPreload(defaultHeroConfig)`.

6. **Testes**:
   - Estender `src/test/hero-config.test.tsx` com invariantes de `srcset`/`sizes`/intrínsecos/preload.
   - Playwright: capturas temporais 0/5/6/10 s (evidência) e comparação de baseline settled por viewport.

7. **Quality Gates**:
   - `bun run lint`, `bun run test`, `bun run build` e Playwright.

---

## 3. Escopo

### Incluído

- Pipeline AVIF/WebP + `srcset`/`sizes`, preload casado, intrínsecos corretos, baseline visual, testes e documentação.

### Excluído

- `og:image`/domínio dos metadados, troca da foto real, animação/tempos/ordem e demais rotas.

---

## 4. Validação

| Critério/risco | Teste, comando ou revisão | Evidência esperada |
| -------------- | ------------------------- | ------------------ |
| AC-069-01/02/03 | Vitest `hero-config.test.tsx` | Asserções de `srcset`/`sizes`/intrínsecos/preload aprovadas |
| AC-069-05 | Playwright `hero-visual-baseline.spec.ts` | Baseline settled sem divergência relevante |
| AC-069-06 | Playwright `hero-cinematic.spec.ts` | Sequence/SSR/reduced-motion aprovados |
| AC-069-07 | `bun run lint` / `test` / `build` | Lint 0 erros; testes e build aprovados |

---

## 5. Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis aprovados.
- [x] Documentação e rastreabilidade atualizadas.
- [x] Limitações e desvios registrados.

---

## 6. Evidências de Validação

- **Variantes geradas** (`public/hero/`): AVIF 1920w ≈ 59 KB / 1280w ≈ 34 KB / 960w ≈ 23 KB; WebP 1920w ≈ 79 KB / 1280w ≈ 44 KB / 960w ≈ 28 KB. JPG fallback original ≈ 186 KB.
- **Preload casado (Chromium, viewport 1280)**: `<link rel="preload" as="image" type="image/avif" imagesrcset/ imagesizes="100vw">`; `img.currentSrc = /hero/hero-1280.avif`; **1 request** de imagem do Hero (sem duplo download).
- **Vitest**: `hero-config.test.tsx` + `hero-cinematic-opening-spec067.test.tsx` = 26/26. Suíte completa: 415 aprovados / 416 (única falha é flaky pré-existente de `booking-status-ux.test.tsx`, passa isolado).
- **Playwright**: `hero-visual-baseline.spec.ts` 6/6 (baseline before/after sem regressão); `hero-cinematic.spec.ts` 3/3.
- **`bun run lint`**: 0 erros (7 warnings pré-existentes).
- **`bun run build`**: cliente + SSR sem erros.
- **Desvio registrado**: commit/push pendente (a matriz sinaliza `TASK-069-01` sem commit até que o trailer `Task-Ref: TASK-069-01` seja criado).
