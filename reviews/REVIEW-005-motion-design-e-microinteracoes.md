# Revisão (Review): Refinamento de UI, Motion Design e Microinterações

## Metadados

| Campo        | Valor                                                              |
| ------------ | ------------------------------------------------------------------ |
| ID           | REVIEW-005                                                         |
| SPEC/TASK    | SPEC-005 / TASK-005-01                                             |
| Status       | Approved                                                           |
| Build/commit | Refinamento avançado de UI, motion design sóbrio e microinterações |
| Revisor      | Engenharia de Software, Design e QA EPMDEVTECH                     |
| Data         | 2026-10-11                                                         |

---

## Escopo revisado

- **Artefatos**:
  - `src/lib/motion.ts`: Utilitários puros de cálculo de rolagem, spotlight e acessibilidade de movimento.
  - `src/hooks/use-scroll-reveal.ts`: Revelação única de seções via `IntersectionObserver`.
  - `src/hooks/use-scroll-progress.ts`: Progresso contínuo de rolagem nativa sem hijacking.
  - `src/components/brs/media-expand.tsx`: Transição cinematográfica entre o Hero e os Serviços com expansão de mídia.
  - `src/components/brs/hero.tsx`: Entrada escalonada com máscara tipográfica por linha no título, fade suave e header integrado.
  - `src/components/brs/services.tsx`: Microinteração Spotlight acompanhando o cursor do mouse e foco via teclado.
  - `src/components/brs/about.tsx`, `project-gallery.tsx`, `process-timeline.tsx`, `partner-section.tsx`, `final-cta.tsx`: Entradas discretas com stagger.
  - `src/components/ui/button.tsx`: Feedback tátil no clique, transições suaves e anel de foco reforçado.
  - `src/styles.css`: Tokens de movimento (`--ease-out`, `--dur-*`, `--stagger`, etc.) e suporte a `prefers-reduced-motion`.
  - `src/test/motion.test.tsx`: 10 novos testes unitários e de integração cobrindo a camada de movimento.
- **Critérios**: AC-005-01 a AC-005-07.
- **Validações realizadas**:
  - `bun run lint` (0 erros).
  - `npx tsc --noEmit` (0 erros de tipagem TypeScript).
  - `bun run test` (17/17 testes aprovados).
  - `bun run build` (Build Client e Nitro SSR concluídos com sucesso).
  - `make check` (Quality Gates 100% verdes).

---

## Achados (Findings)

| ID      | Severidade | Local                       | Evidência e impacto                                                                                                                  | Correção realizada / Status                                                           | Status |
| ------- | ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------ |
| FIND-01 | Média      | Dependências de animação    | Referências externas (21st.dev) usavam `framer-motion`/`motion`. Incluir bibliotecas pesadas aumentaria o bundle desnecessariamente. | Implementado com CSS moderno puro, tokens e hooks nativos sem adicionar dependências. | Closed |
| FIND-02 | Alta       | Acessibilidade e desempenho | Animações contínuas ou scroll hijacking prejudicam usabilidade em dispositivos móveis e usuários sensíveis a movimento.              | Adicionado `prefers-reduced-motion: reduce`, economia de dados e rolagem nativa.      | Closed |
| FIND-03 | Baixa      | Tipagem estrita de tuplas   | Desestruturação em `contact-form.tsx` inferia tipo indefinido com `noUncheckedIndexedAccess`.                                        | Tipado com `as const` para garantia de integridade em tempo de compilação.            | Closed |

---

## Verificações

- [x] O Hero apresenta entrada escalonada elegante sem layout shift e preservando LCP.
- [x] A transição `MediaExpand` expande a imagem suavemente na rolagem nativa sem scroll hijacking.
- [x] O Spotlight nos serviços é acionado apenas por ponteiro fino (`hover: hover`), mantendo conteúdo 100% legível e acessível no mobile.
- [x] Botões refinados com transições suaves, estados de foco nítidos e feedback tátil ativo.
- [x] Entradas de seção executam apenas uma vez e mantêm conteúdo visível sem JavaScript.
- [x] Suporte completo a `prefers-reduced-motion`.
- [x] Zero dependências desnecessárias adicionadas ao `package.json`.
- [x] Todos os quality gates (`make check`) aprovados com 100% de sucesso.

---

## Decisão

**Approved (Aprovado)**

- **Motivo**: O refinamento visual e de movimento elevou o website da BRS a um padrão automotivo sofisticado e premium, mantendo a sobriedade, acessibilidade e integridade técnica do projeto.
- **Revisores**: Engenharia de Software, Design & QA EPMDEVTECH (2026-10-11).
