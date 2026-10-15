# REVIEW-060: Otimização de Code-Splitting de Rotas e Resolução de Erro de Hidratação SSR sob Reduced Motion

## Metadados

| Campo   | Valor                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------- |
| ID      | REVIEW-060                                                                                            |
| SPEC    | SPEC-060                                                                                              |
| TASKS   | TASK-060-01, TASK-060-02                                                                              |
| Status  | Aprovado                                                                                              |
| Data    | 2026-10-15                                                                                            |
| Revisor | Staff Frontend & Performance Engineer (EPMDEVTECH)                                                     |

---

## 1. Resumo da Entrega e Resolução dos Defeitos do Console

A **SPEC-060** eliminou as duas advertências/erros remanescentes identificados no console do navegador tanto em ambiente de desenvolvimento local quanto sob SSR em produção.

### 1.1 Aviso de Code-Splitting na Rota `/acompanhar/$token` (TASK-060-01)
- **Problema**: O TanStack Router emitia no console:
  ```text
  $token.tsx:4 [tanstack-router] These exports from ".../src/routes/acompanhar/$token.tsx" will not be code-split and will increase your bundle size:
  - CustomerTrackingPage
  ```
- **Causa Raiz**: O componente `CustomerTrackingPage` era exportado com `export function CustomerTrackingPage()`. Rotas do TanStack Router exigem a exportação exclusiva da constante `Route` para garantir divisão otimizada de pacotes.
- **Solução Implementada**: Removida a palavra-chave `export` da função, mantendo-a privada dentro de `src/routes/acompanhar/$token.tsx` e referenciada apenas na configuração da rota `Route`.
- **Resultado**: Aviso completamente eliminado e pacote `dist/client/assets/_token-*.js` otimizado.

### 1.2 Erro de Hidratação SSR com `prefers-reduced-motion` (TASK-060-02)
- **Problema**: Ao carregar o site com preferência de movimento reduzido ativada no sistema operacional ou navegador, o React 19 disparava erro de hidratação:
  ```text
  react-dom_client.js:2966 Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
  ```
- **Causa Raiz**: No servidor SSR (`Node/Bun`), `useReducedMotion()` retornava `false` (ausência de `window.matchMedia`), fazendo o servidor renderizar a barra laser transitória (`<motion.div className="fixed top-0 left-0 right-0 h-[2px] ..." aria-hidden="true" />`) como o primeiro filho do `PageTransition`. No cliente com preferência ativa, `useReducedMotion()` retornava `true`, suprimindo a barra e renderizando `<motion.div className="w-full">` como primeiro filho. A divergência de nós filhos e estilos inline causava falha imediata de hidratação e re-renderização completa da árvore.
- **Solução Implementada**:
  1. Introduzido controle de montagem isomorfo (`isMounted` via `useState(false)` e `useEffect(() => setIsMounted(true), [])`).
  2. No passe inicial de renderização (SSR e primeira hidratação síncrona do cliente), ambos os ambientes renderizam rigorosamente a mesma árvore: o container de conteúdo com `initial={false}` e sem a barra laser prematura.
  3. Após a montagem no cliente (`isMounted === true`), o componente ativa as transições de rota e a barra laser se `!shouldReduce` (integrando `useReducedMotionConfig` e `useReducedMotion`).
  4. Adicionada a classe utilitária do Tailwind `motion-reduce:hidden` como defesa em profundidade no CSS.
- **Resultado**: Erro de hidratação 100% resolvido, transições fluidas preservadas para navegação normal e total conformidade com WCAG 2.2 AA.

---

## 2. Evidências de Validação e Quality Gates

### 2.1 Testes Automatizados (Vitest)
```bash
bun run test
```
- **Resultado**: 49 arquivos de teste executados, **358 testes aprovados (100% de sucesso)**.
- Novos testes cobrindo SSR isomorfo (`renderToString`), supressão da barra laser sob reduced motion, renderização da barra laser no mount regular e verificação de export exclusivo em `/acompanhar/$token`.

### 2.2 Linter de Código (ESLint)
```bash
bun run lint
```
- **Resultado**: 0 erros.

### 2.3 Compilação de Produção (Vite + TanStack Start SSR)
```bash
bun run build
```
- **Resultado**: Sucesso completo em ~5.2s. Cliente e servidor SSR compilados em `dist/client` e `dist/server/server.js`.

---

## 3. Matriz de Critérios de Aceite

| Critério | Descrição | Status | Evidência |
| -------- | --------- | ------ | --------- |
| **AC-060-01** | Remoção de export indevido de `CustomerTrackingPage` em `$token.tsx` | Aprovado | Teste unitário e bundle TanStack Router limpo |
| **AC-060-02** | Eliminação do erro de hidratação sob `prefers-reduced-motion` | Aprovado | Teste com `MotionConfig reducedMotion="always"` |
| **AC-060-03** | Isomorfismo estrito entre HTML do SSR e primeiro render do cliente | Aprovado | Teste com `renderToString` de `PageTransition` |
| **AC-060-04** | Preservação da barra laser transitória em usuários sem restrição de movimento | Aprovado | Teste validando elemento após mount |
| **AC-060-05** | Cobertura de testes automatizados para motion e SSR | Aprovado | 358 testes passando no Vitest |
| **AC-060-06** | Quality Gates aprovados | Aprovado | Vitest, ESLint e Vite Build com 100% de sucesso |
