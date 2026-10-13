# TASK: Sistema Global de Motion Design Premium para Todas as Rotas da BRS Reparações Automotivas

## Metadados

| Campo        | Valor                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| ID           | TASK-020-01                                                                                       |
| Status       | Done                                                                                              |
| Responsável  | Senior Frontend & UX/UI Motion Design Specialist EPMDEVTECH                                       |
| SPEC         | SPEC-020                                                                                          |
| Critérios    | AC-020-01, AC-020-02, AC-020-03, AC-020-04, AC-020-05, AC-020-06, AC-020-07, AC-020-08, AC-020-09 |
| Dependências | SPEC-020                                                                                          |

---

## Objetivo

Implementar e consolidar um sistema global de motion design premium com Framer Motion (^14.1.0) para a BRS Reparações Automotivas, centralizando tokens e variantes de animação, criando `PageTransition` para o layout compartilhado, refinando `ScrollReveal` e `ImageReveal`, e aplicando movimento sutil e intencional a 100% das rotas e componentes do projeto.

---

## Escopo

1. **Tokens & Variantes Centralizadas**:
   - Criar `src/lib/motion-tokens.ts`.
2. **Componentes Base Reutilizáveis**:
   - Aprimorar `src/components/ui/scroll-reveal.tsx` (suporte a `once`, `amount`, `viewportMargin`, direções e polimorfismo).
   - Aprimorar `src/components/ui/image-reveal.tsx` (zoom reverso e fade-in suave).
   - Criar `src/components/ui/page-transition.tsx` (transição suave de rota de 200ms).
3. **Integração no Layout e Rotas**:
   - Atualizar `src/components/brs/site-layout.tsx` integrando `PageTransition`.
   - Atualizar `src/components/brs/philosophy.tsx` com `ScrollReveal`.
   - Atualizar `src/components/brs/process-timeline.tsx` com `ScrollReveal`.
   - Atualizar `src/components/brs/final-cta.tsx` com `ScrollReveal`.
   - Atualizar `src/components/brs/contact.tsx` e `src/components/brs/faq-accordion.tsx` com `ScrollReveal`.
   - Atualizar `src/components/brs/project-gallery.tsx` com `ScrollReveal`.
   - Atualizar `src/routes/privacidade.tsx` e `src/routes/404.tsx` com `ScrollReveal`.
4. **Testes & Quality Gates**:
   - Criar `src/test/global-motion-system.test.tsx`.
   - Executar testes Vitest, ESLint e Build SSR Nitro.

---

## Critérios de Aceitação

- [x] **AC-020-01**: Centralização dos motion tokens e variantes em `src/lib/motion-tokens.ts`.
- [x] **AC-020-02**: Componente `ScrollReveal` suporta direções, deslocamentos suaves, disparo único e polimorfismo.
- [x] **AC-020-03**: Componente `ImageReveal` aplica zoom reverso e fade-in suave sem alterar layout ou proporções.
- [x] **AC-020-04**: Componente `PageTransition` implementado no `SiteLayout` para transições sutis entre rotas sem remontar header/footer.
- [x] **AC-020-05**: Todas as rotas do projeto auditadas e unificadas sob o sistema global de motion design.
- [x] **AC-020-06**: Componentes legados (`Philosophy`, `Contact`, `FAQAccordion`, `ProjectGallery`, `FinalCTA`) migrados para o novo padrão.
- [x] **AC-020-07**: Respeito estrito a `prefers-reduced-motion` e resiliência em ambiente SSR do TanStack Start e Nitro.
- [x] **AC-020-08**: Suíte de testes automatizados com Vitest validando o sistema global de motion.
- [x] **AC-020-09**: Quality Gates 100% aprovados (testes, lint, build de produção).
