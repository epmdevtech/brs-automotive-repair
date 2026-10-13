# TASK-030-01 — Implementação dos Serviços de Estética Automotiva, Vitrificação, Espelhamento e Polimento de Para-brisa

## Metadados

| Campo       | Valor                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| ID          | `TASK-030-01`                                                                                                      |
| Status      | Completed (Concluído)                                                                                              |
| Responsável | Software Architect & Staff Frontend Engineer EPM DevTech                                                           |
| Refs:       | SPEC: [`SPEC-030`](../specs/SPEC-030-servicos-estetica-automotiva-acabamento.md); Critérios: AC-030-01 a AC-030-07 |

---

## 1. Objetivo

Implementar os novos serviços captados para a BRS Reparações Automotivas (Espelhamento de Pintura, Vitrificação Cerâmica e Polimento de Para-brisa) como linha de **Estética Automotiva & Proteção**, enriquecendo a fonte única de verdade em `src/lib/brs.ts`, a rota `/servicos`, a seção de serviços da Home, o formulário de contato e os esquemas de SEO, validando com testes e Quality Gates.

---

## 2. Checklist de Execução

- [x] **Etapa 1**: Expansão de `src/lib/brs.ts` com a interface `AestheticServiceDetail`, a constante `aestheticServices` e `allOfferedServices`.
- [x] **Etapa 2**: Atualização de `src/routes/servicos/index.tsx` com a seção nobre de Estética Automotiva & Proteção de Superfícies.
- [x] **Etapa 3**: Atualização de `src/components/brs/services.tsx` com chamada editorial e direcionamento para os serviços de estética.
- [x] **Etapa 4**: Atualização de `src/components/brs/contact-form.tsx` permitindo seleção de qualquer um dos 6 serviços no formulário.
- [x] **Etapa 5**: Atualização de `src/lib/seo.ts` com metadados e schema atualizados.
- [x] **Etapa 6**: Suíte de testes unitários (`src/test/brs.test.ts`) cobrindo as novas regras de negócio e serviços estéticos.
- [x] **Etapa 7**: Quality Gates (Vitest 174/174 passed, ESLint 0 erros, Vite+Nitro build 100%, Playwright E2E 100%).
- [x] **Etapa 8**: Conclusão da tarefa, emissão de `REVIEW-030` e sincronização de `PROJECT.md` e `CHANGELOG.md`.
