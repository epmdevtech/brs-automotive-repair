# Plano de testes de segurança — briefing operacional (SEC-AUDIT-001)

| Campo   | Valor                                                                 |
| ------- | --------------------------------------------------------------------- |
| Auditoria | SEC-AUDIT-001 (2026-10-20)                                          |
| Branch  | `security/master-briefing-audit`                                      |
| Ambiente | Local (`http://localhost:5210`) + projeto Supabase de teste (contas sintéticas) |

> Todos os testes usam dados sintéticos. Nenhuma conta real de cliente é
> utilizada ou alterada.

---

## 1. Comandos executados

| Comando | Resultado |
| ------- | --------- |
| `bun run lint` | 0 erros (7 avisos preexistentes de `react-refresh`) |
| `bun run test` | 64 arquivos, 531 testes, todos passando |
| `bun run build` | Concluído sem falhas |
| `bunx playwright test e2e/security-briefing-access-control.spec.ts` | 10 casos (2 marcados como falha esperada até a aplicação da migração) |
| `bunx playwright test e2e/briefing-exportacao-pdf.spec.ts` | 1 caso passando |
| `bun audit` | 16 alertas (12 `high`, 4 `moderate`), nenhum alcançável em produção |
| `npm audit` | Não aplicável: o repositório usa `bun.lock` (sem `package-lock.json`) |
| `bun install --frozen-lockfile --dry-run` | Sem divergência entre manifesto e lockfile |
| `python3 scripts/generate_traceability.py` | Matriz de rastreabilidade regenerada |

---

## 2. Casos automatizados

### 2.1 Regressão unitária — `src/test/security-hardening.test.ts`

| ID | Verifica |
| -- | -------- |
| AC-SEC-01 | CSP, `nosniff`, `DENY`, `Referrer-Policy` e `Permissions-Policy` presentes |
| AC-SEC-02 | HSTS apenas em HTTPS |
| AC-SEC-03 | CSP de desenvolvimento relaxa somente script e conexão |
| AC-SEC-04 | CSP de produção mantém as diretivas restritivas |
| AC-SEC-05 | `redirect` aceita apenas caminhos internos permitidos |
| AC-SEC-06 | `redirect` rejeita URLs externas, `//host`, barras invertidas e quebras de linha |
| AC-SEC-07 | Valor ausente/vazio cai no destino padrão |
| AC-SEC-08 | Cookie de sessão `httpOnly`, `sameSite=lax`, `secure` conforme o protocolo |
| AC-SEC-09 | A aplicação passa `cookieOptions` explícitos ao Supabase SSR |
| AC-SEC-10 | O gatilho de papel é `security invoker` |
| AC-SEC-11 | `profiles` restringe o `UPDATE` à coluna `display_name` |
| AC-SEC-12 | A migração anterior é a que combina `security definer` com `current_user` (regressão do defeito) |

```bash
bunx vitest run src/test/security-hardening.test.ts
```

### 2.2 Controle de acesso ponta a ponta — `e2e/security-briefing-access-control.spec.ts`

Cria duas contas sintéticas (`qa.audit.cliente-a@…` e `qa.audit.cliente-b@…`),
um briefing, respostas, um arquivo e uma trilha de auditoria, e executa:

| # | Caso | Resultado |
| - | ---- | --------- |
| 1 | Cliente B não lê briefings, respostas, arquivos nem auditoria de A | Passa |
| 2 | Cliente B não altera (`PATCH`) nem apaga (`DELETE`) o briefing de A | Passa |
| 3 | Cliente B não assina URL, não faz upload nem remove o arquivo de A | Passa |
| 4 | Cliente B não injeta auditoria no briefing de A | Passa |
| 5 | Usuário não autenticado não acessa briefings | Passa |
| 6 | `anon` não executa `is_admin` | **Falha esperada** (pendente: migração `20261021000200`) |
| 7 | Cliente não consegue elevar o próprio `role` | **Falha esperada** (pendente: migração `20261021000200`) |
| 8 | Cliente B não lê o perfil de terceiros | Passa |
| 9 | Administrador lista todos os briefings, assina o arquivo e lê a auditoria | Passa |
| 10 | A interface bloqueia `/admin/briefings` para o Cliente B | Passa |

As contas e os objetos sintéticos são removidos ao final da execução
(`afterAll`), e o papel do Cliente B é restaurado para `client` após cada
caso (`afterEach`).

```bash
bunx playwright test e2e/security-briefing-access-control.spec.ts
```

Pré-requisitos: `SUPABASE_URL`, `SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` no ambiente (ou em `.env`).

---

## 3. Verificações manuais executadas durante a auditoria

| # | Verificação | Resultado |
| - | ----------- | --------- |
| M1 | `curl -D - http://localhost:5210/` (dev) | Cabeçalhos de segurança presentes |
| M2 | `curl -D - http://localhost:5211/` (build de produção via `vite preview`) | CSP de produção sem `'unsafe-eval'`, sem `ws:`; `Strict-Transport-Security` ausente por ser HTTP local |
| M3 | Login com `?redirect=https://evil.example/steal` | Redireciona para `/briefing` |
| M4 | Cookie de sessão após o login | `httpOnly: true`, `sameSite: Lax` (`secure: false` apenas por ser HTTP local) |
| M5 | Botão "Sair" no painel administrativo | Sessão encerrada, cookie removido, redirecionamento para `/login` |
| M6 | `/admin/briefings` sem sessão | Redireciona para `/login?redirect=%2Fadmin%2Fbriefings` |
| M7 | Home, login e `/briefing` no build de produção | Sem erros de console e sem violações de CSP |
| M8 | Reprodução da elevação de privilégio (Cliente B → `role = admin`) | **Reproduzida** (HTTP 204 e `is_admin() = true`); revertida ao final |
| M9 | Varredura do `dist/` por valores do `.env` | Nenhuma ocorrência de URL, chave anônima ou chave de serviço |

---

## 4. Reprodução segura dos achados críticos

### SEC-01 — elevação de privilégio (somente em ambiente de teste)

```bash
# 1. criar uma conta sintética de cliente (service role)
curl -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"qa.audit.prova@exemplo.invalid","password":"QaAudit-2026!","email_confirm":true}'

# 2. autenticar e guardar o token
TOKEN=$(curl -s -X POST "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
  -d '{"email":"qa.audit.prova@exemplo.invalid","password":"QaAudit-2026!"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# 3. tentar elevar o próprio papel (esperado: 400/42501 após a correção)
curl -X PATCH "$SUPABASE_URL/rest/v1/profiles?id=eq.<uuid-do-cliente>" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"role":"admin"}'

# 4. conferir o papel efetivo (esperado: "client")
curl -s "$SUPABASE_URL/rest/v1/profiles?select=role" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $TOKEN"

# 5. remover a conta sintética
curl -X DELETE "$SUPABASE_URL/auth/v1/admin/users/<uuid-do-cliente>" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

> Sem a migração `20261021000200`, o passo 3 responde `204` e o passo 4
> responde `"admin"`. Com a migração aplicada, o passo 3 responde erro e o
> passo 4 mantém `"client"`.

---

## 5. O que não foi testado

- Comportamento da borda (Vercel, WAF, rate limiting, headers na borda).
- Configuração do painel do Supabase (email confirmation, MFA, quotas).
- Caddy/DNS local e TLS.
- Fluxos de recuperação de senha, convite e usuário desativado.
- Carga e comportamento sob concorrência (teste de negação de serviço não é
  executado por autorização explícita).
- Compatibilidade da CSP com navegadores antigos (validado apenas em
  Chromium headless).
