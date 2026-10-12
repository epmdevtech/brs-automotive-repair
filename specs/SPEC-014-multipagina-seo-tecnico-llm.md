# SPEC-014: Refatoração Multipágina, SEO Técnico e Otimização para LLMs

## Metadados

| Campo           | Valor                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| ID              | SPEC-014                                                                                          |
| Título          | Refatoração Multipágina, SEO Técnico Avançado e Otimização para LLMs — BRS Reparações Automotivas |
| Status          | Approved                                                                                          |
| Autor           | Engenharia de Software EPMDEVTECH & Antigravity AI                                                |
| Data de Criação | 2026-10-11                                                                                        |
| Alvo            | `src/routes/`, `src/components/`, `src/lib/`, `public/`, `src/test/`                              |

---

## 1. Contexto & Diagnóstico

O site da **BRS Reparações Automotivas** possui design system refinado (Sora + Manrope, dark mode automotivo, componentes Radix UI e Framer Motion) concentrado em uma landing page de página única (`/`).

Para consolidar a presença digital profissional, maximizar a autoridade temática em Toledo-PR e posicionar a oficina para descoberta tanto por mecanismos de busca tradicionais (Google, Bing) quanto por sistemas de busca com IA (ChatGPT Search, Perplexity, Gemini), faz-se necessária uma arquitetura **multipágina** nativa no **TanStack Start / TanStack Router**, com rotas públicas dedicadas, conteúdo específico, metadados exclusivos por rota, Schema.org JSON-LD contextual, sitemap XML, robots.txt com regras para IA e arquivo descritivo `llms.txt`.

---

## 2. Escopo Arquitetural e Funcional

### 2.1 Rotas Públicas Obrigatórias

1. `/` — Página inicial institucional com teasers das seções, visão geral e CTAs direcionando para as páginas filhas.
2. `/servicos` — Visão geral das especialidades da BRS (Funilaria, Pintura e Martelinho de ouro), metodologia de atendimento e triagem técnica.
3. `/servicos/funilaria` — Página temática detalhada de funilaria automotiva (alinhamento, recuperação de painéis, limites técnicos e descarte).
4. `/servicos/pintura-automotiva` — Página temática de pintura automotiva (estufa/cabine, preparação, primers anticorrosivos, colorimetria e cura térmica).
5. `/servicos/martelinho-de-ouro` — Página temática de martelinho de ouro / PDR (desamassamento sem repintura, preservação de pintura original, aplicações e limites).
6. `/trabalhos` — Galeria de projetos com interatividade (Sliders Antes/Depois e Lightbox), com identificação de fotografia ilustrativa temporária.
7. `/para-corretores` — Página exclusiva para corretores de seguro e atendimento a segurados (livre escolha, laudos, comunicação ágil e sem convênios falsos).
8. `/sobre` — Apresentação institucional da BRS, princípios de honestidade técnica e atendimento em Toledo, Paraná.
9. `/contato` — Canal oficial de avaliação com formulário funcional, validação, preparação de mensagem para o Instagram `@brsreparacoes` e telefone `(45) 2035-9440`.
10. `/privacidade` — Política de privacidade e conformidade com a LGPD (esclarecendo a ausência de cookies invasivos de terceiros e processamento local no navegador).
11. Rota 404 personalizada (`NotFoundComponent`) integrada ao design system e navegação.

### 2.2 Componentes Globais e Navegação

- Header unificado (`<Header />`) e Rodapé unificado (`<MinimalFooter />`) compartilhados pelo layout raiz, garantindo ausência de duplicação.
- Menu de navegação atualizado:
  - Início → `/`
  - Serviços → `/servicos`
  - Nosso trabalho → `/trabalhos`
  - Para corretores → `/para-corretores`
  - A BRS → `/sobre`
  - Contato → `/contato`
  - CTA "Solicitar avaliação" → `/contato`
- Navegação através de componentes compatíveis com TanStack Router (`<Link>` / rotas canônicas).

### 2.3 SEO Técnico Tradicional

- Metadados específicos por rota: `title` exclusivo, `meta description` customizada, `canonical URL`, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`, `og:locale`), Twitter Cards (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- `/sitemap.xml` dinâmico ou estático na raiz pública contendo apenas rotas públicas implementadas.
- `/robots.txt` permitindo indexação pública com apontamento para o Sitemap e diretivas para bots de busca.

### 2.4 SEO Local e Dados Estruturados Schema.org JSON-LD

- Tipagem adequada: `AutoBodyShop` / `AutoRepair`, `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `Service`.
- Fidelidade estrita aos dados reais: Cidade Toledo-PR, telefone `(45) 2035-9440`, Instagram `@brsreparacoes`, sem invenção de endereços de rua fictícios, coordenadas, CNPJ ou avaliações artificiais.

### 2.5 Otimização para LLMs e Motores com IA

- Criação de `public/llms.txt` em formato Markdown UTF-8 com sumário factual da oficina, serviços técnicos, limites, localização em Toledo-PR e índice de URLs públicas.
- Regras explícitas e documentadas no `robots.txt` para rastreadores de busca por IA (ex.: `OAI-SearchBot`, `GPTBot`, `PerplexityBot`).
- Conteúdo principal 100% legível no HTML inicial via renderização SSR do Nitro.

---

## 3. Critérios de Aceitação

- **AC-014-01**: Todas as 10 rotas públicas especificadas e a rota 404 funcionam sem erros tanto no carregamento inicial direto quanto na navegação SPA.
- **AC-014-02**: Header e Footer são renderizados exatamente uma vez por página em todas as rotas, com navegação apontando para URLs reais e sem links genéricos `href="#"`.
- **AC-014-03**: Cada rota possui tags `<title>`, `<meta name="description">` e `<link rel="canonical">` exclusivas e condizentes com seu conteúdo.
- **AC-014-04**: O arquivo `/sitemap.xml` é válido e lista todas as 10 rotas canônicas públicas. O `/robots.txt` permite rastreamento público e referencia o sitemap.
- **AC-014-05**: Schemas JSON-LD correspondem exatamente ao conteúdo visual de cada rota e mantêm consistência factual sem dados inventados.
- **AC-014-06**: O arquivo `/llms.txt` é disponibilizado na raiz pública com estrutura Markdown padronizada e informações técnicas estritamente confirmadas.
- **AC-014-07**: Todos os quality gates (`bun run test`, `bun run lint`, `bun run build`, `make check`) passam com 100% de sucesso.
