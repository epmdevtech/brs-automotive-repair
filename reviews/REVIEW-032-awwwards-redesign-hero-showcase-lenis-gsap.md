# REVIEW-032 — Redesign Awwwards da Home (Hero & Showcase), Lenis e GSAP

## Metadados

| Campo            | Valor                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| ID               | `REVIEW-032`                                                                        |
| SPEC Relacionada | [`SPEC-032`](../specs/SPEC-032-awwwards-redesign-hero-showcase-lenis-gsap.md)       |
| TASK Relacionada | [`TASK-032-01`](../tasks/TASK-032-01-awwwards-redesign-hero-showcase-lenis-gsap.md) |
| Data Revisão     | 2026-10-14                                                                          |
| Status           | Approved (Aprovado)                                                                 |
| Revisor          | Lead Creative Technologist & QA Architect                                           |

---

## 1. Sumário Executivo

A implementação do redesign da Home da BRS Reparações Automotivas elevou o padrão estético, cinemático e de microinterações para o patamar internacional **Awwwards Site of the Day (SOTD)**, respeitando integralmente os contratos canônicos de arquitetura, acessibilidade (WCAG AA) e as rotas multipágina existentes em TanStack Start.

---

## 2. Verificação dos Critérios de Aceite da SPEC-032

| Critério      | Descrição                                    | Status   | Evidência                                                                                                                       |
| ------------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **AC-032-01** | Smooth Scroll com Lenis & Sincronização GSAP | Aprovado | `SmoothScrollProvider` e `useSmoothScroll` sincronizam RAF com `ScrollTrigger.update`, com fallback de redução de movimento.    |
| **AC-032-02** | Paleta de Cores & Tokens de Luxo Automotivo  | Aprovado | Variáveis `--gold-metallic`, `--obsidian`, classes `.glass-panel-luxury`, `.led-status-pulse` adicionadas em `src/styles.css`.  |
| **AC-032-03** | Hero Section Awwwards Standard               | Aprovado | Badge com LED pulsante de Toledo-PR, 3 pilares de telemetria automotiva, micro-parallax GSAP `quickTo`, H1 canônico preservado. |
| **AC-032-04** | Showcase Section Antes/Depois & Telemetria   | Aprovado | Tags de estudo de caso com tolerância `< 1.0mm`, moldura de precisão e entrada escalonada com GSAP ScrollTrigger.               |
| **AC-032-05** | MediaExpand Cinematográfico                  | Aprovado | Transição suave de expansão inercial, halo luminoso e legenda técnica de estufa de pintura.                                     |
| **AC-032-06** | Testes e Quality Gates                       | Aprovado | 25 suítes de teste (180 testes) 100% aprovados, 0 erros de linting e build de produção bem-sucedido.                            |

---

## 3. Evidências de Validação

- **Vitest**: `25 passed (25)` / `180 passed (180)` em 66.69s.
- **ESLint & Prettier**: `bun run lint` executado com zero erros.
- **Build & Nitro SSR**: `bun run build` gerou com sucesso os pacotes cliente e SSR em `.output/`.
- **Acessibilidade**: Fallbacks para `prefers-reduced-motion` ativos em todas as animações GSAP e instâncias de rolagem do Lenis.
