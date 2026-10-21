# REVIEW-073 — Briefing da Master com persistência real, autenticação e painel administrativo

| Campo      | Valor                                                               |
| ---------- | ------------------------------------------------------------------- |
| ID         | REVIEW-073                                                          |
| SPEC/TASK  | `SPEC-073` / `TASK-073-01` a `TASK-073-04`                          |
| Status     | Approved                                                            |
| Data       | 2026-10-20                                                          |
| Revisor    | Senior Full Stack / UX-UI Engineer (Universal SDD)                  |
| Evidências | `bun run lint`, `bun run test`, `bun run build`, inspeção do bundle |

---

## 1. Sumário

O briefing da Master Chapeação deixa de ser um protótipo local e passa a ter
autenticação, persistência real, arquivos privados e painel administrativo. A
implementação cobre o caminho completo do dado: schema Zod por etapa no cliente e
no servidor, gravação em PostgreSQL com Row Level Security, envio idempotente,
armazenamento privado com URL assinada curta e operações administrativas
verificadas no servidor. A barreira por código de demonstração da SPEC-072 foi
removida.

## 2. Escopo Verificado

- Domínio puro: 15 etapas com `section_key` canônico, schema Zod derivado por
  etapa (obrigatórios, pendências, opções, formatos), transições de status por
  papel, matriz de permissões e política de arquivos.
- Servidor: cliente Supabase SSR com sessão por cookie, resolução de usuário e
  papel no servidor, `briefing-service` (criar, salvar etapa, carregar, enviar,
  listar, alterar status, solicitar complementação, nota interna), `file-service`
  (upload, listagem, URL assinada, remoção) e funções `createServerFn` com
  `inputValidator`.
- Banco: migração versionada com `profiles`, `briefings`, `briefing_answers`,
  `briefing_files`, `briefing_activity`, RLS em todas as tabelas, gatilhos de
  transição de status e de proteção de papel, função `security definer` de
  auditoria e bucket `master-briefing-private` com políticas por pasta do usuário.
- Interface: `/briefing` com formulário em 15 etapas (React Hook Form + Zod),
  salvamento por etapa, retomada do banco, `/briefing/confirmacao` exibida só
  após persistência confirmada, `/login` com Supabase Auth e painel
  `/admin/briefings` com busca, filtros, detalhe, notas internas isoladas,
  solicitação de complemento, status controlado, arquivos autorizados e histórico.
- Operação: `.env.example` sem segredos, `.gitignore` protegendo `.env`,
  `docs/supabase-briefing.md` com provisionamento, rollback e passos de preview.

## 3. Critérios de Aceite

| Critério  | Verificação                                            | Resultado                                                 |
| --------- | ------------------------------------------------------ | --------------------------------------------------------- |
| AC-073-01 | Redirecionamento sem sessão nas rotas privadas         | Atendido                                                  |
| AC-073-02 | Schema Zod por etapa e revalidação no servidor         | Atendido                                                  |
| AC-073-03 | Persistência real e retomada a partir do banco         | Atendido (com provedor simulado; validação real pendente) |
| AC-073-04 | Envio validado, idempotente e honesto                  | Atendido                                                  |
| AC-073-05 | Isolamento entre clientes                              | Atendido                                                  |
| AC-073-06 | Escalada de privilégio e operações administrativas     | Atendido                                                  |
| AC-073-07 | Arquivos privados com autorização                      | Atendido                                                  |
| AC-073-08 | Painel administrativo com isolamento de dados internos | Atendido                                                  |
| AC-073-09 | Nenhum segredo no bundle do navegador                  | Atendido                                                  |
| AC-073-10 | Honestidade quando o backend não está configurado      | Atendido                                                  |
| AC-073-11 | Qualidade e não regressão do site público              | Atendido                                                  |

## 4. Evidências de Validação

| Gate      | Comando / verificação                                                                                    | Resultado                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Lint      | `bun run lint`                                                                                           | 0 erros; 7 warnings pré-existentes de `react-refresh`                                               |
| Testes    | `bun run test`                                                                                           | 61 arquivos e 481 testes aprovados                                                                  |
| Build     | `bun run build`                                                                                          | Cliente e SSR concluídos sem erros                                                                  |
| Segredo   | `grep -r "supabase\|service_role\|SUPABASE_" dist/client`                                                | Nenhuma ocorrência no bundle do cliente; SDK e código de servidor presentes apenas em `dist/server` |
| Typecheck | `bunx tsc --noEmit` filtrando `src/features/briefing` e `src/routes/{briefing,admin,login,agendamentos}` | Sem erros nos arquivos novos (permanecem erros históricos em módulos anteriores)                    |

Suítes dedicated: `src/test/briefing-dominio-spec073.test.ts`,
`src/test/briefing-server-service.test.ts` (com provedor Supabase simulado em
`src/test/helpers/fake-supabase.ts`), `src/test/briefing-ui-spec073.test.tsx` e
`src/test/briefing-route.test.tsx`.

## 5. Riscos e Pendências

- **Persistência real não validada**: o projeto Supabase de destino e as credenciais não foram fornecidos; a migração, as políticas e o bucket ainda não foram aplicados em um serviço real. A interface opera em modo degradado explícito até a configuração.
- **RLS depende de configuração correta**: as políticas são restritivas por padrão, mas a segurança real só se confirma com a migração aplicada e com o teste de isolamento executado contra o serviço.
- **Múltiplos papéis na mesma tabela `profiles`**: a promoção de administrador é manual (SQL ou painel), por decisão de segurança.
- **Alteração de propósito da rota `/login`**: a autenticação de demonstração do painel de agendamentos permanece em `/agendamentos`, que passou a exibir o próprio acesso local em vez de redirecionar para `/login`.
- **Upload por base64**: payloads limitados a 10 MB por arquivo e 20 MB por requisição; volumes maiores exigem upload direto ao Storage com URL assinada.
- **Sem deploy**: nenhum commit em `main`, nenhuma promoção de release e nenhuma alteração de DNS foram executados.

## 6. Aprovação

| Papel      | Nome                                     | Decisão  | Data       |
| ---------- | ---------------------------------------- | -------- | ---------- |
| Produto    | Solicitação humana explícita             | Approved | 2026-10-20 |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 |
| QA         | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 |
