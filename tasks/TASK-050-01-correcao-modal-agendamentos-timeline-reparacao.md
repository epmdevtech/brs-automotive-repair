# TASK-050-01: Correção do Modal de Agendamentos, Sincronização Multi-Aba e Implementação da Timeline de Reparação Automotiva

## Metadados

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| Task ID            | TASK-050-01                                                  |
| Spec Ref           | SPEC-050                                                     |
| Status             | Concluído                                                    |
| Data de Atribuição | 2026-10-15                                                   |
| Data de Conclusão  | 2026-10-15                                                   |
| Responsável        | Engenheiro de Software Sênior & Arquiteto TanStack Fullstack |

---

## 1. Escopo de Implementação

1. **Correção dos Três Botões no Modal (`CustomerProcessDialog`)**:
   - **Fechar**: Fechamento previsível, limpeza de seleção (`setSelectedAppointmentForDetail(null)`), suporte a tecla Escape e foco acessível.
   - **Concluir**: Transição de status via função centralizada assíncrona, validação por FSM (`canTransition`), bloqueio contra duplo clique com estado `isPending`, feedback inline sem `alert()`, persistência confirmada antes de fechar.
   - **Cancelar**: Diálogo acessível de confirmação Radix UI (`AlertDialog`), justificativa/motivo do cancelamento, gravação e persistência do histórico completo.

2. **Protocolo Estruturado de Sincronização Multi-Aba (`local-repository.ts` & `AdminGridView`)**:
   - Mensagens tipadas com `originId`, `messageId`, `recordId`, `timestamp`.
   - Ignorar auto-mensagens e descartar mensagens duplicadas ou obsoletas.
   - Prevenção de loop de seed e cleanup de listeners e canais ao desmontar.

3. **Modelo de Histórico Append-Only de Eventos (`AppointmentEvent`)**:
   - Definir interfaces de eventos de reparação em `types.ts` e persistência centralizada sob Web Lock em `events.ts` / `local-repository.ts`.
   - Serviço centralizado `transitionAppointmentStatus` registrando data, hora, responsável e observação.

4. **Timeline Automotiva Dinâmica Baseada em Eventos (`RepairTimeline`)**:
   - Renderização adaptável ao serviço automotivo (Funilaria, Pintura em Estufa, Martelinho PDR, Sinistro, Leva e Traz).
   - Indicação de etapas concluídas, etapa atual, etapas futuras, dispensadas e canceladas.
   - Alimentação estrita pelos eventos reais persistidos.

5. **Acompanhamento Externo do Cliente (`/acompanhar/$token`)**:
   - Rota somente leitura para o cliente acompanhar a evolução do reparo.
   - Conformidade com a LGPD: mascaramento de placa (`RHZ-***1`), omissão de telefones e notas internas.
   - Renderização exclusiva de eventos `visibleToCustomer: true`.

6. **Comunicação WhatsApp Custo Zero (Demo)**:
   - Gerador de mensagens pré-formatadas para os 5 marcos da reparação automotiva.
   - Botão para abrir no WhatsApp (`wa.me`) e botão para copiar com feedback visual imediato.

7. **Testes Automatizados & Quality Gates**:
   - Criar suítes de teste para o modal, transições, botões, timeline, canal e LGPD.
   - `bun run test` 100% verde.
   - `bun run lint` 0 erros.
   - `bun run build` sem erros.
   - Sincronização de `PROJECT.md` e matriz de rastreabilidade.
