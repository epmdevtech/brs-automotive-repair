# SPEC-051: Reformulação de UX/UI dos Status Operacionais e Hierarquia Visual do Painel de Atendimentos BRS

## Metadados

| Campo       | Valor                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------- |
| SPEC ID     | SPEC-051                                                                                        |
| Título      | Reformulação de UX/UI dos Status Operacionais e Hierarquia Visual do Painel de Atendimentos BRS |
| Status      | Aprovado                                                                                        |
| Data        | 2026-10-15                                                                                      |
| Autor       | Engenheiro de Software Sênior, Product Designer & Especialista TanStack Fullstack               |
| Relacionado | SPEC-047, SPEC-048, SPEC-049, SPEC-050                                                          |

---

## 1. Contexto e Diagnóstico da Causa Raiz

Durante a auditoria de usabilidade e leitura operacional do painel administrativo de agendamentos (`/agendamentos`), constatou-se que a interface apresentava uma sobrecarga cognitiva severa devido ao uso indiscriminado da cor verde (esmeralda):

1. **Cards da Grade Diária**: Todos os agendamentos eram renderizados com fundo e borda verdes (`bg-emerald-50/60 border-emerald-500/30`), independente de estarem pendentes, em andamento, concluídos ou cancelados.
2. **Badge de Protocolo**: Todos os protocolos (`#BRS-XXXX`) eram exibidos em caixas verdes com texto verde escuro, gerando falsa sensação de conclusão em registros recém-abertos.
3. **Inversão Semântica no Mapeamento de Cores (`status.ts`)**:
   - `CONFIRMED` estava mapeado para verde esmeralda (`bg-emerald-100 text-emerald-900`), quando na realidade representa um atendimento confirmado em andamento ou aguardando execução na oficina;
   - `COMPLETED` estava mapeado para azul (`bg-blue-100 text-blue-900`), privando o estado de conclusão da sua cor natural de sucesso;
   - `CANCELLED` estava em cinza fosco em vez de vermelho discreto semântico;
   - Não havia diferenciação entre fechar a janela modal de visualização e encerrar/fechar o atendimento.
4. **Ausência de Status na Visualização em Lista**: A aba de listagem do painel exibia dados do cliente e veículo, porém **omitir o status operacional**, impossibilitando ao analista saber o estado do atendimento sem abrir o modal.
5. **KPIs Incompletos e Hardcoded**: O resumo superior destacava apenas "Confirmados" em verde e "Leva e Traz" em âmbar, sem contadores dinâmicos para Concluídos, Em Andamento, Abertos ou Cancelados.
6. **Ausência de Filtros Operacionais por Status**: O analista não conseguia filtrar atendimentos por situação na lista e na grade.

---

## 2. Nova Matriz Semântica de Estados do Domínio

A semântica de estados é padronizada respeitando estritamente o domínio existente sem inventar estados desnecessários:

| Estado (`AppointmentStatus`) | Rótulo Operacional    | Cor Semântica               | Indicador / Ícone            | Significado de Negócio                                                        |
| ---------------------------- | --------------------- | --------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `PENDING`                    | **Aberto**            | Azul neutro (`sky`/`blue`)  | `Clock` / Ponto azul         | Agendamento recebido via portal, aguardando triagem técnica.                  |
| `CONFIRMED`                  | **Em Andamento**      | Âmbar automotivo (`amber`)  | `PlayCircle` / Ponto âmbar   | Veículo confirmado e alocado na grade do técnico; exige acompanhamento ativo. |
| `COMPLETED`                  | **Concluído**         | Verde esmeralda (`emerald`) | `CheckCircle2` / Ponto verde | Reparação/avaliação finalizada com checklist de qualidade aprovado.           |
| `CANCELLED`                  | **Cancelado**         | Vermelho discreto (`red`)   | `XCircle` / Ponto vermelho   | Atendimento descontinuado com registro de justificativa.                      |
| `NO_SHOW`                    | **Fechado (Ausente)** | Cinza grafite (`neutral`)   | `Slash` / Ponto cinza        | Cliente não compareceu ao horário reservado; encerrado administrativamente.   |

### Regras Mandatórias de Design System

- **Verde**: Reservado **exclusivamente** para `COMPLETED` (Concluído) e sucessos de ação;
- **Âmbar**: Utilizado para `CONFIRMED` (Em Andamento), sinalizando trabalho ativo que exige atenção do analista;
- **Azul**: Utilizado para `PENDING` (Aberto), indicando item novo aguardando início;
- **Vermelho**: Utilizado com moderação para `CANCELLED` (Cancelado);
- **Cinza**: Utilizado para `NO_SHOW` (Fechado / Ausente).
- **Fundos Neutros nos Cards**: Os cards da grade adotam fundo off-white neutro do tema (`bg-white` / `bg-[#fbf9f6]`), com borda esquerda sutil (4px) na cor do status e o badge textual explícito com ícone.

---

## 3. Requisitos Funcionais

### RF-051-01: Componente Reutilizável de Badge de Status (`StatusBadge`)

- Criar `StatusBadge` com tipagem estrita de `AppointmentStatus`.
- Renderizar ícone SVG correspondente, rótulo textual e ponto geométrico.
- Garantir contraste WCAG AA para visualização em modo claro e escuro.

### RF-051-02: Redesign dos Cards da Grade Diária

- Eliminar o fundo verde generalizado.
- Aplicar superfície neutra com borda esquerda semântica (`border-l-4`).
- Exibir `StatusBadge` compacto no canto superior do card ao lado do protocolo neutro.
- Refletir o status imediatamente na interface após qualquer mutação sem necessidade de recarregar.

### RF-051-03: Exibição de Status na Visualização em Lista

- Incluir coluna/indicador visual explícito com `StatusBadge` em cada linha da lista.
- Hierarquia: 1. Protocolo e Veículo; 2. Cliente e Contato; 3. Status Operacional; 4. Horário e Especialidade; 5. Ações.

### RF-051-04: Barra de Filtros Operacionais por Situação

- Adicionar barra de filtros interativa: `Todos`, `Abertos`, `Em Andamento`, `Concluídos`, `Cancelados`.
- Atualizar a listagem e a grade conforme o filtro selecionado, mantendo a consistência dos dados.

### RF-051-05: Indicadores Dinâmicos de Status (KPIs)

- Calcular métricas a partir dos dados reais:
  - Total do Dia;
  - Abertos (Pendente);
  - Em Andamento (Confirmado);
  - Concluídos;
  - Cancelados.
- Tipografia limpa, números destacados e indicação visual discreta.

### RF-051-06: Clarificação Operacional dos Botões no Modal

- Diferenciar nitidamente o botão "Fechar Janela" (que apenas fecha o modal de diálogo) dos botões de transição de status ("Concluir Atendimento" e "Cancelar Agendamento").
- Na barra de ações do modal, incluir botão explícito para encerramento administrativo caso o cliente não tenha comparecido ("Registrar Não Comparecimento / Fechar").

---

## 4. Critérios de Aceitação

- **AC-051-01**: Um atendimento aberto ou em andamento **não** é renderizado com fundo verde ou badge de sucesso.
- **AC-051-02**: Concluir um atendimento altera seu status para `COMPLETED` e atualiza instantaneamente para o badge verde com ícone de confirmação.
- **AC-051-03**: Cancelar um atendimento altera seu status para `CANCELLED` com badge vermelho e justificativa no histórico.
- **AC-051-04**: A visualização em lista exibe o status de cada atendimento de forma legível e sem ambiguidade.
- **AC-051-05**: Os contadores de KPI refletem com precisão o quantitativo real por estado.
- **AC-051-06**: A barra de filtros permite isolar atendimentos por status tanto na visualização em lista quanto na grade.
- **AC-051-07**: Todos os Quality Gates (`bun run test`, `bun run lint`, `bun run build`) são aprovados com 100% de sucesso.
