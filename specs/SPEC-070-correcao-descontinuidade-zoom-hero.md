# SPEC-070 — Correção da Descontinuidade ("Pulo") no Zoom do Hero

| Campo    | Valor                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------- |
| ID       | `SPEC-070`                                                                                               |
| Título   | Correção da Descontinuidade ("Pulo") no Zoom do Hero — diagnóstico por medição e continuidade da transform |
| Status   | Approved                                                                                                 |
| Data     | 2026-10-16                                                                                               |
| Autor    | Senior Frontend & Motion Design Engineer (Universal SDD)                                                 |
| Escopo   | Animação de zoom da imagem do Hero (`src/styles.css`) e trava automatizada                                |
| Refs     | SPEC-067 (abertura cinematográfica); SPEC-069 (pipeline de imagem do Hero)                               |

---

## 1. Contexto e Motivação

Na home (`/`), durante o zoom lento da imagem de fundo do Hero, ocorre um "pulinho" visível (salto de escala) em um instante específico. A animação em si funciona; o defeito é a **falta de continuidade** da `transform`.

### Medição (Etapa 0, antes de qualquer alteração)

Amostragem do `transform` computado de `img.hero-photo-cinematic` a cada 50 ms por 30 s, `reducedMotion: "no-preference"`, Playwright Chromium:

- **Desktop 1440×900**: descontinuidade em **t = 10,15 s** — escala **1,0692 → 1,0891** (Δscale **0,0199**, ~10× o limite de 0,002). Coincide exatamente com a adição da classe `hero-intro-complete` na `<section>`.
- **Mobile 390×844**: descontinuidade em **t = 8,85 s** — escala **1,0375 → 1,0450** (Δscale **0,0075**), também no instante da adição de `hero-intro-complete`.
- `document.getAnimations()` no elemento da imagem: **uma única** animação `heroSlowZoom`, `duration` 24 s / 20 s, `delay` **0**, `fill: forwards`.
- Sem erros de console.

### Causa-raiz

`src/styles.css:1203-1206` redefine a animação do zoom sob a classe de estado:

```css
.hero-intro-complete .hero-photo-cinematic {
  animation: heroSlowZoom var(--hero-cinematic-zoom-dur, 24s) cubic-bezier(0.25, 1, 0.5, 1) 0s forwards;
}
```

Quando o estado React `introComplete` torna-se `true` (ao fim da abertura, ~t=7 s + hidratação, ou antecipadamente por interação), a `<section>` recebe `hero-intro-complete`. Essa regra **altera o `animation-delay` de 4,2 s (desktop) / 3 s (mobile) para 0 s** numa animação em execução. Alterar o `animation-delay` de uma animação CSS em curso **remapeia sua linha do tempo** — a escala é recalculada instantaneamente para o novo tempo decorrido, produzindo o salto de posição/escala observado.

### Fator secundário

A `animation-timing-function` `cubic-bezier(0.25, 1, 0.5, 1)` é fortemente carregada no início e produz, por si só, deltas de escala > 0,002 entre amostras de 50 ms (medidos até ~0,0075), o que caracteriza descontinuidade de velocidade segundo o critério de aceite.

---

## 2. Princípios e Diretrizes (a verificar contra a causa)

1. O zoom deve ser **uma única** animação de `transform`, com keyframe inicial e final no mesmo elemento, sem redefinição por mudança de estado/classe.
2. Easing contínuo, sem mudança abrupta de velocidade (`cubic-bezier(0.25, 0.1, 0.25, 1)`).
3. `animation-fill-mode: forwards` — escala final mantida.
4. Elemento promovido a camada própria durante toda a vida (`will-change: transform` **não** removido; `translate3d(0,0,0)`, `backface-visibility: hidden`).
5. Não animar `object-position`, `width`, `height`, `top`, `left` ou `margin`.
6. Não alterar textos, imagem, tempos de entrada, CTAs ou outras seções.

---

## 3. Escopo

### No escopo

- Correção da continuidade do zoom em `src/styles.css` (keyframes, easing, `backface-visibility` e remoção da redefinição por estado).
- Trava automatizada (Vitest) lendo `src/styles.css`.

### Fora do escopo

- Troca de imagem, textos, overlays, reflexo, tempos de entrada e demais seções/rotas.
- Alteração do mecanismo de estado (`hero-cinematic-state`) ou dos gatilhos de antecipação.

---

## 4. Critérios de Aceite

- **AC-070-01**: em 30 s de amostragem a 50 ms, **nenhuma** variação de escala > 0,002 nem de translate > 1 px, no desktop e no mobile.
- **AC-070-02**: a escala final (1,10 desktop / 1,05 mobile) é mantida até o fim da vida (`fill: forwards`); `document.getAnimations()` expõe uma única animação de `transform` no elemento da imagem.
- **AC-070-03**: `prefers-reduced-motion: reduce` mantém a composição estática e visível.
- **AC-070-04**: ausência de erros de console/hidratação.
- **AC-070-05**: `bun run lint`/`test`/`build` sem novas falhas.

---

## 5. Abordagem Técnica

- `@keyframes heroSlowZoom`: `translate3d(0,0,0) scale(1)` → `translate3d(0,0,0) scale(var(--hero-cinematic-zoom-scale))`.
- `.hero-photo-cinematic`: easing `cubic-bezier(0.25, 0.1, 0.25, 1)`, `backface-visibility: hidden`, mantendo `will-change: transform` e `forwards`.
- **Remover** a regra `.hero-intro-complete .hero-photo-cinematic` (causa-raiz).
- Teste Vitest garantindo as invariantes acima no CSS.

---

## 6. Aprovação

| Papel      | Nome                                           | Decisão  | Data       | Notas                                |
| ---------- | ---------------------------------------------- | -------- | ---------- | ------------------------------------ |
| Engenharia | Senior Frontend & Motion Design Engineer (SDD) | Approved | 2026-10-16 | Instrução humana explícita (bugfix)  |
