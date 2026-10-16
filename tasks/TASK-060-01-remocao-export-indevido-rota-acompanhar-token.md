# TASK-060-01: Remoção de Export Indevido na Rota `/acompanhar/$token` (Code-Splitting TanStack Router)

## Metadados

| Campo       | Valor                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Task ID     | TASK-060-01                                                                     |
| Spec Ref    | SPEC-060                                                                        |
| Título      | Remoção de Export da Função de Componente em `src/routes/acompanhar/$token.tsx` |
| Status      | Concluído                                                                       |
| Data        | 2026-10-15                                                                      |
| Responsável | Staff Frontend Engineer                                                         |
| Módulo      | `routes/acompanhar/$token.tsx`                                                  |

---

## 1. Escopo de Implementação

1. **Refatoração de Exportação**:
   - Localizar a declaração `export function CustomerTrackingPage()` em `src/routes/acompanhar/$token.tsx`.
   - Alterar para `function CustomerTrackingPage()`.
   - Garantir que apenas `export const Route = createFileRoute("/acompanhar/$token")(...)` seja exportado do módulo de rota.
2. **Validação**:
   - Garantir que nenhuma suite de teste ou componente externo foi impactado.
   - Verificar ausência do aviso no compilador e bundler do TanStack Router.

---

## 2. Critérios de Aceite

- [x] **AC-060-01**: `src/routes/acompanhar/$token.tsx` exporta unicamente o objeto `Route`.
- [x] O aviso do TanStack Router `These exports from ... will not be code-split and will increase your bundle size` não é mais emitido.
