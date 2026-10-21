# Plano de correção — auditoria de segurança do briefing (SEC-AUDIT-001)

| Campo   | Valor                                                            |
| ------- | ---------------------------------------------------------------- |
| Auditoria | SEC-AUDIT-001 (2026-10-20)                                      |
| Branch  | `security/master-briefing-audit`                                 |
| Escopo  | Achados SEC-01 a SEC-17 (relatório em `audit-report.md`)         |

Legenda de estado: **Corrigido no código**, **Pendente no ambiente**
(requer ação manual no Supabase/Vercel), **Pendente de decisão**
(depende de produto/infraestrutura), **Aceito como risco residual**.

---

## P0 — Corrigir antes de qualquer publicação

| # | Ação | Achado | Estado | Responsável |
| - | ---- | ------ | ------ | ----------- |
| 1 | Aplicar `supabase/migrations/20261021000200_profile_role_guard_hardening.sql` no projeto Supabase (SQL Editor ou `supabase db push`) | SEC-01, SEC-09 | **Pendente no ambiente** | Infra / DevOps com acesso ao painel |
| 2 | Remover os marcadores `test.fail` dos dois casos correspondentes em `e2e/security-briefing-access-control.spec.ts` e reexecutar a suíte | SEC-01, SEC-09 | **Pendente no ambiente** | Engenharia (após a ação 1) |
| 3 | Rotacionar a chave de serviço do Supabase e revogar a chave atual | SEC-01 (chave em disco local) | **Pendente no ambiente** | Infra |
| 4 | Trocar as credenciais de teste versionadas (`.env.example` e fallbacks dos specs E2E) por valores vazios/gerados | SEC-10 (cadeia) | **Pendente de decisão** | Engenharia |
| 5 | Confirmar que nenhuma conta de teste existente tem `role = 'admin'` indevido no ambiente | SEC-01 | **Pendente no ambiente** | Engenharia (consulta com service role) |

### Verificação da ação 1

```sql
-- no SQL Editor do Supabase (sessão postgres): deve falhar com 42501
update public.profiles set role = 'admin' where id = '<uuid-de-um-cliente>';
```

```bash
# e, com o token de um cliente comum, deve falhar
curl -X PATCH "$SUPABASE_URL/rest/v1/profiles?id=eq.<uuid>" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer <token-do-cliente>" \
  -H "Content-Type: application/json" -d '{"role":"admin"}'   # esperado: 400/42501
```

---

## P1 — Correções já aplicadas nesta branch (revisar e promover)

| # | Ação | Arquivos | Estado |
| - | ---- | -------- | ------ |
| 6 | Cookie de sessão `httpOnly`, `Secure` em HTTPS e `SameSite=Lax` | `src/features/briefing/server/supabase-server.ts` | **Corrigido no código** |
| 7 | Cabeçalhos de segurança em todas as respostas (CSP, HSTS, `nosniff`, `DENY`, `Referrer-Policy`, `Permissions-Policy`) | `src/lib/security-headers.ts`, `src/start.ts` | **Corrigido no código** |
| 8 | Encerramento de sessão na interface + limpeza do rascunho local | `src/features/briefing/ui/briefing-sign-out-button.tsx` e consumidores | **Corrigido no código** |
| 9 | Allowlist do redirecionamento pós-login | `src/lib/redirect.ts`, `src/routes/login.tsx` | **Corrigido no código** |
| 10 | `.env` fora do contexto de build Docker | `.dockerignore` | **Corrigido no código** |
| 11 | `permissions: contents: read` e versões fixadas no CI | `.github/workflows/ci.yml` | **Corrigido no código** |
| 12 | Suíte E2E de controle de acesso com contas sintéticas | `e2e/security-briefing-access-control.spec.ts` | **Corrigido no código** |
| 13 | Testes de regressão unitários | `src/test/security-hardening.test.ts` | **Corrigido no código** |

**Antes de promover**: revisar o diff completo, executar
`bun run lint`, `bun run test`, `bun run build` e as suítes E2E do briefing
(`briefing-15-etapas`, `briefing-preenchimento-completo`,
`briefing-exportacao-pdf`, `security-briefing-access-control`).

---

## P2 — Endurecimento (próximas iterações)

| # | Ação | Achado | Estado |
| - | ---- | ------ | ------ |
| 14 | Migrar o rascunho do briefing de `localStorage` para `sessionStorage` ou eliminá-lo (o servidor já é a fonte da verdade) | SEC-06 | **Pendente de decisão** |
| 15 | Rotacionar o refresh token: habilitar `refreshSession()` no servidor e corrigir o `maxAge` forçado pelo `@supabase/ssr` (atualizar o SDK) | SEC-13 | **Pendente** |
| 16 | `nonce` por requisição para eliminar `'unsafe-inline'` de `script-src` (depende de suporte do framework ou de sobreposição do payload de hidratação) | SEC-14 | **Pendente de decisão** |
| 17 | Gate de SCA no CI (`bun audit --audit-level=high`) e Dependabot | SEC-10 | **Pendente** |
| 18 | Fixar as actions do GitHub por SHA de commit e a imagem base do Docker por digest | SEC-08 | **Pendente** |
| 19 | Remover dependências diretas não usadas (`@tanstack/router-plugin`, `vite-tsconfig-paths`, `nitro` em beta) | SEC-10, SEC-16 | **Pendente** |
| 20 | Servir `dist/server/server.js` (Nitro) na imagem final em vez de `vite preview`, podando `devDependencies` e definindo `USER` não-root | SEC-16 | **Pendente** |
| 21 | Registrar tentativas de login e de acesso não autorizado (sem PII) para permitir correlação e alerta | Matriz A09 | **Pendente de decisão** |
| 22 | Definir política de retenção e exclusão dos briefings e dos arquivos | Matriz A06 | **Pendente de decisão** |
| 23 | Rate limiting de `/login` na borda (Vercel/WAF) | SEC-11 | **Pendente no ambiente** |
| 24 | Rotular `/agendamentos` como superfície de demonstração e mover a credencial para fora do bundle; exigir proteção server-side antes de receber dados reais | SEC-12 | **Pendente de decisão** |
| 25 | Restringir o dev server a loopback ou configurar `allowedHosts` (o `vite.config.ts` usa `host: "0.0.0.0"`) | SEC-16 | **Pendente** |
| 26 | Excluir `dist/server` do diretório de estáticos na imagem final | SEC-16 | **Pendente** |

---

## Riscos residuais aceitos

| # | Risco | Justificativa |
| - | ----- | ------------- |
| R1 | `script-src 'unsafe-inline'` | Necessário para o payload de hidratação do TanStack Start; mitigado por ausência de sinks de injeção e pela CSP restritiva nas demais diretivas |
| R2 | Sessão de 400 dias imposta pelo SDK | Mitigado por `httpOnly`, `Secure` e logout explícito; corrigir com a ação 15 |
| R3 | Rascunho local em `localStorage` | Dados fictícios/sem PII real no módulo de demonstração; no briefing, mitigado pela limpeza no logout |

---

## Não aplicado de propósito

- Nenhuma alteração de política, gatilho ou dado no Supabase foi executada
  durante a auditoria: a migração foi preparada e versionada, e a aplicação
  ficou como ação manual explícita (ação 1).
- Nenhuma alteração foi feita no painel da Vercel, DNS, Caddy ou em
  configurações de borda.
- Nenhuma credencial de terceiro foi testada e nenhum dado real de cliente foi
  lido.
