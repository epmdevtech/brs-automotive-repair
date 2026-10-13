# SPEC-022: Padronização Global de Botões, Elementos de Forma e Limpeza de Redundâncias no Hero

## Metadados

| Campo   | Valor                                                                    |
| ------- | ------------------------------------------------------------------------ |
| ID      | SPEC-022                                                                 |
| Título  | Padronização de Botões, Elementos de Forma e Limpeza do Hero             |
| Status  | Implementada                                                             |
| Autor   | Senior Frontend Engineer & UI Designer EPMDEVTECH                        |
| Data    | 2026-10-12                                                               |
| Módulos | `src/styles.css`, `src/components/ui/button.tsx`, `animated-hero.tsx`... |

---

## 1. Problema e Justificativa

O site da **BRS Reparações Automotivas** consolidou sua arquitetura multipágina e motion design, mas apresenta inconsistências pontuais de linguagem geométrica e hierarquia de interface:

1. **Conflito de Formas Geométricas**: Coexistência de menu flutuante em pílula (`rounded-full`), botões com chanfros poligonais (`clip-path`), cards com raios arbitrários (`rounded-sm` de 2px a `rounded-xl` de 12px) e inputs com raio de 3px.
2. **Baixo Contraste do Botão Secundário**: O botão secundário sobre o fundo escuro sofria perda de legibilidade em determinados monitores e o recorte do `clip-path` anulava contornos e sombras nativas.
3. **Redundância Crítica de CTAs no Hero**: O Hero exibe simultaneamente no mesmo viewport o botão primário "Solicitar avaliação" (para `/contato`), enquanto o menu flutuante superior já mantém o mesmo CTA visível e fixo na tela.
4. **Ruído Textual no Hero**: Acima do título principal existe um selo/tag genérico com a frase _"PRECISÃO NO REPARO • CUIDADO NO ATENDIMENTO"_, que não agrega valor informativo específico e quebra a limpeza do bloco nobre.

---

## 2. Objetivos

1. Estabelecer **dois raios únicos normativos** em todo o site:
   - `var(--radius-sm): 4px` para botões e inputs/selects/textareas.
   - `var(--radius-lg): 12px` para menu flutuante, cards e imagens.
2. Eliminar completamente `clip-path` em botões e elementos de interface.
3. Centralizar todos os botões no componente canônico `Button` / classe `.btn`, com variantes estritas:
   - `.btn--primary`: Fundo dourado champanhe (`#C8A96A`), texto preto `#16130B`, borda `#C8A96A`, seta ↗ fixa à direita.
   - `.btn--secondary`: Fundo `#18181A`, texto branco/claro, borda `rgb(255 255 255 / 0.28)`, hover dourado com 10% opacidade.
   - `.btn--link`: Texto dourado champanhe com seta → deslocando 4px no hover.
4. Tamanhos normatizados: padrão 44px e compacto `.btn--sm` (34px, específico do menu).
5. Eliminar o CTA duplicado "Solicitar avaliação" do Hero, deixando apenas o botão secundário "Conhecer os serviços" (44px) sob o texto.
6. Remover por completo o selo genérico _"PRECISÃO NO REPARO • CUIDADO NO ATENDIMENTO"_ do Hero, ajustando o espaçamento vertical para composição enxuta (Título, Descrição e 1 Botão).
7. Garantir que no mobile o CTA principal permaneça acessível sem depender da abertura do menu hambúrguer.

---

## 3. Critérios de Aceitação

- **AC-022-01 (Auditoria Completa)**: Realizar e documentar a auditoria minuciosa da stack, de todos os botões, links, inputs, cards, raios, clip-paths e duplicidades.
- **AC-022-02 (Design Tokens Normativos)**: Inserir e centralizar `--radius-sm: 4px`, `--radius-lg: 12px`, `--btn-h: 44px`, `--btn-h-sm: 34px`, `--gold: #C8A96A`, `--gold-hover: #D8BC82`, `--on-gold: #16130B`, `--line-light: rgb(255 255 255 / .28)` em `src/styles.css`.
- **AC-022-03 (Componente Canônico de Botão)**: Padronizar `Button` com `.btn`, variantes `.btn--primary`, `.btn--secondary`, `.btn--link`, estados `:hover`, `:focus-visible`, `:active`, `disabled` e touch target mínimo de 44px.
- **AC-022-04 (Limpeza do Hero)**: Hero exibe exclusivamente o título, a descrição e o botão secundário "Conhecer os serviços" alinhado à esquerda. Selo/tag eliminado sem sobras de markup ou espaçamentos espúrios.
- **AC-022-05 (Menu Flutuante e Mobile)**: Cápsula flutuante migrada de `rounded-full` para `border-radius: var(--radius-lg)` (12px), mantendo CTA primário compacto `.btn--sm` acessível no mobile sem abrir hambúrguer.
- **AC-022-06 (Inputs, Selects e Textareas)**: Todos os campos de formulário utilizam `border-radius: var(--radius-sm)` (4px) e altura mínima de 44px.
- **AC-022-07 (Cards e Imagens)**: Todos os cards e containers de mídia adotam `border-radius: var(--radius-lg)` (12px).
- **AC-022-08 (Extinção de Clip-path)**: Zero `clip-path` em botões ou superfícies de interface.
- **AC-022-09 (Quality Gates & Regressão)**: 100% de aprovação em Vitest, Playwright E2E, ESLint e build de produção.
