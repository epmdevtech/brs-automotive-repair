# TASK-024-01 — Correção do Menu Hamburguer no Desktop, Remoção do Ícone Flutuante e Botão Voltar ao Topo

## Metadados

| Campo                | Valor                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| **Identificador**    | `TASK-024-01`                                                                             |
| **Spec Relacionada** | [`SPEC-024`](../specs/SPEC-024-correcao-menu-desktop-remocao-cta-flutuante-botao-topo.md) |
| **Título**           | Correção do Menu Hamburguer no Desktop, Remoção do Ícone Flutuante e Botão Voltar ao Topo |
| **Data**             | 2026-10-12                                                                                |
| **Status**           | Concluído                                                                                 |
| **Responsável**      | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH)                                     |

---

## 1. Escopo e Objetivos

1. Resolver a causa raiz da exibição do menu hamburguer em desktop ($\ge 1024\text{px}$), eliminando a colisão de cascata CSS entre `.btn` e o utilitário `lg:hidden`.
2. Remover o botão flutuante com ícone de telefone no canto inferior direito em `src/components/brs/site-layout.tsx`.
3. Criar o componente `BackToTop` em `src/components/ui/back-to-top.tsx`, estilizá-lo dentro dos tokens de design automotivo escuro e integrá-lo globalmente no layout.
4. Adicionar testes unitários (Vitest) e testes end-to-end (Playwright) para garantir a integridade dos comportamentos.
5. Executar os Quality Gates e documentar o fechamento em `REVIEW-024`.

---

## 2. Checklist de Execução

- [x] **Etapa 1: Correção do botão do menu hamburguer em `src/components/brs/header.tsx` e proteção na cascata de `.btn`**
- [x] **Etapa 2: Remoção do botão de telefone flutuante em `src/components/brs/site-layout.tsx`**
- [x] **Etapa 3: Implementação do componente `BackToTop` em `src/components/ui/back-to-top.tsx` e integração no layout**
- [x] **Etapa 4: Atualização e criação de testes unitários Vitest para Header e BackToTop**
- [x] **Etapa 5: Atualização e criação de testes E2E Playwright**
- [x] **Etapa 6: Execução dos Quality Gates (Vitest, Playwright, ESLint, Build)**
- [x] **Etapa 7: Criação do REVIEW-024 e sincronização de documentação**
