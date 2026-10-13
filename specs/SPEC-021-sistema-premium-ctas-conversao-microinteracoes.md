# SPEC-021: Sistema Premium de CTAs, Conversão e Microinterações para a BRS Reparações Automotivas

## Metadados

| Campo    | Valor                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------- |
| ID       | SPEC-021                                                                                          |
| Título   | Sistema Premium de CTAs, Conversão e Microinterações para a BRS Reparações Automotivas            |
| Status   | Approved                                                                                          |
| Data     | 2026-10-12                                                                                        |
| Autor    | Senior Frontend Engineer, UX/UI Design & Automotive CRO Specialist EPMDEVTECH                     |
| Contexto | Otimização de conversão, padronização semântica, geometria chanfrada automotiva e microinterações |

---

## 1. Contexto e Problema

O site da **BRS Reparações Automotivas** possui estrutura multipágina e sistema global de motion design recém-validados. No entanto, a camada comercial de CTAs e microinterações apresenta inconsistências:

1. **Rótulos genéricos ou difusos**: Presença de expressões como _"Ver detalhes"_, _"Página da especialidade"_, _"Saiba mais sobre PDR"_, que diminuem o ímpeto de ação e violam boas práticas de CRO automotivo.
2. **Falta de uma geometria visual técnica e proprietária**: Os botões oscilam entre `rounded-full` na navbar e `rounded-sm` no hero e seções, sem uma identidade geométrica que comunique o caráter mecânico, cirúrgico e artesanal da oficina.
3. **Microinterações e Feedback de Conversão**: O formulário de contato gera mensagem para o Instagram mas não expõe claramente os estados `idle`, `submitting`, `success`, `error`. Faltam microinterações táteis de profundidade e precisão (elevação discreta, feedback de clique, atração magnética sutil em desktop).
4. **Semântica e Acessibilidade**: Necessidade de garantir que 100% dos botões possuam área de toque confortável (mínimo 44px de altura nos controles principais), foco acessível preservado com `:focus-visible`, respeito a `prefers-reduced-motion` e ausência de efeitos magnéticos em touch.

---

## 2. Princípios de Design e CRO Automotivo

- **Paleta BRS Preservada**: Fundo escuro grafite (`oklch(0.14 0.005 260)`), acento dourado automotivo (`oklch(0.73 0.1 82)` / `var(--primary)`), alto contraste WCAG AA+ com tipografia em preto/dourado escuro nos botões primários. Jamais utilizar paleta teal B2B externa.
- **Hierarquia Estrita em 3 Níveis**:
  - **Nível 1 (Principal Comercial)**: `SOLICITAR AVALIAÇÃO` (ou `FALAR COM A BRS`). Fundo dourado, presença na Navbar, Hero e fechamentos contextuais.
  - **Nível 2 (Contextual de Serviço)**: `CONHECER FUNILARIA`, `CONHECER A PINTURA`, `ENTENDER O MARTELINHO`, `VER OS TRABALHOS`. Rótulos claros e descritivos.
  - **Nível 3 (Navegação & Aprofundamento)**: `CONHECER A BRS`, `VER TODOS OS SERVIÇOS`, `ENTRAR EM CONTATO`.
- **Geometria Chanfrada Automotiva (`btn-bevel-4`)**:
  Forma técnica octogonal simétrica chanfrada nos 4 cantos (`clip-path: polygon(...)`), inspirada na precisão de ferramentas de funilaria e corte automotivo, com cantos proporcionais (8px a 10px).
- **Profundidade & Sombra Mecânica**: Efeito sutil de extrusão (`box-shadow` e `drop-shadow`) com elevação no hover e compressão no active (`active:scale-[0.98]`).
- **Botão Magnético Opcional e Seguro**: Deslocamento físico suave restrito a dispositivos com ponteiro fino (`@media (hover: hover) and (pointer: fine)`), limitado a 4-6px por eixo, desativado sob touch e `prefers-reduced-motion`.
- **Formulário com Estados de Feedback Reais**: Estados `idle`, `submitting`, `success`, `error` com tratamento honesto dos canais reais (Instagram `@brsreparacoes` e telefone `(45) 2035-9440`).

---

## 3. Critérios de Aceitação (AC)

- [ ] **AC-021-01**: Sistema visual de botões em `src/components/ui/button.tsx` e `src/styles.css` com suporte a variantes `primary` (chanfrado dourado), `secondary` (contorno técnico escuro), `tertiary` (link/botão sutil), `automotive` e `compact`.
- [ ] **AC-021-02**: Geometria chanfrada técnica com 4 cantos (`btn-bevel-4`) implementada de forma acessível, sem cortar sombras nem anéis de foco (`:focus-visible`).
- [ ] **AC-021-03**: Componente reutilizável de microinteração magnética opcional (`src/components/ui/magnetic-button.tsx`) com detecção estrita de `pointer: fine`, limite de 4-6px e limpeza de listeners no unmount.
- [ ] **AC-021-04**: Padronização dos rótulos de CTAs em todas as rotas:
  - Eliminação de "Saiba mais", "Ver detalhes", "Clique aqui", "Ver mais".
  - Adoção de `SOLICITAR AVALIAÇÃO`, `CONHECER FUNILARIA`, `CONHECER A PINTURA`, `ENTENDER O MARTELINHO`, `VER OS TRABALHOS`, `CONHECER A BRS`.
- [ ] **AC-021-05**: Navbar desktop e mobile harmonizadas com a nova linguagem chanfrada e CTA de avaliação em destaque.
- [ ] **AC-021-06**: Formulário de contato (`src/components/brs/contact-form.tsx`) com máquina de estados clara (`idle`, `submitting`, `success`, `error`), validação inline acessível e prevenção de múltiplos cliques.
- [ ] **AC-021-07**: Altura de toque (touch target) >= 44px para botões primários e controles críticos.
- [ ] **AC-021-08**: Suíte de testes automatizados E2E com Playwright e unitários com Vitest validando hierarquia, acessibilidade e interações.
- [ ] **AC-021-09**: Quality Gates 100% aprovados (Vitest, Playwright, ESLint, Build Nitro SSR).
