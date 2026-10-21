# TASK-073-02 — Domínio validado e camada de servidor do briefing

| Campo        | Valor                                                 |
| ------------ | ----------------------------------------------------- |
| ID           | TASK-073-02                                           |
| Status       | Done                                                  |
| Data         | 2026-10-20                                            |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD)    |
| SPEC         | SPEC-073                                              |
| Critérios    | AC-073-02, AC-073-03, AC-073-04, AC-073-05, AC-073-06 |
| Dependências | TASK-073-01, ADR-001                                  |

## Objetivo

Implementar o domínio puro validado (schema Zod por etapa, transições de status, matriz de permissões, política de arquivos) e a camada de servidor do briefing (cliente Supabase SSR, autenticação por cookie, persistência por etapa, envio idempotente, arquivos privados e operações administrativas), com autorização verificada no servidor.

## Escopo

### Incluído

- `src/features/briefing/domain/section-schemas.ts`, `status.ts`, `roles.ts`, `file-policy.ts`.
- `src/features/briefing/server/supabase-server.ts`, `errors.ts`, `auth-service.ts`, `briefing-service.ts`, `file-service.ts`, `functions.ts`.
- Validação Zod no servidor antes de qualquer gravação; normalização de erros do provedor.

### Não incluído

- Interface e rotas (TASK-073-03).
- Testes automatizados e documentação final (TASK-073-04).

## Abordagem e impacto

- Arquivos ou componentes prováveis: `src/features/briefing/domain/*`, `src/features/briefing/server/*`.
- Dados, contratos ou migrações: `briefings`, `briefing_answers` (JSONB por `section_key`), `briefing_files`, `briefing_activity`, `profiles`.
- Riscos e precauções: o cliente nunca define propriedade nem papel; toda função de servidor resolve a sessão e o papel no servidor; payload de etapa limitado.
- ADRs e padrões aplicáveis: ADR-001; `standards/security.md`; `standards/testing.md`.

## Passos

- [x] Schema Zod por etapa derivado das definições data-driven, com pendências aceitas.
- [x] Matriz de transições de status e matriz de permissões por papel.
- [x] Política de arquivos (MIME, tamanho, caminho controlado).
- [x] Cliente Supabase SSR com cookie de requisição/resposta.
- [x] Serviço de autenticação (sessão, papel, atividade).
- [x] Serviço de briefing (criar/obter, salvar etapa, carregar, enviar, exportar).
- [x] Serviço de arquivos (upload, listagem, URL assinada, remoção autorizada).
- [x] Funções de servidor `createServerFn` com `inputValidator`.

## Validação

| Critério/risco | Teste, comando ou revisão       | Evidência esperada                                  |
| -------------- | ------------------------------- | --------------------------------------------------- |
| AC-073-02      | Teste de schema por etapa       | Etapa inválida é recusada pelo servidor             |
| AC-073-04      | Teste de envio idempotente      | Segundo envio não duplica nem muda status           |
| AC-073-05      | Teste de isolamento             | Cliente não acessa briefing de terceiro             |
| AC-073-06      | Teste de escalada de privilégio | Cliente não altera papel nem executa operação admin |
| Qualidade      | `bun run lint`, `bun run test`  | Sem erros                                           |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade finalizadas em `docs/supabase-briefing.md` e na matriz.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: domínio puro e camada de servidor com autorização no servidor, persistência por etapa, envio idempotente e arquivos privados.
- Evidências: testes unitários com provedor Supabase simulado cobrem revalidação, idempotência, isolamento, escalada e arquivos.
- Pendências ou bloqueios: validação contra o Supabase real depende de credenciais externas.
