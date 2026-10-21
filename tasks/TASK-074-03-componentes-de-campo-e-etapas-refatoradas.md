# TASK-074-03 — Componentes de campo, layout das 15 etapas e revisão final

| Campo        | Valor                                                 |
| ------------ | ----------------------------------------------------- |
| ID           | TASK-074-03                                           |
| Status       | In progress                                           |
| Data         | 2026-10-20                                            |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD)    |
| SPEC         | SPEC-074                                              |
| Critérios    | AC-074-02, AC-074-03, AC-074-05, AC-074-07, AC-074-08 |
| Dependências | TASK-074-02                                           |

## Objetivo

Componentes reutilizáveis (entrada mascarada, data em segmentos, radio group, número com unidade, bloco de endereço), agrupamento por assunto, hierarquia de etapa, resumo de erros acessível, campos condicionais com aviso e revisão final com pendências e confirmação explícita.

## Escopo

### Incluído

- Componentes reutilizáveis (entrada mascarada, data em segmentos, radio group, número com unidade, bloco de endereço), agrupamento por assunto, hierarquia de etapa, resumo de erros acessível, campos condicionais com aviso e revisão final com pendências e confirmação explícita.
- Testes automatizados da entrega e atualização de documentação e rastreabilidade.

### Não incluído

- Publicação em produção, alteração de DNS e promoção de release.
- Migração ou reinterpretação de dados já persistidos.
- Matriz de requisitos de seguradoras e coleta de dados pessoais de colaboradores.

## Abordagem e impacto

- Arquivos ou componentes prováveis: src/features/briefing/ui/fields/, src/features/briefing/ui/briefing-step-form.tsx, src/features/briefing/ui/briefing-review.tsx, src/features/briefing/ui/briefing-operacional-container.tsx.
- Dados, contratos ou migrações: nenhum cambio de esquema do banco; novos campos só existem para novos preenchimentos.
- Riscos e precauções: não alterar identificadores persistidos; não apagar resposta de campo ocultado sem aviso; consulta externa nunca bloqueia o formulário.
- ADRs e padrões aplicáveis: ADR-001, ADR-002; `standards/accessibility.md`; `standards/ux-ui.md`; `standards/quality-gates.md`.

## Passos

- [x] src/features/briefing/ui/fields/
- [x] src/features/briefing/ui/briefing-step-form.tsx
- [x] src/features/briefing/ui/briefing-review.tsx
- [x] src/features/briefing/ui/briefing-operacional-container.tsx
- [x] Execução de lint, testes e build.

## Validação

| Critério/risco                                        | Teste, comando ou revisão       | Evidência esperada                   |
| ----------------------------------------------------- | ------------------------------- | ------------------------------------ |
| AC-074-02, AC-074-03, AC-074-05, AC-074-07, AC-074-08 | `bun run test` e E2E            | Aprovação dos testes correspondentes |
| Qualidade                                             | `bun run lint`, `bun run build` | Zero erros e build concluído         |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: ver diff da branch `feature/master-briefing-ux`.
- Evidências: comandos de lint, teste, build e E2E executados.
- Correção pós-revisão (branch `fix/briefing-ui-selects`): removidas as
  definições duplicadas de `empresa.endereco`, `empresa.enderecoNumero` e
  `empresa.enderecoComplemento` em `steps.ts` (chaves React duplicadas) e
  substituído o uso indevido de exports inexistentes de `@radix-ui/react-select`
  pelo wrapper `src/components/ui/select.tsx`; lint sem erros, build concluído,
  `bun run test` com 531/531 testes aprovados e E2E
  `briefing-15-etapas`/`briefing-preenchimento-completo` aprovados, sem erros de
  console (chave duplicada ou elemento inválido).
- Pendências ou bloqueios: validação em navegador real e preview dependem de decisão humana.
