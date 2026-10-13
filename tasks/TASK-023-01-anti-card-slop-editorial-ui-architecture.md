# TASK-023-01 — Refatoração Editorial de UI & Desestruturação de Card Slop

## Metadados

| Campo                | Valor                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| **Identificador**    | `TASK-023-01`                                                               |
| **Spec Relacionada** | [`SPEC-023`](../specs/SPEC-023-anti-card-slop-editorial-ui-architecture.md) |
| **Título**           | Refatoração Editorial de UI & Desestruturação de Card Slop                  |
| **Data**             | 2026-10-12                                                                  |
| **Status**           | Concluído                                                                   |
| **Responsável**      | Staff Design Engineer & Frontend Architect (EPMDEVTECH)                     |

---

## 1. Escopo e Objetivos

Eliminar os padrões genéricos de "card slop" (grades de 3-4 cards idênticos, sombras excessivas, ícones encapsulados em quadradinhos decorativos, badges sobrepostos a fotografias) em todas as rotas e componentes do projeto BRS Reparações Automotivas.

Substituir por padrões editoriais inspirados na estética de marcas premium:

- Divisores estruturais e hairlines (`border-y`, `divide-x`, `divide-y`).
- Matrizes contínuas com bordas compartilhadas.
- Listas editoriais e ledgers.
- Linhas horizontais amplas de 12 colunas para serviços com destaque para fotografia.
- Tipografia precisa e contraste tonal em superfícies escuras.

---

## 2. Checklist de Execução

- [x] **Etapa 1: Auditoria da interface e detecção de containers redundantes**
- [x] **Etapa 2: Refatoração da Seção de Serviços da Homepage (`src/components/brs/services.tsx`)**
- [x] **Etapa 3: Refatoração de `HomePathways` (`src/components/brs/home-pathways.tsx`)**
- [x] **Etapa 4: Refatoração de `ProjectGallery` (`src/components/brs/project-gallery.tsx`)**
- [x] **Etapa 5: Refatoração da Visão Geral de Serviços (`src/routes/servicos/index.tsx`)**
- [x] **Etapa 6: Refatoração do Template Comum de Serviços (`src/components/brs/service-page-layout.tsx`)**
- [x] **Etapa 7: Refatoração de `/para-corretores.tsx` e `/sobre.tsx`**
- [x] **Etapa 8: Refatoração dos canais em `Contact` (`src/components/brs/contact.tsx`)**
- [x] **Etapa 9: Execução dos Quality Gates (Vitest, Playwright, ESLint, Build)**
- [x] **Etapa 10: Criação do REVIEW-023 e sincronização de documentação**
