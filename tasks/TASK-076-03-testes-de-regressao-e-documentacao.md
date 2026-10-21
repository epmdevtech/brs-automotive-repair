# TASK-076-03 — Testes de regressão, documentação e revisão da auditoria

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-076-03                                        |
| Status       | Done                                               |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / AppSec Engineer (Universal SDD) |
| SPEC         | SPEC-076                                           |
| Critérios    | AC-076-02, AC-076-08, AC-076-09                    |
| Dependências | TASK-076-01, TASK-076-02                           |

## Objetivo

Automatizar a regressão das correções de segurança, entregar a documentação
versionada da auditoria e revisar a entrega.

## Escopo

### Incluído

- `src/test/security-hardening.test.ts` (12 casos de regressão).
- `e2e/security-briefing-access-control.spec.ts` (10 casos com contas
  sintéticas, limpeza ao final).
- `docs/security/security-test-plan.md`.
- `reviews/REVIEW-076-auditoria-de-seguranca-briefing.md`.
- Matriz de rastreabilidade regenerada.

### Não incluído

- Testes de intrusão, carga ou DAST completo.

## Abordagem e impacto

- Arquivos ou componentes prováveis: `src/test/`, `e2e/`, `docs/security/`.
- Dados, contratos ou migrações: apenas dados sintéticos, removidos ao final
  da execução do E2E.
- Riscos e precauções: os dois casos que dependem da migração remota estão
  marcados como falha esperada (`test.fail`) com a pendência escrita, para que
  a falha real continue visível até a correção ser aplicada.
- ADRs e padrões aplicáveis: `standards/quality-gates.md`.

## Passos

- [x] Testes unitários das correções.
- [x] E2E de controle de acesso com quatro papéis.
- [x] Plano de testes com comandos e reprodução segura.
- [x] Revisão REVIEW-076 e matriz de rastreabilidade.

## Validação

| Critério/risco                | Teste, comando ou revisão                      | Evidência esperada                   |
| ----------------------------- | ---------------------------------------------- | ------------------------------------ |
| AC-076-02                     | `bunx playwright test e2e/security-briefing-access-control.spec.ts` | 10 casos executados        |
| AC-076-08                     | `docs/security/`                               | Quatro entregáveis versionados       |
| AC-076-09                     | `bun run lint`, `bun run test`, `bun run build` | Zero erros, testes e build verdes    |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.

## Resultado

- Mudanças realizadas: suíte de regressão, entregáveis de `docs/security/` e
  revisão.
- Evidências: comandos de lint, teste, build e E2E executados.
- Pendências ou bloqueios: remover os marcadores `test.fail` após a aplicação
  da migração `20261021000200` no Supabase.
