# TASK-060-02: Correção de Erro de Hidratação SSR no PageTransition com Prefers-Reduced-Motion

## Metadados

| Campo       | Valor                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| Task ID     | TASK-060-02                                                                                                 |
| Spec Ref    | SPEC-060                                                                                                    |
| Título      | Isomorfismo de Hidratação SSR e Suporte a Prefers-Reduced-Motion em `src/components/ui/page-transition.tsx` |
| Status      | Concluído                                                                                                   |
| Data        | 2026-10-15                                                                                                  |
| Responsável | Staff Frontend & Performance Engineer                                                                       |
| Módulo      | `components/ui/page-transition.tsx`                                                                         |

---

## 1. Escopo de Implementação

1. **Garantia de Isomorfismo Server/Client no `PageTransition`**:
   - Introduzir controle de montagem isomorfo (`isMounted` via `useState(false)` e `useEffect(() => setIsMounted(true), [])`).
   - Durante a renderização inicial no servidor (SSR) e o primeiro passe síncrono de hidratação no cliente, renderizar a mesma estrutura DOM limpa (`initial={false}` para o container de conteúdo, e supressão da barra laser transitória até a hidratação ser concluída).
   - Após a montagem no cliente (`isMounted === true`), ativar a barra laser superior e as variantes de transição cinemática de rota se `!shouldReduce`.
   - Adicionar defesa em profundidade com utilitário CSS `motion-reduce:hidden` na barra laser.
2. **Cobertura de Testes Automatizados**:
   - Atualizar/expandir a suíte de testes em `src/test/global-motion-system.test.tsx` e `src/test/awwwards-motion-engine.test.tsx` cobrindo o comportamento de montagem e preferência de movimento reduzido no `PageTransition`.
   - Garantir que `src/test/signature-canvas.test.tsx` continue passando com 100% de sucesso.
3. **Validação de Quality Gates**:
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Critérios de Aceite

- [x] **AC-060-02**: Eliminação completa do erro `Hydration failed because the server rendered HTML didn't match the client` ao abrir o site com `prefers-reduced-motion` ativado.
- [x] **AC-060-03**: A árvore DOM do primeiro passe de hidratação do cliente coincide estritamente com o HTML gerado pelo SSR do TanStack Start.
- [x] **AC-060-04**: A barra laser e as transições cinemáticas continuam funcionando normalmente na navegação entre rotas para usuários sem preferência de movimento reduzido.
- [x] **AC-060-05**: Suíte de testes do Vitest valida a transição de rota sob `prefers-reduced-motion` e montagem no cliente.
