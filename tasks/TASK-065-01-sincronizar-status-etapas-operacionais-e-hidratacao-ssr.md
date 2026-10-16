# TASK-065-01 — Sincronizar Status com Etapas Operacionais e Corrigir Hidratação SSR em `/agendamentos`

- **Spec-Ref**: `SPEC-065`
- **Status**: Completed
- **Responsável**: Antigravity

---

## 1. Objetivo

Corrigir a dessincronização entre a `Linha do tempo operacional` (`TimelineOperacional`) e o status/stepper dos cards em `/agendamentos`, bem como eliminar o erro de hidratação SSR em `src/routes/agendamentos.tsx`.

---

## 2. Passos de Execução

1. Atualizar [`src/features/booking/domain/etapas.ts`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/features/booking/domain/etapas.ts):
   - Exportar `ETAPA_SYNC_DOM_EVENT = "brs:etapas-updated"`.
   - Implementar `sincronizarStatusAgendamentoPorEtapas(agendamentoId: string)` para atualizar o `status` do agendamento em `brs_appointments_v1` conforme `situacao(eventos)` (`"concluido"` -> `"COMPLETED"`, `"em_andamento"` -> `"CONFIRMED"`, ou reversão de `"COMPLETED"` para `"CONFIRMED"`).
   - Implementar `reconciliarStatusAgendamentosComEtapas()` e `garantirTodasEtapasConcluidas(agendamentoId, autorNome)` para manter consistência bidirecional.
   - Disparar `CustomEvent(ETAPA_SYNC_DOM_EVENT)` em `emitirSyncMultiAba` para atualização instantânea na mesma aba.
2. Atualizar [`src/features/booking/data/local/local-repository.ts`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/features/booking/data/local/local-repository.ts):
   - Escutar `ETAPA_SYNC_DOM_EVENT` em `window` no construtor de `LocalBookingRepository` para acionar `this.notifySubscribers()` na mesma aba.
   - Em `updateStatus`, quando `targetStatus === "COMPLETED"`, sincronizar as 6 etapas como concluídas no log de etapas.
   - Reconciliar status de agendamentos em `readStorage()` quando houver eventos de etapas em andamento divergindo de `COMPLETED`.
3. Atualizar [`src/features/booking/ui/admin/process-stepper.tsx`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/features/booking/ui/admin/process-stepper.tsx):
   - Remover o `useMemo(..., [appointmentId])` obsoleto e escutar `ETAPA_SYNC_DOM_EVENT` para atualizar o mini-stepper em tempo real.
4. Atualizar [`src/routes/agendamentos.tsx`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/routes/agendamentos.tsx):
   - Inicializar `authenticated` como `false` no estado inicial para corresponder ao HTML do SSR e atualizar via `useEffect` no cliente.
5. Criar suíte de testes automatizados `src/test/agendamentos-timeline-sync-hydration-spec065.test.tsx` e validar todos os quality gates (`bun run test --run`, `bun run lint`, `bun run build`).
