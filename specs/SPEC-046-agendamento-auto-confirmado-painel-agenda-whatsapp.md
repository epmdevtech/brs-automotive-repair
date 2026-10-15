# SPEC-046: Agendamento Auto-Confirmado, Painel de Agenda Visual e Comunicação Direta via WhatsApp

## Status

- **Status**: APROVADO
- **Data**: 2026-10-15
- **Autor**: Arquiteto Especialista em Agendamento & TanStack Fullstack
- **Task Ref**: TASK-046-01
- **Spec Ref**: SPEC-046

---

## 1. Contexto e Motivação

Na BRS Reparações Automotivas, o objetivo do sistema de agendamento online é a **automação integral da reserva**: o cliente visualiza a disponibilidade real em tempo real, seleciona o dia e horário e confirma a reserva diretamente. Não há necessidade de aprovação manual prévia pela oficina para reservar o slot — ao submeter, o agendamento já nasce no estado **`CONFIRMED`**.

Além disso, a equipe da oficina necessita de um **Painel de Agenda Operacional** em `/agendamentos` que exiba claramente todos os agendamentos confirmados (agrupados por data, destacando atendimentos de hoje, próximos dias e coletas Leva e Traz em Toledo-PR), dispondo de um botão de 1 clique para **conversar diretamente com o cliente via WhatsApp** com mensagem de confirmação e boas-vindas pré-formatada.

---

## 2. Escopo Normativo

1. **Auto-Confirmação pelo Cliente (Zero Espera)**:
   - Ao concluir a Etapa 5 e confirmar no modal, o agendamento é persistido imediatamente com status **`CONFIRMED`**.
   - A trava atômica Web Locks e o double-check de colisão continuam garantindo que dois clientes não reservem o mesmo slot.
   - O feedback para o cliente na Etapa 6 deve ser: "Agendamento Confirmado com Sucesso" (e não pendente).

2. **Comunicação Direta via WhatsApp**:
   - **No Painel da Oficina (`/agendamentos`)**: Em cada agendamento confirmado, disponibilizar um botão proeminente **"Conversar no WhatsApp"** (ou "Enviar Confirmação"). Ao clicar, abre o WhatsApp Web/App com o número normalizado do cliente (`https://wa.me/55...`) e mensagem pré-preenchida contendo o protocolo, data, hora, veículo e orientações da BRS.
   - **Na Tela de Sucesso do Cliente (Etapa 6)**: Disponibilizar botão para abrir o WhatsApp da BRS ou copiar a mensagem com o protocolo e dados da Pré-OS para envio de fotos da avaria.

3. **Painel de Agenda Visual em `/agendamentos`**:
   - Métricas no topo: Total de Confirmados, Atendimentos de Hoje, Serviços Leva e Traz agendados e Concluídos.
   - Agrupamento temporal: "Hoje", "Próximos Dias" e "Histórico".
   - Detalhes visuais de cada ordem: Protocolo `#BRS-XXXXX`, Cliente, Telefone formatado com link, Veículo (Marca/Modelo/Placa/Cor), Peças Avariadas, Modalidade (Presencial vs. Coleta Leva e Traz em Toledo-PR com endereço completo).
   - Ações operacionais: "Conversar no WhatsApp", "Marcar como Concluído" e "Cancelar Agendamento".

---

## 3. Critérios de Aceitação (AC)

- **AC-046-01**: Novos agendamentos submetidos pelo cliente devem ser gravados diretamente com status `CONFIRMED`.
- **AC-046-02**: O painel `/agendamentos` deve filtrar por padrão os agendamentos confirmados e organizá-los em formato de agenda operacional com métricas resumidas.
- **AC-046-03**: Cada agendamento no painel administrativo deve possuir botão de ação rápida para iniciar conversa no WhatsApp com o cliente via URL canônica `https://wa.me/55...` com texto contextualizado da Pré-OS.
- **AC-046-04**: O modal de agendamento (Etapa 6) deve informar ao cliente que o horário está confirmado e oferecer atalho de comunicação no WhatsApp.
- **AC-046-05**: 100% dos testes unitários e de UI devem ser atualizados e validados com Vitest, mantendo zero erros de lint e build limpo.
