# TASK: Implementação da Galeria Interativa (Antes/Depois + Lightbox) e Serviços com CardSpotlight

## Metadados

| Campo        | Valor                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| ID           | TASK-007-01                                                                    |
| Status       | Done                                                                           |
| Responsável  | Engenharia Front-end EPMDEVTECH                                                |
| SPEC         | SPEC-007                                                                       |
| Critérios    | AC-007-01, AC-007-02, AC-007-03, AC-007-04, AC-007-05                          |
| Dependências | SPEC-007                                                                       |

---

## Objetivo

Desenvolver e integrar o componente interativo `BeforeAfterSlider` com modal Lightbox em `ProjectGallery`, e o componente `CardSpotlight` com microinterações refinadas na seção de `Services`, assegurando alto padrão estético, performance de 60fps e zero dependências adicionais.

---

## Escopo

### Incluído

- Criação de `src/components/brs/before-after-slider.tsx` com drag, touch, suporte a teclado e handle estilizado.
- Criação de `src/components/brs/card-spotlight.tsx` com `framer-motion` (`useMotionValue`, `useMotionTemplate`), gradiente radial dinâmico e render seguro para SSR.
- Refatoração de `src/components/brs/project-gallery.tsx` para incorporar o slider antes/depois nos cartões e em tela cheia via Lightbox Dialog com `AnimatePresence`.
- Refatoração de `src/components/brs/services.tsx` para envolver os cards com `CardSpotlight` e microinterações de borda, elevação de ícone e clique tátil.
- Testes unitários cobrindo o slider antes/depois e o card spotlight.
- Validação com `make check`.

### Não incluído

- Alterações em dependências do `package.json`.
- Modificações em dados cadastrais da empresa ou rotas HTTP.

---

## Validação

| Critério/risco | Teste, comando ou revisão      | Evidência esperada                                        |
| -------------- | ------------------------------ | --------------------------------------------------------- |
| AC-007-01      | Testes de `before-after-slider`| Suporte a arrasto, posições e badges testados no Vitest    |
| AC-007-02      | Teste do Lightbox Dialog       | Abertura e fechamento de modal com slider funcional       |
| AC-007-03      | Testes de `card-spotlight`     | Movimentação do ponteiro e fallback de SSR sem erros      |
| AC-007-04      | Inspeção de `services.tsx`     | Microinterações visuais de hover, foco e clique tátil     |
| AC-007-05      | `make check`                   | Vitest, ESLint, Build Nitro e Matriz 100% aprovados       |

---

## Condição de conclusão

- [x] `BeforeAfterSlider` criado em `src/components/brs/before-after-slider.tsx`.
- [x] `CardSpotlight` criado em `src/components/brs/card-spotlight.tsx`.
- [x] `ProjectGallery` atualizado com sliders e Lightbox.
- [x] `Services` atualizado com `CardSpotlight` e microinterações.
- [x] Testes automatizados passando com sucesso.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-007` aprovado.
- [x] Commit com trailers `Spec-Ref: SPEC-007` e `Task-Ref: TASK-007-01`.
