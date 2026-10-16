# REVIEW-063: Prevenção e Blindagem Contra Estouro de Layout e Overflow Horizontal no Modo Mobile

## Metadados

| Campo   | Valor                                                    |
| ------- | -------------------------------------------------------- |
| ID      | REVIEW-063                                               |
| SPEC    | SPEC-063                                                 |
| TASKS   | TASK-063-01                                              |
| Status  | Aprovado                                                 |
| Data    | 2026-10-15                                               |
| Revisor | Staff UX/UI Designer & Performance Engineer (EPMDEVTECH) |

---

## 1. Resumo da Entrega e Resolução dos Defeitos de Layout Mobile

A **SPEC-063** implementou a blindagem definitiva contra estouro de layout (horizontal overflow / scroll lateral indesejado) em dispositivos móveis, resolvendo o problema reportado pelo usuário na captura `/home/elessandro/Imagens/Capturas de tela/Captura de tela de 2026-10-15 20-40-54.png`.

### 1.1 Contenção Estrita em `html`, `body` e Layouts Raiz (TASK-063-01)

- **Problema**: A página permitia rolagem lateral acidental no mobile, deslocando o conteúdo para a esquerda e cortando elementos visuais essenciais (logo BRS, títulos H1 e botões de ação).
- **Causa Raiz**: Falta de contenção no eixo X em `html` e `body` no CSS global, permitindo que microelementos ou rótulos longos expandissem a largura do documento além da viewport.
- **Solução Implementada**:
  1. Adicionado `overflow-x: clip; max-width: 100%;` em `html` e `overflow-x: clip; max-width: 100%; width: 100%;` em `body` em `src/styles.css`.
  2. Adicionadas classes `overflow-x-clip max-w-full` em `<html>` e `<body>` no `RootShell` (`src/routes/__root.tsx`).
  3. Adicionadas classes `w-full max-w-full overflow-x-clip` nos contêineres principais de `SiteLayout` (`src/components/brs/site-layout.tsx`) e `PageTransition` (`src/components/ui/page-transition.tsx`).

### 1.2 Responsividade e Flexibilidade no Rótulo `.eyebrow` (TASK-063-01)

- **Problema**: O texto `"Oficina Técnica Especializada • Toledo, PR"` com espaçamento largo (`0.2em`) atingia mais de 430px de largura sem quebra de linha em telas de 370px, forçando o alargamento da viewport.
- **Solução Implementada**:
  1. Configurado `flex-wrap: wrap; max-width: 100%; word-break: break-word;` na classe `.eyebrow` em `src/styles.css`.
  2. Em telas móveis (`@media (max-width: 767px)`), calibrados o `letter-spacing` para `0.12em` e `font-size` para `0.7rem`, mantendo elegância técnica sem estourar a largura do dispositivo.
  3. Ajustada a largura de `.page-width` em telas pequenas para `calc(100% - 32px)` com `max-width: 100%`.
  4. Redimensionado o logotipo `.brand strong` para 28px no mobile, garantindo respiração plena na barra flutuante.

---

## 2. Evidências de Validação e Quality Gates

### 2.1 Testes Automatizados (Vitest)

```bash
bun test
```

- Nova suíte de testes em `src/test/layout-overflow-mobile.test.tsx` (5/5 aprovados):
  - `AC-063-01`: Regras de contenção `overflow-x: clip` e `max-width: 100%` no CSS global.
  - `AC-063-02`: `flex-wrap: wrap; max-width: 100%` em `.eyebrow`.
  - `AC-063-03`: Contenção em `SiteLayout` e `main#conteudo-principal`.
  - `AC-063-04`: Proteção `max-w-full` e `overflow-x-clip` em `PageTransition`.
  - `AC-063-05`: Limites `max-w-full` e `eyebrow` flex-wrap no `Hero`.
- Suíte `src/test/eyebrows-standardization.test.tsx` (3/3 aprovados) sem regressão.

### 2.2 Quality Gates

- Linter: `bun run lint` com 0 erros.
- Build: `bun run build` gerando pacotes cliente e SSR sem falhas.

---

## 3. Matriz de Conformidade de Critérios de Aceite

| Critério    | Descrição                                                                            | Status   |
| ----------- | ------------------------------------------------------------------------------------ | -------- |
| `AC-063-01` | Contenção `overflow-x: clip; max-width: 100%` em html e body                         | Aprovado |
| `AC-063-02` | Flexibilidade e quebra de linha em `.eyebrow` com `flex-wrap: wrap; max-width: 100%` | Aprovado |
| `AC-063-03` | Contenção em `SiteLayout`, `PageTransition`, `AnimatedHero` e `Header`               | Aprovado |
| `AC-063-04` | 100% dos testes unitários e de integração aprovados                                  | Aprovado |
| `AC-063-05` | Quality Gates verdes (lint, build) sem advertências                                  | Aprovado |
| `AC-063-06` | Rastreabilidade Universal SDD atualizada                                             | Aprovado |
