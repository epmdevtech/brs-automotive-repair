# SPEC-080 — Auditoria UX/UI e Refinamento Responsivo Mobile-First da Proposta /proposta/masterchapeacao

## Metadados

| Campo         | Valor                                                        |
| ------------- | ------------------------------------------------------------ |
| ID            | SPEC-080                                                     |
| Status        | Approved                                                     |
| Data          | 2026-10-26                                                   |
| Responsável   | Senior Frontend / UX-UI & EPM DevTech                        |
| Dependências  | SPEC-079 (proposta modular Master — base da rota)            |
| Tasks         | TASK-080-01                                                  |

---

## 1. Problema e Motivação

A rota `/proposta/masterchapeacao` foi entregue funcional na SPEC-079, mas uma
auditoria mobile-first identificou cinco problemas concretos de UX/UI que
comprometem a leitura e a usabilidade em dispositivos com tela estreita (< 640 px):

| Componente                    | Problema identificado                                                          |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `proposal-nav.tsx`            | `min-w-max` no container força overflow/scroll horizontal invisível no mobile   |
| `proposal-modules-catalog.tsx`| Texto descritivo contém nome de entidade legado ("Chapeação e Pinturas" hardcoded num contexto incorreto) e o grid cai para 1 coluna sem respiro correto |
| `proposal-modular-acceptance.tsx` | Atalhos de pacotes (shortcut buttons) não fazem `flex-wrap` correto em viewports < 400 px, causando truncamento |
| `proposal-comparison-matrix.tsx`  | Já tem fallback de cards mobile, mas os cards têm `truncate` nos deliverables que oculta informação crítica |
| `proposal-bundles.tsx`        | Preço no card não tem contraste correto em modo selecionado; grid usa `items-stretch` mas os cards não equalizam altura em Safari mobile |

Adicionalmente, o `ROADMAP.md` registra versão `0.1.0` e itens da Fase 2 que
já foram entregues nas SPECs 077, 078 e 079. Precisa ser sincronizado.

---

## 2. Objetivos e Critérios de Aceitação

### AC-080-01 — ProposalNav sem overflow horizontal
- A nav não produz scroll horizontal em nenhum viewport ≥ 320 px.
- O container usa scroll interno (`overflow-x: auto`) com fade gradiente lateral
  indicando conteúdo rolável, sem expor a barra de scroll nativa.
- O item ativo é scrollado para visibilidade automática com `scrollIntoView`.

### AC-080-02 — ProposalModulesCatalog corrigido
- O parágrafo descritivo usa `{proposal.companyName}` em vez de texto hardcoded.
- O grid mobile tem `gap-5` e `pb-4` no card para respiro adequado.
- O texto de cada deliverable não é truncado: usa `break-words` e `leading-relaxed`.

### AC-080-03 — ProposalModularAcceptance — atalhos sem truncamento
- O container de atalhos usa `flex-wrap` com `gap-2` e quebra corretamente.
- Cada botão de atalho tem `whitespace-normal text-center min-w-0`.
- Em viewport 320 px, todos os botões são visíveis sem scroll horizontal.

### AC-080-04 — ProposalComparisonMatrix — deliverables completos no mobile
- Os cards mobile exibem os 3 primeiros deliverables sem `truncate`.
- O texto usa `break-words` e `line-clamp-3` com `title` para expandir via leitor de tela.

### AC-080-05 — ProposalBundles — preço e altura equalizados
- O preço no card ativo usa `text-brand-accent` (não `text-white`) para manter
  consistência de identidade visual com os demais componentes.
- O grid usa `auto-rows-fr` para equalizar alturas em Safari mobile via `grid`.

### AC-080-06 — ROADMAP.md sincronizado
- A versão é atualizada para `0.6.0`.
- Os itens já entregues nas SPECs 077, 078 e 079 são marcados como `[x]`.

### AC-080-07 — Quality Gates verdes
- `bun run lint`: 0 erros.
- `bun run test`: 100 % dos testes passam (≥ 555 testes).
- `bun run build`: compilação Vite + Nitro SSR sem erros.

---

## 3. Arquitetura da Solução

### 3.1 ProposalNav — scroll snapped com fade lateral

```
┌─ nav sticky ───────────────────────────────────────────┐
│ ░░░ [Visão Geral] [Módulos] [Comparativo] … [CTA] ░░░ │
│      ↑ fade-left                       ↑ fade-right    │
└────────────────────────────────────────────────────────┘
```

- Remove `min-w-max` do wrapper.
- Adiciona `overflow-x-auto scrollbar-none scroll-smooth` no `<nav>`.
- Wrapper interno mantém `flex items-center gap-1.5` com `w-max`.
- Pseudo-elemento CSS via `className` não é possível em Tailwind puro — usar
  um wrapper `relative` com dois `<div>` absolutos de fade
  (`pointer-events-none` , `w-8`, `bg-gradient-to-r from-neutral-950`).
- No `useEffect` de `setActiveSection`, chamar
  `document.querySelector('[href="#..."]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })`.

### 3.2 ProposalModulesCatalog — prop companyName

- Substituir o texto hardcoded pela prop `modules` que já recebe o contexto do
  catálogo; o texto de intro vem do `<ProposalModulesCatalog>` via nova prop
  opcional `companyName?: string` passada pelo `ProposalView`.
- Ajustar classes de grid: `gap-5 sm:gap-7`.

### 3.3 ProposalModularAcceptance — atalhos flex-wrap

- Alterar container de atalhos de `flex gap-1.5` para
  `flex flex-wrap gap-2`.
- Cada botão: `whitespace-normal text-left min-w-0 break-words`.

### 3.4 ProposalComparisonMatrix — cards mobile sem truncate

- Remover `truncate` dos `<li>` no layout mobile.
- Adicionar `break-words` e `line-clamp-3`.
- Manter `title={item}` para acessibilidade via hover/leitor de tela.

### 3.5 ProposalBundles — preço ativo e altura grid

- Preço no estado ativo: `text-brand-accent` (não `text-white`).
- Grid wrapper: trocar `items-stretch` por `grid-rows` implícito via
  `grid-auto-rows: 1fr` — usar classe utilitária `[&>*]:h-full` em Tailwind v4.

---

## 4. Escopo

### Incluído
- Correção dos 5 problemas de responsividade identificados.
- Sincronização do ROADMAP.md com a versão correta.
- Atualização do CHANGELOG.md e da matriz de rastreabilidade.

### Excluído
- Redesenho visual geral da proposta.
- Alteração de dados comerciais (preços, módulos, e-mail, slugs).
- Criação de novos testes (as correções são de CSS/HTML, cobertas pelos testes existentes).

---

## 5. Impacto e Riscos

| Risco                          | Mitigação                                                    |
| ------------------------------ | ------------------------------------------------------------ |
| Fade lateral quebrando em SSR  | Renderiza divs estáticos — sem `useEffect` necessário        |
| `scrollIntoView` no servidor   | Chamado apenas dentro de `useEffect` (client-only)           |
| Grid `[&>*]:h-full` no Safari  | Testado com `grid` + `min-h-0` no filho; fallback gracioso   |

---

## 6. Arquivos Afetados

| Arquivo                                                               | Tipo de alteração |
| --------------------------------------------------------------------- | ----------------- |
| `src/components/brs/proposal/proposal-nav.tsx`                        | Refactor CSS/UX   |
| `src/components/brs/proposal/proposal-modules-catalog.tsx`            | Fix texto + CSS   |
| `src/components/brs/proposal/proposal-modular-acceptance.tsx`         | Fix CSS flex-wrap |
| `src/components/brs/proposal/proposal-comparison-matrix.tsx`          | Fix truncate       |
| `src/components/brs/proposal/proposal-bundles.tsx`                    | Fix preço ativo   |
| `src/components/brs/proposal/proposal-view.tsx`                       | Passa companyName |
| `ROADMAP.md`                                                          | Sincronização     |
| `CHANGELOG.md`                                                        | Entrada v0.6.1    |
| `docs/traceability-matrix.md`                                         | SPEC-080          |
