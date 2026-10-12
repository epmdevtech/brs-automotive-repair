# TASK: Refatoração Multipágina, SEO Técnico e Otimização para LLMs

## Metadados

| Campo        | Valor                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| ID           | TASK-014-01                                                                 |
| Status       | Done                                                                        |
| Responsável  | Engenharia Fullstack EPMDEVTECH                                             |
| SPEC         | SPEC-014                                                                    |
| Critérios    | AC-014-01, AC-014-02, AC-014-03, AC-014-04, AC-014-05, AC-014-06, AC-014-07 |
| Dependências | SPEC-014                                                                    |

---

## Objetivo

Implementar a arquitetura multipágina com TanStack Start/Router, criar as rotas públicas específicas com conteúdo técnico aprofundado, unificar a navegação via Header e MinimalFooter, aplicar metadados e JSON-LD exclusivos por rota, gerar sitemap.xml, robots.txt calibrado para IA e llms.txt, validando tudo via testes automatizados e `make check`.

---

## Escopo

### Incluído

- Atualizar `src/lib/brs.ts` com dados expandidos de rotas, navegação para URLs reais e metadados canônicos.
- Estruturar o layout global no `__root.tsx` integrando `<Header />` e `<MinimalFooter />` uma única vez.
- Criar rotas filhas em `src/routes/`:
  - `src/routes/index.tsx` (Home institucional)
  - `src/routes/servicos/index.tsx` (Visão geral de serviços)
  - `src/routes/servicos/funilaria.tsx` (Página de Funilaria)
  - `src/routes/servicos/pintura-automotiva.tsx` (Página de Pintura Automotiva)
  - `src/routes/servicos/martelinho-de-ouro.tsx` (Página de Martelinho de Ouro)
  - `src/routes/trabalhos.tsx` (Página de Galeria e Trabalhos)
  - `src/routes/para-corretores.tsx` (Página de Atendimento a Corretores)
  - `src/routes/sobre.tsx` (Página Institucional Sobre a BRS)
  - `src/routes/contato.tsx` (Página de Contato e Avaliação)
  - `src/routes/privacidade.tsx` (Política de Privacidade)
  - `src/routes/404.tsx` ou componente refinado de NotFound em `__root.tsx`.
- Atualizar componentes de navegação (`Header`, `Brand`, `MinimalFooter`, `Hero`, `Services`) para utilizarem rotas absolutas.
- Criar `public/sitemap.xml` listando todas as rotas canônicas públicas.
- Atualizar `public/robots.txt` com referência ao sitemap e diretivas para motores de busca e bots de IA (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `GPTBot`, `PerplexityBot`).
- Criar `public/llms.txt` estruturado em Markdown com especificações factuais da BRS.
- Atualizar e expandir a suíte de testes Vitest para cobrir todas as rotas, metadados, links, integridade do sitemap, robots, llms.txt e garantia de unicidade de Header e Footer.
- Validar via `make check`.

### Não incluído

- Adição de rotas privadas ou painel administrativo.
- Armazenamento em banco de dados ou integração com WhatsApp não homologado.

---

## Validação

| Critério/risco | Teste, comando ou revisão          | Evidência esperada                                          |
| -------------- | ---------------------------------- | ----------------------------------------------------------- |
| AC-014-01      | Testes de correspondência de rotas | Todas as 10 rotas e 404 resolvem com sucesso                |
| AC-014-02      | Testes de Header/Footer            | Exatamente 1 Header e 1 Footer por renderização             |
| AC-014-03      | Inspeção de metadados das rotas    | Titles e descriptions exclusivos e canônicos válidos        |
| AC-014-04      | Validação de sitemap e robots      | `sitemap.xml` e `robots.txt` válidos e sincronizados        |
| AC-014-05      | Validação de JSON-LD               | Schema.org contextual sem informações fictícias             |
| AC-014-06      | Validação de llms.txt              | Markdown UTF-8 na raiz pública com URLs e dados confirmados |
| AC-014-07      | `make check`                       | Vitest, ESLint, TypeScript e Build 100% aprovados           |

---

## Condição de conclusão

- [x] Arquitetura multipágina criada com rotas reais em `src/routes/`.
- [x] Componentes `Header` e `MinimalFooter` unificados com rotas canônicas.
- [x] Metadados, canonicals e JSON-LD implementados em todas as rotas.
- [x] `sitemap.xml`, `robots.txt` e `llms.txt` criados e válidos.
- [x] Suítes de testes automatizados criadas/atualizadas com 100% de aprovação.
- [x] Quality gates aprovados via `make check`.
- [x] `REVIEW-014` criado e aprovado.
