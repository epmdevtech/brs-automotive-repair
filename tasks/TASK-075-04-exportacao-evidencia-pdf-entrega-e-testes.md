# TASK-075-04 — Exportação de evidência em PDF: entrega, segurança e testes

| Campo        | Valor                                              |
| ------------ | -------------------------------------------------- |
| ID           | TASK-075-04                                        |
| Status       | Done                                               |
| Data         | 2026-10-20                                         |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD)  |
| SPEC         | SPEC-075                                           |
| Critérios    | AC-075-01 a AC-075-06                              |
| Dependências | TASK-075-01 a TASK-075-03                           |

## Objetivo

Entregar a exportação da evidência do briefing em PDF pelo painel
administrativo, com geração no servidor, autorização verificada antes da
leitura, botão de download no detalhe do briefing e testes de regressão.

## Escopo

### Incluído

- Escritor de PDF sem dependência (`ADR-003`) e documento de evidência.
- Server Function `exportBriefingPdf` restrita ao papel `admin`.
- Botão "Baixar evidência (PDF)" no detalhe do briefing.
- Testes unitários do escritor, do documento, da autorização e E2E do
  download.
- Correção da renderização duplicada do aviso "Evidência gerada".

### Não incluído

- Dependência de biblioteca de PDF, Chromium no servidor, envio por e-mail,
  armazenamento de PDFs ou exportação pública.

## Abordagem e impacto

- Arquivos ou componentes prováveis: `src/features/briefing/server/pdf/`,
  `src/features/briefing/server/pdf-service.ts`,
  `src/features/briefing/server/functions.ts`,
  `src/features/briefing/ui/admin/briefing-admin-detail.tsx`,
  `src/test/briefing-pdf-spec075.test.ts`,
  `e2e/briefing-exportacao-pdf.spec.ts`.
- Dados, contratos ou migrações: leitura do registro já persistido; nenhuma
  alteração de esquema.
- Riscos e precauções: o documento é interno e declara que o envio não
  representa credenciamento; a exportação exige papel `admin`.
- ADRs e padrões aplicáveis: `ADR-003` (PDF sem dependência).

## Passos

- [x] Escritor de PDF e documento de evidência.
- [x] Server Function com `requireBriefingAdmin`.
- [x] Botão de download com estado de carregamento e erro honesto.
- [x] Testes unitários e E2E do download.
- [x] Correção do aviso duplicado no detalhe administrativo.

## Validação

| Critério/risco         | Teste, comando ou revisão                       | Evidência esperada                  |
| ---------------------- | ----------------------------------------------- | ----------------------------------- |
| AC-075-01 a AC-075-05  | `bunx vitest run src/test/briefing-pdf-spec075.test.ts` | Gerador e documento aprovados |
| Download pelo painel   | `bunx playwright test e2e/briefing-exportacao-pdf.spec.ts` | PDF válido baixado           |
| Qualidade              | `bun run lint`, `bun run test`, `bun run build`  | Zero erros e build concluído        |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.

## Resultado

- Mudanças realizadas: ver diff da branch `feature/master-briefing-ux`.
- Evidências: comandos de lint, teste, build e E2E executados.
- Pendências ou bloqueios: promoção a produção depende de autorização humana.
