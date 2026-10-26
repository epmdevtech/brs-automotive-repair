# TASK-080-01 — Auditoria UX/UI e Refinamento Responsivo Mobile-First da Proposta

## Metadados

| Campo        | Valor                                                     |
| ------------ | --------------------------------------------------------- |
| ID           | TASK-080-01                                               |
| Status       | Completed                                                 |
| Data         | 2026-10-26                                                |
| Responsável  | Senior Frontend / UX/UI & EPM DevTech                     |
| SPEC         | SPEC-080                                                  |
| Critérios    | AC-080-01 a AC-080-07                                     |
| Dependências | SPEC-079 / TASK-079-01 (proposta modular — concluída)     |

## Objetivo

Corrigir os cinco problemas de responsividade e UX identificados nos componentes
da proposta modular `/proposta/masterchapeacao` para garantir leitura e
usabilidade perfeitas em celulares (320 px–640 px), tablets e desktops.

## Escopo

### Incluído

- `proposal-nav`: scroll interno sem overflow, fade lateral indicativo, scroll do
  item ativo para visibilidade.
- `proposal-modules-catalog`: parágrafo usa `companyName` via prop (sem hardcode);
  grid com respiro correto; deliverables sem truncamento.
- `proposal-modular-acceptance`: atalhos de pacotes com `flex-wrap` correto.
- `proposal-comparison-matrix`: cards mobile sem `truncate`, com `break-words`.
- `proposal-bundles`: preço no estado ativo com `text-brand-accent`; grid com
  alturas equalizadas.
- `ROADMAP.md` sincronizado para versão `0.6.0` com itens já entregues marcados.
- `CHANGELOG.md` entrada `v0.6.1`.
- Matriz de rastreabilidade atualizada.

### Excluído

- Redesenho visual, dados comerciais ou novos testes unitários.

## Etapas

- [x] Registrar SPEC-080 e TASK-080-01.
- [x] Corrigir `proposal-nav.tsx` — AC-080-01.
- [x] Corrigir `proposal-modules-catalog.tsx` e `proposal-view.tsx` — AC-080-02.
- [x] Corrigir `proposal-modular-acceptance.tsx` — AC-080-03.
- [x] Corrigir `proposal-comparison-matrix.tsx` — AC-080-04.
- [x] Corrigir `proposal-bundles.tsx` — AC-080-05.
- [x] Executar `bun run lint`, `bun run test`, `bun run build` — AC-080-07.
- [x] Commitar e atualizar documentação SDD.

## Validação

| Critério | Teste / Verificação                                        | Evidência esperada                     |
| -------- | ---------------------------------------------------------- | -------------------------------------- |
| AC-080-01 | Inspeção visual em 320 px (DevTools)                      | Sem barra de scroll horizontal na nav  |
| AC-080-02 | Grep por hardcode de nome de empresa no componente        | Zero ocorrências                       |
| AC-080-03 | Inspeção em 360 px — todos os atalhos visíveis            | Nenhum botão truncado                  |
| AC-080-04 | Inspeção cards mobile — texto dos deliverables legível    | Sem overflow; `break-words` aplicado   |
| AC-080-05 | Preço ativo = `text-brand-accent`                         | Cor consistente com restante da UI     |
| AC-080-06 | `ROADMAP.md` versão `0.6.0`, itens SPECs 077-079 marcados | Grep confirma `[x]` nas linhas         |
| AC-080-07 | `bun run lint && bun run test && bun run build`           | 0 erros, 555+ testes, build ok         |
