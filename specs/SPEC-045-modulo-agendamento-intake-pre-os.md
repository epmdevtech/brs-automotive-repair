# SPEC-045: Módulo de Agendamento Online, Intake Técnico (Pré-OS) e Leva e Traz

## Status

- **Status**: APROVADO
- **Data**: 2026-10-15
- **Autor**: Arquiteto Especialista em Agendamento & TanStack Fullstack
- **Task Ref**: TASK-045-01
- **Spec Ref**: SPEC-045

---

## 1. Contexto e Motivação

A BRS Reparações Automotivas atua com serviços automotivos especializados de alta complexidade (Funilaria, Pintura em Estufa, Martelinho de Ouro, Estética Automotiva e Polimento de Para-brisa). Diferente de serviços de execução curta e preço fixo (como barbearias e clínicas), a reparação automotiva exige uma etapa preliminar de avaliação física das avarias e frequentemente envolve conveniência logística (Serviço Leva e Traz em Toledo-PR).

Para elevar a experiência do cliente e transformar o agendamento em um ponto de contato de alto valor profissional, este módulo implementa uma arquitetura em 5 camadas (Domain-Driven Design), com motor matemático de disponibilidade $[start, end)$, concorrência atômica via Web Locks API (`navigator.locks`), sincronização multi-aba via `BroadcastChannel` e formulário conversacional em etapas com intake detalhado do veículo e avarias (Pré-OS) e opção de Leva e Traz.

---

## 2. Arquitetura em Camadas (`src/features/booking/`)

```text
src/features/booking/
├── domain/                  # 100% Pura: Zero React, Zero DOM, Zod schemas, tipos e matemática
│   ├── types.ts             # Entidades, Enums, DTOs e Result<T, E>
│   ├── schemas.ts           # Validações Zod (veículo, intake, avarias, contato, agendamento)
│   ├── time.ts              # TZDate (America/Sao_Paulo), intervalos semiabertos e formatação
│   ├── phone.ts             # Normalizador E.164 e validador estrito dos 67 DDDs brasileiros
│   ├── status.ts            # FSM (PENDING -> CONFIRMED -> COMPLETED | CANCELLED | NO_SHOW)
│   ├── intake.ts            # Mapeamento técnico de avarias, peças e logística Leva e Traz
│   └── availability.ts      # Motor matemático puro de slots e algoritmo anti-colisão
├── config/                  # Configuração desacoplada do nicho BRS
│   └── booking.config.ts    # BRS_BOOKING_CONFIG com turnos, catálogo e regras de Leva e Traz
├── data/                    # Repositório, persistência e travas de concorrência
│   ├── repository.ts        # Contrato da interface BookingRepository
│   └── local/
│       └── local-repository.ts # Implementação Web Locks API + BroadcastChannel + LocalStorage
├── hooks/                   # Hooks de orquestração e reatividade
│   └── use-booking.ts       # Hook de orquestração do diálogo, slots e criação atômica
└── ui/                      # Superfície conversacional do cliente e visualizador de Pré-OS
    ├── booking-dialog.tsx   # Modal de agendamento em 6 etapas
    ├── vehicle-intake-step.tsx # Seletor de veículo e avarias (peças afetadas)
    ├── logistics-step.tsx   # Escolha de modalidade (Presencial vs. Leva e Traz em Toledo)
    └── pre-os-summary.tsx   # Resumo técnico da Pré-OS com protocolo #BRS-XXXXX
```

---

## 3. Especificação dos Algoritmos Canônicos e Regras de Negócio

### A. Motor Matemático de Disponibilidade (`availability.ts`)

1. **Intervalos Semiabertos**: Cálculos temporais em $[start, end)$.
2. **Buffer de Resguardo & Logística**:
   - Atendimento presencial: $[start, end + bufferMinutes)$.
   - Serviço Leva e Traz: acréscimo de buffer logístico (`levaETrazBufferMinutes`) para deslocamento dentro de Toledo-PR.
3. **Fórmula de Colisão**:
   $$\text{colide} = \max(startA, startB) < \min(endA, endB)$$
4. **Verificação de Turnos e Almoço**: O slot completo deve caber integralmente dentro dos turnos operacionais (Manhã: 08:00–12:00 / Tarde: 13:30–18:00 de Seg a Sex; Sáb: 08:00–12:00).
5. **Atribuição Determinística**: Atribuição balanceada com priorização de ordenação determinística.

### B. Prevenção de Concorrência & Atomicidade (`local-repository.ts`)

1. **Exclusão Mútua**: Uso da Web Locks API (`navigator.locks.request("brs-booking-lock", async () => { ... })`).
2. **Double-Check**: Revalidação de colisão milissegundos antes da persistência. Retorno `{ ok: false, error: "SLOT_TAKEN" }` em caso de corrida.
3. **Idempotência**: Exigência de `idempotencyKey` (UUID v4) gerado na abertura da sessão.
4. **Sincronização Multi-Aba**: Canal `BroadcastChannel("brs-booking-sync")` propagando alterações instantaneamente.

### C. Triagem Técnica do Veículo (Intake Pré-OS) & Leva e Traz

1. **Veículo**: Marca, modelo, ano, cor e placa.
2. **Avarias**: Mapeamento de peças afetadas (para-choques, capô, teto, portas, laterais, para-brisa) e sintoma (amassado s/ quebra de tinta, colisão c/ vinco, arranhão profundo, granizo, etc.).
3. **Leva e Traz**: Endereço em Toledo-PR, condição de rodagem (rodando vs. guincho) e responsável pelo veículo.

---

## 4. Critérios de Aceitação (AC)

- **AC-045-01**: O domínio (`domain/`) deve ser 100% puro, sem dependências de React ou DOM, com validação Zod e timezone fixada em `America/Sao_Paulo`.
- **AC-045-02**: A função `computeAvailableSlots` deve respeitar os turnos, intervalos semiabertos, buffers de resguardo e colisão matemática.
- **AC-045-03**: O repositório local deve implementar `Web Locks API`, `BroadcastChannel` e chave de idempotência com double-check otimista.
- **AC-045-04**: O diálogo conversacional deve guiar o cliente pelas etapas de: (1) Veículo & Avarias; (2) Serviço; (3) Modalidade (Presencial / Leva e Traz); (4) Calendário & Slots; (5) Contato E.164; (6) Protocolo & Pré-OS.
- **AC-045-05**: Ao finalizar, o protocolo `#BRS-XXXXX` e a Pré-OS formatada devem estar disponíveis para cópia para o Instagram `@brsreparacoes` ou confirmação telefônica oficial da BRS.
- **AC-045-06**: Suíte completa de testes unitários no Vitest cobrindo algoritmos de disponibilidade, sanitização E.164 e travas de concorrência.
