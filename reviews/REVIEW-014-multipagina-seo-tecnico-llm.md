# REVIEW: Refatoração Multipágina, SEO Técnico e Otimização para LLMs

## Metadados

| Campo   | Valor                                          |
| ------- | ---------------------------------------------- |
| ID      | REVIEW-014                                     |
| SPEC    | SPEC-014                                       |
| TASK    | TASK-014-01                                    |
| Status  | Approved                                       |
| Revisor | Antigravity AI (Pair Programming) / EPMDEVTECH |
| Data    | 2026-10-11                                     |

---

## 1. Resumo da Mudança

Transformação completa da presença digital da **BRS Reparações Automotivas** de página única para arquitetura multipágina com SEO técnico avançado e preparação para descoberta por inteligência artificial (ChatGPT Search, Perplexity, Gemini, etc.), respeitando o design system premium e a integridade de dados do projeto:

1. **Arquitetura Multipágina com TanStack Router / TanStack Start**:
   - `/` — Página inicial com teasers das seções, visão geral e CTAs direcionando para as páginas filhas (`src/routes/index.tsx`).
   - `/servicos` — Visão geral das especialidades, guia comparativo de triagem e CTA para avaliação (`src/routes/servicos/index.tsx`).
   - `/servicos/funilaria` — Página temática de funilaria automotiva: alinhamento milimétrico de gaps, conformação e limites éticos (`src/routes/servicos/funilaria.tsx`).
   - `/servicos/pintura-automotiva` — Página temática de pintura automotiva em estufa: controle de partículas, colorimetria de precisão e cura térmica (`src/routes/servicos/pintura-automotiva.tsx`).
   - `/servicos/martelinho-de-ouro` — Página temática de martelinho de ouro / PDR: preservação da originalidade e valor de revenda (`src/routes/servicos/martelinho-de-ouro.tsx`).
   - `/trabalhos` — Galeria interativa de trabalhos com sliders antes/depois, Lightbox e aviso de acervo ilustrativo temporário (`src/routes/trabalhos.tsx`).
   - `/para-corretores` — Canal dedicado a corretores de seguro, agilidade em laudos e reforço da livre escolha da oficina (`src/routes/para-corretores.tsx`).
   - `/sobre` — Apresentação institucional da oficina em Toledo-PR, princípios técnicos e serviço Leva e Traz (`src/routes/sobre.tsx`).
   - `/contato` — Canal oficial com formulário de avaliação client-side, formatação para Instagram `@brsreparacoes` e telefone fixo (`src/routes/contato.tsx`).
   - `/privacidade` — Política de privacidade e conformidade com a LGPD (`src/routes/privacidade.tsx`).
   - `/404` e `NotFoundComponent` — Rota e componente de erro 404 estético e integrado à navegação (`src/routes/404.tsx`).

2. **Unificação e Governança de Layout**:
   - Centralização de `<Header />`, `<main id="conteudo-principal">` e `<Footer />` no layout raiz `src/routes/__root.tsx`.
   - Garantia de que cada rota renderiza exatamente um cabeçalho e um rodapé, sem duplicações.
   - Atualização da navegação para rotas canônicas sem âncoras órfãs ou links genéricos `href="#"`.

3. **SEO Técnico Tradicional**:
   - Criação do módulo utilitário `src/lib/seo.ts` gerando `<title>` exclusivo, `<meta name="description">`, Open Graph, Twitter Cards e links canônicos absolutos.
   - Criação de `public/sitemap.xml` com as 10 rotas canônicas públicas.

4. **SEO Local e Dados Estruturados Schema.org JSON-LD**:
   - JSON-LD específico por rota (`AutoBodyShop`, `Service`, `BreadcrumbList`, `WebPage`, `AboutPage`, `ContactPage`).
   - Fidelidade estrita aos dados reais: Toledo-PR, telefone `(45) 2035-9440`, sem informações inventadas.

5. **SEO para LLMs e Motores com IA**:
   - Criação de `public/llms.txt` na raiz pública com descrição factual da oficina, serviços e índice canônico.
   - Calibração de `public/robots.txt` permitindo rastreadores web tradicionais (`Googlebot`, `Bingbot`) e bots de IA (`OAI-SearchBot`, `GPTBot`, `PerplexityBot`).

6. **Testes Automatizados**:
   - Criação da nova suíte `src/test/multipage-seo-llm.test.tsx` com 19 testes dedicados. Total de 81 testes em 14 arquivos com 100% de aprovação.

---

## 2. Verificação de Critérios de Aceitação

| Critério  | Descrição                                                                               | Status   | Evidência                                                                             |
| --------- | --------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| AC-014-01 | As 10 rotas públicas e a 404 resolvem e carregam sem erros no TanStack Router          | Aprovado | Testado em `src/test/multipage-seo-llm.test.tsx` e build Vite/SSR                    |
| AC-014-02 | Exatamente um Header e um Footer por rota, navegação para URLs reais sem links `href="#"`| Aprovado | Validado em `__root.tsx`, `header.test.tsx`, `minimal-footer.test.tsx`                 |
| AC-014-03 | Metadados exclusivos (title, description, canonical, OG, Twitter) por rota               | Aprovado | Validado via `buildRouteHead` em `src/lib/seo.ts` e testes unitários                  |
| AC-014-04 | `sitemap.xml` e `robots.txt` públicos, válidos e sincronizados                          | Aprovado | Validados em `src/test/multipage-seo-llm.test.tsx`                                    |
| AC-014-05 | Schemas JSON-LD contextuais baseados exclusivamente em fatos comprovados                | Aprovado | Schemas validados sem inclusão de avaliações fictícias ou endereço não confirmado    |
| AC-014-06 | `llms.txt` público em Markdown UTF-8 com sumário factual e índice de URLs                | Aprovado | Validado em `public/llms.txt` e `src/test/multipage-seo-llm.test.tsx`                 |
| AC-014-07 | Quality gates 100% aprovados (`make check`)                                             | Aprovado | 81 testes Vitest aprovados, 0 erros ESLint, build SSR Nitro compilado com 100% êxito |

---

## 3. Quality Gates e Evidências

- **Vitest**: 81 testes aprovados em 14 arquivos (100% de aprovação).
- **ESLint / Prettier**: 0 erros (`bun run lint`).
- **Build de Produção**: Vite + Nitro SSR compilados com 100% de sucesso (`bun run build`).
- **Rastreabilidade**: Gerada com sucesso em `docs/traceability-matrix.md`.

---

## 4. Conclusão

Revisão técnica aprovada sem ressalvas. A arquitetura multipágina, o SEO técnico e a otimização para LLMs estão 100% implementados e validados.
