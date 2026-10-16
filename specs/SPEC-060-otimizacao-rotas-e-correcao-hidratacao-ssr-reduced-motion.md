# SPEC-060: Otimização de Code-Splitting de Rotas e Resolução de Erro de Hidratação SSR sob Reduced Motion

## Metadados

| Campo       | Valor                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| Spec ID     | SPEC-060                                                                                                                 |
| Título      | Otimização de Code-Splitting de Rotas e Resolução de Erro de Hidratação SSR com Prefers-Reduced-Motion no TanStack Start |
| Status      | Aprovado                                                                                                                 |
| Data        | 2026-10-15                                                                                                               |
| Autor       | Staff Frontend & Performance Engineer                                                                                    |
| Módulo      | `routes/acompanhar/$token.tsx` & `components/ui/page-transition.tsx`                                                     |
| Dependência | SPEC-020, SPEC-033, SPEC-058, SPEC-059                                                                                   |

---

## 1. Visão Geral e Diagnóstico das Falhas no Console

Ao carregar o projeto em ambiente local ou produção, dois problemas foram identificados no console do navegador:

### Problema 1: Export Indevido em Arquivo de Rota TanStack Router

```text
$token.tsx:4 [tanstack-router] These exports from "/.../src/routes/acompanhar/$token.tsx" will not be code-split and will increase your bundle size:
- CustomerTrackingPage
For the best optimization, these items should either have their export statements removed, or be imported from another location that is not a route file.
```

- **Causa Raiz**: O arquivo [`src/routes/acompanhar/$token.tsx`](src/routes/acompanhar/$token.tsx) declarava `export function CustomerTrackingPage()`. O TanStack Router exige que arquivos de rota exportem exclusivamente `Route` para garantir divisão de código (code-splitting) automática e árvore enxuta.

### Problema 2: Erro Catastrófico de Hidratação SSR (React 19) com `prefers-reduced-motion`

```text
framer-motion.js:181 You have Reduced Motion enabled on your device. Animations may not appear as expected.
react-dom_client.js:2966 Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
```

- **Causa Raiz**: No componente [`src/components/ui/page-transition.tsx`](src/components/ui/page-transition.tsx), a renderização da barra laser utilizava uma condicional JavaScript baseada no hook `useReducedMotion()`:
  ```tsx
  const shouldReduce = useReducedMotion();
  ...
  {!shouldReduce && (
    <motion.div className="fixed top-0 left-0 right-0 h-[2px] ..." ... />
  )}
  ```
  No servidor (SSR Node/Bun), `useReducedMotion()` retorna `false` por ausência de `window.matchMedia`. O servidor renderiza a barra laser como primeiro filho.
  No navegador do cliente com preferência de movimento reduzido ativada no SO/navegador, `useReducedMotion()` avalia como `true`. O cliente então omite a barra laser, tornando o container `<div className="w-full">` o primeiro filho.
  O React 19 detecta a discrepância estrutural entre a árvore do servidor e do cliente e falha com erro de hidratação, regenerando a árvore e causando layout shift.

---

## 2. Princípios de Engenharia e Arquitetura da Solução

1. **Eliminação do Export Indevido na Rota**:
   - Manter `function CustomerTrackingPage()` privada dentro de `src/routes/acompanhar/$token.tsx`, exportando estritamente `export const Route = createFileRoute("/acompanhar/$token")({ component: CustomerTrackingPage, ... })`.
2. **Resiliência e Isomorfismo de Hidratação no `PageTransition`**:
   - Durante a renderização inicial (SSR e primeira hidratação do cliente), a árvore de nós deve ser 100% idêntica entre servidor e cliente.
   - Adotar controle de montagem (`isMounted` via `useEffect`) para exibição de efeitos dinâmicos client-only e classes CSS nativas (`motion-reduce:hidden`), garantindo que o cliente com `prefers-reduced-motion` não remova nós antes da hidratação.
   - Para o container principal `<motion.div>`, fixar `initial={false}` no primeiro mount/SSR, evitando divergências de estilos de animação (`scaleX`, `opacity`, `transform`) entre o servidor e o cliente com preferência reduzida.
3. **Preservação dos Padrões Awwwards e WCAG 2.2 AA**:
   - A barra laser e as transições suaves de rota continuam ativas para usuários em navegação normal.
   - Para usuários com `prefers-reduced-motion`, a animação é suprimida instantaneamente sem causar erro no React.
4. **Quality Gates e Matriz de Rastreabilidade**:
   - 100% de aprovação nos testes do Vitest (`bun run test`).
   - Zero avisos de linter (`bun run lint`).
   - Compilação limpa (`bun run build`).
   - Matriz de rastreabilidade sincronizada (`python3 scripts/generate_traceability.py`).

---

## 3. Requisitos Funcionais e Critérios de Aceite

- [x] **AC-060-01**: `src/routes/acompanhar/$token.tsx` não deve exportar `CustomerTrackingPage`, eliminando o aviso de code-splitting do TanStack Router.
- [x] **AC-060-02**: `PageTransition` não deve causar erro de hidratação (`Hydration failed because the server rendered HTML didn't match the client`) quando executado com `prefers-reduced-motion` ativo no cliente.
- [x] **AC-060-03**: A árvore de nós renderizada no primeiro passe pelo cliente deve coincidir estritamente com o HTML gerado pelo SSR.
- [x] **AC-060-04**: Usuários sem preferência de movimento reduzido continuam visualizando a barra laser e a transição suave de página nas navegações entre rotas.
- [x] **AC-060-05**: Suíte de testes automatizados cobre o cenário de SSR/hidratação sob `prefers-reduced-motion`.
- [x] **AC-060-06**: Quality Gates (Vitest, ESLint, Build e Matriz SDD) aprovados com 100% de sucesso.
