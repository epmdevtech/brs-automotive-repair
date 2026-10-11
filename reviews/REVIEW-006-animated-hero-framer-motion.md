# REVIEW: Seção Hero Animada com Framer Motion (21st.dev AnimatedHero)

## Metadados

| Campo         | Valor                                                      |
| ------------- | ---------------------------------------------------------- |
| ID            | REVIEW-006                                                 |
| SPEC          | SPEC-006                                                   |
| TASK          | TASK-006-01                                                |
| Status        | Approved                                                   |
| Revisor       | Antigravity AI (Pair Programming) / EPMDEVTECH             |
| Data          | 2026-10-11                                                 |

---

## 1. Resumo da Mudança

Implementação do componente `AnimatedHero` inspirado na biblioteca 21st.dev e baseado no framework `framer-motion` v14, integrado à seção Hero do site institucional da BRS Reparações Automotivas (Toledo/PR).

### Entregas Técnicas:
1. `src/components/brs/animated-hero.tsx`: Componente modular exportando a interface canônica `AnimatedHeroProps`, com transições suaves via `framer-motion`, variantes de animação escalonadas (`staggerChildren`), botão glass com `backdrop-blur-md` e suporte completo a `prefers-reduced-motion` via `useReducedMotion()`.
2. `src/components/brs/hero.tsx`: Consome `AnimatedHero` injetando a imagem oficial de alta resolução `brs-hero.jpg`, logotipo institucional `<Brand />`, navegação canônica vinda de `src/lib/brs.ts`, tipografia da marca e ações interativas direcionando para `#contato` e `#servicos`.
3. Preservação do `trust-strip` (faixa de confiança técnica automotiva) e rotulagem legal de foto ilustrativa.
4. `src/test/animated-hero.test.tsx`: Suíte de testes unitários validando renderização, integridade de links, acionamento de cliques e botões com/sem `href`.

---

## 2. Verificação de Critérios de Aceitação

| Critério    | Descrição                                                         | Status   | Evidência                                                                             |
| ----------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| AC-006-01   | Exportação de `AnimatedHeroProps` e uso de variantes framer-motion | Aprovado | `containerVariants` e `itemVariants` configurados com degradê gracioso em SSR        |
| AC-006-02   | Renderização do Hero com estilo dark automotivo e botões glass    | Aprovado | Botão glass estilizado com `backdrop-blur-md border border-white/20` e `automotive`   |
| AC-006-03   | Direcionamento suave de CTAs para `#contato` e `#servicos`        | Aprovado | Suporte a âncoras nativas acessíveis e scroll suave assistido                         |
| AC-006-04   | Quality Gates 100% aprovados (`make check`)                       | Aprovado | 20 testes passando no Vitest, 0 erros no ESLint, build Nitro SSR concluído com êxito  |

---

## 3. Quality Gates e Evidências

- **Testes Vitest**: 20 testes aprovados em 4 suítes (`src/test/animated-hero.test.tsx`, `src/test/app-routing.test.tsx`, `src/test/brs.test.ts`, `src/test/motion.test.tsx`).
- **Linter**: ESLint e Prettier executados sem erros (`bun run lint`).
- **Build**: Vite + TanStack Start + Nitro SSR compilados sem falhas (`bun run build`).
- **Rastreabilidade**: Matriz de rastreabilidade gerada sem lacunas em `docs/traceability-matrix.md`.

---

## 4. Conclusão

Revisão técnica aprovada sem ressalvas. O componente atende plenamente ao padrão de excelência de software house, mantendo a integridade dos dados reais de Toledo/PR e o posicionamento premium da BRS.
