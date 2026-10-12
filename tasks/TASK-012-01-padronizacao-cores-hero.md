# TASK: Padronização das Cores de Tipografia e Botões da Seção Hero

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-012-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia Front-end EPMDEVTECH                                  |
| SPEC         | SPEC-012                                                         |
| Critérios    | AC-012-01, AC-012-02, AC-012-03, AC-012-04, AC-012-05, AC-012-06 |
| Dependências | SPEC-012                                                         |

---

## Objetivo

Padronizar com precisão milimétrica as classes de cores da seção Hero (H1, badge overline, descrição, botão primário e botão secundário) e garantir sincronia total com a Navbar e demais componentes do design system do site.

---

## Escopo

### Incluído

- Substituir classes `text-amber-500` por `text-primary` no H1 e elementos auxiliares da Hero.
- Atualizar o badge superior para `border-primary/20 bg-primary/10 text-primary` com ponto `bg-primary`.
- Atualizar a descrição da Hero para `text-neutral-400`.
- Padronizar o botão primário para `bg-primary text-primary-foreground hover:bg-primary/90` na Hero e na Navbar.
- Padronizar o botão secundário da Hero com `border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-white hover:bg-neutral-800`.
- Criar a suíte de testes `src/test/hero-colors.test.tsx`.
- Validar via `make check`.

### Não incluído

- Alterações estruturais no layout, animações, lógica de estado ou imagens de fundo.

---

## Validação

| Critério/risco | Teste, comando ou revisão      | Evidência esperada                                                  |
| -------------- | ------------------------------ | ------------------------------------------------------------------- |
| AC-012-01      | Inspeção do H1                 | `"Automotivas."` possui classe `text-primary`                       |
| AC-012-02      | Inspeção do Badge              | Badge utiliza `text-primary`, `border-primary/20`, `bg-primary/10`  |
| AC-012-03      | Inspeção da Descrição          | Descrição utiliza `text-neutral-400`                                |
| AC-012-04      | Comparativo Hero vs Header CTA | Ambos usam `bg-primary text-primary-foreground hover:bg-primary/90` |
| AC-012-05      | Inspeção do Botão Secundário   | Botão secundário possui `border-neutral-800 bg-neutral-900/60`      |
| AC-012-06      | `make check`                   | Vitest, ESLint, TypeScript e Build 100% aprovados                   |

---

## Condição de conclusão

- [x] H1 com `text-primary` aplicado.
- [x] Badge superior unificado com tokens de `primary`.
- [x] Descrição alinhada para `text-neutral-400`.
- [x] Botão primário idêntico na Hero e Header.
- [x] Botão secundário estilizado com padrão dark.
- [x] Suíte de testes `src/test/hero-colors.test.tsx` criada e aprovada.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-012` criado e aprovado.
