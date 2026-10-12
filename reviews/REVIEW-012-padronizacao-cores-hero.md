# REVIEW: Padronização das Cores de Tipografia e Botões da Seção Hero

## Metadados

| Campo   | Valor                                          |
| ------- | ---------------------------------------------- |
| ID      | REVIEW-012                                     |
| SPEC    | SPEC-012                                       |
| TASK    | TASK-012-01                                    |
| Status  | Approved                                       |
| Revisor | Antigravity AI (Pair Programming) / EPMDEVTECH |
| Data    | 2026-10-11                                     |

---

## 1. Resumo da Mudança

Atendimento rigoroso ao alinhamento cromático da seção Hero com a paleta e os design tokens canônicos da BRS Reparações Automotivas:

1. **Título Principal (H1)**:
   - `"BRS Reparações"`: Mantido em `text-white font-semibold`.
   - `"Automotivas."`: Substituído de `text-amber-500` pelo design token canônico `text-primary font-semibold`, garantindo 100% de coerência com os títulos das seções seguintes (ex.: `"cuidado em cada etapa."` em `Philosophy`).
2. **Badge Superior (Overline)**:
   - Substituídos os tons alaranjados de `amber-500` por tokens primários refinados: `border-primary/20 bg-primary/10`, ponto `bg-primary animate-pulse` e tipografia `text-primary`.
3. **Subtítulo / Descrição**:
   - Atualizado para a escala editorial de cinza dos parágrafos da landing page (`text-neutral-400`).
4. **Botão Primário ("Solicitar avaliação")**:
   - Sincronizado integralmente entre a Hero e a Navbar (Header) utilizando o token oficial `bg-primary text-primary-foreground hover:bg-primary/90` com sombra sutil `shadow-primary/10` e feedback tátil `active:scale-[0.98]`.
5. **Botão Secundário ("Conhecer os serviços")**:
   - Alinhado à estética dark do projeto: `border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-white hover:bg-neutral-800 backdrop-blur-xs`.
6. **Suíte de Testes Automatizada**:
   - Criado `src/test/hero-colors.test.tsx` com 5 testes cobrindo conformidade do H1, badge, descrição, equivalência de tokens entre Hero e Header CTA e botão secundário dark.

---

## 2. Verificação de Critérios de Aceitação

| Critério  | Descrição                                                                         | Status   | Evidência                                                                            |
| --------- | --------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| AC-012-01 | `"Automotivas."` no H1 utiliza `text-primary`, correspondendo aos títulos do site | Aprovado | Validado em `hero.tsx`, `animated-hero.tsx` e `hero-colors.test.tsx`                 |
| AC-012-02 | Badge overline utiliza `text-primary`, `border-primary/20`, `bg-primary/10`       | Aprovado | Validado em `hero-colors.test.tsx` e inspeção visual                                 |
| AC-012-03 | Descrição da Hero utiliza `text-neutral-400`                                      | Aprovado | Aplicado no parágrafo e testado                                                      |
| AC-012-04 | Botão primário da Hero e CTA do Header idênticos em `bg-primary` e hover          | Aprovado | Classes idênticas validadas no teste comparativo                                     |
| AC-012-05 | Botão secundário possui borda `neutral-800`, fundo `neutral-900/60` e hover claro | Aprovado | Estilo dark refinado aplicado e validado                                             |
| AC-012-06 | Quality gates 100% aprovados (`make check`)                                       | Aprovado | 57 testes Vitest aprovados, 0 erros ESLint, build SSR Nitro compilado com 100% êxito |

---

## 3. Quality Gates e Evidências

- **Vitest**: 57 testes aprovados em 12 arquivos (100% de aprovação).
- **ESLint / Prettier**: 0 erros (`bun run lint`).
- **Build de Produção**: Vite + Nitro SSR compilados com 100% de sucesso (`bun run build`).
- **Rastreabilidade**: Gerada com sucesso em `docs/traceability-matrix.md`.

---

## 4. Conclusão

Revisão técnica aprovada sem ressalvas. As cores da Hero estão 100% harmonizadas com o restante do site.
