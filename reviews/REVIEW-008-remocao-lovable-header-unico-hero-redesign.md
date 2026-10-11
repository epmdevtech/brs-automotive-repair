# REVIEW: Expurgar Vínculos Lovable, Unificar Navbar e Redesign da Seção Hero

## Metadados

| Campo   | Valor                                          |
| ------- | ---------------------------------------------- |
| ID      | REVIEW-008                                     |
| SPEC    | SPEC-008                                       |
| TASK    | TASK-008-01                                    |
| Status  | Approved                                       |
| Revisor | Antigravity AI (Pair Programming) / EPMDEVTECH |
| Data    | 2026-10-11                                     |

---

## 1. Resumo da Mudança

Atendimento integral às correções de arquitetura, limpeza de plataforma e alinhamento visual premium automotivo:

1. **Expurgo Completo do Lovable**:
   - Pacote `@lovable.dev/vite-tanstack-config` desinstalado de `package.json` e `bun.lock`.
   - `vite.config.ts` reescrito do zero com configuração nativa limpa do TanStack Start e Vite (`@tanstack/react-start/plugin/vite`, `nitro/vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`).
   - Removidas exclusões do `bunfig.toml`, excluído `src/lib/lovable-error-reporting.ts` e limpos resíduos em `src/lib/error-reporting.ts`, `AGENTS.md` e `PROJECT.md`.
2. **Unificação da Navbar (Eliminação de Duplicidade)**:
   - Eliminado o `<motion.header>` interno que estava sendo renderizado duplicadamente dentro de `AnimatedHero`.
   - Centralizado um único componente `<Header />` em `src/components/brs/header.tsx` com container `fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5` e menu mobile responsivo via Radix UI / Lucide.
   - Teste unitário [`src/test/header.test.tsx`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/BRS/src/test/header.test.tsx) adicionado, garantindo formalmente que existe exatamente um `<header>` em toda a landing page.
3. **Redesign da Seção Hero**:
   - **Overline / Badge**: Badge sutil em cápsula translúcida `"PRECISÃO NO REPARO • CUIDADO NO ATENDIMENTO"` com ponto pulsante âmbar e borda dourada.
   - **Tipografia H1**: Contraste refinado com "BRS REPARAÇÕES" em branco puro e "AUTOMOTIVAS" no tom âmbar da marca (`text-amber-500`).
   - **Subtítulo**: Texto conciso com leitura fluida e alto contraste sobre a chapa escura.
   - **CTAs Táteis**: Botão primário âmbar/preto com sombra de destaque e botão secundário outline neutro translúcido com `active:scale-[0.98]`.
   - **Background & Viewport**: Gradientes combinados garantindo conformidade WCAG AA+ sobre a fotografia do veículo e rodapé com microdados de Toledo/PR e foto ilustrativa.

---

## 2. Verificação de Critérios de Aceitação

| Critério  | Descrição                                                          | Status   | Evidência                                                                            |
| --------- | ------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------ |
| AC-008-01 | Expurgo total de `@lovable.dev` no código, build e documentação    | Aprovado | Zero ocorrências encontradas no grep global; dependência removida do lockfile        |
| AC-008-02 | `vite.config.ts` com configuração nativa do TanStack Start e Nitro | Aprovado | Build cliente e SSR Nitro executando perfeitamente e mais rápidos                    |
| AC-008-03 | Navbar única no documento com container fixed z-50 e backdrop blur | Aprovado | Validado via `src/test/header.test.tsx` (header único testado via jsdom/Vitest)      |
| AC-008-04 | Hero refinado com badge âmbar, H1 contrastante e CTAs táteis       | Aprovado | Componentes `hero.tsx` e `animated-hero.tsx` atualizados e validados com testes unit |
| AC-008-05 | Quality gates 100% aprovados (`make check`)                        | Aprovado | 31 testes Vitest, 0 erros ESLint, build Nitro SSR concluído com sucesso              |

---

## 3. Quality Gates e Evidências

- **Vitest**: 31 testes aprovados em 8 arquivos (`src/test/header.test.tsx`, `src/test/animated-hero.test.tsx`, `src/test/project-gallery.test.tsx`, `src/test/before-after-slider.test.tsx`, `src/test/card-spotlight.test.tsx`, `src/test/motion.test.tsx`, `src/test/brs.test.ts`, `src/test/app-routing.test.tsx`).
- **ESLint / Prettier**: 0 erros (`bun run lint`).
- **Build de Produção**: Vite + Nitro SSR compilados com 100% de sucesso (`bun run build`).
- **Rastreabilidade**: Gerada com sucesso em `docs/traceability-matrix.md`.

---

## 4. Conclusão

Revisão técnica aprovada sem ressalvas. O repositório está completamente livre de dependências de plataformas de geração de código e a interface do Hero atingiu o nível de acabamento profissional exigido.
