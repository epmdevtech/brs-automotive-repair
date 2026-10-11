# TASK: Expurgar Vínculos Lovable, Unificar Navbar e Redesign do Hero

## Metadados

| Campo        | Valor                                                                          |
| ------------ | ------------------------------------------------------------------------------ |
| ID           | TASK-008-01                                                                    |
| Status       | Done                                                                           |
| Responsável  | Engenharia Front-end EPMDEVTECH                                                |
| SPEC         | SPEC-008                                                                       |
| Critérios    | AC-008-01, AC-008-02, AC-008-03, AC-008-04, AC-008-05                          |
| Dependências | SPEC-008                                                                       |

---

## Objetivo

Remover completamente todas as dependências e resquícios do Lovable, reescrever `vite.config.ts` com plugins nativos de TanStack Start/Vite, eliminar a duplicação da Navbar consolidando um único container fixed com backdrop blur, e aplicar redesign premium na seção Hero com hierarquia visual impecável e alto contraste dark automotivo.

---

## Escopo

### Incluído

- Desinstalar `@lovable.dev/vite-tanstack-config` e atualizar `package.json` e `bun.lock`.
- Configurar `vite.config.ts` com `@tanstack/react-start/plugin/vite`, `nitro/vite`, `@vitejs/plugin-react`, `@tailwindcss/vite` e `vite-tsconfig-paths`.
- Limpar `bunfig.toml`, `src/lib/error-reporting.ts`, deletar `src/lib/lovable-error-reporting.ts` e limpar comentários em `AGENTS.md` e `PROJECT.md`.
- Unificar a Navbar em `src/components/brs/header.tsx` com `fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5` e comportamento responsivo.
- Remover o header duplicado de `AnimatedHero` / `Hero`.
- Redesenhar o Hero com badge elegante âmbar com borda sutil, H1 de alto contraste com destaque da marca, subtítulo claro, CTAs táteis e rodapé de microdados.
- Ajustar os testes unitários afetados e validar com `make check`.

### Não incluído

- Alterações em dados de serviços da oficina ou catálogo comercial.

---

## Validação

| Critério/risco | Teste, comando ou revisão      | Evidência esperada                                        |
| -------------- | ------------------------------ | --------------------------------------------------------- |
| AC-008-01      | Varredura global de arquivos   | Zero ocorrências de `@lovable.dev` ou scripts de tagging  |
| AC-008-02      | `bun run build`                | Build cliente e SSR Nitro funcionando com Vite nativo     |
| AC-008-03      | Inspeção de DOM / Testes       | Apenas 1 `<header>` no documento, sem duplicações         |
| AC-008-04      | Inspeção de Hero / Testes      | Badge âmbar, H1 com forte contraste e CTAs funcionais     |
| AC-008-05      | `make check`                   | Vitest, ESLint, Build e Rastreabilidade 100% aprovados     |

---

## Condição de conclusão

- [x] Dependência `@lovable.dev/vite-tanstack-config` removida e Vite nativo configurado.
- [x] Todos os resíduos de Lovable eliminados do repositório.
- [x] Header único, responsivo e posicionado com `fixed top-0 left-0 right-0 z-50`.
- [x] Hero redesenhado com hierarquia visual e tipografia premium dark automotiva.
- [x] Testes passando com sucesso.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-008` aprovado.
- [x] Commit com trailers `Spec-Ref: SPEC-008` e `Task-Ref: TASK-008-01`.
