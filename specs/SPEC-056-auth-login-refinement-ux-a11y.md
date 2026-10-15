# SPEC-056: Refinamento UX/UI, Acessibilidade (WCAG 2.2 AA) e Isolamento de Layout da Rota /login

## Metadados

| Campo       | Valor                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-056                                                                                                       |
| Título      | Refinamento UX/UI, Acessibilidade WCAG 2.2 AA e Isolamento Arquitetural de Layout da Rota /login e Painel BRS  |
| Status      | Aprovado                                                                                                       |
| Data        | 2026-10-15                                                                                                     |
| Autor       | Staff Product Designer & Engenheiro Front-end Sênior                                                           |
| Módulo      | `features/booking` & `routes/login`                                                                            |
| Issue / Ref | Isolamento de layout administrativo, proporção Fitts/Nielsen, tipografia WCAG, demo discreto e copy humanizada |

---

## 1. Contexto e Diagnóstico

Na rota `/login` (Painel da Oficina), foram identificados problemas críticos de arquitetura de layout, hierarquia visual e acessibilidade:

1. **Vazamento do Layout Público (P0 - D1)**:
   - O `SiteLayout` em `src/components/brs/site-layout.tsx` isolava apenas `/agendamentos`, fazendo com que `/login` renderizasse o `<Header />` flutuante do site público (cobrindo o conteúdo ao rolar), o `<Footer />` público (duplicando CNPJ e navegação) e o botão `<BackToTop />`.
2. **Faixa de Demonstração Conflitante (P0 - D2)**:
   - A barra de demo no topo apresentava texto truncado em resoluções intermediárias e o botão laranja sólido competia com o CTA primário de login.
3. **Desbalanceamento de Composição (P1 - D3)**:
   - A coluna esquerda ocupava ~20% em ultrawide enquanto o painel direito ficava com ~70% de espaço vazio à direita.
4. **Tipografia e Contraste Abaixo de WCAG 2.2 AA (P1 - D4)**:
   - Subtítulos, textos de rodapé e textos sobre fundo escuro necessitam de contraste mínimo verificado de 4.5:1 (texto normal) e 3.0:1 (elementos gráficos e texto grande). Nenhum texto pode ser menor que 12px.
5. **Placeholders Enganosos e Semântica de Campos (P1 - D5)**:
   - A senha com placeholder "••••••••" simulava campo já preenchido; e-mail expunha credencial do admin. Botão de alternância de senha precisa de alvo mínimo 40x40px e `aria-pressed`.
6. **Jargões Técnicos e Falta de Padronização de Case (P1 - D6, D7)**:
   - Uso de termos como Web Locks e BroadcastChannel inadequados para operadores de oficina, excesso de Title Case em português e repetição do termo "operacional".
7. **"Esqueci Minha Senha" Inacessível (P1 - D8)**:
   - Alvo pequeno e sem affordance clara de suporte interno.

---

## 2. Requisitos e Diretrizes Arquiteturais

### 2.1 Isolamento de Layout Administrativo (F1)

- `src/components/brs/site-layout.tsx` deve tratar tanto `/login` quanto `/agendamentos` como rotas administrativas isoladas.
- Zero renderização de `<Header />`, `<Footer />` e `<BackToTop />` em `/login` e `/agendamentos`.
- Raiz do login com `min-h-dvh`, sem rolagem desnecessária em viewports padrão (≥1366×768). Em alturas menores, apenas a coluna de formulário possui rolagem interna.

### 2.2 Composição e Proporção do Layout Split-Screen (F2)

- Grid: `lg:grid-cols-[minmax(440px,42%)_1fr]`.
- Coluna esquerda: formulário com `w-full max-w-[400px] mx-auto`, `px-6 sm:px-10`, flex-col com header no topo, formulário centralizado e rodapé na base.
- Painel direito: `p-10 xl:p-16`, conteúdo centralizado (`mx-auto max-w-[560px]`), fundo navy escuro com gradiente dourado sutil (~8% opacidade) e grid com máscara suave `aria-hidden`.
- Abaixo de 1024px, o painel é oculto e o formulário vira card centralizado sobre fundo neutro.

### 2.3 Modo Demo Não Invasivo (F3)

- Renderização estritamente condicionada à prop `demo={true}`. Quando `demo={false}`, nenhum nó relativo a teste/demo deve existir no DOM.
- Posicionamento: **abaixo** do botão "Entrar no painel", precedido por divisor sutil ("ou").
- Botão secundário `outline` largura total, altura 44px (h-11), ícone neutro e texto "Preencher com dados de demonstração".
- Linha de apoio em 13px: "Ambiente demonstrativo · dados fictícios" com botão/link "Ver credenciais" abrindo popover com e-mail e senha mono e botões de cópia.

### 2.4 Tipografia, Contraste e Acessibilidade WCAG 2.2 AA (F4, F5, F7, F10)

- Título: 28–32px/600; Subtítulo: 14–15px em `text-slate-600` (#475569); Labels: 14px/500 em `text-slate-700`; Inputs: 16px (evita zoom iOS) com h-11 a h-12 (44–48px); Placeholders e ícones: `text-slate-500` (#64748b) ou mais escuro; Microcopy: ≥12px (nunca 11px).
- Painel escuro: título com `clamp(2rem, 1rem + 2.4vw, 3rem)` e `text-balance`; textos secundários com contraste medido ≥ 4.5:1.
- E-mail: placeholder neutro `nome@brsreparacoes.com.br`. Senha: sem placeholder.
- Botão mostrar/ocultar senha: alvo 40×40px com `aria-pressed` e `aria-label`.
- Link "Esqueci minha senha": altura mínima de alvo ≥24px, fonte 14px, aciona diálogo com instruções claras de suporte interno da oficina.
- Landmarks semânticos: `<main>` único com `<h1>Painel da oficina</h1>`; painel direito em `<aside aria-label="Sobre o sistema">` com `<h2>`.
- Foco visível com anel 2px offset 2px contraste ≥3:1.

### 2.5 Padronização de Copy e Acentos Visuais (F6, F8, F9)

- Sentence case em todos os textos (exceto siglas como BRS, SSO, CNPJ).
- Eyebrow: "AGENDA E ATENDIMENTO" com acento dourado institucional.
- Cards informativos com texto desmistificado para rotina de oficina:
  - "Agenda sempre atualizada — Mudanças aparecem em todas as telas e abas abertas, sem recarregar a página."
  - "Fluxo de oficina em 5 etapas — Do recebimento à entrega, com acompanhamento visual de cada veículo e aviso ao cliente."
- Pré-visualização do produto: mini-card estático `aria-hidden` com stepper de 5 etapas reutilizando `ProcessStepper` da BRS em telas ≥1280px.

---

## 3. Matriz de Compatibilidade e Rastreabilidade

- Preservar testes automatizados existentes (`booking-admin-grid.test.tsx`, `booking-status-ux.test.tsx`, etc.).
- Preservar lógica de login `loginAdmin` e contrato `AdminLoginProps`.
- Sincronizar matriz de rastreabilidade com commit via `generate_traceability.py`.
