# TASK-036-01 — Implementação do Motion Engine, Parallax, Contadores e Transições

## Metadados

| Campo         | Valor                                                             |
| ------------- | ----------------------------------------------------------------- |
| Task ID       | `TASK-036-01`                                                     |
| Spec Ref      | `SPEC-036`                                                        |
| Título        | Implementação do Motion Engine, Parallax, Contadores e Transições |
| Status        | Completed                                                         |
| Responsável   | Lead Motion Designer & Interactive Engineer                       |
| Data Início   | 2026-10-14                                                        |
| Data Conclusão| 2026-10-14                                                        |

---

## 1. Escopo de Trabalho

1. **Sincronização e Refresh do Motion Engine (`SmoothScrollProvider`)**:
   - Assegurar inicialização global do Lenis em todas as rotas com sync no ticker do GSAP.
   - Adicionar chamada resiliente de `ScrollTrigger.refresh()` no hook de transição de rota (`useRouterState`) para recalcular offsets dinâmicos.
2. **Contador Numérico Animado (`NumericCounter`)**:
   - Implementar `src/components/ui/numeric-counter.tsx` com GSAP ScrollTrigger para transição fluida de inteiros formatados (ex: `01` a `04` ou contagens métricas) e fallback instantâneo sob `prefers-reduced-motion`.
   - Conectar o contador nas etapas do `ProcessTimeline` na Home e em páginas internas.
3. **Imagens com Parallax Sutil (`ParallaxImage`)**:
   - Implementar `src/components/ui/parallax-image.tsx` acionado por GSAP ScrollTrigger (`scrub: 1` ou `0.8`), transladando suavemente a imagem interna entre `-6%` e `+6%` em relação à viewport.
   - Integrar nas seções de serviços e mídia expandida.
4. **Refinamento do Antes e Depois (`BeforeAfterSlider` & `HomeBeforeAfter`)**:
   - Garantir física de arraste consistente com pointer-events, captura de foco acessível e animação teaser de entrada com teardown limpo.
5. **Microinterações nos Cards de Serviços e Botões**:
   - Estilizar bordas técnicas (`border-white/10` -> `hover:border-primary/40`), sombras douradas discretas e animações no hover de botões e links editoriais.
6. **Transição de Páginas**:
   - Assegurar transição contínua sem tela branca entre as rotas em `src/components/ui/page-transition.tsx`.
7. **Suite de Testes & Validação**:
   - Implementar `src/test/awwwards-motion-engine.test.tsx`.
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Checklist de Execução

- [x] Aprimorar `SmoothScrollProvider` com refresh automático do `ScrollTrigger` na navegação
- [x] Criar `src/components/ui/numeric-counter.tsx`
- [x] Integrar `NumericCounter` nas etapas de `ProcessTimeline`, `Philosophy`, `HomePathways`, `ProjectGallery`, `Sobre` e `ParaCorretores`
- [x] Criar `src/components/ui/parallax-image.tsx`
- [x] Integrar `ParallaxImage` na seção `Services`
- [x] Refinar microinterações nos cards de serviços e botões em `src/styles.css` e componentes
- [x] Validar comportamento suave de `PageTransition`
- [x] Criar suite `src/test/awwwards-motion-engine.test.tsx`
- [x] Executar Quality Gates (`bun run test`, `bun run lint`, `bun run build`)
