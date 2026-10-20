# TASK-076-02 — Correções de segurança em código e migração

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-076-02                                        |
| Status       | Done                                               |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / AppSec Engineer (Universal SDD) |
| SPEC         | SPEC-076                                           |
| Critérios    | AC-076-03, AC-076-04, AC-076-05, AC-076-06, AC-076-07 |
| Dependências | TASK-076-01                                        |

## Objetivo

Corrigir as vulnerabilidades confirmadas com correção local: elevação de
privilégio (migração), cookie de sessão, cabeçalhos de segurança,
encerramento de sessão, allowlist de redirecionamento, contexto Docker e
permissões do CI.

## Escopo

### Incluído

- `supabase/migrations/20261021000200_profile_role_guard_hardening.sql`.
- `src/lib/security-headers.ts` (novo) e middleware em `src/start.ts`.
- `src/features/briefing/server/supabase-server.ts` (opções de cookie).
- `src/features/briefing/ui/briefing-sign-out-button.tsx` (novo) e uso no
  formulário e no painel administrativo.
- `src/lib/redirect.ts` (novo) e `src/routes/login.tsx`.
- `.dockerignore` e `.github/workflows/ci.yml`.

### Não incluído

- Aplicação remota da migração, alterações na Vercel e rotação de credenciais.
- Refatoração do módulo de demonstração de agendamentos.

## Abordagem e impacto

- Arquivos ou componentes prováveis: os listados acima.
- Dados, contratos ou migrações: a migração altera função do gatilho e
  privilégios de coluna em `public.profiles`; não altera dados de clientes.
- Riscos e precauções: CSP pode quebrar SSR — validado em build de produção
  servido por `vite preview`; `Secure` no cookie pode quebrar o ambiente
  local — habilitado apenas quando a requisição é HTTPS.
- ADRs e padrões aplicáveis: ADR-003 (escritor de PDF sem dependência);
  `standards/quality-gates.md`.

## Passos

- [x] Migração de correção do gatilho de papel e dos privilégios de
      `public.profiles`.
- [x] Opções explícitas de cookie (`httpOnly`, `secure`, `sameSite`).
- [x] Middleware de cabeçalhos de segurança em todas as respostas.
- [x] Botão de sair no briefing e no painel administrativo, com limpeza do
      rascunho local.
- [x] Allowlist do redirecionamento pós-login.
- [x] `.env` fora do contexto Docker e `permissions: contents: read` no CI.
- [x] Verificação do comportamento em navegador (dev e build de produção).

## Validação

| Critério/risco                | Teste, comando ou revisão                          | Evidência esperada                     |
| ----------------------------- | -------------------------------------------------- | -------------------------------------- |
| AC-076-03                     | `src/test/security-hardening.test.ts` (AC-SEC-10..12) | Gatilho `security invoker`             |
| AC-076-04                     | AC-SEC-08/09 + verificação em navegador             | Cookie com `httpOnly`                  |
| AC-076-05                     | AC-SEC-01..04 + `curl -D -`                         | Cabeçalhos presentes                   |
| AC-076-06                     | Verificação manual em navegador                     | Cookie removido após "Sair"            |
| AC-076-07                     | AC-SEC-05..07                                        | Redirect externo recusado              |
| Qualidade                     | `bun run lint`, `bun run test`, `bun run build`     | Zero erros e build concluído           |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.

## Resultado

- Mudanças realizadas: ver diff da branch `security/master-briefing-audit`.
- Evidências: comandos de lint, teste, build e E2E executados.
- Pendências ou bloqueios: aplicação da migração no Supabase é ação manual
  (TASK-076-03 e plano de correção).
