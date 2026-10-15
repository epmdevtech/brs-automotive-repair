# SPEC-052: Refatoração UX/UI do Botão WhatsApp e Adição do Status "Fechados" nos KPIs e Filtros

## Metadados

| Campo       | Valor                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-052                                                                                                |
| Título      | Refatoração UX/UI do Botão WhatsApp com Affordance Real e Inclusão de "Fechados" nos KPIs e Filtros BRS |
| Status      | Aprovado                                                                                                |
| Data        | 2026-10-15                                                                                              |
| Autor       | Product Designer Especialista em UX/UI & Engenheiro Fullstack                                           |
| Módulo      | `features/booking`                                                                                      |
| Issue / Ref | Feedback do Usuário — Botão WhatsApp e Métrica de Fechados                                              |

---

## 1. Contexto e Diagnóstico do Problema

Durante a validação com o cliente do painel de atendimentos (`/agendamentos`), dois pontos críticos de usabilidade e consistência operacional foram identificados:

1. **Quebra de Affordance no Botão do WhatsApp**:
   - Para resolver a dominância indevida de verde nos cards, o botão de ação do WhatsApp foi alterado para preto sólido (`#201d1b`).
   - Sob a ótica de Product Design e UX operacional, botões pretos comunicam ações primárias de sistema (como "Salvar", "Concluir" ou "Entrar") ou elementos desabilitados, quebrando totalmente o reconhecimento mental imediato do WhatsApp.
   - O WhatsApp possui identidade global de marca amplamente reconhecida (`#25D366`). Em ferramentas automotivas de operação rápida, os operadores dependem do gatilho visual verde oficial e do ícone do WhatsApp para disparar mensagens em fração de segundo.
   - A separação entre o **status do atendimento** (definido pelo `StatusBadge` e pela borda lateral `border-l-4`) e os **botões de ação externos** (como WhatsApp) deve ser mantida pela semântica de componentes, e não pela neutralização forçada da marca do canal de terceiros.

2. **Ausência da Métrica e Filtro de "Fechados" (`NO_SHOW`) nos Contadores Superiores**:
   - Ao executar a ação "Fechar / Ausente" no modal de processo do cliente, o agendamento transiciona corretamente para o status `NO_SHOW` ("Fechado").
   - Contudo, na barra superior de KPIs só constavam: _Total do Dia_, _Em Andamento_, _Concluídos_, _Abertos_ e _Cancelados_. O estado **Fechados** não existia no cálculo de `stats`, não possuía card de KPI no topo e não constava na barra de filtros operacionais.
   - Isso impedia o gestor de saber quantos atendimentos foram encerrados por ausência do cliente no dia.

---

## 2. Decisões de Design e Arquitetura

### 2.1 Affordance do Botão WhatsApp

- Utilizar a cor canônica e autêntica do WhatsApp: **`#25D366`** (com estados de foco/hover `hover:bg-[#20ba59]` e `active:scale-[0.98]`).
- Tipografia em branco puro com peso `font-semibold` ou `font-medium`, ícone vetorial `MessageCircle` alinhado à esquerda e texto explícito "WhatsApp".
- Sombra sutil de botão (`shadow-xs` / `shadow-sm`) e cantos arredondados normativos (`rounded-lg`), destacando-o como um gatilho de ação contextual sem contaminar o fundo neutro do cartão.

### 2.2 KPIs Superiores Completos (6 Colunas)

- Grid responsivo de 6 colunas (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3`):
  1. **Total do Dia**: Neutro (`bg-[#fbf9f6] text-[#201d1b]`);
  2. **Em Andamento**: Âmbar (`border-l-amber-500 text-amber-700`);
  3. **Concluídos**: Verde Esmeralda (`border-l-emerald-500 text-emerald-600`);
  4. **Abertos**: Azul Celeste (`border-l-sky-500 text-sky-700`);
  5. **Fechados**: Grafite/Cinza Neutro (`border-l-neutral-400 text-neutral-700`, ícone `Slash`);
  6. **Cancelados**: Vermelho Suave (`border-l-red-400 text-red-600`, ícone `XCircle`).

### 2.3 Barra de Filtros Operacionais Sincronizada

- Adicionar o botão **"Fechados" (`NO_SHOW`)** na barra de filtros:
  - Rótulo: `Fechados (${stats.closed})`
  - Estilo inativo: `bg-neutral-100 text-neutral-800 border border-neutral-300 hover:bg-neutral-200`
  - Estilo ativo: `bg-neutral-700 text-white font-semibold shadow-xs`

### 2.4 Carga de Dados Seed Realista

- Enriquecer a geração de agendamentos fictícios de demonstração para que a grade do dia atual contenha pelo menos um agendamento com status `NO_SHOW` (Fechado) e um com `PENDING` (Aberto), além dos confirmados e concluídos, proporcionando visibilidade imediata de todos os contadores no carregamento.

---

## 3. Requisitos Funcionais

- **RF-052-01**: Refatorar os botões de ação do WhatsApp na grade de slots, na visualização em lista e no modal de detalhes para o padrão autêntico `#25D366` com alto contraste.
- **RF-052-02**: Atualizar o cálculo de `stats` em `admin-grid-view.tsx` para incluir `closed` correspondente a atendimentos com status `NO_SHOW` na data selecionada.
- **RF-052-03**: Renderizar o card de KPI "Fechados" no topo da página de agendamentos.
- **RF-052-04**: Incluir o botão de filtro "Fechados" na barra de filtros por situação.
- **RF-052-05**: Atualizar a suíte de testes automatizados para validar a presença do contador de fechados, filtro de fechados e a cor/affordance do botão WhatsApp.

---

## 4. Critérios de Aceitação

- **AC-052-01**: O botão do WhatsApp possui cor `#25D366` (verde oficial da marca) com texto e ícone nítidos, sendo facilmente reconhecido pelo operador.
- **AC-052-02**: O card de KPI "Fechados" aparece no topo da tela `/agendamentos` e seu valor reflete o total de agendamentos com status `NO_SHOW` no dia.
- **AC-052-03**: Ao registrar ausência e fechar um atendimento no modal, o contador de "Fechados" no topo é atualizado imediatamente.
- **AC-052-04**: O filtro "Fechados" isola agendamentos com status `NO_SHOW` tanto na grade quanto na listagem cronológica.
- **AC-052-05**: Todos os Quality Gates (`bun run test`, `bun run lint`, `bun run build`) passam com 100% de sucesso.
