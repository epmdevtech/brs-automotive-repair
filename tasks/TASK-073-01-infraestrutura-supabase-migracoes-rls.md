# TASK-073-01 — Infraestrutura Supabase do briefing (variáveis, migrações, RLS e Storage)

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-073-01                                        |
| Status       | Done                                               |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD) |
| SPEC         | SPEC-073                                           |
| Critérios    | AC-073-06, AC-073-07, AC-073-09                    |
| Dependências | ADR-001                                            |

## Objetivo

Entregar a infraestrutura de dados do briefing: variáveis de ambiente por ambiente sem segredos versionados, migração SQL versionada com esquema, RLS, gatilhos de integridade e bucket privado com políticas de Storage.

## Escopo

### Incluído

- `.env.example` com placeholders e `.gitignore` protegido para arquivos `.env` reais.
- `src/features/briefing/server/env.ts` com leitura tipada de ambiente e detecção de configuração ausente.
- `supabase/migrations/20261020000100_briefing_core.sql` com enum de status, tabelas `profiles`, `briefings`, `briefing_answers`, `briefing_files`, `briefing_activity`, índices, RLS, gatilhos e bucket.
- `docs/supabase-briefing.md` com provisionamento, aplicação da migração, criação de usuários, papel `admin`, bucket, retenção e rollback.

### Não incluído

- Provisionamento real do projeto Supabase e preenchimento de credenciais.
- Backend de aplicação e rotas (TASK-073-02 e TASK-073-03).
- Publicação em produção.

## Abordagem e impacto

- Arquivos ou componentes prováveis: `.env.example`, `src/features/briefing/server/env.ts`, `supabase/migrations/`, `docs/supabase-briefing.md`, `.gitignore`.
- Dados, contratos ou migrações: enum `briefing_status` (`draft`, `submitted`, `in_review`, `awaiting_information`, `completed`), tabelas e políticas conforme SPEC-073.
- Riscos e precauções: políticas irrestritas são proibidas; chave `service_role` nunca é referenciada por variável `VITE_`; o papel do cliente não pode ser elevado por si mesmo.
- ADRs e padrões aplicáveis: ADR-001; `standards/security.md`; `standards/commits.md`.

## Passos

- [x] Criar `.env.example` e garantir que `.env` real permanece ignorado.
- [x] Implementar `env.ts` com leitura de `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` exclusivamente no servidor.
- [x] Escrever a migração SQL com esquema, índices, RLS, gatilhos de transição de status, proteção de elevação de papel e bucket privado.
- [x] Documentar provisionamento, configuração, retenção e rollback.
- [ ] Validar a migração em um projeto Supabase de desenvolvimento (pendência externa, registrada em `docs/supabase-briefing.md`).

## Validação

| Critério/risco | Teste, comando ou revisão                    | Evidência esperada                            |
| -------------- | -------------------------------------------- | --------------------------------------------- |
| AC-073-09      | Inspeção do bundle e de `package.json`       | Nenhuma chave privilegiada exposta ao cliente |
| AC-073-06      | Revisão do SQL de RLS e de elevação de papel | Cliente não altera o próprio `role`           |
| AC-073-07      | Revisão das políticas de Storage             | Bucket privado, sem leitura pública           |
| Qualidade      | `bun run lint`, `bun run test`               | Sem erros                                     |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [ ] Migração validada em ambiente Supabase de desenvolvimento (pendência externa, registrada).
- [x] Documentação e rastreabilidade foram atualizadas.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: `.env.example`, `env.ts`, migração SQL com RLS e bucket, documentação de provisionamento.
- Evidências: política restritiva por padrão em todas as tabelas; nenhuma variável `VITE_` privilegiada; comandos de lint e teste aprovados.
- Pendências ou bloqueios: aplicação da migração e criação do projeto Supabase dependem de credenciais externas, ainda não fornecidas.
