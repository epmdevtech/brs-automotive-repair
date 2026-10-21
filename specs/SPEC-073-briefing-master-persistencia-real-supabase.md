# SPEC-073 — Briefing Master com persistência real, autenticação e painel administrativo

## Metadados

| Campo          | Valor                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID             | SPEC-073                                                                                                                                                                           |
| Título         | Briefing Master com Supabase (Auth, Postgres, Storage), RLS e painel administrativo                                                                                                |
| Status         | Approved                                                                                                                                                                           |
| Responsável    | Senior Full Stack / UX-UI Engineer (Universal SDD)                                                                                                                                 |
| Revisores      | Produto / Engenharia / QA / Segurança                                                                                                                                              |
| Criado         | 2026-10-20                                                                                                                                                                         |
| Atualizado     | 2026-10-20                                                                                                                                                                         |
| Liberação Alvo | Preview em Vercel (sem promoção para produção sem autorização humana explícita)                                                                                                    |
| Refs:          | Discovery: solicitação humana explícita de 2026-10-20 (prompt de implementação); Design: N/A — mantém a identidade visual e os componentes existentes da SPEC-072; ADRs: `ADR-001` |

---

## Problema e resultado

O briefing de 15 etapas entregue na SPEC-072 é um protótipo local: os dados ficam no `localStorage` do navegador, a barreira de acesso é um código de demonstração versionado no bundle e não existe persistência, auditoria, upload real ou painel de análise. A Master Chapeação precisa de um levantamento real, retomável e seguro, com dados de operação, estrutura, equipe, documentação e interesse em credenciamento, e a EPM DevTech precisa de um painel para analisar esses briefings.

**Resultado esperado:** a rota `/briefing` passa a exigir autenticação Supabase válida, persistir cada etapa em PostgreSQL com Row Level Security, anexar arquivos em bucket privado com URL assinada, permitir retomada do rascunho a partir do banco, confirmar o envio somente após persistência verificada pelo servidor e disponibilizar um painel administrativo com Searching, filtros, pendências, histórico, solicitação de complemento e conclusão da análise.

**Fatos:** o projeto não possui backend, banco, autenticação de produção nem bucket configurados; TanStack Start 1.168, React 19, Vite 8, Zod 3.25 e React Hook Form 7.71 estão instalados; o deploy alvo é Vercel.
**Suposições (a confirmar na configuração):** a existência de um projeto Supabase dedicado e a disponibilidade de credenciais de ambiente para preview.

**Medidas de sucesso:** nenhuma etapa se perde ao recarregar; envio nunca é confirmado sem persistência comprovada; cliente não acessa dados de terceiros; nenhum segredo privilegiado no bundle; lint, testes e build aprovados; nenhuma rota pública alterada.

## Escopo

### No escopo (In scope)

- Integração Supabase: `Auth` (e-mail e senha, sessão por cookie SSR), `PostgreSQL` (tabelas, índices, restrições, RLS) e `Storage` (bucket privado).
- Variáveis de ambiente por ambiente, `.env.example` com placeholders e nenhum segredo versionado.
- Migrações SQL versionadas com RLS em todas as tabelas e políticas do bucket.
- Funções de servidor (TanStack Start) para leitura, gravação, envio, upload, download e operações administrativas, sempre com autorização verificada no servidor.
- Domínio puro testável: schema Zod por etapa, transições de status, matriz de permissões, política de arquivos.
- Rotas `/briefing`, `/briefing/confirmacao`, `/login` (Supabase), `/admin/briefings` e `/admin/briefings/$briefingId`.
- Rascunho local mantido apenas como cache de apoio; o banco é a fonte de verdade.
- Painel administrativo com listagem, busca, filtros, detalhe, pendências, notas internas, solicitação de complemento, alteração de status e histórico.
- Testes de domínio, autorização, persistência mockada e rotas.
- Documentação de configuração, retenção, LGPD, preview Vercel e pendências manuais.

### Fora do escopo (Out of scope)

- Provisionamento real do projeto Supabase, criação de usuários e preenchimento de credenciais (depende de acesso externo).
- Publicação em produção, promoção de release, alteração de DNS e merge na branch principal.
- Integração com seguradoras, matriz de requisitos de credenciamento e envio de e-mail transacional.
- Processamento de imagens, miniatura, OCR e publicação automática de arquivos.
- Recriação do projeto, troca de framework, Express ou segundo roteador.
- Alteração de rotas públicas, identidade visual e do painel de agendamentos existente.

## Comportamento funcional

### Autenticação e autorização

- `/briefing`, `/briefing/confirmacao` e `/admin/*` exigem sessão Supabase válida resolvida no servidor; sem sessão, a resposta é redirecionamento para `/login` com `redirect` preservado.
- A barreira por código de demonstração da SPEC-072 é removida; nenhum acesso privileged depende de знание de URL ou credencial fixa no código.
- Perfis: `client` (padrão) e `admin`. O cliente não altera o próprio `role`; a alteração é feita por administrador autenticado ou por função `security definer` controlada.
- Toda função de servidor resolve o usuário pela sessão do servidor, ignora identificadores enviados pelo navegador para definir propriedade e verifica `role` no banco antes de qualquer operação administrativa.

### Formulário em 15 etapas

- Cada etapa mantém identificador canônico (`company_identification` … `website_content`, `observations`) e um schema Zod próprio, derivado da definição data-driven de campos já existente.
- Campos obrigatórios são sinalizados; um campo obrigatório pode ser marcado como pendente, e a pendência é registrada junto da resposta.
- Validação em cliente com React Hook Form + `zodResolver` e revalidação obrigatória no servidor antes de persistir.
- Navegação anterior/próxima, indicador de progresso, mensagens de erro em pt-BR, revisão das respostas antes do envio e estados de carregamento.

### Persistência

- Cada etapa salva é gravada em `briefing_answers` (JSONB por `section_key`) vinculada ao `briefing_id` do usuário autenticado, com sobrescrita idempotente da mesma etapa.
- O carregamento da rota `/briefing` restaura valores, pendências, metadados de arquivos e status a partir do banco.
- O envio final valida todas as 15 etapas no servidor, exige a confirmação explícita do usuário e muda o status de `draft` para `submitted` em operação idempotente (repetir o envio não duplica briefing nem atividade).
- Falhas de rede ou indisponibilidade do banco são exibidas como erro com preservação dos dados preenchidos; nunca como sucesso.
- `localStorage` é cache de apoio, com aviso explícito, e nunca substitui o banco.

### Arquivos

- Bucket privado `master-briefing-private`; upload autenticado para caminho controlado (`<user_id>/<briefing_id>/<categoria>/<uuid>.<ext>`), com limite de tamanho, lista de MIME permitidos e validação no servidor.
- Download e visualização somente por URL assinada de curta duração, gerada após verificação de autorização e de propriedade.
- Envio de arquivo não autoriza publicação no site; a autorização de publicação é campo separado, desmarcado por padrão.

### Painel administrativo

- Listagem com busca por empresa e filtros por status e data, paginada no servidor.
- Detalhe com as 15 etapas, campos pendentes, metadados de arquivos, download autorizado, notas internas, solicitação de complemento, alteração de status e histórico de atividades.
- Notas internas e metadados administrativos nunca são retornados nas consultas do cliente.
- Exportação controlada do briefing para CSV/JSON, disponível apenas a administradores.

### Operação e honestidade operacional

- Sem `SUPABASE_URL`/`SUPABASE_ANON_KEY` configurados, a interface informa explicitamente que a persistência está indisponível e orienta a configuração; nenhuma operação é simulada.
- Erros de Supabase são normalizados em categorias (rede, autenticação, autorização, validação, indisponibilidade) sem vazar segredos ou mensagens internas do provedor.

## Requisitos não-funcionais

- **Segurança e privacidade:** RLS ativa em todas as tabelas; nenhuma política irrestrita; interface nunca é mecanismo de segurança; segredos apenas em ambiente do servidor; nenhum dado sensível desnecessário em logs ou na atividade.
- **Desempenho e capacidade:** consultas indexadas por `owner_user_id`, `status` e `created_at`; paginação no painel; payload de etapa limitado a 200 KB.
- **Confiabilidade e recuperação:** envio idempotente; falha de gravação não apaga o rascunho local; reenvio permitido sem duplicidade.
- **Acessibilidade:** labels associados, `aria-invalid`, mensagens de erro, navegação por teclado, foco visível, regiões vivas para status de envio.
- **Compatibilidade:** TanStack Start 1.168, React 19, Vite 8, Bun, Node 20 LTS na Vercel; nenhuma dependência fora de `@supabase/supabase-js` e `@supabase/ssr`.
- **Observabilidade:** registro de atividades por ação relevante; sem conteúdo integral de documentos ou segredos.

## Critérios de aceitação

### AC-073-01

```yaml
id: AC-073-01
title: Sessão obrigatória nas rotas privadas
preconditions:
  - Aplicação em execução com Supabase configurado
action: Acessar /briefing, /briefing/confirmacao e /admin/briefings sem sessão autenticada
expected_result: Cada rota redireciona para /login preservando o destino; nenhuma resposta do briefing é renderizada
evidence_type: automated
```

### AC-073-02

```yaml
id: AC-073-02
title: Schema Zod por etapa e revalidação no servidor
preconditions:
  - Sessão autenticada com papel client
action: Enviar uma etapa com campo obrigatório vazio e depois com campo válido
expected_result: O cliente bloqueia o avanço com mensagem em pt-BR; o servidor recusa a gravação inválida mesmo que a requisição seja forjada
evidence_type: automated
```

### AC-073-03

```yaml
id: AC-073-03
title: Persistência real e retomada
preconditions:
  - Sessão autenticada com papel client
action: Preencher e salvar duas etapas, recarregar a rota e reabrir em outra sessão do mesmo usuário
expected_result: As respostas são lidas do PostgreSQL, sem depender do cache local; o rascunho do navegador não é tratado como persistência
evidence_type: automated
```

### AC-073-04

```yaml
id: AC-073-04
title: Envio validado, idempotente e honesto
preconditions:
  - Briefing com todas as etapas válidas
action: Enviar o briefing duas vezes e simular indisponibilidade do banco
expected_result: A primeira submissão muda o status para submitted e registra atividade; a segunda não duplica briefing nem atividade; em falha de banco a interface mostra erro e preserva os dados
evidence_type: automated
```

### AC-073-05

```yaml
id: AC-073-05
title: Isolamento entre clientes
preconditions:
  - Dois usuários autenticados com briefings distintos
action: O usuário A tentar ler, gravar ou enviar o briefing de B
expected_result: A operação é recusada com erro de autorização e nenhum dado de B é retornado
evidence_type: automated
```

### AC-073-06

```yaml
id: AC-073-06
title: Escalada de privilégio e operações administrativas
preconditions:
  - Usuário autenticado com papel client
action: Tentar elevar o próprio papel e executar listagem, mudança de status ou leitura de arquivos de outro cliente
expected_result: Todas as tentativas são recusadas no servidor; as operações administrativas só ocorrem para papel admin verificado
evidence_type: automated
```

### AC-073-07

```yaml
id: AC-073-07
title: Arquivos privados com autorização
preconditions:
  - Bucket configurado e sessão autenticada
action: Enviar arquivo acima do limite ou com MIME não permitido; tentar baixar arquivo de outro cliente
expected_result: O upload é recusado com motivo explícito e o download de terceiro é negado; os arquivos permanecem privados e acessados por URL assinada curta
evidence_type: automated
```

### AC-073-08

```yaml
id: AC-073-08
title: Painel administrativo com isolamento de dados internos
preconditions:
  - Sessão administrativa autenticada
action: Listar briefings com busca e filtro, abrir detalhe, registrar nota interna e solicitar complemento
expected_result: A listagem filtra e pagina no servidor; a nota interna aparece apenas no painel e nunca nas respostas do cliente; a solicitação de complemento muda o status de forma controlada e gera atividade
evidence_type: automated
```

### AC-073-09

```yaml
id: AC-073-09
title: Nenhum segredo no bundle do navegador
preconditions:
  - Build de produção executado
action: Inspecionar o artefato do cliente e as variáveis de ambiente
expected_result: Nenhuma chave privilegiada (service_role) é exposta; apenas URL e chave anônima públicas são referenciadas no cliente; nenhum valor real está versionado
evidence_type: automated
```

### AC-073-10

```yaml
id: AC-073-10
title: Honestidade quando o backend não está configurado
preconditions:
  - Ausência de SUPABASE_URL/SUPABASE_ANON_KEY
action: Acessar /briefing
expected_result: A interface informa que a persistência está indisponível e orienta a configuração; nenhum sucesso de envio ou de gravação é exibido
evidence_type: automated
```

### AC-073-11

```yaml
id: AC-073-11
title: Qualidade e não regressão do site público
preconditions:
  - Implementação concluída
action: Executar lint, testes e build e percorrer as rotas públicas
expected_result: Lint sem erros, testes aprovados, build de cliente e SSR concluído; as rotas públicas, a identidade visual e o painel de agendamentos seguem funcionando
evidence_type: automated
```

## Abordagem técnica

- `src/features/briefing/server/`: `env.ts` (variáveis de ambiente do servidor), `supabase-server.ts` (cliente SSR com cookie via `@supabase/ssr`), `errors.ts` (categorias de erro), `auth-service.ts`, `briefing-service.ts`, `file-service.ts`, `functions.ts` (`createServerFn`).
- `src/features/briefing/domain/`: `section-schemas.ts` (Zod por etapa), `status.ts` (transições), `roles.ts` (permissões), `file-policy.ts` (MIME, tamanho, caminho).
- `supabase/migrations/20261020000100_briefing_core.sql`: enum de status, tabelas `profiles`, `briefings`, `briefing_answers`, `briefing_files`, `briefing_activity`, RLS, gatilhos de integridade, bucket e políticas de Storage.
- Rotas: `src/routes/briefing/index.tsx`, `src/routes/briefing/confirmacao.tsx`, `src/routes/login.tsx`, `src/routes/admin/briefings/index.tsx`, `src/routes/admin/briefings/$briefingId.tsx`.
- Dependências adicionadas: `@supabase/supabase-js` e `@supabase/ssr` (somente estas).
- Alternativas rejeitadas: backend Express (quebra a premissa de stack única), autenticação por código no bundle (não é segurança), persistência apenas em `localStorage` (não atende o requisito de retomada real), SDK de ORM adicional (camada de tipos já coberta por Zod).

## Entrega e operações

- **Plano de implantação:** branch `feature/master-briefing`; migração aplicada manualmente no projeto Supabase de destino; variáveis de ambiente configuradas no ambiente de preview; sem promoção para produção sem autorização humana.
- **Plano de migração:** aplicar a migração SQL em ambiente de desenvolvimento, provisionar usuários, configurar bucket e RLS, validar com usuário client e admin.
- **Plano de rollback:** reverter a migração (SQL `drop` reversível fornecido na própria migração) e remover as variáveis de ambiente; o código detecta ausência de configuração e permanece inerte.
- **Monitoramento e alertas:** observar erros de autenticação e de gravação na atividade do Supabase; revisar `briefing_activity` para auditoria.

## Riscos e dependências

| Risco ou dependência                                    | Impacto | Probabilidade | Mitigação                                                                                       | Responsável        |
| ------------------------------------------------------- | ------- | ------------- | ----------------------------------------------------------------------------------------------- | ------------------ |
| Projeto Supabase ainda não existe                       | Alto    | Alta          | Código e migrações prontos; documentação de provisionamento; interface degrada com honestidade  | Engenharia / Infra |
| RLS mal configurada em produção                         | Crítico | Média         | Policies restritivas por padrão, `anon` sem acesso, testes de isolamento e revisão de segurança | Segurança          |
| Exposição de chave privilegiada no bundle               | Crítico | Baixa         | Nenhum `service_role` em variável `VITE_`; build verificado por varredura do artefato           | Engenharia         |
| Vazamento de dados sensíveis em logs                    | Alto    | Baixa         | Atividade registra ação e identificadores, nunca conteúdo integral ou credenciais               | Engenharia         |
| Escopo do painel administrativo cresce além do previsto | Médio   | Média         | Separado em tarefa própria com escopo mínimo listagem/detalhe/notas/status                      | Produto            |
| Compatibilidade do runtime Vercel com SSR e cookies     | Alto    | Média         | Validar preview antes de qualquer promoção; confirmar `Node 20` e variáveis de ambiente         | Engenharia / Infra |

## Questões abertas

| Questão                                                      | Responsável   | Data limite      | Resolução                                                            |
| ------------------------------------------------------------ | ------------- | ---------------- | -------------------------------------------------------------------- |
| Credenciais e URL do projeto Supabase de produção            | Infra         | Antes do preview | Preenchimento manual documentado; não versionado                     |
| Nome definitivo do bucket e política de retenção de arquivos | Produto / DPO | Antes da promote | `master-briefing-private` como padrão; retenção de 180 dias proposta |
| Encaminhamento do briefing à EPM DevTech após o envio        | Produto       | Antes da promote | Exportação administrativa controlada já prevista                     |

## Aprovação

| Papel      | Nome                                      | Decisão  | Data       | Notas                                               |
| ---------- | ----------------------------------------- | -------- | ---------- | --------------------------------------------------- |
| Produto    | Solicitação humana explícita              | Approved | 2026-10-20 | Briefing com persistência real, auth e painel admin |
| Design     | N/A — identidade e componentes existentes | N/A      | 2026-10-20 | Sem alteração de design system                      |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD)  | Approved | 2026-10-20 | Branch isolada, sem deploy de produção              |
| QA         | Senior Full Stack / UX-UI Engineer (SDD)  | Ready    | 2026-10-20 | Critérios de aceitação automatizáveis definidos     |
