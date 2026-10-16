# REVIEW-070 — Correção da Descontinuidade ("Pulo") no Zoom do Hero

| Campo          | Valor                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| ID             | `REVIEW-070`                                                               |
| SPEC/TASK      | `SPEC-070` / `TASK-070-01`                                                 |
| Status         | Approved                                                                   |
| Data           | 2026-10-16                                                                 |
| Revisor        | Senior Frontend & Motion Design Engineer (Universal SDD)                   |
| Evidências     | `/tmp/opencode/zoom-measure*.json`, `/tmp/opencode/zoom-proof/*.png`        |

---

## 1. Sumário

O "pulinho" no zoom do Hero foi eliminado. A causa-raiz — redefinição da animação `heroSlowZoom` sob `.hero-intro-complete` (que alterava o `animation-delay` de 4,2 s/3 s para 0 s e remapeava a linha do tempo de uma animação em curso) — foi removida, o easing passou a ser contínuo e o elemento foi promovido a camada própria. Uma trava Vitest impede a reintrodução do defeito.

---

## 2. Diagnóstico (Etapa 0 — antes da correção)

Amostragem do `transform` de `img.hero-photo-cinematic` a cada 50 ms por 30 s (Playwright Chromium, `reducedMotion: "no-preference"`):

| Viewport | Instante | Escala antes → depois | Δscale |
| -------- | -------- | --------------------- | ------ |
| Desktop 1440×900 | t = 10,15 s (adição de `hero-intro-complete`) | 1,0692 → 1,0891 | **0,0199** |
| Mobile 390×844 | t = 8,85 s (adição de `hero-intro-complete`) | 1,0375 → 1,0450 | **0,0075** |

`document.getAnimations()`: uma única animação `heroSlowZoom` (dur 24 s/20 s), `delay` **0**, `fill: forwards`. Sem erros de console.

---

## 3. Correção Aplicada

Arquivo `src/styles.css`:

1. `@keyframes heroSlowZoom` → `translate3d(0,0,0) scale(1)` / `translate3d(0,0,0) scale(var(--hero-cinematic-zoom-scale))`.
2. `.hero-photo-cinematic` → `animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1)`, `backface-visibility: hidden` (mantidos `will-change: transform` e `forwards`).
3. **Removida** a regra `.hero-intro-complete .hero-photo-cinematic` (causa-raiz).

Novo teste: `src/test/hero-zoom-continuity.test.tsx` (3 casos) lendo o CSS.

---

## 4. Evidências de Validação (Etapa 4 — depois da correção)

| Critério | Resultado |
| -------- | --------- |
| **Continuidade** (delta em amostras com `currentTime` adjacente ≤20 ms) | Desktop **0,000040** · Mobile **0,000030** (limite 0,002) — 466/444 pares verificados |
| Troca de classe `hero-intro-complete` | Desktop Δscale **0,0016** · Mobile **0,0000** (limite 0,002) |
| Zoom = uma única animação, delay preservado | `heroSlowZoom` delay **4200 ms** (desktop) / **3000 ms** (mobile), `fill: forwards` |
| Escala final mantida (não retorna a 1,00) | Desktop **1,10** · Mobile **1,05** em t=30 s |
| `prefers-reduced-motion: reduce` | `transform: none`, `opacity: 1`, visível, **0** animações |
| Erros de console/hidratação | **0** |
| `bun run lint` | 0 erros, 7 warnings pré-existentes |
| `bun run test` | Nova trava 3/3; 2 timeouts flaky pré-existentes (`booking-admin-grid`, `booking-status-ux`) passam isolados |
| `bun run build` | OK (`✓ built in 3.59s`) |

Capturas em `/tmp/opencode/zoom-proof/`: desktop/mobile t=0/5/10/20/30 s e reduced-motion.

---

## 5. Notas sobre a medição

No desktop (dev server com HMR) houve stalls de main thread (intervalo entre amostras de até ~760 ms), fazendo a escala amostrada ficar "parada" e depois "pular" — artefato de amostragem, não descontinuidade visual. A verificação decisiva foi feita no tempo da própria animação (`currentTime`): para amostras adjacentes, a escala evolui de forma contínua, com delta máximo 4,0×10⁻⁵. O transform roda no compositor; sem redefinição de animação, o comportamento visual é contínuo.

---

## 6. Decisão

**Approved.** Atende a todos os critérios de aceite da SPEC-070. Defeito corrigido na causa (não no sintoma), com prova quantitativa e trava automatizada.
