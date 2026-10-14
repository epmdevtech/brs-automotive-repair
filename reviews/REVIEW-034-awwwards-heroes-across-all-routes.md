# REVIEW-034 — Validação dos Heroes Awwwards em Todas as Rotas

## 1. Metadados

| Campo   | Valor                                                                      |
| ------- | -------------------------------------------------------------------------- |
| SPEC    | [`SPEC-034`](../specs/SPEC-034-awwwards-heroes-across-all-routes.md)       |
| TASK    | [`TASK-034-01`](../tasks/TASK-034-01-awwwards-heroes-across-all-routes.md) |
| Data    | 2026-10-14                                                                 |
| Status  | Aprovado (100% Quality Gates Cumpridos)                                    |
| Revisor | Quality Gate Lead & Awwwards Design Auditor                                |

---

## 2. Sumário da Entrega

Implementação bem-sucedida do redesign cinematográfico Awwwards Site of the Day para as seções Hero de todas as rotas da aplicação BRS Reparações Automotivas:

1. **Componente Canônico `PageHero` (`src/components/brs/page-hero.tsx`)**:
   - Cabeçalho de alta precisão com breadcrumbs, código técnico e coordenadas geográficas (`COORD: 24°43'S 53°44'W`).
   - Tipografia refinada (Sora Display + Manrope Body) com balanço visual e iluminação especular em halo verde automotivo.
   - Coreografia de entrada GSAP (`gsap.timeline`) com stagger milimétrico e respeito irrestrito a `prefers-reduced-motion`.
   - Grid de chips de telemetria técnica contextual por rota.
   - Botões de ação (`Button`) com roteamento estrito TanStack Router `<Link to="..." search={...}>`.

2. **Rotas Elevadas**:
   - `/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro` via `ServicePageLayout` (`ESP.01`, `ESP.02`, `ESP.03`).
   - `/servicos` (`CAT.02 // SERVIÇOS`).
   - `/trabalhos` (`GAL.03 // PORTFÓLIO`).
   - `/sobre` (`INS.04 // INSTITUCIONAL`).
   - `/para-corretores` (`PAR.05 // SINISTROS & CORRETORES`).
   - `/contato` (`CON.06 // CONTATO & AVALIAÇÃO` ou `PAR.06 // ATENDIMENTO CORRETORES`).
   - `/privacidade` (`LEG.07 // LGPD & PRIVACIDADE`).
   - `/proposta/$slug` (`PRO.08 // APRESENTAÇÃO COMERCIAL`).

---

## 3. Evidências dos Quality Gates

- **Vitest (`bun run test`)**: 27 suítes aprovadas, 189 testes passando (100%).
- **ESLint & Prettier (`bun run lint`)**: 0 erros.
- **Produção Build (`bun run build`)**: Vite + Nitro SSR compilado com sucesso em 1.55s.
- **Roteamento Estrito**: Zero tags `<a href="/...">` internas detectadas em heróis.
