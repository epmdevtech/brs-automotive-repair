# TASK-067-01 — Implementar Hero com Abertura Cinematográfica, Zoom Lento e Reflexo de Luz

| Campo       | Valor                                                    |
| ----------- | -------------------------------------------------------- |
| ID          | `TASK-067-01`                                            |
| SPEC        | `SPEC-067`                                               |
| Status      | Completed                                                |
| Data        | 2026-10-16                                               |
| Responsável | Senior Frontend & Motion Design Engineer (Universal SDD) |

---

## 1. Objetivo

Implementar no Hero da página inicial uma sequência de abertura cinematográfica estrita, com entrada suave dos elementos de UI, clareamento do veículo, início de zoom lento após a revelação total da UI e passagem única de um reflexo de luz sobre a lataria, garantindo compatibilidade SSR, acessibilidade WCAG, interatividade ininterrupta e performance LCP.

---

## 2. Passos de Execução Realizados

1. **Variáveis e Animações CSS (`src/styles.css`)**:
   - Centralizadas todas as variáveis de tempo desktop e mobile no `:root` (`--hero-cinematic-header-delay`, `--hero-cinematic-zoom-dur`, `--hero-cinematic-flare-dur`, etc.).
   - Criados keyframes dedicados sem sobreposição de engines: `@keyframes heroFadeUp`, `@keyframes heroFadeIn`, `@keyframes heroHeaderDrop`, `@keyframes heroSlowZoom` e `@keyframes heroFlareSweep`.
   - Implementadas classes de camadas: `.hero-photo-cinematic`, `.hero-light-flare`, `.hero-overlay-cinematic` e seletores sequenciais `.hero-intro-*`.
   - Adicionadas regras para `.hero-intro-complete` e suporte pleno a `@media (prefers-reduced-motion: reduce)`.

2. **Refatoração do Componente Hero (`src/components/brs/hero.tsx` & `src/components/brs/animated-hero.tsx`)**:
   - Ajustado H1 com `text-wrap: balance` e espaços inseparáveis em "martelinho\u00a0de\u00a0ouro" e "pintura\u00a0em\u00a0estufa".
   - Unificada a terminologia técnica de "cabine" para "estufa" na descrição do serviço.
   - Preservado o CTA primário canônico `/contato` com suporte adicional a CTA secundário de ligação com o telefone oficial `(45) 2035-9440`.
   - Aumentado o tamanho e contraste do microdado "Fotografia ilustrativa" e endereço/horário na barra inferior de viewport.
   - Inserida camada decorativa de reflexo de luz única (`hero-light-flare`) entre a foto e o overlay de legibilidade (Camada 2).
   - Gerenciada flag volátil de módulo em `src/lib/hero-cinematic-state.ts` com antecipação precoce (`click`, `wheel`, `touchstart`, `keydown`) e Page Visibility API.

3. **Ajuste do Header Global (`src/components/brs/header.tsx`)**:
   - Aplicada a animação de entrada `header-cinematic-intro` apenas na rota inicial (`/`) na primeira visita.
   - Sincronização via CustomEvent `brs:hero-intro-skip` e flag de módulo em navegações internas via SPA.

4. **Testes Automatizados e E2E**:
   - Criada suíte dedicada `src/test/hero-cinematic-opening-spec067.test.tsx` com 7 testes unitários/integração cobrindo todas as camadas, reduções e interatividade precoce.
   - Criada suíte Playwright `e2e/hero-cinematic.spec.ts` validando visualmente sequenciamento desktop, mobile, reduced-motion e ausência de erros de console/hidratação.

---

## 3. Evidências de Validação

- **Linter (`bun run lint`)**: Aprovado com 0 erros (7 avisos pré-existentes de componentes UI).
- **Testes Unitários / Integração (`bun vitest run`)**: 55 arquivos de teste e mais de 390 testes executados com 100% de aprovação.
- **Testes E2E (`bun x playwright test e2e/hero-cinematic.spec.ts`)**: 3 testes aprovados em 31.2s.
- **Compilação / Build (`bun run build`)**: Vite + Nitro SSR finalizado com sucesso em 1.91s sem avisos críticos.
