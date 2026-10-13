# TASK-027-01 — Implementação da Rota de Proposta Comercial Personalizada

## Metadados

| Campo        | Valor                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| ID           | `TASK-027-01`                                                                                                       |
| Status       | Done (Concluído)                                                                                                    |
| Responsável  | Staff Frontend Engineer & Especialista Comercial EPM DevTech                                                        |
| Refs:        | SPEC: [`SPEC-027`](../specs/SPEC-027-rota-de-proposta-comercial-personalizada.md); Critérios: AC-027-01 a AC-027-08 |
| Dependências | Nenhuma bloqueadora                                                                                                 |

---

## 1. Objetivo

Implementar a rota dinâmica de proposta comercial personalizada (`/proposta/$slug` e `/proposta`) com identidade visual premium da BRS Reparações Automotivas e autoria discreta da EPM DevTech, modularizada em 10 seções de alta conversão, modelo de dados tipado, prevenção de placeholders/dados incompletos, metadados com diretiva `noindex`, e fluxo honesto de manifestação de interesse com diálogo explicativo para início da etapa de briefing.

---

## 2. Escopo

### Incluído

1. Criação do módulo de domínio `src/lib/proposta.ts` com tipos, modelo de validação `validateProposalCompleteness`, dados da proposta piloto real da BRS e utilitários monetários.
2. Criação dos submódulos de apresentação em `src/components/brs/proposal/`:
   - `proposal-hero.tsx` (Seção 1: Identificação, cliente, data, autoria EPM DevTech)
   - `proposal-nav.tsx` (Sub-header adesivo com âncoras suaves)
   - `proposal-opportunity.tsx` (Seção 2: Diagnóstico e objetivos claros)
   - `proposal-solution.tsx` (Seção 3: Solução proposta e diferenciais)
   - `proposal-scope.tsx` (Seção 4: Escopo incluído e não incluído)
   - `proposal-investment.tsx` (Seção 5: Investimento, parcelamento, ausência de mensalidade surpresa)
   - `proposal-conditions.tsx` (Seção 6: Condições comerciais e termos)
   - `proposal-timeline.tsx` (Seção 7: Etapas de execução)
   - `proposal-responsibilities.tsx` (Seção 8: Prazos e responsabilidades mútuas)
   - `proposal-faq.tsx` (Seção 9: Dúvidas frequentes em acordeão acessível)
   - `proposal-acceptance.tsx` (Seção 10: CTAs de conversão e modal de transição para o briefing)
   - `proposal-not-found.tsx` (Estado 404 para proposta inexistente ou expirada)
   - `proposal-view.tsx` (Orquestrador da visualização completa da proposta)
3. Criação das rotas TanStack Router:
   - `src/routes/proposta/$slug.tsx`
   - `src/routes/proposta/index.tsx`
4. Metadados SEO com `<meta name="robots" content="noindex, nofollow" />` e ausência da rota no `sitemap.xml`.
5. Suíte de testes unitários e de integração em `src/test/proposta.test.ts` e `src/test/proposta-route.test.tsx`.
6. Validação dos Quality Gates (`bun run test`, `bun run lint`, `bun run build`).

### Excluído

- Persistência em banco de dados ou autenticação com senha.
- Assinatura contratual jurídica formal na plataforma.
- Inclusão da rota nos menus de navegação pública (`navigation` / `primaryNavigation`).

---

## 3. Checklist de Execução

- [x] **Etapa 1: Elaboração e aprovação da SPEC-027**
- [x] **Etapa 2: Implementação do módulo canônico de dados e validações (`src/lib/proposta.ts`)**
- [x] **Etapa 3: Implementação dos componentes da proposta (`src/components/brs/proposal/*`)**
- [x] **Etapa 4: Implementação das rotas dinâmicas do TanStack Router (`src/routes/proposta/*`)**
- [x] **Etapa 5: Atualização e suporte a metadados noindex em `src/lib/seo.ts`**
- [x] **Etapa 6: Criação das suítes de testes (`src/test/proposta.test.ts` e `src/test/proposta-route.test.tsx`)**
- [x] **Etapa 7: Validação dos Quality Gates (`bun run test`, `bun run lint`, `bun run build`)**
- [x] **Etapa 8: Elaboração do REVIEW-027 e atualização de PROJECT.md e CHANGELOG.md**

---

## 4. Validação e Critérios

| Critério/Risco                       | Comando / Teste                                 | Evidência Esperada                   |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------ |
| Regras de negócio da proposta        | `bun run test src/test/proposta.test.ts`        | 100% dos testes aprovados            |
| Renderização das rotas e componentes | `bun run test src/test/proposta-route.test.tsx` | 100% dos testes aprovados            |
| Regressão em testes existentes       | `bun run test`                                  | 100% dos testes da suíte passando    |
| Conformidade com Linters             | `bun run lint`                                  | Zero erros ESLint / Prettier         |
| Compilação e Build SSR               | `bun run build`                                 | Sucesso no bundling Vite e Nitro SSR |
