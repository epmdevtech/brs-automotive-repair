# SPEC-048: Carga Inicial de Dados Fictícios Realistas (Seed) para Demonstração da Agenda dos Técnicos

## Metadados

- **ID**: SPEC-048
- **Título**: Carga Inicial de Dados Fictícios Realistas (Seed) para Demonstração da Agenda dos Técnicos
- **Status**: APROVADO
- **Data**: 2026-10-15
- **Autor**: Engenheiro de Software Sênior & Arquiteto TanStack Fullstack
- **Relacionado**: SPEC-045, SPEC-046, SPEC-047

---

## 1. Contexto e Motivação

A plataforma de agendamento em grade diária dos técnicos (`/agendamentos`) foi implementada com arquitetura DDD e componentes reativos fiéis ao design de referência. Entretanto, ao acessar a interface pela primeira vez ou com o armazenamento limpo, a grade e as listas operacionais encontram-se vazias (apenas com slots `+ Livre`), exigindo cadastros manuais repetitivos para testar e visualizar o valor funcional da ferramenta.

Para proporcionar uma experiência imediata e demonstrativa de alto impacto para a equipe técnica, avaliadores e proprietários da BRS, é necessário disponibilizar um gerador de **dados fictícios realistas (Seed)** aderentes à realidade operacional da oficina em Toledo-PR.

---

## 2. Requisitos Funcionais

1. **Geração Dinâmica de Dados para a Data Corrente ("Hoje")**:
   - Os agendamentos demonstrativos devem ser ancorados na data de hoje (`new Date()`) do usuário, garantindo que a visão diária da grade (`AdminGridView`) exiba imediatamente atendimentos confirmados distribuídos entre os técnicos da BRS.
   - Incluir atendimentos para o dia anterior e dia seguinte para enriquecer a navegação e a aba _"Lista"_.

2. **Aderência ao Negócio da BRS Reparações**:
   - **Bruno (Funilaria & Vistoria)**:
     - Atendimento 1 (Manhã): Toyota Corolla Altis 2022 (RHZ-9B21) — Parachoque Dianteiro e Paralama Esquerdo (Colisão com vinco profundo) — Presencial.
     - Atendimento 2 (Tarde): Jeep Compass Longitude 2023 (QJF-4C10) — Lateral Traseira Direita — Serviço Leva e Traz (Rua Santos Dumont, Centro, Toledo-PR).
   - **Técnico Martelinho de Ouro**:
     - Atendimento 1 (Manhã): Honda Civic G10 2021 (BCX-2A34) — Capô e Teto (Dano de Granizo sem repintura) — Presencial.
     - Atendimento 2 (Tarde): Volkswagen T-Cross Highline 2024 (SDF-8E99) — Porta Dianteira Direita (Batida de estacionamento) — Serviço Leva e Traz (Av. Parigot de Souza, Jd. La Salle, Toledo-PR).
   - **Técnico Pintura em Estufa**:
     - Atendimento 1 (Manhã): Chevrolet Tracker Premier 2023 (RAY-5H71) — Para-choque Traseiro e Tampa do Porta-Malas — Pintura em Estufa com Curagem Infravermelho — Presencial.
     - Período Bloqueado (Tarde): Manutenção e troca de filtros da estufa pressurizada (14:00 às 16:00).

3. **Carga Automática e Ação Manual na Interface**:
   - **Carga Automática**: Se o `localStorage` não contiver agendamentos ao abrir a plataforma, o seed deve ser injetado automaticamente uma única vez.
   - **Botão de Ação Manual no Cabeçalho**: Um botão discreto e acessível _"Restaurar Dados Demo"_ (com ícone de atualização/varinha mágica) deve permitir recarregar/reiniciar os dados fictícios a qualquer momento durante avaliações, exibindo confirmação visual.

4. **Preservação de Todas as Validações e FSM**:
   - Todos os dados gerados devem respeitar os esquemas do TypeScript, status `CONFIRMED`, telefones válidos com DDD 45, protocolos padronizados (`#BRS-XXXX`) e links funcionais de WhatsApp.

---

## 3. Critérios de Aceitação

- **AC-048-01**: A função `ensureSeedData(force?: boolean)` popula os agendamentos e bloqueios na data atual da máquina cliente.
- **AC-048-02**: Ao acessar `/agendamentos` e logar, a grade exibe imediatamente os cards verdes de atendimentos confirmados distribuídos entre as colunas dos 3 técnicos.
- **AC-048-03**: Os botões de WhatsApp de cada card geram links válidos para `https://wa.me/5545...` contendo a Pré-OS formatada.
- **AC-048-04**: O botão manual _"Restaurar Dados Demo"_ no cabeçalho recarrega a base com sucesso e emite notificação/feedback de atualização.
- **AC-048-05**: 100% de cobertura nos testes unitários e aprovação nos Quality Gates (`bun run test`, `bun run lint`, `bun run build`).
