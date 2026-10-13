# TASK: Consolidação da Arquitetura Multipágina

## Metadados

| Campo        | Valor                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| ID           | TASK-017-01                                                                                       |
| Status       | Done                                                                                              |
| Responsável  | Engenharia Frontend EPMDEVTECH                                                                    |
| SPEC         | SPEC-017                                                                                          |
| Critérios    | AC-017-01, AC-017-02, AC-017-03, AC-017-04, AC-017-05, AC-017-06, AC-017-07, AC-017-08, AC-017-09 |
| Dependências | SPEC-017                                                                                          |

---

## Objetivo

Implementar a SPEC-017: reduzir a home a um resumo orientado à conversão, mover conteúdo para sua localização única, migrar links para navegação client-side, refinar a navbar, unificar o layout e extrair `ServicePageLayout`/`ContactCTA`.

## Escopo

1. `src/components/brs/site-layout.tsx` (novo) + `__root.tsx`; unificação de casca no layout compartilhado.
2. `src/components/brs/website.tsx` → `HomePageContent` enxuta; `home-pathways.tsx` (novo).
3. `header.tsx`, `breadcrumbs.tsx`, `hero.tsx`, `services.tsx`, `final-cta.tsx`, `ui/minimal-footer.tsx`, `animated-hero.tsx`: `Link` do TanStack Router para navegação client-side limpa.
4. `service-page-layout.tsx`, `contact-cta.tsx` (novos); refatoração das páginas de serviço (`funilaria`, `pintura-automotiva`, `martelinho-de-ouro`), `/trabalhos`, `/sobre`, `/para-corretores`, `/servicos`.
5. `/contato` com FAQ integrado e suporte a audiência (`audience=corretor`); remoção de componentes redundantes da home.
6. `use-scroll-reveal` reexecutável por rota através do pathname; `scroll-padding-top` para âncoras.
7. Testes unitários e de integração expandidos (16 suites, 105 testes), sitemap, matriz de rastreabilidade, REVIEW-017.

## Critérios de Aceitação

- [x] **AC-017-01**: A home não contém `ProjectGallery`, `PartnerSection` completa, `About`, formulário de contato nem `FAQAccordion`.
- [x] **AC-017-02**: Nenhum `<a href="/...">` interno restante em componentes/rotas; navegação client-side via `<Link>`.
- [x] **AC-017-03**: Navbar com 5 itens essenciais + CTA "Solicitar avaliação" e estado ativo discreto com `aria-current="page"`.
- [x] **AC-017-04**: Todos os `href` de âncora na home apontam para IDs existentes e únicos (`#inicio`, `#servicos`, `#processo`).
- [x] **AC-017-05**: `/contato` apresenta atendimento completo + FAQ; corretores chegam com `audience=corretor`.
- [x] **AC-017-06**: Existe um único `SiteLayout` montado na raiz (`__root.tsx`) com skip link, banner, main, footer e botão mobile.
- [x] **AC-017-07**: Páginas de serviço usam `ServicePageLayout` e incluem navegação contextual cruzada entre serviços.
- [x] **AC-017-08**: Sitemap XML e robots.txt íntegros, sem rotas de erro ou links mortos.
- [x] **AC-017-09**: Quality gates satisfeitos: 100% dos testes Vitest (105 testes), ESLint (0 erros) e build SSR Nitro aprovados.
