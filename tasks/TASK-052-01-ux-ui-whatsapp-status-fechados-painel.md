# TASK-052-01: Refatoração UX/UI do Botão WhatsApp e Inclusão de "Fechados" nos KPIs e Filtros

## Metadados

| Campo              | Valor                                                         |
| ------------------ | ------------------------------------------------------------- |
| Task ID            | TASK-052-01                                                   |
| Spec Ref           | SPEC-052                                                      |
| Status             | Concluído                                                     |
| Data de Atribuição | 2026-10-15                                                    |
| Data de Conclusão  | 2026-10-15                                                    |
| Responsável        | Product Designer Especialista em UX/UI & Engenheiro Fullstack |

---

## 1. Escopo de Implementação

1. **Refatoração do Botão do WhatsApp**:
   - Ajustar a estilização dos botões do WhatsApp nos cards de slot e na listagem de `admin-grid-view.tsx` para o verde oficial da marca (`#25D366`), garantindo affordance inequívoca.
   - Manter superfícies dos cards neutras e o `StatusBadge` como indicador exclusivo do estado do veículo.

2. **Cálculo e Exibição de Atendimentos Fechados (`NO_SHOW`) nos KPIs**:
   - Adicionar `closedCount` no useMemo `stats`.
   - Adicionar o 5º card de status ("Fechados") na barra de KPIs superiores, totalizando 6 cards organizados em grid responsivo.

3. **Inclusão do Filtro de "Fechados" na Barra de Filtros**:
   - Adicionar o botão "Fechados" associado ao estado `NO_SHOW` na barra de navegação/filtros operacionais.

4. **Enriquecimento do Seed de Demonstração**:
   - Adicionar agendamento com status `NO_SHOW` e `PENDING` para a data de hoje no seed de dados, permitindo conferir todos os estados imediatamente ao restaurar os dados fictícios.

5. **Testes Automatizados & Quality Gates**:
   - Atualizar e adicionar casos de teste para o contador de fechados, botão de filtro de fechados e a cor oficial do WhatsApp.
   - Garantir 100% de sucesso em `bun run test`, `bun run lint` e `bun run build`.
