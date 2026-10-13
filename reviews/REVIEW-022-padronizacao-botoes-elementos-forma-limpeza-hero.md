# REVIEW-022: Padronização Global de Botões, Elementos de Forma e Limpeza de Redundâncias no Hero

## Metadados

| Campo   | Valor                                             |
| ------- | ------------------------------------------------- |
| ID      | REVIEW-022                                        |
| SPEC    | SPEC-022                                          |
| TASK    | TASK-022-01                                       |
| Status  | Aprovado                                          |
| Data    | 2026-10-12                                        |
| Revisor | Senior Frontend Engineer & UI Designer EPMDEVTECH |

---

## 1. Resumo da Entrega

A **SPEC-022 / TASK-022-01** consolidou uma arquitetura visual refinada, de raio pequeno e alta precisão geométrica para a BRS Reparações Automotivas, eliminando definitivamente incongruências de formas, recortes por `clip-path` em botões, ruído textual e disputas de atenção comercial no Hero.

---

## 2. Escopo Implementado

1. **Tokens Normativos Únicos (Fonte Única de Verdade)**:
   - Configurados no `:root` e inline theme de `src/styles.css`:
     - `--radius-sm: 4px;` (botões e inputs)
     - `--radius-lg: 12px;` (menu flutuante, cards, imagens e painéis)
     - `--btn-h: 44px;` e `--btn-h-sm: 34px;`
     - `--btn-px: 20px;` e `--btn-px-sm: 14px;`
     - `--gold: #C8A96A;`, `--gold-hover: #D8BC82;`, `--on-gold: #16130B;`
     - `--line-light: rgb(255 255 255 / .28);`
     - `--ease: 200ms ease;`
2. **Componente Canônico de Botão (`.btn`)**:
   - Classe única `.btn` criada em `src/styles.css` e vinculada ao componente `Button` em `src/components/ui/button.tsx`.
   - `.btn--primary`: Fundo ouro champanhe `#C8A96A`, texto `#16130B`, borda `#C8A96A`, hover `#D8BC82`, com seta ↗ (16px) à direita.
   - `.btn--secondary`: Fundo escuro `#18181A`, texto branco, borda `rgb(255 255 255 / .28)`, hover com borda dourada e fundo dourado 10%. Sem ícone.
   - `.btn--link`: Texto dourado champanhe sem fundo nem borda, com seta → deslocando 4px no hover.
   - `.btn--sm`: 34px de altura, padding 14px, font-size 11px, exclusivo da cápsula flutuante.
   - Estados de foco com `:focus-visible: outline: 2px solid var(--gold); outline-offset: 2px;`, `:active: transform: translateY(1px);`, e acessibilidade para desabilitados.
   - Zero `clip-path` em botões (classes `.btn-bevel-4` e `.btn-bevel-4-sm` totalmente extintas).
3. **Limpeza do Hero & Hierarquia Comercial**:
   - Remoção completa do selo/tag genérico _"PRECISÃO NO REPARO • CUIDADO NO ATENDIMENTO"_ de `src/components/brs/hero.tsx` e `src/components/brs/animated-hero.tsx`, com ajuste do espaçamento vertical.
   - Remoção do CTA primário duplicado "Solicitar avaliação" no Hero, evitando disputa com o botão fixo do menu flutuante.
   - Manutenção exclusiva do botão secundário "Conhecer os serviços" (`.btn--secondary`, 44px) alinhado à esquerda sob a descrição.
   - No mobile (<768px), o botão secundário assume 100% de largura e altura de 48px.
4. **Menu Flutuante e Acesso Mobile**:
   - Cápsula flutuante migrada de `rounded-full` para `rounded-xl` (`var(--radius-lg)` = 12px).
   - CTA primário "Solicitar avaliação" no formato compacto (`.btn--sm`) visível diretamente no cabeçalho em telas menores, sem depender da abertura do menu hambúrguer.
   - Menu mobile aberto (`#mobile-nav`) atualizado para `var(--radius-lg)` (12px).
5. **Formulários, Cards e Imagens**:
   - `.field-input`: `border-radius: var(--radius-sm)` (4px), altura mínima de 44px, borda `var(--line-light)`, foco com outline dourado idêntico aos botões.
   - Todos os cards (`CardSpotlight`, `ProjectGallery`, comparativos de serviços, depoimentos, princípios e caixas de aviso) padronizados com `var(--radius-lg)` (12px).
   - Imagens e modais com `var(--radius-lg)` (12px).

---

## 3. Evidências de Validação

- **Vitest**: 19 suites de teste passaram, 132/132 testes aprovados (100%).
- **Playwright E2E**: 19 testes automatizados de ponta a ponta passaram (100%).
- **ESLint & Prettier**: 0 erros.
- **Build de Produção**: `bun run build` gerou artefatos estáticos e SSR Nitro com sucesso.

---

## 4. Conclusão

Todos os critérios de aceitação (AC-022-01 a AC-022-09) foram satisfeitos integralmente sem regressões funcionais ou visuais.
