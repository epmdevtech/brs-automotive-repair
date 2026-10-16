# TASK-061-01: Eliminação de Bifurcações SSR em ScrollReveal, ImageReveal e Reveal

## Metadados

| Campo       | Valor                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------- |
| Task ID     | TASK-061-01                                                                              |
| Spec Ref    | SPEC-061                                                                                 |
| Título      | Remoção de Early Returns de useReducedMotion em `ScrollReveal`, `ImageReveal` e `Reveal` |
| Status      | Concluído                                                                                |
| Data        | 2026-10-15                                                                               |
| Responsável | Staff Frontend Engineer                                                                  |
| Módulo      | `components/ui/scroll-reveal.tsx`, `components/ui/image-reveal.tsx`, `components/brs/*`  |

---

## 1. Escopo de Implementação

1. **`src/components/ui/scroll-reveal.tsx`**:
   - Remover `const shouldReduceMotion = useReducedMotion() ?? false;` e o bloco condicional `if (shouldReduceMotion) return ...`.
   - Garantir renderização contínua de `<MotionComponent>` com `initial` e `whileInView`, permitindo que o `<MotionConfig reducedMotion="user">` global trate o movimento reduzido sem divergência de atributos de estilo com o SSR.
2. **`src/components/ui/image-reveal.tsx` e `src/components/brs/image-reveal.tsx`**:
   - Remover bifurcação `if (shouldReduceMotion) return ...` que omitia o nó filho `<motion.div>`.
   - Manter a mesma estrutura de container e elemento animado tanto no SSR quanto no cliente.
3. **`src/components/brs/reveal.tsx`**:
   - Remover o teste de `typeof window` / `isObserverAvailable` e `shouldReduceMotion` que gerava nós com `initial` divergente entre servidor e cliente.
4. **Validação**:
   - Assegurar que os testes existentes em `src/test/scroll-reveal.test.tsx`, `src/test/scroll-reveal-luxury.test.tsx` e `src/test/global-motion-system.test.tsx` continuem passando.

---

## 2. Critérios de Aceite

- [x] **AC-061-01**: Eliminar completamente o erro de hidratação de atributos no React 19 (`A tree hydrated but some attributes of the server rendered HTML didn't match the client properties`) em `ScrollReveal`.
- [x] **AC-061-02**: Paridade estrita de atributos e nós DOM entre SSR e primeiro render de hidratação do cliente sob qualquer preferência de movimento.
