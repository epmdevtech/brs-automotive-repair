# SPEC-017: Consolidação da Arquitetura Multipágina e Auditoria UX/UI

## Metadados

| Campo           | Valor                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ID              | SPEC-017                                                                                                                                      |
| Título          | Consolidação da Arquitetura SPA + Multi-Route: Home Resumida, Navegação Client-Side, Navbar com Estado Ativo e Conteúdo com Localização Única |
| Status          | Approved (instrução humana explícita de 2026-10-12)                                                                                           |
| Autor           | Engenharia Frontend EPMDEVTECH & Antigravity AI                                                                                               |
| Data de Criação | 2026-10-12                                                                                                                                    |
| Alvo            | `src/components/brs/*`, `src/routes/*`, `src/lib/brs.ts`, `src/test/*`, `public/sitemap.xml`, `public/llms.txt`                               |

---

## 1. Contexto & Diagnóstico (auditoria da implementação real)

Stack: TanStack Start (SSR/Nitro) + `@tanstack/react-router` com `scrollRestoration: true`. Raiz `__root.tsx` monta `Header` + `<main><Outlet/></main>` + `Footer` + botão flutuante de telefone.

| Rota                               | Conteúdo antes da SPEC                                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                | **Antiga SPA completa**: Hero, MediaExpand, Services, Philosophy, ProjectGallery, ProcessTimeline, PartnerSection, Pickup, About, FAQ, Contact (com formulário), FinalCTA |
| `/servicos` + 3 páginas de serviço | Conteúdo próprio (3 páginas de serviço com estrutura idêntica copiada)                                                                                                    |
| `/trabalhos`                       | `ProjectGallery` completa (duplicada na home)                                                                                                                             |
| `/para-corretores`                 | Página própria (duplicada por `PartnerSection` na home)                                                                                                                   |
| `/sobre`                           | Página própria (duplicada por `About` na home)                                                                                                                            |
| `/contato`                         | `Contact` + formulário (duplicados na home)                                                                                                                               |
| `/privacidade`, `/404`             | Páginas próprias                                                                                                                                                          |

Problemas reais identificados:

1. **Duplicação editorial**: galeria, corretores, sobre, contato/formulário e leva-e-traz aparecem na home e em rotas dedicadas. A galeria é composta por imagens ilustrativas (sem material real verificado), portanto não deve ser prévia na home.
2. **Âncoras mortas/enganosas**: Hero rola para `#contato`/`#servicos` por `scrollIntoView` condicionado a `pathname === "/"`; o link "Conheça a BRS ↓" aponta para rota enquanto o ícone sugere scroll; `PartnerSection` usa estado local + scroll para `#contato` em vez de `/contato?audience=corretor`.
3. **Navegação com recarregamento completo**: todos os links internos são `<a href>` (inclusive Header, Footer, Breadcrumbs, CTAs), anulando a navegação client-side do roteador.
4. **Navbar** sem estado ativo; item "Contato" sobrepõe semanticamente o CTA "Solicitar avaliação" (ambos → `/contato`).
5. **Layout duplicado**: `Website` (website.tsx) replica o shell de `__root.tsx` (skip link, Header, main, Footer, botão de telefone).
6. **Scroll reveal** (`useScrollReveal`) só é inicializado na home; não é reexecutado em mudança de rota.
7. **FAQ** existe apenas na home, embora trate do contato (melhor localização: `/contato`).
8. **Páginas de serviço**: três arquivos ~178 linhas com marcação idêntica (candidato legítimo a layout compartilhado); sem navegação contextual entre serviços.
9. **CTAs finais** de seis páginas repetem a mesma marcação.

Reutilizações **corretas** (não alteradas): Header, Footer, botão flutuante de telefone, Breadcrumbs, `Contact`/`ContactForm` (usados em `/contato`), `Services` (resumo na home x detalhe em `/servicos`: diferença de profundidade).

---

## 2. Arquitetura de Informação Final

| Rota                                                          | Intenção                                |
| ------------------------------------------------------------- | --------------------------------------- |
| `/`                                                           | Apresentar, contextualizar e encaminhar |
| `/servicos`                                                   | Visão geral/comparação dos serviços     |
| `/servicos/{funilaria,pintura-automotiva,martelinho-de-ouro}` | Aprofundamento                          |
| `/trabalhos`                                                  | Galeria (única localização)             |
| `/para-corretores`                                            | Relacionamento com corretores           |
| `/sobre`                                                      | Institucional                           |
| `/contato`                                                    | Conversão (contato + FAQ)               |
| `/privacidade`                                                | Política existente (mantida)            |

Nenhuma rota removida; nenhuma URL pública quebrada; sem redirecionamentos necessários.

### Home (`/`)

Hero (+ faixa de confiança) → MediaExpand → Services (resumo, `#servicos`) → Philosophy (diferenciais) → ProcessTimeline (`#processo`) → HomePathways (resumo curto de `/sobre` e `/para-corretores`) → FinalCTA.

Removidos da home (conteúdo preservado em sua rota própria): ProjectGallery, PartnerSection, About, Pickup (permanece em `/servicos`), Contact, FAQ (movido para `/contato`).

---

## 3. Requisitos

- **R1** Todos os links internos usam `Link` do TanStack Router (sem recarga completa); links externos/`tel:` seguem `<a>`.
- **R2** Navbar única; itens: Início, Serviços, Nosso trabalho, Para corretores, A BRS; CTA "Solicitar avaliação" → `/contato` (item "Contato" removido da navbar, mantido no rodapé). Estado ativo discreto com `aria-current="page"` (ativo por prefixo para `/servicos/*`).
- **R3** Remover scroll imperativo do Hero; âncoras apenas para seções existentes (`#servicos`, `#processo`) com `scroll-margin-top` compensando a navbar fixa.
- **R4** `SiteLayout` único compartilhado entre `__root.tsx` e testes; remover `Website` duplicado. `useScrollReveal` inicializado uma única vez no layout e reexecutado por rota.
- **R5** `ServicePageLayout` para as 3 páginas de serviço (conteúdo editorial específico por página) com bloco "Outros serviços"; `ContactCTA` reutilizável para CTAs finais.
- **R6** `/contato` incorpora o FAQ; links de `/para-corretores` para contato usam `?audience=corretor`.
- **R7** SEO: um `h1` por página, canonicals únicos, sitemap/llms.txt coerentes, JSON-LD de FAQ **não** adicionado sem validação.
- **R8** `prefers-reduced-motion` preservado. Sem novas dependências.
- **R9** Sem WhatsApp, sem dados/depoimentos/imagens inventados; mídia ilustrativa continua identificada.

## 4. Critérios de Aceitação

- **AC-017-01**: A home não contém ProjectGallery, PartnerSection completa, About, Contact/formulário nem FAQ.
- **AC-017-02**: Nenhum `<a href="/...">` interno restante em componentes/rotas (exceto externos, `tel:` e âncoras de mesma página).
- **AC-017-03**: Navbar com 5 itens + CTA, estado ativo com `aria-current`, logo → `/`.
- **AC-017-04**: Todos os `href` de âncora na home apontam para IDs existentes e únicos.
- **AC-017-05**: `/contato` apresenta Contact + FAQ; corretores chegam com `audience=corretor`.
- **AC-017-06**: Existe um único `SiteLayout` (um `banner`, um `contentinfo`, um `main`).
- **AC-017-07**: Páginas de serviço usam `ServicePageLayout` e linkam entre si.
- **AC-017-08**: Sitemap lista apenas rotas canônicas existentes.
- **AC-017-09**: `bun run test`, `bun run lint` e `bun run build` passam.
