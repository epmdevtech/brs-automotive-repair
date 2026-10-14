# REVIEW-036 — Validação do Motion Engine (Lenis + GSAP ScrollTrigger), Componentes Interativos e Transições Suaves de Página

## 1. Metadados

| Campo   | Valor                                                                               |
| ------- | ----------------------------------------------------------------------------------- |
| SPEC    | [`SPEC-036`](../specs/SPEC-036-awwwards-motion-engine-transitions.md)               |
| TASK    | [`TASK-036-01`](../tasks/TASK-036-01-awwwards-motion-engine-transitions.md)         |
| Data    | 2026-10-14                                                                          |
| Status  | Aprovado (100% dos Quality Gates Cumpridos)                                         |
| Revisor | Quality Gate Lead & Awwwards Motion Auditor                                         |

---

## 2. Sumário da Entrega

Implementação e validação integral dos padrões normativos de engenharia de movimento e transições suaves de página Awwwards Site of the Day:

1. **Motion Engine com Relógio Único (Lenis + GSAP ScrollTrigger)**:
   - Lenis ativo globalmente em todas as rotas em `SmoothScrollProvider` e sincronizado com `gsap.ticker.add((time) => lenis.raf(time * 1000))` e `gsap.ticker.lagSmoothing(0)`.
   - `ScrollTrigger.refresh()` disparado sincronamente nas transições entre páginas no hook de rota para recalcular posições geométricas de pin e gatilhos.
2. **Contadores Numéricos Animados (`NumericCounter`)**:
   - Criação do componente `NumericCounter` com aceleração suave por GSAP ScrollTrigger (`start: "top 90%"`, `once: true`, `onEnter`).
   - Números tabulares sem jitter de layout (`font-mono` / `tabular-nums`).
   - Acessibilidade: `aria-label` fixo com o valor final anunciado a leitores de tela e valor completo disponível no HTML para bots, crawlers e SSR.
   - Integrado nos passos de `ProcessTimeline` (`01` a `04`), pilares de `Philosophy`, cartões de `HomePathways`, estudos de caso de `ProjectGallery` e seções institucionais de `/sobre` e `/para-corretores`.
3. **Imagens com Parallax Sutil (`ParallaxImage`)**:
   - Componente `ParallaxImage` acionado por GSAP ScrollTrigger com scrub contínuo (`scrub: 1`), transladando suavemente a imagem interna entre `-6%` e `+6%`.
   - Container com `overflow-hidden` evitando qualquer transbordamento ou layout shift.
   - Integrado nas especialidades automotivas de `Services` (`/servicos`).
4. **Antes e Depois Interativo (`BeforeAfterSlider`)**:
   - Slider com arrasto suave por mouse/toque (`setPointerCapture`), controles completos por teclado (Setas, PageUp/Down, Home, End), badges de antes/depois com opacidade fluida e affordance visual.
   - Totalmente funcional e integrado na Home (`HomeBeforeAfter`) e na galeria de trabalhos (`ProjectGallery`).
5. **Microinterações Refinadas de Hover e Transições de Página**:
   - Bordas hairline iluminadas em dourado automotivo (`primary/40` e `shadow-primary/5`), translações do ícone de seta (`ArrowUpRight`) e feedback no `:active` dos botões.
   - Transição fluida de rotas em `PageTransition` eliminando qualquer quebra ou tela branca durante a navegação, com varredura laser superior dourada transitória.
6. **Acessibilidade Normativa (WCAG 2.1 AA / prefers-reduced-motion)**:
   - Desativação imediata do scroll suave, do parallax e das animações de contadores sob `prefers-reduced-motion`, exibindo instantaneamente o estado final estável e legível.

---

## 3. Evidências dos Quality Gates

- **Testes Unitários e de Integração (Vitest)**:
  - 29 arquivos de teste executados.
  - 203 testes passando com 100% de sucesso.
- **Linter (ESLint + Prettier)**:
  - 0 erros em todo o repositório.
- **Build de Produção (Vite + Nitro SSR)**:
  - Compilação concluída com sucesso em 1.87s (`.output/server` e `.output/public`).
- **Verificação das Rotas Locais (HTTP 200 OK na porta 5210)**:
  - `http://localhost:5210/` (Home) -> HTTP 200
  - `http://localhost:5210/servicos` -> HTTP 200
  - `http://localhost:5210/trabalhos` -> HTTP 200
  - `http://localhost:5210/sobre` -> HTTP 200
