# TASK-074-02 — Domínio de máscaras, validadores, consulta de CEP e regras condicionais

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-074-02                                        |
| Status       | Done                                               |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD) |
| SPEC         | SPEC-074                                           |
| Critérios    | AC-074-02, AC-074-03, AC-074-04                    |
| Dependências | TASK-074-01, ADR-002                               |

## Objetivo

Máscaras e validadores puros (CEP, CNPJ com DV, telefone, data civil, número pt-BR), consulta de CEP com timeout e falha não bloqueante, regras condicionais com descarte explícito e schema Zod por etapa coerente com o novo domínio.

## Escopo

### Incluído

- Máscaras e validadores puros (CEP, CNPJ com DV, telefone, data civil, número pt-BR), consulta de CEP com timeout e falha não bloqueante, regras condicionais com descarte explícito e schema Zod por etapa coerente com o novo domínio.
- Testes automatizados da entrega e atualização de documentação e rastreabilidade.

### Não incluído

- Publicação em produção, alteração de DNS e promoção de release.
- Migração ou reinterpretação de dados já persistidos.
- Matriz de requisitos de seguradoras e coleta de dados pessoais de colaboradores.

## Abordagem e impacto

- Arquivos ou componentes prováveis: src/features/briefing/domain/masks.ts, src/features/briefing/domain/cep-service.ts, src/features/briefing/domain/conditional.ts, src/features/briefing/domain/section-schemas.ts.
- Dados, contratos ou migrações: nenhum cambio de esquema do banco; novos campos só existem para novos preenchimentos.
- Riscos e precauções: não alterar identificadores persistidos; não apagar resposta de campo ocultado sem aviso; consulta externa nunca bloqueia o formulário.
- ADRs e padrões aplicáveis: ADR-001, ADR-002; `standards/accessibility.md`; `standards/ux-ui.md`; `standards/quality-gates.md`.

## Passos

- [x] src/features/briefing/domain/masks.ts
- [x] src/features/briefing/domain/cep-service.ts
- [x] src/features/briefing/domain/conditional.ts
- [x] src/features/briefing/domain/section-schemas.ts
- [ ] Execução de lint, testes e build.

## Validação

| Critério/risco                  | Teste, comando ou revisão       | Evidência esperada                   |
| ------------------------------- | ------------------------------- | ------------------------------------ |
| AC-074-02, AC-074-03, AC-074-04 | `bun run test` e E2E            | Aprovação dos testes correspondentes |
| Qualidade                       | `bun run lint`, `bun run build` | Zero erros e build concluído         |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: ver diff da branch `feature/master-briefing-ux`.
- Evidências: comandos de lint, teste, build e E2E executados.
- Pendências ou bloqueios: validação em navegador real e preview dependem de decisão humana.
