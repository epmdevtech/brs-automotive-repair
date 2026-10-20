# REVIEW-071 — Nova Proposta MASTER Chapeação e Pinturas

| Campo     | Valor                                                                 |
| --------- | --------------------------------------------------------------------- |
| ID        | `REVIEW-071`                                                          |
| SPEC/TASK | `SPEC-071` / `TASK-071-01`                                            |
| Status    | Approved                                                              |
| Data      | 2026-10-20                                                            |
| Revisor   | Senior Full Stack / UX-UI Engineer (Universal SDD)                    |
| Evidências | `bun run lint`, `bun run test`, `bun run build`, inspeção local       |

---

## 1. Sumário

O rebranding para MASTER Chapeação e Pinturas foi concluído sobre a arquitetura multipágina existente, sem novas rotas ou integrações. A identidade passou a usar a logo oficial, fotos reais da operação e a paleta preta, vermelha e branca extraída da logo, eliminando o dourado herdado da demonstração BRS.

## 2. Escopo Verificado

- `src/lib/brs.ts` com dados oficiais da MASTER (Av. Maripá, 4138 — Centro, Toledo-PR; `(45) 99954-5442`; horários 08h-12h e 13h30-18h30).
- Logo oficial, favicons, ícones de manifest e imagem Open Graph em `public/master/` e `public/`.
- Hero com variantes AVIF/WebP responsivas e foto real da estufa.
- Fotos reais aplicadas em serviços, sobre, contato e guincho; PDR e pares antes/depois mantidos como ilustrativos e identificados.
- Paleta `--brand-primary` (`#e01b24`) e `--brand-text-accent` (`#f26b6f`) aplicada em componentes, rotas administrativas e proposta comercial.
- `DESIGN.md` e `PROJECT.md` sincronizados com a nova paleta.

## 3. Critérios de Aceite

| Critério   | Verificação                                          | Resultado |
| ---------- | ---------------------------------------------------- | --------- |
| AC-071-01  | Identidade MASTER nas páginas públicas               | Atendido  |
| AC-071-02  | Logo e favicons sem distorção                        | Atendido  |
| AC-071-03  | Fotos reais apenas em contexto compatível            | Atendido  |
| AC-071-04  | Contato, horários e JSON-LD atualizados              | Atendido  |
| AC-071-05  | Semântica de imagens e build de produção             | Atendido  |
| AC-071-06  | Nenhum push, merge, deploy ou alteração de DNS       | Atendido  |

## 4. Evidências de Validação

| Gate            | Comando         | Resultado                                                        |
| --------------- | --------------- | ---------------------------------------------------------------- |
| Lint            | `bun run lint`  | 0 erros; 7 warnings pré-existentes de `react-refresh`            |
| Testes          | `bun run test`  | 57 arquivos e 420 testes aprovados                               |
| Build           | `bun run build` | Concluído sem erros (`✓ built in 2.71s`)                         |
| Busca de resíduo | `grep` em `src/` | Sem referências visuais a dourado, BRS, Bruno ou telefone antigo |

## 5. Riscos e Pendências

- Pares reais de antes/depois e imagens de PDR não foram fornecidos; permanecem ilustrativos e rotulados.
- As alterações estão no working tree, sem commit, push ou merge.
- A validação visual em navegador real permanece recomendada antes da publicação.
