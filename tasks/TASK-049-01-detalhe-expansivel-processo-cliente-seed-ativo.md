# TASK-049-01: Detalhe Expansível do Processo Completo do Cliente e Garantia de Seed Ativo no Painel de Agendamentos

## Metadados

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| Task ID            | TASK-049-01                                                  |
| Spec Ref           | SPEC-049                                                     |
| Status             | Concluído                                                    |
| Data de Atribuição | 2026-10-15                                                   |
| Data de Conclusão  | 2026-10-15                                                   |
| Responsável        | Engenheiro de Software Sênior & Arquiteto TanStack Fullstack |

---

## 1. Escopo de Implementação

1. **Aprimoramento do Seed Automático (`src/features/booking/domain/seed.ts`)**:
   - Atualizar `ensureSeedData` para mesclar dados demonstrativos quando `localStorage` já possui itens mas nenhum agendamento na data atual.
   - Garantir timestamps realistas de cadastro (`createdAt`) retroativos (ex: 2 a 4 horas antes do agendamento) para evidenciar quando o cliente cadastrou.
   - Adicionar auto-injeção no montador de `AdminGridView` caso a lista da data corrente esteja zerada.

2. **Criação do Componente Modal Expansível (`src/features/booking/ui/admin/customer-process-dialog.tsx`)**:
   - Implementar componente acessível com Radix UI Dialog.
   - Exibir bloco em destaque "Quando cadastrou" com `createdAt` e tempo relativo.
   - Implementar timeline visual com 6 etapas do ciclo de vida automotivo da BRS.
   - Exibir ficha cadastral do cliente, placa Mercosul estilizada e dados do veículo.
   - Exibir anamnese de danos (áreas afetadas, tipo de impacto, descrição e seguro).
   - Integrar ações operacionais: WhatsApp da Pré-OS, cópia para OS e avanço de status.

3. **Integração na Grade, Lista e Rota Leva e Traz (`src/features/booking/ui/admin/admin-grid-view.tsx`)**:
   - Conectar o clique nos cards de agendamento na grade diária para abrir o `CustomerProcessDialog`.
   - Adicionar botão "Ver Processo Completo" na visualização em lista.
   - Adicionar botão "Ver Detalhes do Processo" na visualização Leva e Traz.
   - Atualizar KPIs e estado reativo pós-transição de status.

4. **Testes Automatizados (`src/test/booking-customer-process.test.tsx`)**:
   - Testar renderização do modal expansível com todos os detalhes do processo e dados de cadastro (`createdAt`).
   - Testar abertura do modal ao selecionar um agendamento na grade e na lista.
   - Testar garantia de carga do seed e atualização de status no modal.

5. **Quality Gates**:
   - `bun run test` 100% verde.
   - `bun run lint` 0 erros.
   - `bun run build` sem erros.
   - Matriz de rastreabilidade sincronizada.
