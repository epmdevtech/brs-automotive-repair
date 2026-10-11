# SPEC: Seção Hero Animada com Framer Motion (21st.dev AnimatedHero)

## Metadados

| Campo                               | Valor                                          |
| ----------------------------------- | ---------------------------------------------- |
| ID                                  | SPEC-006                                       |
| Status                              | Implemented                                    |
| Responsável                         | Engenharia Front-end EPMDEVTECH                |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH  |
| Criado                              | 2026-10-11                                     |
| Atualizado                          | 2026-10-11                                     |
| Lançamento alvo                     | `0.1.0`                                        |
| Briefing de UX relacionado          | Integração de componente 21st.dev AnimatedHero |
| Especificação de design relacionada | Dark Automotive Premium Design System          |
| ADRs relacionadas                   | N/A                                            |

---

## Problema e resultado

O usuário solicitou a aplicação do componente `AnimatedHero` (baseado no padrão da biblioteca 21st.dev) na seção Hero da BRS Reparações Automotivas utilizando a biblioteca `framer-motion`.
O componente utiliza animações com variantes (`containerVariants`, `itemVariants`), `motion.header`, `motion.div`, `motion.h1`, `motion.p` e botões de estilo glass com backdrop-blur.

### Resultado Desejado

1. Instalação e integração do pacote oficial `framer-motion` no ecossistema Bun e TanStack Start com SSR Nitro.
2. Criação do componente reutilizável `src/components/brs/animated-hero.tsx` implementando a interface `AnimatedHeroProps` exatamente conforme a especificação do usuário.
3. Composição de `src/components/brs/hero.tsx` utilizando `AnimatedHero`, preservando a identidade visual da BRS (Toledo-PR, Funilaria/Pintura/Martelinho, telefone, canal Instagram e nota de foto ilustrativa) e as metas de acessibilidade WCAG.
4. Manutenção da compatibilidade com testes automatizados Vitest e zero quebra em SSR.

---

## Escopo

### No escopo (In scope)

- Instalação de `framer-motion`.
- Criação de `src/components/brs/animated-hero.tsx` com `motion`, `containerVariants`, `itemVariants` e estilo glass para botões.
- Integração em `src/components/brs/hero.tsx` consumindo os dados canônicos da BRS (`hero.jpg`, logotipo `Brand`, navegação institucional e ações para `#contato` e `#servicos`).
- Preservação da `trust-strip` (faixa de confiança técnica) e indicador de localização.
- Atualização da suíte de testes Vitest (`src/test/motion.test.tsx` e `src/test/brs.test.ts`).

### Fora do escopo (Out of scope)

- Modificação de rotas ou de regras comerciais de Toledo-PR.
- Alteração dos demais componentes da página institucional.

---

## Critérios de Aceitação

- [AC-006-01] O componente `AnimatedHero` deve exportar a interface `AnimatedHeroProps` e utilizar `framer-motion` com variantes de transição e stagger.
- [AC-006-02] O Hero da BRS deve renderizar com imagem de fundo, título, descrição, navegação e botões em glassmorphism translúcido com acessibilidade.
- [AC-006-03] As ações de CTA devem direcionar suavemente para as âncoras `#contato` e `#servicos`.
- [AC-006-04] O build de produção Nitro SSR (`bun run build`) e a suíte de testes (`bun run test`) devem passar com 100% de sucesso.
