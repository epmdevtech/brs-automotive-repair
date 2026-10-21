# Auditoria de segurança — briefing operacional da Master Chapeação

| Campo          | Valor                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| ID             | SEC-AUDIT-001                                                              |
| Data           | 2026-10-20                                                                 |
| Branch auditada | `security/master-briefing-audit` (base: `feature/master-briefing-ux`)      |
| Commit auditado | `41c9334` — `feat(briefing): exporta a evidência em PDF pelo painel administrativo` |
| Método         | OWASP Top 10:2025 (referência principal) + ASVS 5.0.0 (referência secundária) |
| Ambiente       | Local (`http://localhost:5210`) + projeto Supabase de teste `mntsvlryetnrzabprjaq` (apenas contas e dados sintéticos) |
| Autorização    | Solicitação humana explícita de 2026-10-20 (auditoria + correções)         |

> Este relatório **não** declara conformidade com OWASP, ASVS ou qualquer norma.
> Ele descreve o que foi verificado, com evidência, e o que permanece em aberto.

---

## 1. Resumo executivo

A implementação do briefing é **sólida na camada de aplicação**: autorização é
revalidada no servidor em todas as operações, o PostgreSQL aplica RLS em todas
as tabelas, o bucket de Storage é privado, os uploads são validados no servidor
e o caminho de armazenamento é derivado no servidor (nunca do navegador).

A auditoria encontrou **uma vulnerabilidade crítica confirmada**, que é um
defeito no próprio código de migração do projeto: o gatilho que deveria
impedir a elevação de privilégio em `public.profiles.role` foi escrito como
`security definer`, o que faz a checagem `current_user in ('postgres', ...)`
ser **sempre verdadeira**. Na prática, **qualquer usuário autenticado
consegue se autoelevar a `admin`** e, com isso, ler via RLS os briefings de
todos os clientes. A correção está preparada como migração
`supabase/migrations/20261021000200_profile_role_guard_hardening.sql` e está
**pendente de aplicação no projeto Supabase** (ação manual, sem acesso
remoto de SQL nesta auditoria).

Além disso, a ausência de cabeçalhos de segurança, o cookie de sessão
legível por JavaScript e a inexistência de encerramento de sessão foram
**corrigidos no código** nesta branch, com testes de regressão.

| Severidade | Quantidade | Achados |
| ---------- | ---------- | ------- |
| Crítico    | 1          | SEC-01  |
| Alto       | 3          | SEC-02, SEC-03, SEC-04 |
| Médio      | 6          | SEC-05, SEC-06, SEC-07, SEC-08, SEC-09, SEC-10 |
| Baixo      | 4          | SEC-11, SEC-12, SEC-13, SEC-14 |
| Informativo| 3          | SEC-15, SEC-16, SEC-17 |

---

## 2. Escopo

### 2.1 Superfícies auditadas

- **Aplicação**: TanStack Start / TanStack Router, React 19, TypeScript, React
  Hook Form + Zod, Tailwind 4.
- **Servidor**: Server Functions (`src/features/briefing/server/functions.ts`),
  camada de serviço (`briefing-service.ts`, `file-service.ts`,
  `auth-service.ts`, `pdf-service.ts`), cliente Supabase SSR
  (`supabase-server.ts`), leitura de ambiente (`env.ts`), normalização de
  erros (`errors.ts`).
- **Banco**: migrações `20261020000100_briefing_core.sql` e
  `20261021000100_profile_role_guard_privileged.sql`; políticas RLS,
  `SECURITY DEFINER`, bucket privado e políticas de Storage.
- **Rotas**: 21 rotas em `src/routes`, com destaque para `/briefing`,
  `/briefing/confirmacao`, `/admin/briefings`, `/admin/briefings/$briefingId`
  e `/login`.
- **Uploads**: `file-policy.ts` (MIME, tamanho, nome), `file-service.ts`
  (caminho, metadados, URL assinada, exclusão).
- **Configuração**: `vite.config.ts`, `src/start.ts`, `src/server.ts`,
  `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`,
  `.github/workflows/ci.yml`, `bunfig.toml`, `bun.lock`, `package.json`.
- **Fluxos completos**: login, retomada, salvamento por etapa, envio,
  upload/download de arquivos, painel administrativo, mudança de status,
  solicitação de complementação, nota interna, exportação de PDF.

### 2.2 Fora do escopo

- Infraestrutura externa (DNS, CDN, WAF, Vercel), Caddy do ambiente local e
  o painel do Supabase (não há acesso remoto a SQL nesta auditoria).
- Dados reais de clientes: todos os testes usam contas e dados sintéticos.
- Pentest, DAST completo ou teste de intrusão: **não** foram executados.

---

## 3. Metodologia

1. **Estado inicial registrado**: branch, commit, `git status` e árvore de
   trabalho preservados; a auditoria correu em branch própria
   (`security/master-briefing-audit`), sem `reset`, `rebase` ou limpeza.
2. **Análise estática** de todo o código de servidor, das migrações e das
   configurações de deploy.
3. **Análise de dependências** com `bun audit` (`npm audit` não se aplica:
   o repositório usa `bun.lock` e não possui `package-lock.json`).
4. **Testes dinâmicos** no ambiente local e no projeto Supabase de teste, com
   contas sintéticas independentes: Cliente A, Cliente B, Administrador e
   usuário não autenticado.
5. **Verificação de impacto**: cada suspected breach foi reproduzida antes de
   ser classificada como confirmada.
6. **Correção** dos problemas confirmados com correção local, seguida de
   teste de regressão.
7. **Quality gates**: `bun run lint`, `bun run test`, `bun run build` e
   Playwright.

Classificação usada: **Confirmada** (evidência reproduzível), **Provável**,
**Não encontrada nos testes executados**, **Não testada**, **Não aplicável**.

---

## 4. Achados

### SEC-01 — Elevação de privilégio em `public.profiles.role` (Crítico)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A01:2025 Broken Access Control / A08:2025 Software or Data Integrity Failures |
| Arquivos       | `supabase/migrations/20261021000100_profile_role_guard_privileged.sql` (causa), `supabase/migrations/20261021000200_profile_role_guard_hardening.sql` (correção) |
| Status         | **Confirmada** — reproduzida e revertida |
| Pre-condições  | Conta autenticada com papel `client` (qualquer conta do briefing) |
| CVSS 3.1       | 8.8 (`AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N`) |

**Evidência**

A migração `20261021000100` define o gatilho assim:

```sql
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer        -- <-- current_user passa a ser o dono da função
...
  caller_is_privileged boolean :=
    public.is_admin()
    or auth.role() in ('service_role', 'supabase_admin')
    or current_user in ('postgres', 'supabase_admin');   -- <-- sempre verdadeiro
```

Dentro de uma função `security definer`, `current_user` é o **dono da função**
(`postgres`) e não a sessão que executou o `UPDATE`. A condição
`current_user in ('postgres', 'supabase_admin')` é, portanto, sempre verdadeira
e o gatilho nunca bloqueia nada.

Reprodução (ambiente de teste, conta sintética `qa.audit.cliente-b@…`, papel
`client`):

```
PATCH /rest/v1/profiles?id=eq.<uuid-do-cliente>   {"role":"admin"}
  → HTTP 204 (sem erro)
GET  /rest/v1/profiles?id=eq.<uuid-do-cliente>&select=role
  → [{"role":"admin"}]
POST /rest/v1/rpc/is_admin  →  true
GET  /rest/v1/briefings?select=id  →  lista os briefings de todos os clientes
```

**Impacto**: qualquer cliente autenticado (inclusive uma conta de teste
convidadas) torna-se administrador e passa a ler, via RLS, os briefings,
respostas, arquivos e trilha de auditoria dos demais clientes — os dados
comerciais que a Master Chapeação forneceu sob sigilo. É também uma violação
de integridade: a aplicação confia em `profiles.role`, campo que o próprio
cliente consegue escrever.

**Correção aplicada (pendente de execução no Supabase)**
`supabase/migrations/20261021000200_profile_role_guard_hardening.sql`:

1. recria o gatilho como `security invoker` (agora `current_user` é a sessão
   real: `authenticated`, `service_role` ou `postgres` no SQL Editor);
2. mantém as exceções legítimas (chave de serviço, SQL Editor e administrador
   já autenticado);
3. restringe a atualização de `public.profiles` à coluna `display_name`
   (`revoke update … ; grant update (display_name) …`), de modo que `role` não
   possa ser alterado por um cliente mesmo que o gatilho falte;
4. revoga a execução de `public.is_admin()` para `anon`.

**Estado após a correção**: o código está no repositório e coberto por teste
de regressão; a migração **ainda não foi aplicada** no projeto Supabase, por
decisão de não alterar configuração remota durante a auditoria. Enquanto isso,
o teste E2E correspondente está marcado como falha esperada
(`test.fail`) e documenta o estado real.

---

### SEC-02 — Cookie de sessão legível por JavaScript (Alto)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A07:2025 Authentication Failures / A04:2025 Cryptographic Failures |
| Arquivos       | `src/features/briefing/server/supabase-server.ts` |
| Status         | **Confirmada** — corrigida no código |
| Pre-condições  | Qualquer sessão autenticada |

**Evidência**: o cliente Supabase SSR é criado sem `cookieOptions`, e o SDK
aplica seus padrões (`node_modules/@supabase/ssr/dist/main/utils/constants.js`):

```js
exports.DEFAULT_COOKIE_OPTIONS = {
  path: "/", sameSite: "lax", httpOnly: false, maxAge: 400 * 24 * 60 * 60,
};
```

O cookie `sb-<ref>-auth-token` (que carrega access token e refresh token) era,
portanto, legível por `document.cookie`, sem a flag `Secure` e com validade
de 400 dias.

**Impacto**: qualquer XSS, script de terceiro injetado ou extensão de
navegador na origem lê o token e assume a sessão — inclusive a de
administrador. A validade de 400 dias mantém a sessão viva indefinidamente.

**Correção**: `resolveBriefingCookieOptions()` declara explicitamente
`httpOnly: true`, `sameSite: "lax"`, `secure` conforme o protocolo da
requisição e `path: "/"`. Verificado em execução: o cookie passou a ser
emitido com `HttpOnly` (ver `docs/security/security-test-plan.md`).
Limitação conhecida: a versão instalada do `@supabase/ssr` **ignora o `maxAge`
informado** e reaplica 400 dias (`cookies.js`, `setCookieOptions`); a redução
do tempo de vida depende de atualização do SDK ou de logout explícito
(SEC-13).

---

### SEC-03 — Ausência de cabeçalhos de segurança (Alto)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A02:2025 Security Misconfiguration |
| Arquivos       | `src/start.ts`, `src/lib/security-headers.ts` (novo) |
| Status         | **Confirmada** — corrigida no código |

**Evidência**: nenhuma busca no repositório encontra `content-security-policy`,
`strict-transport-security`, `x-frame-options`, `x-content-type-options`,
`referrer-policy` (cabeçalho) ou `permissions-policy` em código ou configuração.
Não há `vercel.json`; `src/start.ts` só instalava os middlewares de erro e de
CSRF.

**Impacto**: sem CSP, um XSS encontra execução livre de scripts; sem
`X-Frame-Options`/`frame-ancestors`, as páginas autenticadas (`/briefing`,
`/admin/briefings`) podem ser embutidas em frames (clickjacking); sem HSTS, há
risco de downgrade; sem `nosniff`, respostas de Storage podem ser
interpretadas de forma inesperada.

**Correção**: middleware global em `src/start.ts` aplica, em **todas** as
respostas (HTML e Server Functions), os cabeçalhos: `Content-Security-Policy`
(restritiva, com `default-src 'self'`, `object-src 'none'`,
`frame-ancestors 'none'`, `form-action 'self'`, `base-uri 'self'`),
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
mínima, `Cross-Origin-Opener-Policy` e `Cross-Origin-Resource-Policy`.
`Strict-Transport-Security` é enviado apenas em requisições HTTPS.

**Validação**: build de produção servido por `vite preview` (porta 5211) com a
CSP de produção ativa; home, login autenticado e `/briefing` renderizam sem
erros de console e sem violações de CSP.

---

### SEC-04 — Não existia forma de encerrar a sessão (Alto)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A07:2025 Authentication Failures |
| Arquivos       | `src/features/briefing/server/functions.ts` (existia, sem uso), `src/features/briefing/ui/briefing-sign-out-button.tsx` (novo) |
| Status         | **Confirmada** — corrigida no código |

**Evidência**: `signOutBriefing` existia em `functions.ts:83` mas não era
importado nem invocado em nenhum lugar do código; não havia botão "Sair" em
`/briefing` nem em `/admin/briefings`.

**Impacto**: em computador compartilhado, o usuário não consegue invalidar a
sessão; a sessão permanece válida pelo tempo do cookie (400 dias, SEC-02).

**Correção**: novo componente `BriefingSignOutButton`, usado no formulário do
briefing e no painel administrativo, chama `signOutBriefing`, apaga o rascunho
local (`clearBriefingDraft`) e redireciona para `/login`. Verificado em
navegador: o cookie de sessão é removido e o acesso posterior a
`/admin/briefings` redireciona para `/login`.

---

### SEC-05 — `redirect` do login aceito sem validação (Médio)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A01:2025 Broken Access Control / A07:2025 |
| Arquivos       | `src/routes/login.tsx`, `src/lib/redirect.ts` (novo) |
| Status         | **Confirmada** — corrigida no código |

**Evidência**: `loginSearchSchema` aceitava qualquer string
(`redirect: z.string().optional()`) e o valor era usado direto em
`navigate({ to: targetRedirect })`. Na versão instalada do router, payloads
clássicos são neutralizados (`resolvePath`/`normalizeProtocolRelative`
transformam `https://evil.com` em caminho interno), mas a correção dependia de
comportamento interno de dependência transitiva.

**Correção**: `sanitizeRedirectTarget()` aceita apenas caminhos internos de
uma lista fechada (`/briefing`, `/admin/briefings`) e rejeita URLs absolutas,
`//host`, barras invertidas, quebras de linha e esquemas perigosos.
Verificado: `?redirect=https://evil.example/steal` leva a `/briefing`.

---

### SEC-06 — Rascunho do briefing em `localStorage` (Médio)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A04:2025 Cryptographic Failures / A02:2025 |
| Arquivos       | `src/features/briefing/domain/storage.ts`, `src/lib/briefing.ts` |
| Status         | **Provável** — parcialmente corrigida |

**Evidência**: o rascunho operacional (razão social, contatos, dados técnicos)
é gravado em `localStorage` (`master_briefing_operacional_draft_v1` e o
legado `master_briefing_draft_v1`), sem criptografia e sem limpeza. Com o
cookie agora `httpOnly` (SEC-02), a exposição passou a depender só de XSS ou
extensão de navegador — ainda assim, dado comercial confidencial de terceiro.

**Correção parcial**: o rascunho é apagado no logout (SEC-04) e o valor
gravado é validado por schema Zod na leitura.
**Pendente**: migrar para `sessionStorage`, criptografar ou eliminar o
rascunho local (o servidor já é a fonte da verdade).

---

### SEC-07 — `.env` incluído no contexto de build do Docker (Médio)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A05:2025 Security Misconfiguration / A03:2025 |
| Arquivos       | `.dockerignore` |
| Status         | **Confirmada** — corrigida no código |

**Evidência**: `.dockerignore` excluía apenas `.env*.local`; o `Dockerfile`
faz `COPY . .`, levando o `.env` (com `SUPABASE_SERVICE_ROLE_KEY`) para a camada
de build da imagem.

**Correção**: `.dockerignore` passou a excluir `.env`, `.env.*` e manter
apenas `.env.example`.

---

### SEC-08 — Permissões e fixação do pipeline (Médio)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A03:2025 Software Supply Chain Failures |
| Arquivos       | `.github/workflows/ci.yml` |
| Status         | **Provável** — parcialmente corrigida |

**Evidência**: o workflow não declarava `permissions:` (herdava o escopo
padrão do repositório), fixava as actions por tag mutável
(`actions/checkout@v4`, `oven-sh/setup-bun@v2`, `actions/setup-python@v5`,
`docker/setup-buildx-action@v3`) e usava `bun-version: latest` e
`python-version: "3.x"`. Não há `pull_request_target` nem interpolação de
dados do evento em blocos `run:` (sem vetor de script injection). Não há
`bun audit`/`npm audit` no pipeline nem Dependabot.

**Correção parcial**: `permissions: contents: read` no nível do workflow,
`bun-version` e `python-version` fixados.
**Pendente**: fixar as actions por SHA de commit, adicionar
`bun audit --audit-level=high` como gate e configurar Dependabot.

---

### SEC-09 — Função `is_admin()` executável pelo papel `anon` (Médio)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A01:2025 |
| Arquivos       | `supabase/migrations/20261021000200_profile_role_guard_hardening.sql` |
| Status         | **Confirmada** — correção preparada, pendente de aplicação |

**Evidência**: `POST /rest/v1/rpc/is_admin` com a chave anônima respondeu
`200 false`, embora a migração original faça `revoke all on function
public.is_admin() from public`. O efeito prático é baixo (a função só revela
se o próprio chamador é administrador), mas indica divergência entre o
código de migração e o estado efetivo do banco.

**Correção**: a mesma migração `20261021000200` revoga a execução para `anon`
e a concede explicitamente a `authenticated` e `service_role`.

---

### SEC-10 — Alertas de dependência sem impacto demonstrado (Médio)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A03:2025 |
| Arquivos       | `package.json`, `bun.lock` |
| Status         | **Não encontrada nos testes executados** (sem vulnerabilidade alcançável) |

`bun audit` reportou 16 alertas (12 `high`, 4 `moderate`) em `brace-expansion`,
`js-yaml`, `nanoid`, `source-map-js` e `vite`. Todos estão em caminho de
lint, build ou dev server; nenhum pacote reachável do runtime de produção foi
afetado. Não há `package-lock.json` (o repositório usa `bun.lock`, com hash
`sha512` em 589/589 entradas e `minimumReleaseAge = 86400` em `bunfig.toml`).
Observações: nenhum script `preinstall`/`install`/`postinstall` em toda a
árvore installada; nenhuma dependência vem de fonte não-npm; as três
dependências diretas não usadas (`@tanstack/router-plugin`,
`vite-tsconfig-paths`, `nitro` em beta) podem ser removidas.

**Recomendação**: adicionar `bun audit --audit-level=high` ao CI (hoje
dependências vulneráveis entram sem aviso).

---

### SEC-11 — Ausência de rate limiting no login (Baixo)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A07:2025 |
| Arquivos       | `src/features/briefing/server/functions.ts` (`signInWithPassword`) |
| Status         | **Provável** |

A aplicação não impõe limite de tentativas; a proteção depende do rate limit
nativo do Supabase Auth e do WAF da Vercel (configuração não auditável a
partir do repositório). A mensagem de erro é genérica, o que evita
enumeração de e-mails.

---

### SEC-12 — Painel de demonstração `/agendamentos` protegido só no cliente (Baixo)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A01:2025 |
| Arquivos       | `src/features/booking/domain/auth.ts`, `src/routes/agendamentos.tsx` |
| Status         | **Confirmada** — impacto baixo no estado atual |

A "sessão de administrador" é um JSON em `localStorage` e a credencial de
demonstração (`admin@master.local` / `demo123`) está no bundle do navegador.
Os dados do módulo são fictícios e locais (`localStorage`), sem PII real no
servidor. O risco passa a ser relevante se o módulo receber dados reais.

---

### SEC-13 — Rotação e expiração da sessão (Baixo)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A07:2025 / A04:2025 |
| Arquivos       | `src/features/briefing/server/auth-service.ts`, `supabase-server.ts` |
| Status         | **Provável** |

O cliente SSR é criado com `autoRefreshToken: false` e a aplicação não chama
`refreshSession()`: o token de acesso expira em ~1 h sem renovação e o refresh
token (400 dias, SEC-02) não é rotacionado. `client.auth.getUser()` — a
chamada correta, que revalida o JWT no servidor de autenticação — é usada em
todo o fluxo.

---

### SEC-14 — CSP com `'unsafe-inline'` em `script-src` (Baixo)

| Campo          | Valor |
| -------------- | ----- |
| Categoria      | A02:2025 |
| Arquivos       | `src/lib/security-headers.ts` |
| Status         | **Confirmada** — limitação aceita e documentada |

O payload de hidratação do TanStack Start é injetado como script inline; sem
suporte a `nonce` por requisição no framework instalado, a diretiva
`script-src` precisa de `'unsafe-inline'`. O bloqueio de scripts externos,
objetos e frames permanece ativo. Pendente: nonce por requisição (ver
`remediation-plan.md`).

---

### SEC-15 — URL assinada de Storage com TTL de 300 s (Informativo)

`SIGNED_URL_TTL_SECONDS = 300` e o bucket é privado (`public = false`), com
políticas que restringem o acesso ao dono da pasta ou ao administrador. TTL
curto é adequado; o link pode ser usado por qualquer pessoa que o obtenha
durante a validade.

---

### SEC-16 — Imagem de produção executa como root e inclui devDependencies (Informativo)

O `Dockerfile` não define `USER` no estágio final e copia `node_modules`
completo (com `eslint`, `typescript`, `vitest`, `playwright`), além de rodar
`vite preview` — ou seja, a ferramenta de build é dependência de runtime.
Nenhum `devDependency` é importado por código de produção (verificado no
bundle gerado).

---

### SEC-17 — Diferenças entre local, preview e produção (Informativo)

| Aspecto                | Local (dev)                | Preview (`vite preview`)        | Produção (Vercel)                    |
| ---------------------- | -------------------------- | ------------------------------- | ------------------------------------ |
| CSP                    | relaxada (`'unsafe-eval'`, `ws:`) | restritiva                  | restritiva (mesmo código)            |
| HSTS                   | não                        | não (HTTP local)                | sim quando `x-forwarded-proto: https` |
| Cookie `Secure`        | não                        | não                             | sim                                   |
| Painel do Supabase     | não auditável              | não auditável                   | não auditável                        |

---

## 5. Controles verificados e Effective

| Controle | Evidência | Resultado |
| -------- | --------- | --------- |
| Autorização por operação no servidor | `functions.ts` chama `requireBriefingSession`/`requireBriefingAdmin` em todas as 16 Server Functions | Effective |
| Verificação de propriedade | `briefing-service.ts:137`, `:525`, `file-service.ts:74`, `:200` | Effective |
| RLS com `auth.uid()` e `USING`/`WITH CHECK` | `20261020000100_briefing_core.sql:268-408` | Effective |
| Trilha de auditoria por função controlada | `log_briefing_activity` (`SECURITY DEFINER`, `revoke` de `anon`) | Effective |
| Bucket de Storage privado + políticas por prefixo | `20261020000100_briefing_core.sql:476-532` | Effective |
| Caminho de arquivo derivado no servidor | `buildBriefingStoragePath` (`file-policy.ts:70`) | Effective |
| Allowlist de MIME, limite de 10 MB e sanitização de nome | `file-policy.ts:32-55` | Effective |
| CSRF em Server Functions | `src/start.ts` (`createCsrfMiddleware`) + `method: "POST"` | Effective |
| Normalização de erros (sem stack trace) | `errors.ts:46-79` | Effective |
| Sem segredos no bundle do navegador | varredura do `dist/` | Effective |
| Sem source maps publicados | `vite.config.ts` sem `sourcemap` | Effective |
| Sem `dangerouslySetInnerHTML` com dado de usuário | `src/components/ui/chart.tsx` (estático e sem uso) | Effective |
| `open redirect` | `sanitizeRedirectTarget` | Effective (corrigido) |
| Elevação de privilégio | `profiles_guard_role` | **Falha** (SEC-01) |

---

## 6. Correções realizadas nesta branch

| # | Correção | Arquivos | Teste de regressão |
| - | -------- | -------- | ------------------- |
| 1 | Gatilho de papel `security invoker` + restrição de coluna em `profiles` | `supabase/migrations/20261021000200_profile_role_guard_hardening.sql` | `src/test/security-hardening.test.ts` (AC-SEC-10 a AC-SEC-12) |
| 2 | Cookie de sessão `httpOnly`/`secure`/`sameSite` | `src/features/briefing/server/supabase-server.ts` | `src/test/security-hardening.test.ts` (AC-SEC-08, AC-SEC-09) |
| 3 | Cabeçalhos de segurança em todas as respostas | `src/lib/security-headers.ts`, `src/start.ts` | `src/test/security-hardening.test.ts` (AC-SEC-01 a AC-SEC-04) |
| 4 | Encerramento de sessão na interface | `src/features/briefing/ui/briefing-sign-out-button.tsx`, painel e formulário | E2E manual em `docs/security/security-test-plan.md` |
| 5 | Allowlist do redirecionamento pós-login | `src/lib/redirect.ts`, `src/routes/login.tsx` | `src/test/security-hardening.test.ts` (AC-SEC-05 a AC-SEC-07) |
| 6 | `.env` fora do contexto Docker | `.dockerignore` | Revisão de configuração |
| 7 | `permissions: contents: read` e versões fixadas no CI | `.github/workflows/ci.yml` | Revisão de configuração |
| 8 | Suíte E2E de controle de acesso (BOLA/IDOR) | `e2e/security-briefing-access-control.spec.ts` | 10 casos com contas sintéticas |

---

## 7. Riscos residuais

1. **SEC-01 continua explorável até a aplicação da migração no Supabase** —
   é o risco residual mais relevante e o único com impacto direto em dados de
   terceiros.
2. Enquanto `script-src` precisar de `'unsafe-inline'`, a mitigação contra
   XSS depende da ausência de sinks de injeção (verificada) e do nonce pendente.
3. Rascunho local ainda existe em `localStorage` (SEC-06) e a sessão não é
   rotacionada (SEC-13).
4. O painel `/agendamentos` continua sendo um "admin" apenas no cliente
   (SEC-12); se receber dados reais, precisa de proteção server-side.
5. A configuração da Vercel (WAF, rate limiting, proteção de preview) não é
   verificável pelo repositório e permanece fora do alcance desta auditoria.

---

## 8. Limitações da auditoria

- Não houve acesso ao SQL Editor do Supabase: as políticas **efetivamente
  aplicadas** foram verificadas por comportamento (chamadas diretas à API com
  tokens de cada papel), e o código das migrações foi lido — mas o catálogo
  (`pg_policies`, `pg_proc`) não foi inspecionado. As divergências encontradas
  (SEC-01 e SEC-09) provam que o estado do banco **não coincide** com o
  código das migrações.
- Não foram inspecionados: painel do Vercel, Caddy local, DNS, CDN, WAF e
  configuração de autenticação do projeto Supabase (email confirmation, rate
  limits, MFA).
- Não houve DAST, fuzzing nem teste de intrusão; a análise foi estática mais
  testes funcionais dirigidos.
- `npm audit` não pôde ser executado (o repositório usa `bun.lock`); a base de
  avisos usada foi a do `bun audit` (GHSA).
- O build de produção foi verificado com `vite preview` local, não no domínio
  real.
- Não foi executada verificação de proveniência de dependências (npm
  provenance/SLSA) nem comparação byte a byte com os pacotes oficiais.

---

## 9. Próximas ações recomendadas

1. **Aplicar `supabase/migrations/20261021000200_profile_role_guard_hardening.sql`**
   no projeto Supabase (SQL Editor ou `supabase db push`) e remover os
   marcadores `test.fail` correspondentes em
   `e2e/security-briefing-access-control.spec.ts`.
2. Rotacionar a chave de serviço do Supabase e as credenciais de teste
   versionadas (`.env.example`, fallbacks dos specs E2E).
3. Verificar no painel da Vercel: rate limiting de `/login`, proteção de
   preview e cabeçalhos na borda.
4. Aplicar o restante do plano em `docs/security/remediation-plan.md`.
5. Restringir o ambiente de teste: remover a chave de serviço do `.env` local
   quando ela não for necessária.
