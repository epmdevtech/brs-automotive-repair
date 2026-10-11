# TASK: Refinamento do Sistema Tipográfico com Sora e Manrope

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-009-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia Front-end EPMDEVTECH                                  |
| SPEC         | SPEC-009                                                         |
| Critérios    | AC-009-01, AC-009-02, AC-009-03, AC-009-04, AC-009-05, AC-009-06 |
| Dependências | SPEC-009                                                         |

---

## Objetivo

Refinar exclusivamente o sistema tipográfico da landing page da BRS Reparações Automotivas, migrando títulos para Sora (pesos 500/600) e corpo/controles para Manrope (pesos 400/500/600), centralizando tokens em `src/styles.css`, otimizando o carregamento de fontes e eliminando estilos em caixa alta e negrito excessivos.

---

## Escopo

### Incluído

- Atualizar o link de fontes do Google Fonts em `src/routes/__root.tsx`.
- Centralizar tokens de tipografia em `src/styles.css` (`--font-display: "Sora"`, `--font-body: "Manrope"`, variáveis `clamp()`, `line-height`, `letter-spacing`).
- Adicionar `font-size-adjust: from-font`, `text-wrap: balance` e `text-wrap: pretty` às regras base de tipografia.
- Refinar as classes de tipografia nos componentes (`hero.tsx`, `services.tsx`, `project-gallery.tsx`, `partner-section.tsx`, `philosophy.tsx`, `process-timeline.tsx`, `pickup.tsx`, `header.tsx`, `footer.tsx`).
- Criar a suíte de testes `src/test/typography.test.tsx`.
- Executar e validar todos os Quality Gates via `make check`.

### Não incluído

- Alterações estruturais no layout, paleta de cores ou regras de negócio.

---

## Validação

| Critério/risco | Teste, comando ou revisão           | Evidência esperada                                                  |
| -------------- | ----------------------------------- | ------------------------------------------------------------------- |
| AC-009-01      | Inspeção de `src/routes/__root.tsx` | Link aponta para Sora e Manrope com pesos otimizados                |
| AC-009-02      | Inspeção de `src/styles.css`        | `--font-display: "Sora"` e `--font-body: "Manrope"` configurados    |
| AC-009-03      | Inspeção visual & CSS               | Títulos fluidos com `clamp()`, `text-wrap: balance` e line-heights  |
| AC-009-04      | Inspeção visual & CSS               | Textos corridos com Manrope 400/500, line-height 1.6+ e `pretty`    |
| AC-009-05      | Inspeção de componentes             | Cards de serviços e galeria sem caixa alta agressiva e sem bold 800 |
| AC-009-06      | `make check`                        | Vitest, ESLint, TypeScript e Build 100% aprovados                   |

---

## Condição de conclusão

- [x] Google Fonts configurado com Sora e Manrope otimizados.
- [x] Variáveis CSS e tokens de tipografia centralizados em `src/styles.css`.
- [x] Componentes refinados com pesos 500/600 em Sora e 400/500/600 em Manrope.
- [x] Testes em `src/test/typography.test.tsx` criados e aprovados.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-009` criado e aprovado.
