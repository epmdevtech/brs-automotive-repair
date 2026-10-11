# SPEC: Auditoria e Implementação de Scroll Reveal Premium

## Metadados

| Campo                               | Valor                                                  |
| ----------------------------------- | ------------------------------------------------------ |
| ID                                  | SPEC-010                                               |
| Status                              | Implemented                                            |
| Responsável                         | Engenharia Front-end EPMDEVTECH                        |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH          |
| Criado                              | 2026-10-11                                             |
| Atualizado                          | 2026-10-11                                             |
| Lançamento alvo                     | `0.1.0`                                                |
| Briefing de UX relacionado          | Auditoria e Implementação de Scroll Reveal Premium BRS |
| Especificação de design relacionada | Motion Design & Performance Guidelines                 |
| ADRs relacionadas                   | N/A                                                    |

---

## 1. Problema e Resultado

A landing page da BRS Reparações Automotivas possui animações de entrada refinadas no Hero (via Framer Motion) e transição de mídia (MediaExpand), além de efeito spotlight em cards de serviços. No entanto, a experiência de rolagem ao longo das seções apresentava inconsistências:

1. Algumas seções (`Philosophy`, `Pickup`, `FAQAccordion`, `Contact`) não possuíam revelação gradual ao entrar no viewport, aparecendo de forma abrupta em relação às seções vizinhas (`Services`, `ProjectGallery`, `ProcessTimeline`, `PartnerSection`, `About`, `FinalCTA`).
2. Os parâmetros de deslocamento, duração e curvas de aceleração do scroll reveal precisavam de calibração fina para respeitar a métrica editorial e técnica (12-20px de deslocamento, 450-650ms de duração, easing suave sem overshoot e stagger equilibrado de 70-120ms).
3. Era necessária uma auditoria completa para catalogar todas as animações, evitar duplicidades, conflitos de transform com hover e garantir que nenhum elemento essencial ficasse permanentemente invisível.

### Matriz Canônica de Auditoria de Animações

| Seção e Componente                          | Efeito Existente                                            | Possível Duplicidade                                   | Ação Recomendada                                            | Custo e Risco |
| ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | ------------- |
| **Header** (`header.tsx`)                   | Transição de fundo no scroll (>40px)                        | Nenhuma                                                | Manter intacto                                              | Nulo          |
| **Hero** (`hero.tsx` / `animated-hero.tsx`) | Animação no mount com Framer Motion (stagger)               | Evitar reveal duplo de scroll                          | Manter animação Framer Motion; NÃO aplicar reveal de scroll | Nulo          |
| **MediaExpand** (`media-expand.tsx`)        | Expansão contínua orientada a rolagem (`useScrollProgress`) | Não possui reveal                                      | Manter efeito contínuo                                      | Baixo         |
| **Serviços** (`services.tsx`)               | Cabeçalho e cards com `data-reveal`; hover spotlight        | Sem conflito (transform no wrapper, spotlight interno) | Manter e calibrar timings globais                           | Mínimo        |
| **Filosofia** (`philosophy.tsx`)            | Nenhum efeito anterior                                      | Nenhuma                                                | Adicionar scroll reveal coordenado no cabeçalho e pilares   | Mínimo        |
| **Galeria** (`project-gallery.tsx`)         | Cabeçalho e cards com `data-reveal`; slider interno         | Não animar elementos internos do card                  | Manter reveal no card container; calibrar timings           | Mínimo        |
| **Processo** (`process-timeline.tsx`)       | Cabeçalho e passos com `data-reveal`                        | Nenhuma                                                | Manter stagger ordenado de 4 etapas                         | Mínimo        |
| **Corretores** (`partner-section.tsx`)      | Imagem e bloco de texto com `data-reveal`                   | Sem animação interna de bullets                        | Manter reveal nos blocos principais                         | Mínimo        |
| **Leva e Traz** (`pickup.tsx`)              | Nenhum efeito anterior                                      | Nenhuma                                                | Adicionar scroll reveal suave no bloco                      | Mínimo        |
| **Sobre** (`about.tsx`)                     | Colunas com `data-reveal`                                   | Nenhuma                                                | Manter reveal coordenado                                    | Mínimo        |
| **FAQ** (`faq-accordion.tsx`)               | Nenhum efeito de entrada; animação Radix no toggle          | Não interferir no toggle do accordion                  | Adicionar scroll reveal no container e cabeçalho            | Mínimo        |
| **Contato** (`contact.tsx`)                 | Nenhum efeito anterior                                      | Não atrasar formulário                                 | Adicionar scroll reveal suave em blocos principais          | Mínimo        |
| **CTA Final** (`final-cta.tsx`)             | Bloco central com `data-reveal`                             | Nenhuma                                                | Manter reveal suave                                         | Mínimo        |
| **Footer** (`footer.tsx`)                   | Estático                                                    | Nenhuma                                                | Manter estático sem animações supérfluas                    | Nulo          |

---

## 2. Escopo

### No escopo (In scope)

- Padronização global dos tokens de movimento em `src/styles.css`:
  - `--reveal-distance: 16px` (deslocamento vertical sutil entre 12 e 20px).
  - `--dur-reveal: 520ms` (duração suave entre 450 e 650ms).
  - `--reveal-ease: cubic-bezier(0.16, 1, 0.3, 1)` (easing suave sem overshoot).
  - `--stagger: 80ms` (intervalo ordenado entre 70 e 120ms).
- Aprimoramento do hook `useScrollReveal` (`src/hooks/use-scroll-reveal.ts`):
  - Disparo otimizado via `IntersectionObserver` com `threshold: 0.12` e `rootMargin: "0px 0px -10% 0px"`.
  - Desconexão imediata (`unobserve`) após revelação inicial (execução única).
  - Suporte estrito a `prefers-reduced-motion: reduce` e fallback com conteúdo 100% visível sem JavaScript.
- Integração harmoniosa de `reveal()` nas seções que ainda não possuíam (`Philosophy`, `Pickup`, `FAQAccordion`, `Contact`).
- Preservação intacta do Hero (Framer Motion) e de componentes de interação (Lightbox, BeforeAfterSlider, CardSpotlight).
- Criação de suíte de testes dedicados em `src/test/scroll-reveal.test.tsx`.
- Validação total via `make check`.

### Fora do escopo (Out of scope)

- Modificação de bibliotecas externas (não instalar novas dependências).
- Scroll hijacking, pinning ou smooth scroll forçado via JavaScript.
- Alteração no catálogo comercial ou textos da BRS.

---

## 3. Critérios de Aceitação

- [AC-010-01] Todas as seções abaixo da dobra devem possuir revelação coordenada suave com deslocamento vertical de ~16px e duração de ~520ms.
- [AC-010-02] O Hero deve manter sua animação original via Framer Motion sem aplicação redundante de scroll reveal.
- [AC-010-03] Elementos revelados nunca devem ser ocultados novamente ao sair da viewport (execução estritamente única via `unobserve`).
- [AC-010-04] O conteúdo deve estar no DOM e visível por padrão caso JavaScript esteja desabilitado ou o observer não esteja disponível.
- [AC-010-05] Em modo `prefers-reduced-motion: reduce`, todos os elementos devem aparecer imediatamente sem transições nem deslocamentos.
- [AC-010-06] Todos os Quality Gates (`make check`) devem passar com 100% de sucesso.
