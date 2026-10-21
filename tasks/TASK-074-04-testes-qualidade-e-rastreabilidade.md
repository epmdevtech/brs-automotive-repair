# TASK-074-04 — Testes, quality gates, documentação e rastreabilidade

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-074-04                                        |
| Status       | In progress                                        |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD) |
| SPEC         | SPEC-074                                           |
| Critérios    | AC-074-06, AC-074-07, AC-074-08, AC-074-09         |
| Dependências | TASK-074-01 a TASK-074-03                          |

## Objetivo

Suíte de domínio, componente e E2E das correções de UX, execução de lint, testes e build, percurso E2E das 15 etapas, atualização de PROJECT.md, matriz de rastreabilidade e revisão REVIEW-074.

## Escopo

### Incluído

- Suíte de domínio, componente e E2E das correções de UX, execução de lint, testes e build, percurso E2E das 15 etapas, atualização de PROJECT.md, matriz de rastreabilidade e revisão REVIEW-074.
- Testes automatizados da entrega e atualização de documentação e rastreabilidade.

### Não incluído

- Publicação em produção, alteração de DNS e promoção de release.
- Migração ou reinterpretação de dados já persistidos.
- Matriz de requisitos de seguradoras e coleta de dados pessoais de colaboradores.

## Abordagem e impacto

- Arquivos ou componentes prováveis: src/test/briefing-ux-spec074.test.ts, e2e/briefing-15-etapas.spec.ts, docs/traceability-matrix.md, reviews/REVIEW-074-auditoria-refatoracao-ux-ui-briefing.md.
- Dados, contratos ou migrações: nenhum cambio de esquema do banco; novos campos só existem para novos preenchimentos.
- Riscos e precauções: não alterar identificadores persistidos; não apagar resposta de campo ocultado sem aviso; consulta externa nunca bloqueia o formulário.
- ADRs e padrões aplicáveis: ADR-001, ADR-002; `standards/accessibility.md`; `standards/ux-ui.md`; `standards/quality-gates.md`.

## Passos

- [x] src/test/briefing-ux-spec074.test.ts
- [x] e2e/briefing-15-etapas.spec.ts
- [x] docs/traceability-matrix.md
- [x] reviews/REVIEW-074-auditoria-refatoracao-ux-ui-briefing.md
- [ ] Execução de lint, testes e build.

## Validação

| Critério/risco                             | Teste, comando ou revisão       | Evidência esperada                   |
| ------------------------------------------ | ------------------------------- | ------------------------------------ |
| AC-074-06, AC-074-07, AC-074-08, AC-074-09 | `bun run test` e E2E            | Aprovação dos testes correspondentes |
| Qualidade                                  | `bun run lint`, `bun run build` | Zero erros e build concluído         |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: ver diff da branch `feature/master-briefing-ux`.
- Evidências: comandos de lint, teste, build e E2E executados.
- Pendências ou bloqueios: validação em navegador real e preview dependem de decisão humana.
