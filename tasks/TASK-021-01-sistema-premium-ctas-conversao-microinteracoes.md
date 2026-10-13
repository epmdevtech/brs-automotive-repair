# TASK: Sistema Premium de CTAs, Conversão e Microinterações para a BRS Reparações Automotivas

## Metadados

| Campo        | Valor                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| ID           | TASK-021-01                                                                                       |
| Status       | Concluída                                                                                         |
| Responsável  | Senior Frontend & Automotive CRO Specialist EPMDEVTECH                                            |
| SPEC         | SPEC-021                                                                                          |
| Critérios    | AC-021-01, AC-021-02, AC-021-03, AC-021-04, AC-021-05, AC-021-06, AC-021-07, AC-021-08, AC-021-09 |
| Dependências | SPEC-021                                                                                          |

---

## Objetivo

Implementar e consolidar o sistema premium de CTAs, conversão, geometria chanfrada automotiva e microinterações para a BRS Reparações Automotivas, eliminando termos genéricos, padronizando a hierarquia comercial em 3 níveis, refinando o formulário com estados de feedback e garantindo total acessibilidade e responsividade.

---

## Escopo

1. **Design System de Botões & Geometria Chanfrada (`src/styles.css` e `src/components/ui/button.tsx`)**:
   - Criar classes de geometria chanfrada técnica com 4 cantos (`btn-bevel-4` e `btn-bevel-4-sm`).
   - Adicionar variantes `primary`, `secondary`, `tertiary`, `compact` em `buttonVariants`.
2. **Microinteração Magnética Suave (`src/components/ui/magnetic-button.tsx`)**:
   - Implementar componente para ponteiro fino (`pointer: fine`), restrito a 4-6px, sem distorção de layout, e seguro para acessibilidade.
3. **Padronização de CTAs em Todas as Rotas**:
   - Header / Navbar (`src/components/brs/header.tsx`): Botão chanfrado de avaliação em destaque.
   - Hero (`src/components/brs/hero.tsx` e `src/components/brs/animated-hero.tsx`): "SOLICITAR AVALIAÇÃO" (primário) e "CONHECER OS SERVIÇOS" (secundário).
   - Cards de Serviços na Home (`src/components/brs/services.tsx`): "CONHECER FUNILARIA", "CONHECER A PINTURA", "ENTENDER O MARTELINHO".
   - Página Geral de Serviços (`src/routes/servicos/index.tsx`): Botões contextuais e eliminação de "Saiba mais sobre...".
   - Páginas de Serviço Individual (`src/components/brs/service-page-layout.tsx`): Botões claros e objetivos.
   - Galeria e Trabalhos (`src/routes/trabalhos.tsx`, `src/components/brs/project-gallery.tsx` e `src/components/brs/contact-cta.tsx`): "SOLICITAR AVALIAÇÃO" e CTA no lightbox.
   - Corretores (`src/routes/para-corretores.tsx`) e Sobre (`src/routes/sobre.tsx`): Rótulos diretos.
   - Footer (`src/components/ui/minimal-footer.tsx`): "SOLICITAR AVALIAÇÃO".
4. **Formulário de Contato (`src/components/brs/contact-form.tsx`)**:
   - Estados `idle`, `submitting`, `success`, `error` com prevenção de duplo clique e feedback acessível.
5. **Testes & Quality Gates**:
   - Criar suíte Vitest `src/test/cta-conversion-system.test.tsx`.
   - Criar teste Playwright `e2e/cta-conversion.spec.ts`.
   - Validar testes, linter e build SSR.

---

## Critérios de Aceitação

- [x] **AC-021-01**: Sistema visual de botões em `src/components/ui/button.tsx` e `src/styles.css` com variantes chanfradas e clássicas.
- [x] **AC-021-02**: Geometria chanfrada técnica com 4 cantos (`btn-bevel-4`) implementada sem cortar sombras nem anéis de foco.
- [x] **AC-021-03**: Componente reutilizável de microinteração magnética opcional (`src/components/ui/magnetic-button.tsx`).
- [x] **AC-021-04**: Padronização dos rótulos de CTAs em todas as rotas (eliminação de "Saiba mais", "Ver detalhes", "Clique aqui").
- [x] **AC-021-05**: Navbar desktop e mobile harmonizadas com a nova linguagem chanfrada e CTA em destaque.
- [x] **AC-021-06**: Formulário de contato com estados de feedback claros (`idle`, `submitting`, `success`, `error`).
- [x] **AC-021-07**: Touch target >= 44px para botões primários.
- [x] **AC-021-08**: Suítes de testes automatizados com Playwright e Vitest cobrindo CTAs e conversão.
- [x] **AC-021-09**: Quality Gates 100% aprovados.
