# SPEC-065 — Sincronização da Linha do Tempo Operacional com Status do Agendamento e Correção de Hidratação SSR em `/agendamentos`

| Campo   | Valor                                        |
| ------- | -------------------------------------------- |
| ID      | `SPEC-065`                                   |
| Status  | Approved                                     |
| Data    | 2026-10-15                                   |
| Autor   | UX/UI & Frontend Engineering (Universal SDD) |
| Tarefas | `TASK-065-01`                                |
| Revisão | `REVIEW-065`                                 |

---

## 1. Contexto e Problema

Na rota administrativa `/agendamentos`, foram identificados dois problemas em execução no navegador:

1. **Dessincronização entre a Linha do Tempo Operacional (`TimelineOperacional`) e o Status Operacional do Agendamento (`Appointment.status`) / Mini-Stepper (`ProcessStepper`)**:
   - Ao abrir o modal de detalhes do agendamento (`CustomerProcessDialog`, ex.: `#BRS-8412` — Roberto Albuquerque) e avançar, desfazer ou reverter etapas na **Linha do tempo operacional** (`src/features/booking/domain/etapas.ts`), os eventos eram gravados apenas em `brs_etapas_audit_log` e emitidos via `BroadcastChannel` (que só notifica outras abas, nunca a mesma aba).
   - O status do agendamento (`appointment.status` em `brs_appointments_v1`) não era sincronizado com a situação derivada das etapas (`situacao(eventos)`), fazendo com que um agendamento na **Etapa 5 de 6 (Em execução)** permanecesse com o badge **`CONCLUÍDO`** (`COMPLETED`) tanto no cabeçalho do modal quanto no card da grade.
   - Além disso, o componente [`ProcessStepper`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/features/booking/ui/admin/process-stepper.tsx) nos cards da grade utilizava `useMemo(..., [appointmentId])`, que não reavaliava os eventos de `localStorage` ao fechar o modal porque `appointmentId` permanecia o mesmo.
2. **Erro de Hidratação SSR em `/agendamentos`**:
   - Em [`src/routes/agendamentos.tsx`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/routes/agendamentos.tsx), `const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated())` retornava `false` no servidor (renderizando `<AdminLogin />`), mas no cliente autenticado retornava `true` na primeira passagem de hidratação (renderizando `<AdminGridView />`), disparando `Uncaught Error: Hydration failed because the server rendered HTML didn't match the client`.

---

## 2. Escopo e Requisitos Funcionais

### RF-065-01 — Sincronização Bidirecional entre Etapas Operacionais e Status do Agendamento

1. Sempre que `concluirEtapa`, `desfazerUltimaAcao` ou `reverterEtapa` (em [`src/features/booking/domain/etapas.ts`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/features/booking/domain/etapas.ts)) atualizar as etapas de um agendamento:
   - Calcular a situação operacional atual via `situacao(eventos)` e `progresso(eventos)`.
   - Sincronizar automaticamente o `status` do agendamento em `brs_appointments_v1` (quando o agendamento não estiver `CANCELLED` nem `NO_SHOW`):
     - Se `situacao(eventos) === "concluido"` (`concluidas === 6`): atualizar `status` para `"COMPLETED"` (`Concluído`).
     - Se `situacao(eventos) === "em_andamento"` (`concluidas >= 2 && concluidas < 6`, ou etapa 6 com sub-ação parcial): atualizar `status` para `"CONFIRMED"` (`Em Andamento`), mesmo que o agendamento estivesse anteriormente como `"COMPLETED"` ou `"PENDING"`.
     - Se `situacao(eventos) === "aberto"` (`concluidas <= 1`): se o agendamento estava `"COMPLETED"`, reverter `status` para `"CONFIRMED"` (`Em Andamento`).
   - Emitir evento customizado na mesma aba (`window.dispatchEvent(new CustomEvent("brs:etapas-updated", ...))`) além do `BroadcastChannel` multi-aba.
2. Reconciliação de consistência:
   - Na inicialização e leitura do repositório local (`LocalBookingRepository`) e de `ensureInitialEtapaEvents`:
     - Se um agendamento já possui eventos registrados em `brs_etapas_audit_log` (ex.: 4 etapas concluídas, Etapa 5 em execução) e seu `status` em `brs_appointments_v1` diverge da esteira (ex.: `COMPLETED` com menos de 6 etapas concluídas), reconciliar imediatamente o `status` para `"CONFIRMED"` (`Em Andamento`).
     - Se um agendamento é marcado como `"COMPLETED"` pelo botão rápido de conclusão (`updateStatus(id, "COMPLETED")`) ou vem do seed como `"COMPLETED"` sem eventos prévios, garantir que as 6 etapas operacionais estejam concluídas no log de etapas para manter coerência total entre o badge e o stepper.

### RF-065-02 — Reatividade Imediata do `ProcessStepper`, `CustomerProcessDialog` e `AdminGridView` na Mesma Aba

1. `LocalBookingRepository` deve escutar o evento `brs:etapas-updated` em `window` e notificar todos os seus subscribers (`AdminGridView`, etc.) imediatamente na mesma aba.
2. `ProcessStepper` não deve reter cache obsoleto apenas por `[appointmentId]`; deve ler os eventos atualizados de `getEtapaEventsForAppointment(appointmentId)` a cada renderização e escutar `brs:etapas-updated` para refletir instantaneamente a etapa atual nos cards da grade e do Kanban.

### RF-065-03 — Hidratação SSR Determinística em `/agendamentos`

1. Em [`src/routes/agendamentos.tsx`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/routes/agendamentos.tsx), inicializar `authenticated` de forma determinística (`false`) para que a árvore HTML inicial do cliente coincida exatamente com o HTML renderizado pelo servidor (SSR), verificando `isAdminAuthenticated()` dentro de `useEffect` após a montagem no cliente.

---

## 3. Critérios de Aceite (AC)

- **AC-065-01**: Ao avançar ou reverter etapas na `Linha do tempo operacional` dentro de `CustomerProcessDialog`, o `StatusBadge` no topo do modal e no card da grade (`AdminGridView`) reflete imediatamente o status correspondente (`Em Andamento` para etapas 2–5 ou 6 parcial; `Concluído` ao finalizar a etapa 6b).
- **AC-065-02**: Ao fechar o modal `CustomerProcessDialog`, o card do agendamento em `/agendamentos` exibe imediatamente tanto o `StatusBadge` atualizado quanto o `ProcessStepper` na etapa exata (ex.: Etapa 5 ativa quando 4 etapas estão concluídas).
- **AC-065-03**: Agendamentos que estavam com `status: "COMPLETED"` mas com linha do tempo operacional em andamento (ex.: Etapa 5 de 6 · 4 concluídas) são automaticamente reconciliados para `"CONFIRMED"` (`Em Andamento`).
- **AC-065-04**: A rota `/agendamentos` hidrata sem erro `Hydration failed because the server rendered HTML didn't match the client` quando o administrador já possui sessão ativa no navegador.
