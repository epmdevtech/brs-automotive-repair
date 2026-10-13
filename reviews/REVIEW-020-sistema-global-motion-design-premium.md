# REVIEW: Sistema Global de Motion Design Premium para Todas as Rotas da BRS Reparações Automotivas

## Metadados

| Campo           | Valor                                                       |
| --------------- | ----------------------------------------------------------- |
| ID              | REVIEW-020                                                  |
| SPEC            | SPEC-020                                                    |
| Tarefa          | TASK-020-01                                                 |
| Data da Revisão | 2026-10-12                                                  |
| Revisor         | Senior Frontend & UX/UI Motion Design Specialist EPMDEVTECH |
| Status          | Approved ✅                                                 |

---

## 1. Sumário Executivo

A auditoria, implementação e consolidação do **Sistema Global de Motion Design Premium** com **Framer Motion (^14.1.0)** para a **BRS Reparações Automotivas** foram concluídas com sucesso irrestrito em 100% das páginas, rotas e componentes estruturais do projeto.

O objetivo de transformar o site num ecossistema de motion sutil, intencional e boutique foi plenamente alcançado através dos seguintes pilares arquiteturais:

1. **Centralização de Motion Tokens (`src/lib/motion-tokens.ts`)**:
   - Curva bezier suave e refinada: `MOTION_EASE = [0.21, 0.47, 0.32, 0.98]`.
   - Tempos de duração intencionais: `hero` (0.85s), `section` (0.70s), `card` (0.60s), `micro` (0.25s), `route` (0.20s).
   - Deslocamentos contidos: `subtle` (12px), `standard` (20px), `prominent` (28px), garantindo total ausência de saltos visuais ou quebras de layout mobile.
   - Geradores puros de variantes Framer Motion (`createFadeInVariants`, `createSlideVariants`, `createStaggerContainer`, `createCardHoverVariants`).

2. **Componentes Base Reutilizáveis e Acessíveis**:
   - `ScrollReveal`: Wrapper polimórfico (`as: "div" | "section" | "article" | "p" | ...`), suporte a direções (`up`, `down`, `left`, `right`, `none`), margem de viewport negativa (`-60px`), execução única (`once: true`) e fallback limpo para SSR/redução de movimento.
   - `ImageReveal`: Container com `overflow-hidden`, zoom reverso de precisão (`scale: 1.08 -> 1.00`) e fade-in suave, valorizando o catálogo e acabamento artesanal dos veículos sem causar CLS (Cumulative Layout Shift).
   - `PageTransition`: Envoltório transparente integrado diretamente ao `SiteLayout` que executa uma transição sutil de 200ms na troca de rota, sem remontar Header e Rodapé, respeitando o scroll restoration nativo do TanStack Router.

3. **Cobertura Global em 100% das Rotas e Componentes**:
   - Homepage e seções transversais (`Philosophy`, `ProcessTimeline`, `ProjectGallery`, `Contact`, `FAQAccordion`, `FinalCTA`, `HomePathways`).
   - Rotas de Serviços (`/servicos`, `/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro` via `ServicePageLayout`).
   - Páginas institucionais e de conversão (`/trabalhos`, `/para-corretores`, `/sobre`, `/contato`, `/privacidade`, `/404`).

4. **Acessibilidade e Desempenho Estrito**:
   - Respeito integral à preferência de acessibilidade `prefers-reduced-motion` através do hook `useReducedMotion()`.
   - Garantia de hidratação perfeita em SSR do TanStack Start e Nitro Server, prevenindo flashes de conteúdo desordenado (FOUC).

---

## 2. Verificação dos Critérios de Aceitação

- [x] **AC-020-01**: Centralização dos motion tokens e geradores de variantes em `src/lib/motion-tokens.ts`.
- [x] **AC-020-02**: Componente `ScrollReveal` aprimorado com direções, deslocamentos sutis (12-28px), viewport once configurável e polimorfismo.
- [x] **AC-020-03**: Componente `ImageReveal` com zoom reverso cinematográfico e fade-in, preservando aspect ratios e sem layout shift.
- [x] **AC-020-04**: Componente `PageTransition` implementado no `SiteLayout` para transições de páginas sem desmontar header/footer.
- [x] **AC-020-05**: Auditoria e aplicação consistente em todas as rotas da aplicação (Homepage, Serviços, Trabalhos, Corretores, Sobre, Contato, Privacidade, 404).
- [x] **AC-020-06**: Componentes compartilhados e de rodapé/seções migrados com retrocompatibilidade garantida para testes existentes.
- [x] **AC-020-07**: Respeito estrito a `prefers-reduced-motion` e resiliência total em SSR.
- [x] **AC-020-08**: Suíte de testes automatizados `src/test/global-motion-system.test.tsx` com 12 novos cenários aprovados.
- [x] **AC-020-09**: Quality Gates 100% aprovados:
  - Vitest: 18 suites, 122 testes com 100% de sucesso.
  - ESLint: 0 erros, 0 warnings.
  - Build: Vite + Nitro SSR concluído com sucesso.

---

## 3. Conclusão

Revisão técnica aprovada sem ressalvas. O ecossistema de movimento estabelece uma linguagem coerente de luxo, precisão automotiva e alta performance para a BRS Reparações Automotivas.
