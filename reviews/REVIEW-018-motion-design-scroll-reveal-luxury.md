# REVIEW: Motion Design de Luxo com Framer Motion (ScrollReveal & ImageReveal)

## Metadados

| Campo           | Valor                                                     |
| --------------- | --------------------------------------------------------- |
| ID              | REVIEW-018                                                |
| SPEC            | SPEC-018                                                  |
| Tarefa          | TASK-018-01                                               |
| Data da Revisão | 2026-10-12                                                |
| Revisor         | Senior Frontend Engineer & Luxury UI/UX Motion Specialist |
| Status          | Approved ✅                                               |

---

## 1. Sumário Executivo

A implementação do sistema de Motion Design refinado e elegante com **Framer Motion (^14.1.0)** para a **BRS Reparações Automotivas** foi concluída com excelência em todo o projeto.

Atendendo ao posicionamento boutique e de alto padrão (estúdio de Martelinho de Ouro Artesanal e Funilaria Fina), todos os componentes de animação adotam parâmetros estritos que evitam comportamentos espalhafatosos ou infantis:

- **Deslocamentos contidos e curtos**: Padrão de 24px (faixa de 15px a 30px, nunca ultrapassando 40px).
- **Easing e Timing de Luxo**: Curva bezier cinematográfica suave `[0.21, 0.47, 0.32, 0.98]` com durações entre 0.7s e 1.0s.
- **Execução Única**: Viewport com `once: true, margin: "-60px"`, evitando recálculos ou repetições incômodas durante a rolagem reversa.
- **Efeito Stagger (Cascata)**: Delays sequenciais (`delay={index * 0.12}`) aplicados em listas, cards e especialidades.
- **Zoom Reverso Cinematográfico**: O componente `ImageReveal` aplica leve zoom reverso de escala (`scale: 1.12 -> 1.00`) combinado com fade-in suave, garantindo um visual de catálogo de luxo para as fotografias veiculares.
- **Acessibilidade e SSR**: Suporte estrito a `useReducedMotion()` para respeitar preferências do sistema operacional, e verificação robusta de `IntersectionObserver` evitando falhas durante o SSR com Nitro e jsdom em testes.

---

## 2. Verificação dos Critérios de Aceitação

- [x] **AC-018-01**: `ScrollReveal` implementado em `src/components/ui/scroll-reveal.tsx` com direções `up`, `down`, `left`, `right` e `none`.
- [x] **AC-018-02**: `ImageReveal` implementado em `src/components/ui/image-reveal.tsx` com `overflow-hidden` e zoom reverso cinematográfico.
- [x] **AC-018-03**: Execução única por padrão configurada com `viewport={{ once: true, margin: "-60px" }}`.
- [x] **AC-018-04**: Deslocamento restrito entre 15px e 30px (default de 24px), prevenindo movimentos bruscos.
- [x] **AC-018-05**: Suporte a acessibilidade (`useReducedMotion`) desativando transições para usuários sensíveis a movimento.
- [x] **AC-018-06**: Integração refinada e completa em todas as rotas:
  - `src/routes/servicos/index.tsx`
  - `src/components/brs/service-page-layout.tsx` (cobrindo `/servicos/funilaria`, `/servicos/pintura-automotiva` e `/servicos/martelinho-de-ouro`)
  - `src/routes/trabalhos.tsx`
  - `src/routes/para-corretores.tsx`
  - `src/routes/sobre.tsx`
  - `src/routes/contato.tsx`
  - `src/components/brs/home-pathways.tsx`
  - `src/components/brs/contact-cta.tsx`
- [x] **AC-018-07**: Suíte de testes automatizados Vitest criada e aprovada (`src/test/scroll-reveal-luxury.test.tsx` com 5 testes específicos).
- [x] **AC-018-08**: Quality Gates satisfeitos com 100% de aprovação:
  - Vitest: 17 suites, 110 testes aprovados.
  - ESLint: 0 erros.
  - Build: Produção Vite + Nitro SSR concluído com sucesso.

---

## 3. Conclusão

Revisão técnica aprovada sem ressalvas. As microinterações e transições de scroll transmitem sofisticação, precisão artesanal e alta performance condizentes com a identidade boutique da BRS Reparações Automotivas.
