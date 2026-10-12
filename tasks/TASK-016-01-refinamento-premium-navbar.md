# TASK: Refinamento Premium da Navbar (Cápsula Flutuante)

## Metadados

| Campo        | Valor                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| ID           | TASK-016-01                                                                                                  |
| Status       | Done                                                                                                         |
| Responsável  | Engenharia Frontend EPMDEVTECH                                                                               |
| SPEC         | SPEC-016                                                                                                     |
| Critérios    | AC-016-01, AC-016-02, AC-016-03, AC-016-04, AC-016-05, AC-016-06, AC-016-07, AC-016-08, AC-016-09, AC-016-10 |
| Dependências | SPEC-016                                                                                                     |

---

## Objetivo

Refinar visualmente o componente `Header` (`src/components/brs/header.tsx`), transformando a barra horizontal em uma cápsula flutuante centralizada com glassmorphism escuro (`bg-neutral-950/75`, `backdrop-blur-md`, `border-white/10`), cantos arredondados contínuos (`rounded-full` / `rounded-2xl`), botão dourado com `rounded-full` e brilho sutil no hover, painel mobile dark refinado e testes unitários atualizados.

---

## Escopo

### Incluído

1. **Transformação em Cápsula Flutuante**:
   - Container flutuante com `fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none`.
   - Cápsula interna com `pointer-events-auto max-w-6xl mx-auto rounded-full border border-white/10`.
   - Transição suave na rolagem (mais compacta com `py-2 px-5 sm:px-6` e `bg-neutral-950/90`).
2. **Glassmorphism e Cores Escuras**:
   - Vidro escuro translúcido com `backdrop-blur-md` e fallback sem distorções visuais.
   - Borda sutil delimitadora e sombra leve `shadow-2xl shadow-black/40`.
3. **Botão Dourado de CTA**:
   - Cantos arredondados `rounded-full`.
   - Brilho dourado refinado no hover (`hover:shadow-[0_0_18px_rgba(212,175,55,0.22)]`).
   - Indicador de foco via teclado (`focus-visible:ring-2 focus-visible:ring-primary`).
4. **Menu Mobile**:
   - Painel escuro flutuante com `rounded-2xl`, `bg-neutral-950/95`, `backdrop-blur-lg` e borda `border-white/10 mt-2`.
5. **Testes & Quality Gates**:
   - Atualizar e expandir testes em `src/test/header.test.tsx`.
   - Validar com `bun run test`, `bun run lint` e `bun run build`.

---

## Critérios de Aceitação

- [x] AC-016-01: Navbar em cápsula flutuante centralizada com largura controlada e margens superiores.
- [x] AC-016-02: Vidro escuro translúcido com blur e borda sutil.
- [x] AC-016-03: Botão dourado com cantos arredondados e brilho discreto no hover.
- [x] AC-016-04: Identidade visual BRS e paleta preservadas.
- [x] AC-016-05: Logotipo, todos os 6 links e CTA funcionais.
- [x] AC-016-06: Navegação desktop e mobile totalmente responsiva e acessível.
- [x] AC-016-07: Sem sobreposição indesejada, cortes de viewport ou bloqueio de cliques.
- [x] AC-016-08: Contraste acessível e indicador de foco por teclado preservados.
- [x] AC-016-09: Nenhuma dependência externa adicional adicionada.
- [x] AC-016-10: 100% dos testes, lint e build aprovados.
