# SPEC-020: Sistema Global de Motion Design Premium para Todas as Rotas da BRS Reparações Automotivas

## Metadados

| Campo       | Valor                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------- |
| ID          | SPEC-020                                                                                  |
| Título      | Sistema Global de Motion Design Premium para Todas as Rotas da BRS Reparações Automotivas |
| Status      | Approved                                                                                  |
| Autor       | Senior Frontend & UX/UI Motion Design Specialist EPMDEVTECH                               |
| Data        | 2026-10-12                                                                                |
| Dependência | SPEC-015, SPEC-017, SPEC-018, SPEC-019                                                    |

---

## 1. Contexto e Justificativa

A **BRS Reparações Automotivas** é um estúdio de funilaria fina, pintura em estufa e martelinho de ouro em Toledo, Paraná, cuja marca posiciona-se no segmento premium automotivo.
Historicamente desenvolvida como SPA e expandida para múltiplas rotas em TanStack Start, a interface apresentava comportamentos de movimento fragmentados:

- O Hero da página inicial possuía animação, enquanto blocos internos e rotas secundárias (`/privacidade`, `404`, componentes legados `Philosophy`, `Contact`, `ProjectGallery`, etc.) ainda utilizavam implementações mistas ou estáticas.
- A transição entre rotas ocorria de forma seca, sem continuidade visual refinada.
- Havia a necessidade de unificar e padronizar um **sistema global, reutilizável e consistente de motion design** com tokens centralizados, respeitando rigorosamente a acessibilidade (`prefers-reduced-motion`), SSR com Nitro, ausência de layout shift e sem degradação de performance.

---

## 2. Princípios e Diretrizes de Motion Design

| Propriedade           | Diretriz Normativa                                                      |
| --------------------- | ----------------------------------------------------------------------- |
| Deslocamento Vertical | 16–24 px (máximo estrito de 30 px, sem sobressaltos visuais)            |
| Deslocamento Lateral  | 12–20 px apenas quando estritamente intencional, sem overflow           |
| Duração Padrão        | 0,65–0,8 s com curva suave `[0.21, 0.47, 0.32, 0.98]`                   |
| Duração de Destaque   | Até 0,95 s para revelação cinematográfica de fotos automotivas          |
| Transição entre Rotas | 180–220 ms (rápida, sutil, opacidade + 6-8 px de deslocamento)          |
| Escala de Imagem      | Zoom reverso contido (`scale: 1.08 -> 1.00`), sem esticar fotos         |
| Stagger em Grids      | 0,08–0,12 s entre cards, evitando atrasos excessivos no último          |
| Execução no Scroll    | Disparo único por padrão (`viewport={{ once: true, margin: "-60px" }}`) |
| Acessibilidade        | Remoção total de translações/escalas sob `prefers-reduced-motion`       |

---

## 3. Arquitetura do Sistema de Motion

### 3.1. Tokens e Variantes Globais (`src/lib/motion-tokens.ts`)

- Centralização dos parâmetros de easing, durações, distâncias e variantes prontas (`fadeUp`, `fadeIn`, `staggerContainer`, `staggerItem`, `imageScale`, `pageTransition`).

### 3.2. Primitivas de UI (`src/components/ui/`)

1. **`ScrollReveal` (`src/components/ui/scroll-reveal.tsx`)**:
   - Suporte polimórfico (`as="div" | "article" | "section" | "li" | ...`).
   - Direções `up`, `down`, `left`, `right`, `none`.
   - Props: `delay`, `duration`, `distance`, `once`, `amount`, `viewportMargin`.
   - Fallback gracioso para SSR e `useReducedMotion()`.
2. **`ImageReveal` (`src/components/ui/image-reveal.tsx`)**:
   - Container `overflow-hidden` preservando aspecto (`aspect-16/10`, `aspect-4/3`).
   - Leve zoom reverso de escala (`scale: 1.08 -> 1.00`) e fade-in suave (`opacity: 0 -> 1`).
   - Sem layout shift e preservando semântica de imagem e selos de conformidade.
3. **`PageTransition` (`src/components/ui/page-transition.tsx`)**:
   - Envolve o conteúdo principal no `SiteLayout`.
   - Transição curta de rota orientada pela chave de pathname do TanStack Router.
   - Não bloqueia interações nem remonta shells globais (Navbar e Footer preservados).

### 3.3. Abrangência Global (100% das Rotas e Componentes)

- `/`: `Hero`, `MediaExpand`, `Services`, `Philosophy`, `ProcessTimeline`, `HomePathways`, `FinalCTA`.
- `/servicos`: Header de especialidades, grid de serviços e guia de triagem.
- `/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`: `ServicePageLayout` integrado.
- `/trabalhos`: Header técnico, transparência fotográfica e galeria interativa (`ProjectGallery`).
- `/para-corretores`: Parceria com segurados, fotografia e pilares de cooperação.
- `/sobre`: Apresentação institucional, dados da oficina e princípios técnicos.
- `/contato`: Atendimento, formulário de mensagem estruturada e `FAQAccordion`.
- `/privacidade`: Header institucional e blocos de diretrizes de proteção de dados.
- `404`: Mensagem de erro e rotas de retorno amigáveis.

---

## 4. Critérios de Aceitação (AC)

- [ ] **AC-020-01**: Centralização dos motion tokens e variantes em `src/lib/motion-tokens.ts`.
- [ ] **AC-020-02**: Componente `ScrollReveal` suporta direções, deslocamentos suaves, disparo único e polimorfismo.
- [ ] **AC-020-03**: Componente `ImageReveal` aplica zoom reverso e fade-in suave sem alterar layout ou proporções.
- [ ] **AC-020-04**: Componente `PageTransition` implementado no `SiteLayout` para transições sutis entre rotas sem remontar header/footer.
- [ ] **AC-020-05**: Todas as rotas do projeto auditadas e unificadas sob o sistema global de motion design.
- [ ] **AC-020-06**: Componentes legados (`Philosophy`, `Contact`, `FAQAccordion`, `ProjectGallery`, `FinalCTA`) migrados para o novo padrão.
- [ ] **AC-020-07**: Respeito estrito a `prefers-reduced-motion` e resiliência em ambiente SSR do TanStack Start e Nitro.
- [ ] **AC-020-08**: Suíte de testes automatizados com Vitest validando o sistema global de motion.
- [ ] **AC-020-09**: Quality Gates 100% aprovados (testes, lint, build de produção).
