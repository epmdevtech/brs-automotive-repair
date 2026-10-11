# SPEC: Expurgar Vínculos Lovable, Unificar Navbar e Redesign da Seção Hero

## Metadados

| Campo                               | Valor                                                         |
| ----------------------------------- | ------------------------------------------------------------- |
| ID                                  | SPEC-008                                                      |
| Status                              | Implemented                                                   |
| Responsável                         | Engenharia Front-end EPMDEVTECH                               |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH                 |
| Criado                              | 2026-10-11                                                    |
| Atualizado                          | 2026-10-11                                                    |
| Lançamento alvo                     | `0.1.0`                                                       |
| Briefing de UX relacionado          | Limpeza de Plataforma, Header Único & Redesign Hero Dark Auto |
| Especificação de design relacionada | Dark Automotive Premium Design System                         |
| ADRs relacionadas                   | N/A                                                           |

---

## Problema e resultado

O projeto apresenta dois problemas arquiteturais e visuais críticos:

1. **Header/Navbar Duplicado e Sobreposto**: A barra de navegação está sendo renderizada duplamente no topo da página (pelo componente `Header` global e pelo `motion.header` interno do `AnimatedHero`), causando colisão de z-index, duplicidade de logos e layout quebrado.
2. **Resíduos de Template/Plataforma (Lovable)**: Permanecem no repositório a dependência `@lovable.dev/vite-tanstack-config`, scripts de telemetria/reporte de erro e comentários legados que devem ser completamente removidos em favor de uma configuração limpa e nativa de Vite e TanStack Start.
3. **Refinamento do Hero**: A seção Hero necessita de um alinhamento estético de alto padrão dark automotivo, com badge superior elegante, tipografia H1 de alto contraste com destaque âmbar da marca, CTAs táteis com variantes primária e outline limpa, overlay de gradiente otimizado para legibilidade WCAG AA+ e rodapé sutil da viewport.

### Resultado Desejado

1. Remoção completa da dependência `@lovable.dev/vite-tanstack-config`, migrando `vite.config.ts` para configuração nativa do TanStack Start e Vite (`@tanstack/react-start/plugin/vite`, `nitro/vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`).
2. Expurgar todos os arquivos, propriedades e comentários remanescentes vinculados a Lovable (`lovable-error-reporting.ts`, referências em `error-reporting.ts`, `bunfig.toml`, `AGENTS.md` e `PROJECT.md`).
3. Unificação da Navbar: manter um único componente `<Header />` fixo no topo (`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5`), responsivo com menu mobile e sem duplicação no Hero.
4. Redesign do Hero: badge `"PRECISÃO NO REPARO • CUIDADO NO ATENDIMENTO"` em `tracking-widest text-xs uppercase text-amber-400/90 font-medium`, H1 de alto impacto visual ("BRS REPARAÇÕES" em branco sólido e "AUTOMOTIVAS" em dourado/âmbar), subtítulo conciso, CTAs táteis e rodapé elegante de microdados.
5. Aprovação integral dos quality gates (`bun run test`, `bun run lint`, `bun run build`).

---

## Escopo

### No escopo (In scope)

- Remoção do pacote `@lovable.dev/vite-tanstack-config` de `package.json` e `bun.lock`.
- Configuração limpa e nativa de `vite.config.ts` mantendo SSR Nitro, porta estrita 5210 e plugins essenciais.
- Limpeza de referências em `bunfig.toml`, `src/lib/error-reporting.ts`, `AGENTS.md` e `PROJECT.md`, e remoção de `src/lib/lovable-error-reporting.ts`.
- Remoção do header interno duplicado em `AnimatedHero` / `Hero` e consolidação de um único `<Header />` fixo em `src/components/brs/header.tsx`.
- Redesign do Hero com badge refinado, tipografia H1 em alto contraste, gradiente lateral escuro e CTAs táteis com foco acessível.
- Atualização e garantia de 100% de aprovação na suíte de testes Vitest.

### Fora do escopo (Out of scope)

- Alterações em serviços da BRS ou dados de contato em `src/lib/brs.ts`.

---

## Critérios de Aceitação

- [AC-008-01] O pacote `@lovable.dev/vite-tanstack-config` e todas as referências a Lovable no código-fonte, build e documentação devem ser totalmente expurgados.
- [AC-008-02] O arquivo `vite.config.ts` deve usar configuração nativa e compilar o build cliente e SSR Nitro perfeitamente sem erros.
- [AC-008-03] Apenas uma única barra de navegação/header deve existir no topo da página, com estilo `fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/5` e menu mobile responsivo.
- [AC-008-04] O Hero deve renderizar com badge elegante âmbar, H1 com forte contraste ("BRS REPARAÇÕES AUTOMOTIVAS"), subtítulo nítido, CTAs táteis e rodapé de viewport com indicador de rolagem e foto ilustrativa.
- [AC-008-05] `make check` deve aprovar 100% dos testes Vitest, ESLint, compilação de produção e matriz de rastreabilidade.
