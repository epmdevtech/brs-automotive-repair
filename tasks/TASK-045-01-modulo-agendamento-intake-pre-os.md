# TASK-045-01: Implementação do Módulo de Agendamento Online, Intake Pré-OS e Leva e Traz

## Metadados

- **Task ID**: TASK-045-01
- **Spec Ref**: SPEC-045
- **Status**: EM ANDAMENTO
- **Data de Atribuição**: 2026-10-15
- **Responsável**: Engenheiro de Software Sênior & Arquiteto TanStack Fullstack

---

## 1. Escopo de Implementação

1. **Fase 1: Núcleo Puro do Domínio (`src/features/booking/domain/`)**:
   - `types.ts`: Definições tipadas de Appointment, Service, VehicleData, DamageIntake, LogisticsData, Result<T, E>.
   - `time.ts`: Manipulação com TZDate (`America/Sao_Paulo`), formatação e sobreposições.
   - `phone.ts`: Normalizador E.164 com os 67 DDDs brasileiros.
   - `status.ts`: FSM com transições de status válidas.
   - `intake.ts`: Definição de peças automotivas afetadas e tipos de avaria.
   - `schemas.ts`: Schemas de validação com Zod.
   - `availability.ts`: Motor de slots, colisão $\max(startA, startB) < \min(endA, endB)$, buffers e turnos.

2. **Fase 2: Testes Unitários do Domínio (`src/test/booking-domain.test.ts`)**:
   - Testar cálculo de slots livres em dias úteis e sábados.
   - Testar colisão com e sem buffer.
   - Testar alocação de Leva e Traz com buffer ampliado.
   - Testar normalização E.164 e rejeição de DDDs inválidos.
   - Testar FSM de transição de status.

3. **Fase 3: Configuração e Persistência Segura (`config/` & `data/`)**:
   - `config/booking.config.ts`: Configuração BRS com turnos, catálogo e Leva e Traz.
   - `data/repository.ts`: Interface assíncrona BookingRepository.
   - `data/local/local-repository.ts`: Persistência local com Web Locks API (`navigator.locks`), idempotência (UUID) e BroadcastChannel multi-aba.

4. **Fase 4: Hook Reativo e Interface de Agendamento (`hooks/` & `ui/`)**:
   - `hooks/use-booking.ts`: Gestão do estado do agendamento, query de slots e submissão atômica.
   - `ui/booking-dialog.tsx`: Modal em etapas com Radix UI Dialog:
     - Etapa 1: Veículo & Avarias (Pré-OS)
     - Etapa 2: Serviço Desejado
     - Etapa 3: Modalidade (Presencial na Oficina vs. Leva e Traz em Toledo)
     - Etapa 4: Calendário & Horários (Manhã / Tarde)
     - Etapa 5: Identificação do Cliente (Nome, Celular E.164, LGPD)
     - Etapa 6: Confirmação Atômica, Protocolo #BRS-XXXXX e Resumo da Pré-OS.

5. **Fase 5: Integração com as Rotas do Projeto**:
   - Disponibilizar trigger do Diálogo na rota `/contato` como opção avançada "Agendar Avaliação / Pré-OS Online" ao lado do formulário tradicional.
   - Integrar nas chamadas de CTA pertinentes.

6. **Fase 6: Quality Gates e Validação**:
   - `bun run test` (100% de aprovação).
   - `bun run lint` (zero erros).
   - `bun run build` (build cliente e Nitro SSR sem erros).
