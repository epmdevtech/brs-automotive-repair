# REVIEW-069 — Revisão de Engenharia: Pipeline de Imagem Responsiva do Hero (AVIF/WebP + srcset/sizes) e Baseline Visual

| Campo   | Valor                                                    |
| ------- | -------------------------------------------------------- |
| SPEC    | `SPEC-069`                                               |
| TASK    | `TASK-069-01`                                            |
| Data    | 2026-10-16                                               |
| Status  | Aprovado                                                 |
| Revisor | Senior Frontend & Motion Design Engineer (Universal SDD) |

---

## 1. Resumo da Implementação

A `SPEC-069` fechou as lacunas residuais da `SPEC-068` no pipeline de imagem do Hero, sem tocar em animação, tempos, SSR, reduced-motion ou flag de execução única.

### Destaques:

- **Variantes reais geradas sem novas dependências**: `public/hero/hero-{960,1280,1920}.{avif,webp}` geradas por CLI (ImageMagick `convert`). Redução de peso do LCP: **AVIF 1920w ≈ 59 KB** contra **JPG original ≈ 186 KB** (−68%).
- **Intrínsecos verídicos**: `defaultHeroConfig` corrigido para `1920×1088` (desktop) e `1280×725` (mobile), coerentes com o asset real `src/assets/brs-hero.jpg`; proporção 16:9 unificada, eliminando reserva de layout incorreta.
- **Pipeline responsivo real**: `<picture>` emite `<source type="image/avif">`, `<source type="image/webp">` e fallback JPG com `srcSet` (descritores `w`) e `sizes="100vw"`.
- **Preload de LCP casado (`getHeroLcpPreload`)**: `<link rel="preload" as="image" type="image/avif" imageSrcSet=... imageSizes="100vw" fetchPriority="high">`. Verificado no Chromium: `img.currentSrc` = `/hero/hero-1280.avif` e **exatamente 1 request de imagem do Hero**, sem duplo download AVIF+JPG.
- **Trava anti-regressão visual**: baseline Playwright versionado (desktop, mobile, reduced-motion) e evidência temporal 0/5/6/10 s.

---

## 2. Arquivos Criados e Modificados

| Arquivo | Natureza | Descrição |
| --- | --- | --- |
| `specs/SPEC-069-pipeline-imagem-responsiva-hero-avif-webp-baseline-visual.md` | Novo | Especificação de requisitos aprovada |
| `tasks/TASK-069-01-pipeline-imagem-responsiva-hero-avif-webp-baseline-visual.md` | Novo | Plano de tarefas |
| `src/lib/hero-config.ts` | Modificado | `HeroImageVariant` com `avifSrcSet`/`webpSrcSet`/`srcSet`/`sizes`; intrínsecos reais; `HeroLcpPreload` + `getHeroLcpPreload` |
| `src/components/brs/animated-hero.tsx` | Modificado | `<picture>` com `srcset`/`sizes` em AVIF/WebP/fallback |
| `src/routes/index.tsx` | Modificado | Preload via `getHeroLcpPreload(defaultHeroConfig)` |
| `src/test/hero-config.test.tsx` | Modificado | +5 testes (SPEC-069): srcset/sizes, intrínsecos, preload |
| `e2e/hero-visual-baseline.spec.ts` + `…-snapshots/` | Novo | Baseline visual + evidência temporal |
| `public/hero/*.avif`, `public/hero/*.webp` | Novo | Variantes responsivas versionadas |
| `docs/guia-troca-foto-hero.md` | Modificado | Geração CLI, pesos medidos e regras de calibração |
| `scripts/generate_traceability.py` | Modificado | Correção do vínculo TASK→SPEC pela linha de metadado `SPEC` |
| `docs/traceability-matrix.md` | Regenerado | Registro da SPEC-069 e reconciliação SPEC-067/068 |
| `PROJECT.md` | Modificado | Registro canônico da SPEC-069 |

---

## 3. Evidências de Qualidade e Gates (execuções reais)

1. **Linter** — `bun run lint`: **0 erros** (7 warnings `react-refresh` pré-existentes).
2. **Testes unitários** — `bun run test`: **415 aprovados / 416**; a única falha é o teste flaky pré-existente `booking-status-ux.test.tsx` (SPEC-052), que **passa isolado** e não guarda relação com esta mudança. Os testes de Hero (`hero-config.test.tsx`, `hero-cinematic-opening-spec067.test.tsx`): **26/26**.
3. **Build** — `bun run build`: cliente + SSR Nitro compilados sem erros.
4. **Playwright baseline** — `hero-visual-baseline.spec.ts`: **6/6 aprovados** (comparação antes/depois sem regressão no perfil `veiculo-inteiro`).
5. **Playwright cinematográfico** — `hero-cinematic.spec.ts`: **3/3 aprovados** (SSR, mobile, reduced-motion).
6. **Verificação de preload** — script Chromium: 1 request de Hero (AVIF), `currentSrc` AVIF.

---

## 4. Itens Fora do Escopo (pendentes)

1. **Fotografia real da oficina**: substituir a imagem ilustrativa seguindo o guia atualizado.
2. **`og:image`/`twitter:image`**: atualizar junto com a foto definitiva.
3. **Domínio dos metadados**: `og:url`/canonical ainda podem apontar para `http://brs.localhost` em contexto de desenvolvimento.
4. **Rastreabilidade da SPEC-068**: a lacuna histórica (commits de hotfix com `Task-Ref: TASK-068-02` inexistente) permanece; recomenda-se reconciliar em tarefa dedicada.
5. **Commit/push da SPEC-069**: pendente de `Task-Ref: TASK-069-01` (a matriz registra a lacuna enquanto não houver commit).
