# TASK-074-01 — Auditoria das 15 etapas e plano de correções

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-074-01                                        |
| Status       | Done                                               |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD) |
| SPEC         | SPEC-074                                           |
| Critérios    | AC-074-01                                          |
| Dependências | ADR-001, ADR-002                                   |

## Objetivo

Matriz de auditoria com campo, problema, impacto, correção e teste por etapa, além do registro das correções priorizadas e dos itens deliberadamente não alterados.

## Escopo

### Incluído

- Matriz de auditoria com campo, problema, impacto, correção e teste por etapa, além do registro das correções priorizadas e dos itens deliberadamente não alterados.
- Testes automatizados da entrega e atualização de documentação e rastreabilidade.

### Não incluído

- Publicação em produção, alteração de DNS e promoção de release.
- Migração ou reinterpretação de dados já persistidos.
- Matriz de requisitos de seguradoras e coleta de dados pessoais de colaboradores.

## Abordagem e impacto

- Arquivos ou componentes prováveis: docs/auditoria-briefing-15-etapas.md.
- Dados, contratos ou migrações: nenhum cambio de esquema do banco; novos campos só existem para novos preenchimentos.
- Riscos e precauções: não alterar identificadores persistidos; não apagar resposta de campo ocultado sem aviso; consulta externa nunca bloqueia o formulário.
- ADRs e padrões aplicáveis: ADR-001, ADR-002; `standards/accessibility.md`; `standards/ux-ui.md`; `standards/quality-gates.md`.

## Passos

- [x] docs/auditoria-briefing-15-etapas.md
- [ ] Execução de lint, testes e build.

## Validação

| Critério/risco | Teste, comando ou revisão       | Evidência esperada                   |
| -------------- | ------------------------------- | ------------------------------------ |
| AC-074-01      | `bun run test` e E2E            | Aprovação dos testes correspondentes |
| Qualidade      | `bun run lint`, `bun run build` | Zero erros e build concluído         |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: ver diff da branch `feature/master-briefing-ux`.
- Evidências: comandos de lint, teste, build e E2E executados.
- Pendências ou bloqueios: validação em navegador real e preview dependem de decisão humana.
