# Matriz OWASP Top 10:2025 — briefing operacional da Master Chapeação

| Campo          | Valor                                                                 |
| -------------- | --------------------------------------------------------------------- |
| Auditoria      | SEC-AUDIT-001 (2026-10-20)                                           |
| Branch         | `security/master-briefing-audit`                                     |
| Commit         | `41c9334`                                                             |
| Referências    | OWASP Top 10:2025; ASVS 5.0.0 (consultado, sem atribuição de IDs)   |

Legenda de resultado: **Effective** (verificado e funcionando), **Parcial**,
**Falha** (controle presente e quebrado), **Não encontrado nos testes
executados**, **Não testado** (sem acesso/condição), **Não aplicável**.

---

## A01:2025 — Broken Access Control

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Autorização server-side por operação | `functions.ts` (16 Server Functions) | Effective | `requireBriefingSession` / `requireBriefingAdmin` em todas |
| Verificação de propriedade do briefing | `briefing-service.ts:137`, `:525` | Effective | `isOwner` + papel `admin` |
| Verificação de propriedade de arquivo | `file-service.ts:74`, `:200` | Effective | Path derivado no servidor |
| Isolamento entre clientes (leitura) | E2E `security-briefing-access-control.spec.ts` | Effective | Cliente B não lê briefings, respostas, arquivos ou auditoria de A |
| Isolamento entre clientes (escrita/exclusão) | E2E idem | Effective | PATCH/DELETE do Cliente B não alteram o registro de A |
| Isolamento de Storage (upload/assinatura/remoção) | E2E idem | Effective | Cliente B não assina URL, não grava nem remove objeto de A |
| Trilha de auditoria restrita a admin | E2E idem | Effective | `briefing_activity` só é lida por admin; escrita via RPC controlada |
| Bloqueio do painel administrativo na interface | E2E idem | Effective | Cliente B recebe "Acesso restrito a administradores" |
| RLS no PostgreSQL | `20261020000100_briefing_core.sql:268-408` | Effective | `USING`/`WITH CHECK` corretos; teste comportamental por papel |
| Impossibilidade de elevar o próprio papel | `20261021000100_profile_role_guard_privileged.sql` | **Falha** | **SEC-01** — `security definer` + `current_user` sempre verdadeiro |
| Allowlist do `redirect` pós-login | `src/lib/redirect.ts` | Effective | Correção desta auditoria |
| Painel de demonstração `/agendamentos` | `src/features/booking/domain/auth.ts` | Parcial | Guarda só no cliente; dados fictícios locais (SEC-12) |
| Enumeração de e-mails no login | `functions.ts:58-69` | Effective | Mensagem genérica |

## A02:2025 — Security Misconfiguration

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Cabeçalhos de segurança | `src/start.ts`, `src/lib/security-headers.ts` | Effective | Correção desta auditoria; CSP com `'unsafe-inline'` (SEC-14) |
| HSTS condicional | idem | Effective | Somente em HTTPS |
| `X-Frame-Options` / `frame-ancestors` | idem | Effective | `DENY` / `'none'` |
| `nosniff` | idem | Effective | — |
| `Referrer-Policy` / `Permissions-Policy` | idem | Effective | — |
| Segredos fora do bundle | varredura do `dist/` | Effective | Nenhuma chave encontrada |
| `.env` fora do build Docker | `.dockerignore` | Effective | Correção desta auditoria |
| Sem source maps publicados | `vite.config.ts` | Effective | — |
| Sem rotas de diagnóstico | `src/routes/**` | Effective | 21 rotas mapeadas, nenhuma expõe diagnóstico |
| Erros sem stack trace | `errors.ts`, `src/lib/error-page.ts` | Effective | Mensagens normalizadas |
| `Cache-Control` em respostas com cookie | `supabase-server.ts:73` | Effective | `private, no-store` |
| CSP na borda (Vercel) | — | **Não testado** | Configuração externa ao repositório |
| Runtimes/headers do preview | `vite preview` | Effective | Verificado em execução |

## A03:2025 — Software Supply Chain Failures

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Lockfile versionado com hash | `bun.lock` | Effective | 589/589 entradas com `sha512` |
| Idade mínima de publicação | `bunfig.toml` | Effective | `minimumReleaseAge = 86400` |
| Install determinístico | `.github/workflows/ci.yml` | Effective | `--frozen-lockfile` |
| Scripts de instalação | árvore installada | Effective | Nenhum `pre/install/postinstall` |
| Dependências de fontes não-npm | `bun.lock` | Effective | Nenhum `git+`/`http` |
| Dependências suspeitas | `package.json` | Effective | Nenhum typosquat |
| Permissões do token no CI | `.github/workflows/ci.yml` | Effective | `contents: read` (correção) |
| Fixação das actions por SHA | idem | **Não encontrado** | Tags mutáveis (SEC-08) |
| Gate de SCA no CI | idem | **Não encontrado** | Sem `bun audit` (SEC-10) |
| Dependências de desenvolvimento no runtime | `Dockerfile` | Parcial | Imagem final inclui toolchain (SEC-16) |

## A04:2025 — Cryptographic Failures

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Segredos não versionados | `.gitignore`, histórico git | Effective | `.env` nunca commitado |
| Chave privilegiada fora do navegador | `env.ts`, varredura do `dist/` | Effective | `serviceRoleKey` lida e nunca usada no código |
| Cookie de sessão inacessível ao script | `supabase-server.ts` | Effective | `httpOnly: true` (correção) |
| `Secure` em produção | idem | Effective | Conforme `x-forwarded-proto` |
| Tokens fora da URL | busca por `access_token`/`refresh_token` | Effective | Nenhuma ocorrência |
| Transporte TLS | não aplicável ao ambiente local | **Não testado** | Depende da borda (Vercel/Caddy) |
| TTL de URL assinada | `file-service.ts:13` | Effective | 300 s |
| Dados sensíveis em storage do navegador | `storage.ts` | Parcial | `localStorage` sem criptografia (SEC-06) |
| Coleta minimizada | `briefing-service.ts` | Effective | Respostas por seção; sem dado não declarado |

## A05:2025 — Injection

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Consultas parametrizadas (PostgREST) | `briefing-service.ts`, `file-service.ts` | Effective | Sem concatenação de SQL |
| Busca textual com `ilike` | `briefing-service.ts:357-362` | Effective | Sanitiza `%`, `,`, `(` e limita o tamanho |
| Validação de entrada no servidor | `functions.ts` (Zod) + `section-schemas.ts` | Effective | Validação duplicada no cliente |
| XSS por `dangerouslySetInnerHTML` | `src/components/ui/chart.tsx` | Effective | Valores estáticos; componente sem uso |
| `eval` / `new Function` / `setTimeout(string)` | busca no repositório | Effective | Nenhuma ocorrência |
| Entrada refletida | `src/routes/acompanhar/$token.tsx:809` | Effective | React escapa; sem CSP quebra a página |
| Separação entre código e dados no PDF | `src/features/briefing/server/pdf/` | Effective | Escritor próprio, sem HTML |
| Logs sem payload sensível | `briefing-service.ts:502` | Effective | Registra apenas `action` e `code` |
| Comandos de shell | `scripts/`, `Makefile` | Effective | Sem interpolação de entrada externa |

## A06:2025 — Insecure Design

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Limite de confiança navegador/servidor/banco | `functions.ts`, RLS | Effective | Papel nunca vem do navegador |
| Salvamento por etapa | `briefing-service.ts:193` | Effective | Seção a seção, transação única por etapa |
| Envio idempotente | `briefing-service.ts:252-337` | Effective | Reenvio retorna o estado atual |
| Transições de status no banco | `enforce_briefing_status_transition` | Effective | Gatilho no PostgreSQL |
| Integridade de arquivo ↔ metadados | `file-service.ts:113-116` | Effective | Falha de metadado remove o objeto |
| Ausência de rate limiting na aplicação | `functions.ts` | Parcial | Depende da borda (SEC-11) |
| Fluxo de convite/convocação | `docs/supabase-briefing.md` | **Não testado** | Convite feito fora do sistema |
| Retenção e exclusão de dados | — | **Não testado** | Sem política de retenção implementada |
| Recuperação de rascunho | `use-briefing-draft.ts` | Effective | Rascunho local + servidor |

## A07:2025 — Authentication Failures

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Validação de identidade no servidor | `auth-service.ts:32` (`getUser()`) | Effective | Revalida o JWT no Auth Server |
| Distinção autenticado × autorizado | `auth-service.ts:53` | **Falha** | Autorização quebra por SEC-01 |
| Cookie `httpOnly`/`Secure`/`SameSite` | `supabase-server.ts` | Effective | Correção desta auditoria |
| Encerramento de sessão | `briefing-sign-out-button.tsx` | Effective | Correção desta auditoria |
| CSRF em Server Functions | `src/start.ts` | Effective | `createCsrfMiddleware` + POST |
| Enumeração de e-mails | `functions.ts:58-69` | Effective | Mensagem genérica |
| Elevação de privilégio | `profiles_guard_role` | **Falha** | SEC-01 |
| Rate limiting de autenticação | — | **Não testado** | Borda externa |
| Rotação/expiração de refresh token | `supabase-server.ts` | Parcial | `autoRefreshToken: false`, sem `refreshSession()` (SEC-13) |
| Recuperação de senha | — | **Não testado** | Fluxo do Supabase Auth |
| Usuário desativado | `auth-service.ts` | Effective | `getUser()` falha para usuário removido |

## A08:2025 — Software or Data Integrity Failures

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Confiança em campos do navegador | `auth-service.ts:28` | **Falha** | Papel vem do banco, mas o cliente escreve nele (SEC-01) |
| Mass assignment | `saveSection`, `changeBriefingStatus` | Effective | Campos montados explicitamente |
| Propriedade não alterável pelo cliente | RLS + trigger | Effective | `owner_user_id` imutável |
| Integridade do JSONB das respostas | `section-schemas.ts` | Effective | Schema Zod por etapa |
| Upload e associação de arquivos | `file-service.ts` | Effective | Path derivado no servidor |
| Repetição de operações | `submitBriefing`, `submitBriefing` | Effective | Sem envio duplicado |
| Migrations SQL versionadas | `supabase/migrations/` | Parcial | Estado do banco divergente do código (SEC-01, SEC-09) |

## A09:2025 — Security Logging & Alerting Failures

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Trilha de auditoria do briefing | `log_briefing_activity` | Effective | Ações, ator, metadados e data |
| Operações administrativas auditadas | `briefing-service.ts:447`, `:486` | Effective | `status_changed`, `internal_note` |
| Falhas de persistência registradas | `briefing-service.ts:502` | Effective | Sem payload sensível |
| Falhas de autenticação registradas | — | **Não encontrado** | Não há log de tentativa de login |
| Tentativa de acesso não autorizado registrada | — | **Não encontrado** | `forbidden` retorna ao cliente, sem registro |
| Alertas e correlação | — | **Não testado** | Não há sistema de alerta no ambiente |
| Proteção dos logs | `error-capture.ts` | Effective | Servidor apenas; sem PII |

## A10:2025 — Mishandling of Exceptional Conditions

| Controle verificado | Onde | Resultado | Observação |
| ------------------- | ---- | --------- | ---------- |
| Falha segura por padrão | `auth-service.ts`, `briefing-service.ts` | Effective | Exceções de autorização sempre falham fechadas |
| Respostas de erro normalizadas | `errors.ts:46-79` | Effective | Sem texto do provedor |
| Falha parcial de upload | `file-service.ts:113-116` | Effective | Remove o objeto órfão |
| Transições inválidas de estado | `assertTransition` + trigger do banco | Effective | Rejeição nos dois níveis |
| Status HTTP das Server Functions | `functions.ts` | Effective | Sempre 200 com `ok:false` + código; erro fatal vira 500 pelo middleware |
| Falha do Supabase | `briefing-service.ts` | Effective | Mensagem honesta; sem estado parcial |
| Falha de SSR | `src/server.ts`, `src/start.ts` | Effective | Página de erro estática |
| "Salvo" sem persistência | `saveSection` | Effective | Retorna erro se o `upsert` falhar |
| Envio marcado como concluído sem persistir | `submitBriefing` | Effective | Verifica `updated`; conflito é tratado |
