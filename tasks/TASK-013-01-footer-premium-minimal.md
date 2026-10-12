# TASK: Implementar Footer Premium Minimal BRS

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-013-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia Front-end EPMDEVTECH                                  |
| SPEC         | SPEC-013                                                         |
| Critérios    | AC-013-01, AC-013-02, AC-013-03, AC-013-04, AC-013-05, AC-013-06 |
| Dependências | SPEC-013                                                         |

---

## Objetivo

Implementar o componente `MinimalFooter` inspirado na referência 21st.dev adaptado ao design system da BRS Reparações Automotivas, integrando-o ao layout como footer definitivo único e validando acessibilidade, links reais e ano dinâmico.

---

## Escopo

### Incluído

- Implementar `src/components/ui/minimal-footer.tsx` com layout responsivo (desktop multi-colunas e mobile empilhado).
- Reutilizar dados centralizados em `src/lib/brs.ts` (`company`, `navigation`, `services`).
- Incluir marca institucional `<Brand />` e texto institucional da BRS.
- Configurar links reais para as âncoras da página e canais oficiais confirmados (Instagram e Telefone fixo).
- Incluir ano dinâmico no copyright e nota de conformidade fotográfica.
- Refatorar `src/components/brs/footer.tsx` para consumir e exportar `MinimalFooter` sem duplicação de footers.
- Criar a suíte de testes `src/test/minimal-footer.test.tsx`.
- Validar via `make check`.

### Não incluído

- Adição de redes sociais não confirmadas ou rotas inexistentes.

---

## Validação

| Critério/risco | Teste, comando ou revisão       | Evidência esperada                                             |
| -------------- | ------------------------------- | -------------------------------------------------------------- |
| AC-013-01      | Inspeção do DOM da Landing Page | Exatamente um footer renderizado                               |
| AC-013-02      | Inspeção textual de marca       | Presença da marca BRS e texto institucional oficial            |
| AC-013-03      | Inspeção de links de navegação  | Apenas âncoras válidas (`#inicio`, `#servicos`, etc.)          |
| AC-013-04      | Inspeção de redes e contato     | Apenas Instagram oficial e telefone `tel:`, sem WhatsApp falso |
| AC-013-05      | Inspeção do ano no copyright    | Ano atual exibido dinamicamente                                |
| AC-013-06      | `make check`                    | Vitest, ESLint, TypeScript e Build 100% aprovados              |

---

## Condição de conclusão

- [x] `src/components/ui/minimal-footer.tsx` criado e estilizado.
- [x] `src/components/brs/footer.tsx` integrado com `MinimalFooter`.
- [x] Links, canais e ano dinâmico validados.
- [x] Suíte de testes `src/test/minimal-footer.test.tsx` criada e aprovada.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-013` criado e aprovado.
