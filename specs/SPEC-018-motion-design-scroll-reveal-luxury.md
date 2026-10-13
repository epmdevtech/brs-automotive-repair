# SPEC-018: Motion Design de Luxo com Framer Motion (ScrollReveal & ImageReveal)

## Metadados

| Campo           | Valor                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| ID              | SPEC-018                                                                                                            |
| Título          | Sistema de Animações de Scroll Refinadas e Elegantes (Framer Motion) para Estúdio Automotivo Boutique BRS           |
| Status          | Approved (instrução humana explícita de 2026-10-12)                                                                 |
| Autor           | Senior Frontend Engineer & Luxury UI/UX Motion Specialist (EPMDEVTECH & Antigravity)                                |
| Data de Criação | 2026-10-12                                                                                                          |
| Alvo            | `src/components/ui/scroll-reveal.tsx`, `src/components/ui/image-reveal.tsx`, `src/routes/*`, `src/components/brs/*` |

---

## 1. Contexto & Diretrizes de Design (Estética Luxury / Boutique)

A **BRS Reparações Automotivas** é um estúdio automotivo especializado em Martelinho de Ouro Artesanal, Funilaria Fina e Pintura em Estufa em Toledo-PR. Para consolidar uma percepção de marca boutique e de alto padrão (Porsche, Aston Martin, estúdios artesanais de alta precisão), as animações de scroll devem seguir rigorosas restrições estéticas:

1. **Deslocamento Curto (Subtle Movement)**: Distância contida entre 15px e 30px (nunca ultrapassar 40px), evitando saltos visuais grosseiros.
2. **Easing & Timing de Alta Precisão**:
   - Duração entre `0.7s` e `1.0s` (padrão de `0.8s` para revelação e `0.9s` para mídia).
   - Curva bezier normatizada: `ease: [0.21, 0.47, 0.32, 0.98]`.
3. **Execução Única (Once in Viewport)**:
   - Configuração estrita de `viewport={{ once: true, margin: "-60px" }}` para evitar disparos repetitivos ou recálculos durante a rolagem reversa.
4. **Cascata Orgânica (Stagger)**:
   - Grids, listas e grupos de cards revelam-se sequencialmente com atrasos progressivos (`delay={index * 0.12}`).
5. **Acessibilidade & Prevenção de Overflow Mobile**:
   - Integração com `useReducedMotion()` do Framer Motion e detecção de `prefers-reduced-motion`.
   - Limitação de transições horizontais para não causar overflow lateral (`overflow-x: hidden`) em viewports mobile.

---

## 2. Requisitos Técnicos

### 2.1 Componentes Base Reutilizáveis (`src/components/ui/`)

1. **`ScrollReveal` (`src/components/ui/scroll-reveal.tsx`)**:
   - Props tipadas:
     - `children`: `React.ReactNode`
     - `direction`: `"up" | "down" | "left" | "right" | "none"` (padrão: `"up"`)
     - `delay`: `number` (padrão: `0`)
     - `duration`: `number` (padrão: `0.8`)
     - `distance`: `number` (padrão: `24`)
     - `className`: `string`
     - `as`: elemento semântico (`"div" | "article" | "section" | "li" | "span" | "header"`, padrão: `"div"`)
   - Comportamento:
     - Animação combinada de `opacity: 0 -> 1` e translação no eixo X ou Y conforme a direção.
     - Fallback imediato para SSR e `prefers-reduced-motion`.

2. **`ImageReveal` (`src/components/ui/image-reveal.tsx`)**:
   - Wrapper com `overflow-hidden` para fotografias e detalhes técnicos de verniz e carroceria.
   - Animação com leve zoom reverso: de `scale: 1.12` para `scale: 1`, acompanhado de `opacity: 0` para `opacity: 1`.
   - Props: `children`, `delay` (padrão: `0`), `duration` (padrão: `0.9`), `scale` (padrão: `1.12`), `className`, `viewportMargin` (padrão: `"-60px"`).

### 2.2 Aplicação nas Rotas e Estruturas de Conteúdo

1. **Hero & Cabeçalhos de Seções**:
   - Entrada vertical com escalonamento refinado: subtítulo (`delay: 0.05`), título (`delay: 0.15`), parágrafo descritivo (`delay: 0.25`) e botões/CTAs (`delay: 0.35`).
2. **Cards e Grids**:
   - Envolver cartões nas páginas de serviços ([`/servicos`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/routes/servicos/index.tsx)), institucional ([`/sobre`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/routes/sobre.tsx)), corretores ([`/para-corretores`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/routes/para-corretores.tsx)) e atalhos da home ([`home-pathways.tsx`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/components/brs/home-pathways.tsx)) com `delay={index * 0.12}`.
3. **Mídias e Fotografias**:
   - Aplicar `ImageReveal` nas ilustrações técnicas dos serviços e apresentação.
4. **Formulários e CTAs**:
   - Entrada suave com `direction="up"` no formulário de contato e blocos de encerramento [`ContactCTA`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/components/brs/contact-cta.tsx).

---

## 3. Critérios de Aceitação (AC)

- **AC-018-01**: `ScrollReveal` implementado em `src/components/ui/scroll-reveal.tsx` com direção, delay, duração e distância configuráveis, respeitando a curva bezier `[0.21, 0.47, 0.32, 0.98]`.
- **AC-018-02**: `ImageReveal` implementado em `src/components/ui/image-reveal.tsx` com `overflow-hidden` e efeito de zoom reverso suave (`scale: 1.12 -> 1.0`).
- **AC-018-03**: Todas as animações usam `viewport={{ once: true, margin: "-60px" }}`.
- **AC-018-04**: Deslocamentos mantidos estritamente entre 15px e 30px (padrão 24px).
- **AC-018-05**: Suporte a `useReducedMotion()` preservando acessibilidade WCAG.
- **AC-018-06**: Integração refinada nas rotas do projeto sem quebrar layout, SSR do TanStack Start ou tipagem TypeScript.
- **AC-018-07**: Suíte de testes automatizados com Vitest cobrindo os componentes de motion design de luxo.
- **AC-018-08**: 100% dos quality gates aprovados (`bun run test`, `bun run lint`, `bun run build`).
