# SPEC-016: Refinamento Premium da Navbar (Cápsula Flutuante)

## Metadados

| Campo           | Valor                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| ID              | SPEC-016                                                                                               |
| Título          | Refinamento Premium da Navbar da BRS Reparações Automotivas (Cápsula Flutuante & Glassmorphism Escuro) |
| Status          | Approved                                                                                               |
| Autor           | Engenharia Frontend EPMDEVTECH & Antigravity AI                                                        |
| Data de Criação | 2026-10-11                                                                                             |
| Alvo            | `src/components/brs/header.tsx`, `src/test/header.test.tsx`                                            |

---

## 1. Contexto & Diagnóstico

A barra de navegação da **BRS Reparações Automotivas** atualmente utiliza uma estrutura horizontal padrão de largura total fixada no topo (`fixed top-0 left-0 right-0 w-full`). Embora funcional, o objetivo deste refinamento é elevar a percepção de sofisticação e modernidade por meio de uma estética premium inspirada em interfaces automotivas de alto padrão (ex.: Porsche, Aston Martin, 21st.dev).

A nova diretriz visual estabelece a transformação da navbar em uma **cápsula flutuante centralizada**, com vidro escuro translúcido (`backdrop-blur-md`, `bg-neutral-950/75`), bordas finas e refinadas (`border-white/10`), cantos arredondados contínuos (`rounded-full` / `rounded-2xl`) e realce do botão dourado de CTA principal com cantos arredondados e brilho discreto no hover.

---

## 2. Requisitos Técnicos e de Design

### 2.1 Cápsula Flutuante Centralizada

- Em vez de uma barra que ocupa 100% da largura da tela, o cabeçalho deve flutuar com espaçamento superior e lateral (`top-3 sm:top-5 px-4 sm:px-6`).
- Container centralizado com `mx-auto` e largura máxima controlada (`max-w-6xl` / `max-w-5xl`).
- Cantos arredondados em cápsula: `rounded-full` em desktop e `rounded-2xl` quando o conteúdo ou telas intermediárias exigirem.
- Espaçamento interno proporcional e equilibrado: logotipo à esquerda, navegação institucional no centro e botão CTA à direita.

### 2.2 Vidro Escuro com Transparência (Glassmorphism)

- Fundo: `bg-neutral-950/75` (ou `bg-black/75` / tom equivalente coerente com a paleta dark da BRS).
- Desfoque de fundo: `backdrop-blur-md` com fallback para fundos sem suporte a backdrop-filter.
- Borda: fina e sutil (`border border-white/10` ou `border-white/12`).
- Sombra: elevação sutil `shadow-2xl shadow-black/40` sem poluição visual.

### 2.3 Refinamento do Botão CTA Principal (Dourado)

- Botão "Solicitar avaliação" com cantos arredondados (`rounded-full`).
- Brilho dourado discreto no hover (`hover:shadow-[0_0_18px_rgba(212,175,55,0.22)]`).
- Indicador de foco evidente para navegação por teclado (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950`).
- Sem animações pulsantes contínuas no botão de ação.

### 2.4 Comportamento no Scroll e Menu Mobile

- Preservação da fixação flutuante durante o scroll (`fixed top-3 sm:top-5 z-50 left-0 right-0`).
- Ao rolar a página (`window.scrollY > 40`), transição suave e discreta para estado ainda mais compacto (`py-2 px-5 sm:px-6`) e fundo ligeiramente mais denso (`bg-neutral-950/90`).
- Menu mobile responsivo: preserva o botão de alternância (`Menu` / `X`), abrindo um painel escuro sofisticado com `rounded-2xl`, `bg-neutral-950/95`, `backdrop-blur-lg` e borda `border-white/10`.
- Zero dependências adicionais instaladas.

---

## 3. Critérios de Aceitação (AC)

- **AC-016-01**: A navbar apresenta aparência de cápsula flutuante centralizada (`max-w-6xl`, margens laterais e espaçamento superior).
- **AC-016-02**: O fundo utiliza vidro escuro translúcido com `backdrop-blur-md` e borda sutil `border-white/10`.
- **AC-016-03**: O botão dourado possui cantos arredondados `rounded-full` e brilho discreto no hover.
- **AC-016-04**: A identidade visual original, paleta dourada e tipografia da BRS foram 100% preservadas.
- **AC-016-05**: Logotipo, todos os 6 links de navegação e o CTA continuam funcionando e apontando para as rotas corretas.
- **AC-016-06**: A navegação desktop e o menu móvel responsivo permanecem totalmente funcionais e acessíveis (`aria-label`, `aria-expanded`).
- **AC-016-07**: Não ocorrem sobreposições indevidas, cortes de viewport ou bloqueio de elementos interativos.
- **AC-016-08**: Contraste acessível (WCAG AA) e anel de foco visível por teclado preservados.
- **AC-016-09**: Nenhuma dependência externa adicional foi instalada.
- **AC-016-10**: Todos os testes automatizados, verificação de TypeScript, lint e build passam com 100% de sucesso.
