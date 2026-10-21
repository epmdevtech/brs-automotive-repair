# TASK-073-03 — Rotas e interface do briefing persistido, login e painel administrativo

| Campo        | Valor                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| ID           | TASK-073-03                                                                 |
| Status       | Done                                                                        |
| Data         | 2026-10-20                                                                  |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD)                          |
| SPEC         | SPEC-073                                                                    |
| Critérios    | AC-073-01, AC-073-02, AC-073-03, AC-073-04, AC-073-07, AC-073-08, AC-073-10 |
| Dependências | TASK-073-02                                                                 |

## Objetivo

Entregar as rotas `/briefing`, `/briefing/confirmacao`, `/login` (Supabase), `/admin/briefings` e `/admin/briefings/$briefingId`, com formulário em 15 etapas validados por React Hook Form e Zod, persistência real por etapa, retomada a partir do banco, envio honesto, upload privado e painel administrativo com isolamento de dados internos.

## Escopo

### Incluído

- Substituição do gate por código de demonstração por sessão Supabase resolvida no servidor.
- Formulário em 15 etapas com `useForm` + `zodResolver` por etapa, indicador de progresso, revisão e envio.
- Autosave por etapa no banco, com cache local apenas como apoio.
- Tela de confirmação exibida somente após confirmação do servidor.
- Login Supabase com mensagens de erro honestas e sem credenciais fixas no código.
- Painel administrativo: listagem com busca e filtros, detalhe por etapa, pendências, notas internas, solicitação de complemento, mudança de status e histórico.
- Estados de carregamento, erro, vazio e acessibilidade (labels, `aria-invalid`, foco visível).

### Não incluído

- Provisionamento de usuários e credenciais.
- Publicação de arquivos no site institucional.
- Deploy de produção.

## Abordagem e impacto

- Arquivos ou componentes prováveis: `src/routes/briefing/index.tsx`, `src/routes/briefing/confirmacao.tsx`, `src/routes/login.tsx`, `src/routes/admin/briefings/index.tsx`, `src/routes/admin/briefings/$briefingId.tsx`, `src/features/briefing/ui/*`.
- Dados, contratos ou migrações: consumo das funções de servidor da TASK-073-02.
- Riscos e precauções: sem sessão, redirecionar; sem Supabase configurado, degradação honesta; notas internas jamais retornadas ao cliente.
- ADRs e padrões aplicáveis: ADR-001; `standards/accessibility.md`; `standards/ux-ui.md`.

## Passos

- [x] Rotas privadas com loader de sessão e redirecionamento para `/login`.
- [x] Formulário em 15 etapas com RHF e Zod por etapa.
- [x] Persistência por etapa e retomada a partir do banco.
- [x] Envio final com confirmação do servidor e rota de confirmação.
- [x] Login Supabase com tratamento de erro.
- [x] Painel administrativo com busca, filtros, detalhe, notas, status e histórico.
- [x] Upload de arquivos com validação e download por URL assinada.

## Validação

| Critério/risco | Teste, comando ou revisão                       | Evidência esperada                          |
| -------------- | ----------------------------------------------- | ------------------------------------------- |
| AC-073-01      | Teste de rota privada                           | Redirecionamento sem sessão                 |
| AC-073-03      | Teste de retomada                               | Valores recarregados do banco               |
| AC-073-04      | Teste de envio                                  | Confirmação apenas após sucesso do servidor |
| AC-073-08      | Teste de painel                                 | Busca, filtro, nota interna e status        |
| AC-073-10      | Teste de degradação                             | Mensagem explícita sem Supabase configurado |
| Qualidade      | `bun run lint`, `bun run test`, `bun run build` | Sem erros                                   |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade finalizadas em `docs/supabase-briefing.md` e na matriz.
- [x] Limitações e desvios estão registrados.

## Resultado

- Mudanças realizadas: rotas privadas, formulário persistido, login Supabase e painel administrativo.
- Evidências: suíte de testes de interface e rota cobrindo sessão, persistência, envio, painel e degradação.
- Pendências ou bloqueios: preview em Vercel depende de variáveis de ambiente e credenciais do projeto Supabase.
