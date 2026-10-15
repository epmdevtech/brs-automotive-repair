# TASK-062-01: Ocultação Responsiva do Botão CTA do Header no Mobile e Padronização do CTA no Menu Hambúrguer

## Metadados

| Campo       | Valor                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| Task ID     | TASK-062-01                                                                    |
| Spec Ref    | SPEC-062                                                                       |
| Título      | Ajuste de Visibilidade do CTA no Header e Rótulo "Avaliação" no Menu Hambúrguer |
| Status     | Concluído                                                                      |
| Data        | 2026-10-15                                                                     |
| Responsável | Staff UX/UI Designer & Frontend Engineer                                       |
| Módulo      | `components/brs/header.tsx`, `test/header.test.tsx`                           |

---

## 1. Escopo de Implementação

1. **`src/components/brs/header.tsx`**:
   - No wrapper do botão CTA dentro da cápsula do Header (`<MagneticButton>`), alterar a classe de `inline-flex` para `hidden sm:inline-flex`.
   - No botão CTA do menu móvel suspenso (`#mobile-nav`), substituir o texto "Solicitar avaliação" por "Avaliação".
2. **`src/test/header.test.tsx`**:
   - Adicionar asserção validando que o container do CTA no Header possui a classe utilitária `hidden sm:inline-flex`.
   - Adicionar asserção validando que, ao expandir o menu móvel, o botão exibe o rótulo "Avaliação".
3. **Validação**:
   - Rodar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Critérios de Aceite

- [x] **AC-062-01**: Ocultação do CTA na barra superior no mobile via `hidden sm:inline-flex`.
- [x] **AC-062-02**: Rótulo "Avaliação" no botão CTA do menu móvel hambúrguer.
- [x] **AC-062-03**: Testes automatizados cobrindo a responsividade e conteúdo do menu móvel aprovados.
- [x] **AC-062-04**: Quality Gates verdes (test, lint, build).
