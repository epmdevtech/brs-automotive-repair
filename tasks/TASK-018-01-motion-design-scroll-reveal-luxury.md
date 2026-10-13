# TASK: Motion Design de Luxo com Framer Motion (ScrollReveal & ImageReveal)

## Metadados

| Campo        | Valor                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| ID           | TASK-018-01                                                                            |
| Status       | Done                                                                                   |
| Responsável  | Senior Frontend Engineer & Luxury UI/UX Motion Specialist                              |
| SPEC         | SPEC-018                                                                               |
| Critérios    | AC-018-01, AC-018-02, AC-018-03, AC-018-04, AC-018-05, AC-018-06, AC-018-07, AC-018-08 |
| Dependências | SPEC-018                                                                               |

---

## Objetivo

Criar os componentes base de animação `ScrollReveal` e `ImageReveal` em `src/components/ui/`, seguindo os padrões de motion design boutique/luxo (distância curta de 15px-30px, curva suave `[0.21, 0.47, 0.32, 0.98]`, viewport `once: true, margin: "-60px"` e zoom reverso `1.12 -> 1.0`), e aplicá-los com elegância nas rotas do projeto BRS Reparações Automotivas.

---

## Escopo

1. **Componentes Base (`src/components/ui/`)**:
   - `src/components/ui/scroll-reveal.tsx`
   - `src/components/ui/image-reveal.tsx`
2. **Integração nas Rotas e Componentes Estruturais**:
   - Refatoração dos headers, grids e CTAs com `ScrollReveal` e `ImageReveal` em:
     - `src/routes/servicos/index.tsx`
     - `src/components/brs/service-page-layout.tsx` (que atende `/servicos/funilaria`, `/servicos/pintura-automotiva` e `/servicos/martelinho-de-ouro`)
     - `src/routes/trabalhos.tsx`
     - `src/routes/para-corretores.tsx`
     - `src/routes/sobre.tsx`
     - `src/routes/contato.tsx`
     - `src/components/brs/home-pathways.tsx`
     - `src/components/brs/contact-cta.tsx`
3. **Testes & Quality Gates**:
   - Criar `src/test/scroll-reveal-luxury.test.tsx`.
   - Validar testes (`bun run test`), lint (`bun run lint`) e build SSR (`bun run build`).

---

## Critérios de Aceitação

- [x] **AC-018-01**: `ScrollReveal` implementado em `src/components/ui/scroll-reveal.tsx`.
- [x] **AC-018-02**: `ImageReveal` implementado em `src/components/ui/image-reveal.tsx`.
- [x] **AC-018-03**: `viewport={{ once: true, margin: "-60px" }}` configurado por padrão.
- [x] **AC-018-04**: Deslocamento entre 15px e 30px (default 24px).
- [x] **AC-018-05**: Suporte a acessibilidade (`useReducedMotion`).
- [x] **AC-018-06**: Integração refinada nas rotas do projeto sem layout shift ou overflow mobile.
- [x] **AC-018-07**: Suíte de testes automatizados Vitest validando propriedades de luxo.
- [x] **AC-018-08**: Quality gates 100% aprovados.
