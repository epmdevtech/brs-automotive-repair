# TASK: Implementação do AnimatedHero com Framer Motion

## Metadados

| Campo        | Valor                                      |
| ------------ | ------------------------------------------ |
| ID           | TASK-006-01                                |
| Status       | Done                                       |
| Responsável  | Engenharia Front-end EPMDEVTECH            |
| SPEC         | SPEC-006                                   |
| Critérios    | AC-006-01, AC-006-02, AC-006-03, AC-006-04 |
| Dependências | SPEC-006                                   |

---

## Objetivo

Implementar e integrar o componente `AnimatedHero` da biblioteca 21st.dev com `framer-motion` na seção Hero do website da BRS Reparações Automotivas, preservando a identidade visual automotiva e os quality gates do projeto.

---

## Escopo

### Incluído

- Criação de `src/components/brs/animated-hero.tsx` com `motion.header`, `motion.div`, `motion.h1`, `motion.p`, `containerVariants`, `itemVariants` e estilo de botão glass.
- Atualização de `src/components/brs/hero.tsx` usando `AnimatedHero` com os dados oficiais da BRS.
- Ajuste e validação dos testes em `src/test/motion.test.tsx` e `src/test/brs.test.ts`.
- Validação com `make check`.

### Não incluído

- Alterações em formulários de contato ou rotas do servidor.

---

## Validação

| Critério/risco | Teste, comando ou revisão   | Evidência esperada                                  |
| -------------- | --------------------------- | --------------------------------------------------- |
| AC-006-01      | Inspeção de `animated-hero` | Variantes `framer-motion` implementadas sem erros   |
| AC-006-02      | Inspeção de `hero.tsx`      | Dados e estilo glass integrados à identidade visual |
| AC-006-03      | Validação de CTAs           | Links e scroll para `#contato` e `#servicos` ativos |
| AC-006-04      | `make check`                | Lint, Vitest, Build Nitro e Matriz 100% aprovados   |

---

## Condição de conclusão

- [x] `AnimatedHero` criado em `src/components/brs/animated-hero.tsx`.
- [x] `Hero` integrado em `src/components/brs/hero.tsx`.
- [x] Testes passando com sucesso.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-006` aprovado.
- [x] Commit com trailers `Spec-Ref: SPEC-006` e `Task-Ref: TASK-006-01`.
