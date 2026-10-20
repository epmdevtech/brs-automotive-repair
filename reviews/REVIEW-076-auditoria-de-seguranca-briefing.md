# REVIEW-076 — Auditoria de segurança do briefing operacional da Master Chapeação

| Campo      | Valor                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| ID         | REVIEW-076                                                                                           |
| SPEC/TASK  | `SPEC-076` / `TASK-076-01` a `TASK-076-03`                                                          |
| Status     | Approved                                                                                             |
| Data       | 2026-10-20                                                                                           |
| Revisor    | Senior Full Stack / AppSec Engineer (Universal SDD)                                                  |
| Evidências | `bun run lint`, `bun run test`, `bun run build`, E2E Playwright, `bun audit`, testes dinâmicos no Supabase de teste |

---

## 1. Sumário

A auditoria do briefing operacional (OWASP Top 10:2025) encontrou a aplicação
**sólida na camada de aplicação** — autorização revalidada no servidor em
todas as operações, RLS em todas as tabelas, bucket privado, caminho de
arquivo derivado no servidor, validação de MIME e tamanho, CSRF ativo e
normalização de erros sem stack trace — e **uma falha crítica na camada de
banco**: o gatilho que deveria impedir a elevação de privilégio em
`public.profiles.role` foi escrito como `security definer`, o que faz a
condição `current_user in ('postgres', 'supabase_admin')` ser sempre verdadeira.
Na prática, **qualquer cliente autenticado consegue se autoelevar a
administrador** e ler, via RLS, os briefings de todos os clientes.

O achado foi reproduzido de forma controlada com contas sintéticas e
revertido em seguida. A correção foi versionada como migração
(`20261021000200_profile_role_guard_hardening.sql`), que recria o gatilho
como `security invoker`, restringe a atualização de `profiles` à coluna
`display_name` e revoga a execução de `is_admin()` para `anon`. A aplicação
remota da migração ficou como ação manual explícita, por decisão de não
alterar configuração do ambiente durante a auditoria.

Além disso, foram corrigidos no código: o cookie de sessão (agora `httpOnly` e
`Secure` em HTTPS), a ausência total de cabeçalhos de segurança (agora CSP,
HSTS condicional, `nosniff`, `DENY`, `Referrer-Policy` e `Permissions-Policy`
em todas as respostas), a inexistência de encerramento de sessão (agora há
botão "Sair" no briefing e no painel, que apaga o rascunho local) e a ausência
de validação do redirecionamento pós-login (agora com allowlist).

## 2. Achados por severidade

| Severidade | Quantidade | IDs |
| ---------- | ---------- | --- |
| Crítico | 1 | SEC-01 |
| Alto | 3 | SEC-02, SEC-03, SEC-04 |
| Médio | 6 | SEC-05, SEC-06, SEC-07, SEC-08, SEC-09, SEC-10 |
| Baixo | 4 | SEC-11, SEC-12, SEC-13, SEC-14 |
| Informativo | 3 | SEC-15, SEC-16, SEC-17 |

Detalhamento, evidências e correções em
[`docs/security/audit-report.md`](../docs/security/audit-report.md); matriz por
categoria em
[`docs/security/owasp-top-10-matrix.md`](../docs/security/owasp-top-10-matrix.md).

## 3. Verificações executadas

| Verificação | Resultado |
| ----------- | --------- |
| Isolamento entre clientes (leitura, escrita, exclusão, arquivos, auditoria) | Approved — Cliente B sem acesso aos dados de A |
| Elevação de privilégio | **Failed** (achado SEC-01) — corrigido em migração, pendente de aplicação |
| Cookie de sessão | Approved após correção (`httpOnly` observado em execução) |
| Cabeçalhos de segurança | Approved após correção (dev e build de produção) |
| Encerramento de sessão | Approved após correção (cookie removido, redirecionamento para `/login`) |
| Redirecionamento pós-login | Approved após correção |
| Dependências | 16 alertas, nenhum alcançável em produção; sem gate de SCA no CI |
| Lint, testes e build | Approved (0 erros de lint; 531 testes; build concluído) |

## 4. Desvios e limitações

- O estado efetivo do banco divergiu do código das migrações (SEC-01 e
  SEC-09), o que prova a necessidade de aplicar as migrações de forma
  controlada e verificar o estado depois.
- Não houve acesso ao SQL Editor, à Vercel, ao Caddy ou ao DNS: as
  políticas foram verificadas por comportamento, não por leitura de catálogo.
- Não foram executados DAST, fuzzing, pentest ou testes de carga.
- A CSP mantém `'unsafe-inline'` em `script-src` porque o payload de
  hidratação do framework é inline; o nonce por requisição está registrado como
  pendência.

## 5. Decisão

**Approved com pendências.** As correções de código estão verificadas e
regressão automatizada. Antes de qualquer publicação, é obrigatória a
aplicação da migração `20261021000200_profile_role_guard_hardening.sql` no
projeto Supabase e a remoção dos marcadores `test.fail` correspondentes. As
demais pendências estão priorizadas em
[`docs/security/remediation-plan.md`](../docs/security/remediation-plan.md).
