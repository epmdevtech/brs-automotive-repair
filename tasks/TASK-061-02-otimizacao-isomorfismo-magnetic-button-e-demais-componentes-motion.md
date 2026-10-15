# TASK-061-02: Otimização de Isomorfismo em MagneticButton, AnimatedHero, ProcessTimeline e BeforeAfterSlider

## Metadados

| Campo       | Valor                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| Task ID     | TASK-061-02                                                                                                     |
| Spec Ref    | SPEC-061                                                                                                        |
| Título      | Isolamento Client-Side de Media Queries e Paridade SSR em Componentes Interativos                               |
| Status     | Concluído                                                                                                      |
| Data        | 2026-10-15                                                                                                      |
| Responsável | Staff Frontend & Performance Engineer                                                                           |
| Módulo      | `components/ui/magnetic-button.tsx`, `components/brs/*`                                                         |

---

## 1. Escopo de Implementação

1. **`src/components/ui/magnetic-button.tsx`**:
   - Eliminar `useReducedMotion()`, migrando a checagem de acessibilidade para dentro de `useEffect` junto à detecção de `hover: hover` e `pointer: fine`.
   - Eliminar o aviso de desenvolvimento do Framer Motion (`You have Reduced Motion enabled on your device`).
2. **`src/components/brs/before-after-slider.tsx`**:
   - Migrar a checagem de movimento reduzido para dentro do `useEffect` de teaser, eliminando chamada de hook de renderização.
3. **`src/components/brs/card-spotlight.tsx`**:
   - Migrar a checagem de movimento reduzido para o manipulador de eventos de ponteiro.
4. **`src/components/brs/animated-hero.tsx` e `src/components/brs/process-timeline.tsx`**:
   - Unificar variantes e estilos inline para evitar ternários SSR vs client divergentes.
5. **Validação**:
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Critérios de Aceite

- [x] **AC-061-03**: Ausência de avisos `warnOnce` do Framer Motion em `MagneticButton` e `BeforeAfterSlider` no console.
- [x] **AC-061-04**: Preservação das diretrizes de WCAG 2.2 AA em todos os componentes.
- [x] **AC-061-05**: 100% dos testes do Vitest aprovados.
- [x] **AC-061-06**: Quality gates aprovados.
