# TASK-025-01 — Comparador Antes e Depois: Home, Galeria e Componente Reutilizável

## Metadados

| Campo                | Valor                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| **Identificador**    | `TASK-025-01`                                                           |
| **Spec Relacionada** | [`SPEC-025`](../specs/SPEC-025-comparador-antes-depois-home-galeria.md) |
| **Título**           | Comparador Antes e Depois: Home, Galeria e Componente Reutilizável      |
| **Data**             | 2026-10-12                                                              |
| **Status**           | Concluído                                                               |
| **Responsável**      | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH)                   |

---

## 1. Escopo e Objetivos

1. Aprimorar o componente `BeforeAfterSlider` (`src/components/brs/before-after-slider.tsx`) com controle ampliado por teclado (`PageUp`/`PageDown`), affordance visual discreta ("Arraste o divisor para comparar"), tipagem expandida e otimizações de carregamento de imagem (`priority`).
2. Criar o componente de demonstração da Home `HomeBeforeAfter` (`src/components/brs/home-before-after.tsx`) com composição editorial assimétrica (7 colunas para imagem, 5 colunas para narrativa e CTA).
3. Integrar `HomeBeforeAfter` em `src/components/brs/website.tsx` logo abaixo do Hero, estabelecendo uma transição fluida entre o Hero e as especialidades com link para `/trabalhos`.
4. Assegurar que `ProjectGallery` continue reutilizando perfeitamente o componente `BeforeAfterSlider`.
5. Adicionar testes unitários Vitest e testes E2E Playwright.
6. Validar Quality Gates e gerar `REVIEW-025`.

---

## 2. Checklist de Execução

- [x] **Etapa 1: Aprimoramento do componente `BeforeAfterSlider` com suporte a PageUp/PageDown, hint e priority**
- [x] **Etapa 2: Criação do componente `HomeBeforeAfter` com composição editorial assimétrica e CTA para `/trabalhos`**
- [x] **Etapa 3: Integração de `HomeBeforeAfter` em `src/components/brs/website.tsx` abaixo do Hero**
- [x] **Etapa 4: Validação de compatibilidade e reutilização em `src/components/brs/project-gallery.tsx`**
- [x] **Etapa 5: Testes unitários Vitest para BeforeAfterSlider e HomeBeforeAfter**
- [x] **Etapa 6: Testes end-to-end Playwright validando interação de arraste, teclado e link para a galeria**
- [x] **Etapa 7: Execução dos Quality Gates (Vitest, Playwright, ESLint, Build)**
- [x] **Etapa 8: Criação do REVIEW-025 e sincronização de documentação**
