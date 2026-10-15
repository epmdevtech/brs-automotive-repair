# TASK-046-01: Implementação da Auto-Confirmação de Agendamentos, Painel de Agenda e Comunicação WhatsApp

## Metadados

- **Task ID**: TASK-046-01
- **Spec Ref**: SPEC-046
- **Status**: EM ANDAMENTO
- **Data de Atribuição**: 2026-10-15
- **Responsável**: Engenheiro de Software Sênior & Arquiteto TanStack Fullstack

---

## 1. Escopo de Implementação

1. **Auto-Confirmação no Hook `useBooking`**:
   - Atualizar a criação para gravar diretamente `status: "CONFIRMED"`.
   - Ajustar textos e feedbacks de confirmação imediata.

2. **Gerador de Mensagem WhatsApp para o Cliente**:
   - Criar utilitário `buildCustomerWhatsAppLink(appointment: Appointment)`:
     - Gera link `https://wa.me/{digits}?text={encodedText}`.
     - Texto formatado contendo saudação formal da oficina, protocolo `#BRS-XXXXX`, data, horário, veículo e peças avariadas.
   - Criar utilitário `buildOficinaWhatsAppLink(appointment: Appointment)` para o cliente enviar dados à oficina.

3. **Refatoração do Painel de Agenda (`AdminBookingDashboard`)**:
   - Barra de métricas superiores (Confirmados, Hoje, Leva e Traz, Concluídos).
   - Abas/Filtros: "Confirmados (Ativos)" (default), "Hoje", "Leva e Traz", "Concluídos", "Cancelados" e "Todos".
   - Cards com visual de agenda técnica (ficha da Pré-OS com peças mapeadas).
   - Botão direto verde de destaque: **"Conversar no WhatsApp"** (com ícone e link direto para o WhatsApp do cliente com texto pronto).
   - Ações de "Concluir Vistoria / Atendimento" e "Cancelar".

4. **Refinamento do Modal de Confirmação do Cliente (Etapa 6)**:
   - Destaque "Horário Confirmado na Agenda".
   - Botão para abrir WhatsApp direto com a oficina ou enviar fotos.

5. **Testes Unitários & Quality Gates**:
   - Atualizar testes em `src/test/booking-domain.test.ts`, `booking-repository.test.ts` e `booking-ui.test.tsx`.
   - Executar `bun run test`, `bun run lint` e `bun run build`.
