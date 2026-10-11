# TASK: Auditoria e Implementação de Scroll Reveal Premium

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-010-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia Front-end EPMDEVTECH                                  |
| SPEC         | SPEC-010                                                         |
| Critérios    | AC-010-01, AC-010-02, AC-010-03, AC-010-04, AC-010-05, AC-010-06 |
| Dependências | SPEC-010                                                         |

---

## Objetivo

Implementar a padronização e distribuição equilibrada de scroll reveal premium na landing page da BRS Reparações Automotivas, calibrando os tokens CSS em `src/styles.css`, estendendo `useScrollReveal` com disparo único eficiente via `IntersectionObserver` e aplicando reveal suave às seções `Philosophy`, `Pickup`, `FAQAccordion` e `Contact` sem conflitos ou duplicidades.

---

## Escopo

### Incluído

- Ajustar tokens de movimento em `src/styles.css` (`--reveal-distance: 16px`, `--dur-reveal: 520ms`, `--reveal-ease: cubic-bezier(0.16, 1, 0.3, 1)`, `--stagger: 80ms`).
- Refinar `[data-reveal="hidden"]` e `[data-reveal="shown"]` em `src/styles.css` e garantir fallback com `prefers-reduced-motion`.
- Atualizar `src/hooks/use-scroll-reveal.ts` com calibração de threshold (0.12), rootMargin e execução única por elemento.
- Integrar `{...reveal()}` nos componentes `philosophy.tsx`, `pickup.tsx`, `faq-accordion.tsx` e `contact.tsx`.
- Criar a suíte de testes `src/test/scroll-reveal.test.tsx` com validação de execução única, acessibilidade reduzida e integridade visual.
- Executar e validar todos os Quality Gates via `make check`.

### Não incluído

- Alterações estruturais no Hero, dados comerciais ou instalação de novas bibliotecas externas.

---

## Validação

| Critério/risco | Teste, comando ou revisão    | Evidência esperada                                            |
| -------------- | ---------------------------- | ------------------------------------------------------------- |
| AC-010-01      | Inspeção de `src/styles.css` | Tokens calibrados (16px, 520ms, ease suave, 80ms stagger)     |
| AC-010-02      | Inspeção do Hero             | Hero renderiza com Framer Motion sem `data-reveal` duplicado  |
| AC-010-03      | Inspeção do observer         | `observer.unobserve()` chamado imediatamente na interseção    |
| AC-010-04      | Teste de degradação          | Elementos permanecem visíveis sem JS ou observer ativo        |
| AC-010-05      | Teste de reduced motion      | `prefers-reduced-motion` anula animações mantendo opacidade 1 |
| AC-010-06      | `make check`                 | Vitest, ESLint, TypeScript e Build 100% aprovados             |

---

## Condição de conclusão

- [x] Tokens de scroll reveal calibrados em `src/styles.css`.
- [x] Hook `useScrollReveal` refinado com disparo em 10-20% e unobserve único.
- [x] Seções `Philosophy`, `Pickup`, `FAQAccordion` e `Contact` integradas com `reveal()`.
- [x] Testes em `src/test/scroll-reveal.test.tsx` criados e aprovados.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-010` criado e aprovado.
