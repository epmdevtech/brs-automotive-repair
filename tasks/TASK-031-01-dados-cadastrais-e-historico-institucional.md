# TASK-031-01 — Integração de Dados Cadastrais (Razão Social, CNPJ, Fundação) e Histórico do Fundador Bruno

## Metadados

| Campo       | Valor                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| ID          | `TASK-031-01`                                                                                                         |
| Status      | Completed (Concluído)                                                                                                 |
| Responsável | Staff Frontend Engineer & Product Strategist EPM DevTech                                                              |
| Refs:       | SPEC: [`SPEC-031`](../specs/SPEC-031-dados-cadastrais-e-historico-institucional.md); Critérios: AC-031-01 a AC-031-06 |

---

## 1. Objetivo

Implementar os dados cadastrais oficiais e a narrativa de experiência do fundador Bruno no projeto da BRS Reparações Automotivas:

- Razão Social: `Brs Comercio de Pecas Automotivas LTDA`
- Nome Fantasia: `Brs Comercio de Pecas Automotivas`
- CNPJ: `53.877.400/0001-46`
- Fundação: `09/02/2024`
- Fundador: Bruno (anos de atuação prática no segmento automotivo)

---

## 2. Checklist de Execução

- [x] **Etapa 1**: Atualizar `src/lib/brs.ts` com os novos campos de `company` (legalName, tradeName, cnpj, foundedDate, founder).
- [x] **Etapa 2**: Atualizar `src/components/ui/minimal-footer.tsx` exibindo a razão social e o CNPJ.
- [x] **Etapa 3**: Atualizar `src/routes/sobre.tsx` incorporando a seção de liderança do fundador Bruno e o histórico institucional.
- [x] **Etapa 4**: Atualizar `src/routes/privacidade.tsx` com a identificação da controladora jurídica e CNPJ.
- [x] **Etapa 5**: Atualizar `src/lib/seo.ts` com schema enriquecido (`legalName`, `taxID`, `foundingDate`, `founder`).
- [x] **Etapa 6**: Atualizar testes unitários (`src/test/brs.test.ts` e `src/test/minimal-footer.test.tsx`).
- [x] **Etapa 7**: Validar Quality Gates (`bun run test` 175/175 passed, `bun run lint` 0 erros, `bun run build` 100%).
- [x] **Etapa 8**: Emitir `REVIEW-031` e sincronizar `PROJECT.md` e `CHANGELOG.md`.
