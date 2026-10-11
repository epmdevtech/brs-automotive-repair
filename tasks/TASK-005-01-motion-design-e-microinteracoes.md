# TASK: Implementação de Motion Design e Microinterações

## Metadados

| Campo        | Valor                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| ID           | TASK-005-01                                                                 |
| Status       | Done                                                                        |
| Responsável  | Engenharia de Software EPMDEVTECH                                           |
| SPEC         | SPEC-005                                                                    |
| Critérios    | AC-005-01, AC-005-02, AC-005-03, AC-005-04, AC-005-05, AC-005-06, AC-005-07 |
| Dependências | SPEC-005                                                                    |

---

## Objetivo

Implementar o sistema de movimento da BRS e as três intervenções de maior impacto (hero, transição por expansão de mídia e spotlight nos serviços), além de entradas discretas nas seções e refino dos botões, sem adicionar dependências.

---

## Escopo

### Incluído

- `src/lib/motion.ts`: utilitários puros (`prefersReducedMotion`, `shouldSimplifyMotion`, `progressFromRect`, `seq`, `revealDelay`, `trackPointer`).
- `src/hooks/use-scroll-reveal.ts` e `src/hooks/use-scroll-progress.ts`.
- `src/components/brs/media-expand.tsx` e integração em `website.tsx`.
- Atualização de `hero.tsx`, `services.tsx`, `about.tsx`, `project-gallery.tsx`, `process-timeline.tsx`, `partner-section.tsx` e `final-cta.tsx`.
- Tokens e estilos de movimento em `src/styles.css`; variantes em `src/components/ui/button.tsx`.
- Testes em `src/test/motion.test.ts`.

### Não incluído

- Comparador antes/depois, vídeo, WebGL, novas dependências, mudanças de conteúdo comercial.

---

## Validação

| Critério/risco        | Teste, comando ou revisão                       | Evidência esperada                                  |
| --------------------- | ----------------------------------------------- | --------------------------------------------------- |
| AC-005-01 / AC-005-02 | Inspeção visual e testes de `progressFromRect`  | Progresso 0..1 determinístico e sem layout shift    |
| AC-005-03             | Inspeção de CSS (`@media (hover: hover)`)       | Spotlight restrito a ponteiro fino                  |
| AC-005-04             | Inspeção de variantes de botão                  | Foco visível e área de toque ampliada               |
| AC-005-05 / AC-005-06 | Testes e `prefers-reduced-motion` no CSS e hook | Conteúdo visível sem JS e sem movimento             |
| AC-005-07             | `git diff package.json` e `make check`          | Sem dependências novas; lint, testes e build verdes |

---

## Condição de conclusão

- [x] Hero refinado com entrada escalonada.
- [x] `MediaExpand` implementado sem scroll hijacking.
- [x] Spotlight nos serviços.
- [x] Botões e entradas de seção refinados.
- [x] Reduced motion validado.
- [x] `make check` aprovado.
- [x] REVIEW-005 aprovado e documentos sincronizados.
