# TASK-034-01 — Implementação do Redesign Awwwards dos Heroes em Todas as Rotas

## Metadados

| Campo        | Valor                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------- |
| ID           | `TASK-034-01`                                                                                 |
| SPEC         | [`SPEC-034`](../specs/SPEC-034-awwwards-heroes-across-all-routes.md)                          |
| Título       | Implementação do Redesign Awwwards dos Heroes em Todas as Rotas com Tipografia, Paleta e GSAP |
| Data Criação | 2026-10-14                                                                                    |
| Status       | Completed (Concluído)                                                                         |
| Responsável  | Creative Director & Principal Motion Architect                                                |
| Branch/Alvo  | `feature/awwwards-redesign`                                                                   |

---

## 1. Escopo de Trabalho

1. **Criação do Componente Reutilizável `PageHero`**:
   - Criar `src/components/brs/page-hero.tsx` com suporte a breadcrumbs, código de seção Awwwards, H1 cinemático, telemetria automotiva, botões de ação e área visual com animação GSAP.
2. **Atualização do `ServicePageLayout`**:
   - Integrar o padrão `PageHero` em `src/components/brs/service-page-layout.tsx` para elevar simultaneamente as 3 rotas de especialidades:
     - `/servicos/funilaria`
     - `/servicos/pintura-automotiva`
     - `/servicos/martelinho-de-ouro`
3. **Atualização dos Heroes de Rotas Principais**:
   - `/servicos` (`src/routes/servicos/index.tsx`)
   - `/trabalhos` (`src/routes/trabalhos.tsx`)
   - `/sobre` (`src/routes/sobre.tsx`)
   - `/para-corretores` (`src/routes/para-corretores.tsx`)
   - `/contato` (`src/routes/contato.tsx`)
   - `/privacidade` (`src/routes/privacidade.tsx`)
   - `/proposta/$slug` (`src/components/brs/proposal/proposal-hero.tsx`)
4. **Verificação e Quality Gates**:
   - Adicionar suite de testes `src/test/awwwards-heroes-all-routes.test.tsx`.
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Critérios de Aceitação Verificáveis

- [x] `PageHero` renderiza com semântica H1 única, telemetrias e suporte a GSAP e reduced-motion.
- [x] As 3 rotas de serviço compartilham o layout elevado mantendo os testes de arquitetura aprovados.
- [x] As páginas `/servicos`, `/trabalhos`, `/sobre`, `/para-corretores`, `/contato`, `/privacidade` e `/proposta` exibem heroes no padrão Awwwards.
- [x] Nenhuma rota interna utiliza tags `<a href="/...">` (estritamente `<Link to="...">`).
- [x] 100% dos testes Vitest passam (`bun run test` - 27 arquivos, 189 testes).
- [x] `bun run lint` sem erros e `bun run build` bem-sucedido.
