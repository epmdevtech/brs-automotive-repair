# SPEC-034 — Redesign Awwwards Standard dos Heroes em Todas as Rotas: Tipografia, Paleta de Cores, Lenis e Coreografia GSAP

## Metadados

| Campo        | Valor                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-034`                                                                                                        |
| Título       | Redesign Awwwards Standard dos Heroes em Todas as Rotas com Tipografia, Paleta de Cores, Lenis e Coreografia GSAP |
| Data Criação | 2026-10-14                                                                                                        |
| Status       | Approved (Aprovada)                                                                                               |
| Autor        | Creative Director & Principal Motion Architect EPM DevTech                                                        |
| Prioridade   | Alta (P0)                                                                                                         |
| Impacto      | Seções Hero de todas as páginas (`/servicos`, `/trabalhos`, `/sobre`, `/para-corretores`, `/contato`, etc.)       |

---

## 1. Contexto e Motivação

Seguindo as diretrizes normativas da skill Awwwards (`~/.agents/skills/awwwards/SKILL.md`) e os princípios de excelência do Universal SDD, todo website premiado como _Site of the Day_ deve manter uma **continuidade visual e cinemática impecável entre todas as suas páginas**. O primeiro frame visível de cada rota deve operar como um "pôster editorial", unindo tipografia de alta precisão (Sora + Manrope), coordenadas geográficas reais de Toledo-PR, badges de telemetria contextualizadas e coreografia inercial GSAP sincronizada com a rolagem suave do Lenis.

As páginas do projeto BRS Reparações Automotivas devem manter estritamente:

- A fonte única de verdade dos dados da oficina em `src/lib/brs.ts` (razão social, CNPJ, telefone, fundador Bruno, serviços).
- A arquitetura multipágina com rotas dedicadas em `@tanstack/react-router`.
- Navegação client-side via componente `<Link to="...">` (sem `<a href="/...">` para rotas internas).
- Acessibilidade WCAG AA (contraste >= 4.5:1, rótulos semânticos, foco visível e respeito a `prefers-reduced-motion`).

---

## 2. Requisitos e Critérios de Aceite

- **AC-034-01 (Componente Reutilizável `PageHero`)**:
  - Criar `src/components/brs/page-hero.tsx` como componente unificado e reutilizável para heroes de páginas internas.
  - Suportar breadcrumbs integrados, índice de seção Awwwards (`codeIndex`, ex: `SEC.02 // ESPEC`), título `h1` expressivo, descrição, badges de telemetria técnica, botões de ação e área visual auxiliar (`asideContent`).
  - Implementar entrada coreografada via GSAP Timeline (`title`, `description`, `badges`, `actions`) sincronizada com o RAF e com desativação sob `prefers-reduced-motion`.
- **AC-034-02 (Redesign do Hero do Catálogo de Serviços `/servicos`)**:
  - Aplicar o novo padrão visual no topo de `src/routes/servicos/index.tsx`, com telemetria dos 3 pilares técnicos e atalhos rápidos.
- **AC-034-03 (Redesign dos Heroes das 3 Especialidades em `ServicePageLayout`)**:
  - Atualizar `src/components/brs/service-page-layout.tsx` (utilizado por `/servicos/funilaria`, `/servicos/pintura-automotiva` e `/servicos/martelinho-de-ouro`).
  - Adicionar telemetria específica para cada especialidade (tolerância de gaps, estufa de pressão positiva, preservação de verniz original) e moldura chanfrada com marcas de coordenadas.
- **AC-034-04 (Redesign do Hero de Trabalhos `/trabalhos`)**:
  - Atualizar `src/routes/trabalhos.tsx` com telemetria de portfólio, notas de conformidade fotográfica de Toledo-PR e entrada GSAP fluida.
- **AC-034-05 (Redesign do Hero Institucional Sobre `/sobre`)**:
  - Atualizar `src/routes/sobre.tsx` destacando a liderança técnica do fundador Bruno, fundação em 2024 e transparência do CNPJ ativo.
- **AC-034-06 (Redesign do Hero Para Corretores `/para-corretores`)**:
  - Atualizar `src/routes/para-corretores.tsx` com telemetria de agilidade de sinistros, vistorias e livre escolha de oficina.
- **AC-034-07 (Redesign do Hero de Contato `/contato` e Proposta Comercial `/proposta`)**:
  - Atualizar `src/routes/contato.tsx` (e `Contact`) e `src/components/brs/proposal/proposal-hero.tsx` com acabamento Awwwards, preservando toda a lógica do formulário e parâmetros de busca.
- **AC-034-08 (Rastreabilidade e Quality Gates)**:
  - Preservar navegação client-side sem tags `<a>` para rotas internas.
  - 100% dos testes Vitest devem passar sem regressões.
  - `bun run lint` com 0 erros.
  - `bun run build` gerando pacotes cliente e SSR Nitro com sucesso.

---

## 3. Arquitetura e Decisões Técnicas

- **Reutilização e Consistência**: O componente `PageHero` centraliza os tokens de espaçamento, gradiente de iluminação ambiente e GSAP Context, garantindo que qualquer nova página adicionada no futuro herde imediatamente o padrão Awwwards.
- **Sem Interrupções de Navegação**: O Lenis gerencia o scroll inercial suave de forma global via `SiteLayout`, e o reset de rolagem no topo em cada transição de rota ocorre sem interferir no estado da página.
