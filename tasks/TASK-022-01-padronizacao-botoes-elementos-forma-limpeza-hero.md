# TASK: Padronização Global de Botões, Elementos de Forma e Limpeza de Redundâncias no Hero

## Metadados

| Campo        | Valor                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| ID           | TASK-022-01                                                                                       |
| Status       | Completed                                                                                         |
| Responsável  | Senior Frontend Engineer & UI Designer EPMDEVTECH                                                 |
| SPEC         | SPEC-022                                                                                          |
| Critérios    | AC-022-01, AC-022-02, AC-022-03, AC-022-04, AC-022-05, AC-022-06, AC-022-07, AC-022-08, AC-022-09 |
| Dependências | SPEC-022                                                                                          |

---

## Objetivo

Auditar e padronizar toda a geometria de interface da BRS Reparações Automotivas para uma linguagem visual de raio pequeno (4px e 12px), unificar a hierarquia de botões em um componente único (`.btn`, `.btn--primary`, `.btn--secondary`, `.btn--link`), eliminar clip-paths em botões, remover a redundância do CTA duplicado do Hero e expurgar o selo genérico de IA no topo da seção.

---

## Escopo

1. **Passo 1 (Auditoria Detalhada)**:
   - Identificação da stack e localização de tokens.
   - Mapeamento exato de todos os botões, inputs, cards e menu com arquivo e linha.
   - Levantamento de border-radius, clip-paths e cores divergentes.
   - Mapeamento de CTAs do site e detecção de duplicidades no mesmo viewport.
   - Localização de selos e tags decorativas.
2. **Passo 2 (Design Tokens Normativos)**:
   - Configuração de `--radius-sm: 4px`, `--radius-lg: 12px`, `--btn-h: 44px`, `--btn-h-sm: 34px`, `--gold: #C8A96A`, `--gold-hover: #D8BC82`, `--on-gold: #16130B`, `--line-light: rgb(255 255 255 / .28)` em `src/styles.css`.
3. **Passo 3 (Componente Canônico de Botão)**:
   - Refatoração de `src/components/ui/button.tsx` e classes `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--link`.
4. **Passo 4 (Limpeza do Hero & Hierarquia Comercial)**:
   - Remoção do CTA primário duplicado no Hero (`Solicitar avaliação`), mantendo exclusivamente o botão secundário `Conhecer os serviços` (44px) alinhado à esquerda.
   - Remoção do selo _"PRECISÃO NO REPARO • CUIDADO NO ATENDIMENTO"_ e reequilíbrio de espaçamento vertical.
   - Garantia de acesso direto ao CTA principal no mobile sem abrir menu hambúrguer.
5. **Passo 5 (Demais Elementos de Forma)**:
   - Menu flutuante com `border-radius: var(--radius-lg)` (12px).
   - Inputs, selects e textareas com `border-radius: var(--radius-sm)` (4px) e altura 44px.
   - Cards e imagens com `border-radius: var(--radius-lg)` (12px).
   - Remoção definitiva de `clip-path` em botões e containers.
6. **Passo 6 (Quality Gates e Testes)**:
   - Atualização das suítes de teste Vitest e Playwright para validar a nova geometria e ausência do selo.
   - Validação de 100% dos testes, lint e build.

---

## Critérios de Aceitação

- [x] **AC-022-01**: Auditoria detalhada executada e documentada com precisão de arquivos e linhas.
- [x] **AC-022-02**: Tokens globais de raios, alturas e cores registrados como fonte única de verdade.
- [x] **AC-022-03**: Componente único de botão com variantes `.btn--primary`, `.btn--secondary`, `.btn--link` e estados de acessibilidade.
- [x] **AC-022-04**: Hero enxuto sem selo e com botão secundário único, sem repetição do CTA do menu.
- [x] **AC-022-05**: Menu flutuante em raio de 12px com CTA primário acessível no mobile sem abrir hambúrguer.
- [x] **AC-022-06**: Inputs, selects e textareas com raio de 4px e altura 44px.
- [x] **AC-022-07**: Cards e imagens padronizados com raio de 12px.
- [x] **AC-022-08**: Eliminação total de `clip-path` em botões e containers.
- [x] **AC-022-09**: Quality gates (Vitest, Playwright, ESLint, Vite/Nitro SSR Build) 100% aprovados.
