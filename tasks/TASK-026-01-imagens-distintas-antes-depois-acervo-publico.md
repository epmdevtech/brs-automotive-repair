# TASK-026-01 — Imagens Distintas para Comparadores Antes/Depois e Eliminação de Repetição Visual

## Metadados

| Campo                | Valor                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| **Identificador**    | `TASK-026-01`                                                                                       |
| **Spec Relacionada** | [`SPEC-026`](../specs/SPEC-026-imagens-distintas-antes-depois-acervo-publico.md)                    |
| **Título**           | Imagens Distintas para Comparadores Antes/Depois e Eliminação de Repetição Visual no Acervo Público |
| **Data**             | 2026-10-12                                                                                          |
| **Status**           | Concluído                                                                                           |
| **Responsável**      | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH)                                               |

---

## 1. Escopo e Objetivos

1. Obter e organizar acervo de imagens públicas de alta definição e fotorrealismo para a BRS Reparações Automotivas.
2. Criar pares genuinamente distintos para o Antes e Depois das três especialidades principais:
   - Funilaria de Precisão (`funilaria-antes.jpg` e `funilaria-depois.jpg`).
   - Pintura em Estufa (`pintura-antes.jpg` e `pintura-depois.jpg`).
   - Martelinho de Ouro (`martelinho-antes.jpg` e `martelinho-depois.jpg`).
3. Fornecer imagens contextuais dedicadas para as páginas de serviços e corretores, eliminando a repetição contínua das mesmas 3 imagens pelo site:
   - `funilaria-servico.jpg` para `/servicos/funilaria`.
   - `pintura-servico.jpg` para `/servicos/pintura-automotiva`.
   - `martelinho-servico.jpg` para `/servicos/martelinho-de-ouro`.
   - `corretores-vistoria.jpg` para `/para-corretores`.
4. Atualizar os componentes `ProjectGallery` (`src/components/brs/project-gallery.tsx`), `HomeBeforeAfter` (`src/components/brs/home-before-after.tsx`), `Services` (`src/components/brs/services.tsx`), `MediaExpand` (`src/components/brs/media-expand.tsx`), `FinalCTA` (`src/components/brs/final-cta.tsx`) e as rotas individuais.
5. Remover filtros CSS artificiais de distorção/dessaturação usados anteriormente para simular o "antes".
6. Executar todos os quality gates: Vitest, Playwright, ESLint e Vite/Nitro Build.
7. Produzir o relatório de encerramento `REVIEW-026` e atualizar `CHANGELOG.md`.

---

## 2. Checklist de Execução

- [x] **Etapa 1: Produção e aquisição dos pares fotográficos distintos de alta fidelidade (Antes e Depois)**
- [x] **Etapa 2: Obtenção de fotografia contextual distinta para páginas de serviços e corretores**
- [x] **Etapa 3: Instalação dos novos ativos em `src/assets/` com nomenclatura canônica e dimensões otimizadas**
- [x] **Etapa 4: Atualização de `src/components/brs/project-gallery.tsx` e remoção de filtros CSS artificiais**
- [x] **Etapa 5: Atualização de `src/components/brs/home-before-after.tsx` com imagens autênticas de antes/depois**
- [x] **Etapa 6: Atualização das rotas dedicadas de serviços e corretores com fotografias distintas**
- [x] **Etapa 7: Ajustes e validação da suíte de testes Vitest e testes E2E Playwright**
- [x] **Etapa 8: Validação dos Quality Gates (Vitest, Playwright, ESLint, Build SSR)**
- [x] **Etapa 9: Criação do REVIEW-026 e atualização do CHANGELOG.md**
