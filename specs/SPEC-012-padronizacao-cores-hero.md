# SPEC: Padronização das Cores de Tipografia e Botões da Seção Hero

## Metadados

| Campo                               | Valor                                         |
| ----------------------------------- | --------------------------------------------- |
| ID                                  | SPEC-012                                      |
| Status                              | Implemented                                   |
| Responsável                         | Engenharia Front-end EPMDEVTECH               |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH |
| Criado                              | 2026-10-11                                    |
| Atualizado                          | 2026-10-11                                    |
| Lançamento alvo                     | `0.1.0`                                       |
| Briefing de UX relacionado          | Padronização de Cores e Tokens Hero BRS       |
| Especificação de design relacionada | Dark Automotive Premium Design System         |
| ADRs relacionadas                   | N/A                                           |

---

## 1. Problema e Resultado

A seção Hero apresentava divergências cromáticas em relação aos tokens e componentes das demais seções da landing page:

1. O termo `"Automotivas."` no H1 e elementos auxiliares estavam estilizados com classe direta `text-amber-500` (tom alaranjado saturado), divergindo da cor dourada de destaque canônica do site (`text-primary`, como empregada em `"cuidado em cada etapa."` em `Philosophy`).
2. O badge superior (overline) utilizava classes `amber-500` com matiz destoante.
3. A descrição/subtítulo necessitava de alinhamento com a escala de cinza editorial de parágrafos (`text-neutral-400`).
4. Os botões de ação apresentavam classes divergentes do botão de avaliação do Header (`bg-amber-500 text-black hover:bg-amber-400`), demandando unificação perfeita para o design token `bg-primary text-primary-foreground hover:bg-primary/90`, e o botão secundário demandava refinamento dark com `border-neutral-800`, `bg-neutral-900/60` e `text-neutral-300`.

### Resultado Esperado

1. **H1 da Hero**: `"BRS Reparações"` em `text-white font-semibold` e `"Automotivas."` em `text-primary font-semibold`, utilizando rigorosamente o token do design system.
2. **Badge Superior**: Borda `border-primary/20`, fundo `bg-primary/10`, ponto `bg-primary` e tipografia `text-primary`.
3. **Subtítulo da Hero**: Texto em `text-neutral-400`.
4. **Botão Primário**: Idêntico ao botão da Navbar, utilizando `bg-primary text-primary-foreground hover:bg-primary/90` com feedback tátil e transição suave.
5. **Botão Secundário**: Estilo escuro elegante com `border-neutral-800`, `bg-neutral-900/60`, texto `text-neutral-300` e hover para `text-white` e `bg-neutral-800`.
6. **Preservação**: Preservar 100% de layouts, imagens, animações Framer Motion, links de âncoras e funcionalidades.

---

## 2. Escopo

### No escopo (In scope)

- Atualizar classes de cores do H1, badge, descrição e botões em `src/components/brs/hero.tsx` e `src/components/brs/animated-hero.tsx`.
- Sincronizar o botão de avaliação em `src/components/brs/header.tsx` para garantir correspondência 100% exata com o botão da Hero (`bg-primary text-primary-foreground hover:bg-primary/90`).
- Criar suíte de testes em `src/test/hero-colors.test.tsx` para assegurar conformidade e ausência de divergências cromáticas.
- Validar via `make check`.

### Fora do escopo (Out of scope)

- Alterações na imagem de fundo, lógica de animação, estrutura das rotas ou textos comerciais.

---

## 3. Critérios de Aceitação

- [AC-012-01] O destaque `"Automotivas."` do H1 deve usar a classe `text-primary`, alinhando-se aos títulos das seções subsequentes.
- [AC-012-02] O badge superior `"Precisão no reparo • Cuidado no atendimento"` deve utilizar `text-primary`, `border-primary/20`, `bg-primary/10` e ponto `bg-primary`.
- [AC-012-03] A descrição da Hero deve adotar a cor de parágrafo `text-neutral-400`.
- [AC-012-04] O botão primário `"Solicitar avaliação"` da Hero e o botão do Header devem possuir as exatas mesmas cores de background (`bg-primary`), texto (`text-primary-foreground`) e hover (`hover:bg-primary/90`).
- [AC-012-05] O botão secundário `"Conhecer os serviços"` deve utilizar `border-neutral-800`, `bg-neutral-900/60`, `text-neutral-300` com hover `hover:text-white hover:bg-neutral-800`.
- [AC-012-06] Todos os Quality Gates (`make check`) devem passar com 100% de sucesso.
