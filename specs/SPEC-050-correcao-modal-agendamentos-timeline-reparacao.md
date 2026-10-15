# SPEC-050: Correção do Modal de Agendamentos, Sincronização e Implementação da Timeline de Reparação Automotiva

## Metadados

| Campo       | Valor                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| SPEC ID     | SPEC-050                                                                                             |
| Título      | Correção do Modal de Agendamentos, Sincronização e Implementação da Timeline de Reparação Automotiva |
| Status      | Aprovado                                                                                             |
| Data        | 2026-10-15                                                                                           |
| Autor       | Engenheiro de Software Sênior & Arquiteto TanStack Fullstack                                         |
| Relacionado | SPEC-045, SPEC-046, SPEC-047, SPEC-048, SPEC-049                                                     |

---

## 1. Contexto e Motivação

Durante a auditoria operacional do painel administrativo de agendamentos (`/agendamentos`), foram identificados pontos críticos de estabilidade no modal de detalhes do cliente (`CustomerProcessDialog`):

1. **Botão Concluir**: Disparo de mutação de forma desincronizada com fechamento imediato do modal antes da resolução da Promise e ausência de feedback de erro acessível;
2. **Botão Cancelar**: Uso de `window.confirm()` síncrono bloqueante e não acessível, sem modal de confirmação Radix UI e sem registro do motivo do cancelamento;
3. **Botão Fechar**: Retenção do estado do registro selecionado em memória após o fechamento, podendo causar reaberturas com dados obsoletos durante eventos de sincronização;
4. **Sincronização Multi-Aba**: O canal `BroadcastChannel` emitia eventos genéricos `{ type: "MUTATION" }` sem identificador de origem (`originId`), mensagem (`messageId`) ou controle de timestamp, permitindo loops de propagação e sobrescrita de estados;
5. **Ausência de Linha do Tempo Real**: A timeline visual exibia etapas estáticas não baseadas em eventos persistidos, sem adaptação ao serviço (Funilaria, Pintura, Martelinho, Leva e Traz ou Sinistro).

Além disso, como o projeto é um ambiente demonstrativo e institucional para a BRS Reparações Automotivas, a comunicação via WhatsApp deve adotar uma solução de **custo zero** (sem APIs pagas como Twilio ou Meta Cloud API), baseada em gerador de intenções profundas (`wa.me` com templates pré-formatados) e composição de mensagens em 1 clique com cópia para área de transferência.

---

## 2. Requisitos Funcionais por Fase

### Fase 1 — Diagnóstico da Causa Raiz

- Auditar e documentar a causa exata dos problemas nos botões Fechar, Concluir e Cancelar.
- Identificar concorrência entre `BroadcastChannel`, Web Locks e reatividade do `subscribe`.

### Fase 2 — Correção dos Três Botões

- **Fechar**: Fechamento previsível via `onOpenChange(false)` e limpeza segura do registro selecionado (`setSelectedAppointmentForDetail(null)` após transição suave). Fechamento por teclado (Escape) e foco acessível.
- **Concluir**: Validação estrita via FSM (`canTransition`), execução via serviço centralizado assíncrono com bloqueio anti-duplo clique (`isPending`), persistência verificada antes de apresentar sucesso, exibição de feedback visual inline (sucesso/erro) sem `alert()`.
- **Cancelar**: Diálogo acessível de confirmação Radix UI (`AlertDialog`), campo opcional para motivo do cancelamento, gravação antes do fechamento, persistência do histórico completo (sem apagar agendamento).

### Fase 3 — Protocolo Estruturado de Sincronização Multi-Abas

- Definir contrato tipado para mensagens do `BroadcastChannel`:
  - `originId`: UUID único gerado por aba para ignorar mensagens geradas pela própria aba;
  - `type`: `APPOINTMENT_UPDATED` | `APPOINTMENT_CREATED` | `SEED_RESET` | `BLOCK_CHANGED`;
  - `recordId`: ID do agendamento afetado;
  - `timestamp`: timestamp em milissegundos para evitar que eventos antigos sobrescrevam novos;
  - `messageId`: UUID único para descarte de mensagens duplicadas.
- Fechamento correto de instâncias e remoção de listeners em cleanup hooks.

### Fase 4 — Modelo de Histórico de Eventos Append-Only

- Criação do tipo `AppointmentEvent`:
  - `id`: string (UUID)
  - `appointmentId`: string
  - `type`: `CREATED` | `CONFIRMED` | `VEHICLE_RECEIVED` | `INSPECTION_COMPLETED` | `INSURANCE_APPROVED` | `REPAIR_STARTED` | `PAINT_PREPARATION` | `BOOTH_CURING` | `QUALITY_CHECK` | `COMPLETED` | `CANCELLED`
  - `fromStatus` / `toStatus`: status anterior e novo
  - `createdAt`: ISO timestamp
  - `actorId` / `actorName`: Identificação do operador/técnico
  - `note`: Observação ou justificativa (ex: motivo de cancelamento)
  - `visibleToCustomer`: boolean (se o cliente pode visualizar na consulta pública)
  - `metadata`: informações adicionais tipadas
- Serviço de domínio centralizado `transitionAppointmentStatus` responsável por validar transição, criar o evento no histórico append-only e persistir atomicamente via Web Locks.

### Fase 5 — Timeline Automotiva Dinâmica Baseada em Eventos

- Componente `RepairTimeline` que consome os eventos reais gravados e renderiza:
  - Etapas concluídas com data/hora e responsável;
  - Etapa atual em destaque com indicador de progresso;
  - Etapas futuras planejadas com base na categoria do serviço (Funilaria vs Pintura em Estufa vs Martelinho PDR);
  - Tratamento de etapas dispensadas (ex: sem Leva e Traz ou sem Seguradora).

### Fase 6 — Acompanhamento Externo do Cliente (Custo Zero e Seguro)

- Rota somente leitura `/acompanhar/$token` acessível pelo cliente:
  - Proteção de dados e LGPD: Mascaramento da placa (ex: `RHZ-***1`), omissão de telefone completo, CPF e notas técnicas internas restritas.
  - Exibição exclusiva dos eventos com `visibleToCustomer: true`.
  - Cabeçalho com `Cache-Control: no-store` em SSR.

### Fase 7 — Solução de Comunicação WhatsApp Sem Custos (Demo)

- Implementar gerador de mensagens pré-formatadas para marcos de serviço:
  - Marco 1: Confirmação do Agendamento
  - Marco 2: Veículo Recebido na Oficina / Coletado
  - Marco 3: Vistoria Técnica Concluída
  - Marco 4: Veículo em Fase de Pintura / Montagem
  - Marco 5: Veículo Pronto para Retirada
- Botão "Abrir no WhatsApp" (`https://wa.me/55...`) + Botão "Copiar Mensagem do Marco" com feedback visual de 1 clique, sem cobrança de API ou custos de terceiros.

---

## 3. Critérios de Aceitação

- **AC-050-01**: O botão Fechar fecha o modal de detalhes de forma imediata e limpa o estado de seleção sem provocar mutações nem reaberturas.
- **AC-050-02**: O botão Concluir valida a transição via FSM, previne cliques múltiplos com estado de carregamento e só fecha o modal após persistência comprovada.
- **AC-050-03**: O botão Cancelar abre um diálogo acessível de confirmação Radix UI, grava o cancelamento com motivo e atualiza a grade sem remover o registro.
- **AC-050-04**: O `BroadcastChannel` utiliza contrato tipado com `originId` e `messageId`, sem loops de sincronização entre abas.
- **AC-050-05**: Todo avanço de status gera um registro no histórico append-only de eventos com data, hora, autor e nota.
- **AC-050-06**: A timeline do veículo é alimentada pelos eventos reais persistidos e se adapta à especialidade do reparo.
- **AC-050-07**: A página `/acompanhar/$token` renderiza a evolução do reparo mascarando dados sensíveis de acordo com a LGPD.
- **AC-050-08**: O gerador de mensagens WhatsApp permite compor comunicados de marco em 1 clique sem custos de API externa.
- **AC-050-09**: 100% de aprovação nos Quality Gates (`bun run test`, `bun run lint`, `bun run build`).
