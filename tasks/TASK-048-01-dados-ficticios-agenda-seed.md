# TASK-048-01: Implementação da Carga de Dados Fictícios Realistas (Seed) para a Agenda dos Técnicos

## Metadados

- **Task ID**: TASK-048-01
- **Spec Ref**: SPEC-048
- **Status**: CONCLUÍDO
- **Data de Atribuição**: 2026-10-15
- **Data de Conclusão**: 2026-10-15
- **Responsável**: Engenheiro de Software Sênior & Arquiteto TanStack Fullstack

---

## 1. Escopo de Implementação

1. **Módulo de Dados Demonstrativos (`src/features/booking/domain/seed.ts`)**:
   - Criação da função geradora `generateDemoAppointments(baseDate: Date): Appointment[]`.
   - Criação da função geradora `generateDemoBlockedPeriods(baseDate: Date): BlockedPeriod[]`.
   - Criação da função de orquestração `ensureSeedData(force?: boolean): { appointments: number; blocks: number }`.
   - Suporte a veículos realistas (Toyota Corolla, Jeep Compass, Honda Civic, VW T-Cross, Chevrolet Tracker) com placas de Toledo/PR e dados de avarias técnicos reais.

2. **Integração no Repositório Local (`src/features/booking/data/local/local-repository.ts`)**:
   - Adicionar método `clearAndSeed(appointments: Appointment[]): boolean` e notificação de assinantes reativa.
   - Adicionar suporte a `seedBlockedPeriods` em `src/features/booking/domain/blocks.ts`.

3. **Integração na Interface Administrativa (`src/features/booking/ui/admin/admin-grid-view.tsx`)**:
   - Invocação automática de `ensureSeedData(false)` no montador do componente se o repositório estiver vazio.
   - Inclusão do botão _"Restaurar Dados Demo"_ no cabeçalho ou barra de ferramentas da plataforma com feedback visual ao clicar.

4. **Testes Automatizados (`src/test/booking-seed.test.ts`)**:
   - Teste de geração e integridade de campos obrigatórios dos agendamentos seed.
   - Teste da função `ensureSeedData` em storage vazio e sob flag `force: true`.
   - Teste de renderização dos cards na grade da interface.

5. **Quality Gates**:
   - Vitest com 100% de sucesso.
   - ESLint com 0 erros.
   - Prettier format.
   - Compilação SSR Nitro (`bun run build`).
