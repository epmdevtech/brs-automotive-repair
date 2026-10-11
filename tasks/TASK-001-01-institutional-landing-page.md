# TASK: Implementação da Landing Page Institucional BRS & Governança SDD

## Metadados

| Campo        | Valor                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| ID           | TASK-001-01                                                                 |
| Status       | Done                                                                        |
| Responsável  | Engenharia EPMDEVTECH                                                       |
| SPEC         | SPEC-001                                                                    |
| Critérios    | AC-001-01, AC-001-02, AC-001-03, AC-001-04, AC-001-05, AC-001-06, AC-001-07 |
| Dependências | N/A                                                                         |

---

## Objetivo

Implementar a landing page institucional completa da BRS Reparações Automotivas com design tokens temáticos automotivos, navegação ancorada, regras comerciais centralizadas em `src/lib/brs.ts`, formulário honesto com cópia de mensagem para o canal do Instagram, testes automatizados e configuração de porta local estrita na porta `5210`.

---

## Escopo

### Incluído

- Componente `Website` e subcomponentes em `src/components/brs/website.tsx`.
- Centralização de regras e validações em `src/lib/brs.ts`.
- Rotas TanStack Start em `src/routes/` (`__root.tsx`, `index.tsx`).
- Estilos e tokens em `src/styles.css`.
- Testes automatizados em `src/test/brs.test.ts` e `src/test/app-routing.test.tsx`.
- Configuração estrita de porta local `5210` e proxy `http://brs.localhost`.

### Não incluído

- Backend próprio ou integração com WhatsApp não homologado.

---

## Validação

| Critério/risco         | Teste, comando ou revisão | Evidência esperada                            |
| ---------------------- | ------------------------- | --------------------------------------------- |
| AC-001-01 a AC-001-05  | `bun test`                | 7 testes passando com 100% de sucesso         |
| Padronização de código | `bun run lint`            | 0 erros ESLint e formatação Prettier          |
| Compilação e Bundling  | `bun run build`           | Build Nitro SSR e assets estáticos concluídos |
| Alocação de Porta      | `vite.config.ts`          | Porta estrita 5210                            |

---

## Condição de conclusão

- [x] Escopo implementado sem expansão não documentada.
- [x] Testes unitários e build passam integralmente.
- [x] Documentação e rastreabilidade sincronizadas.
- [x] Pré-requisitos de fotos reais e WhatsApp registrados em `ROADMAP.md`.
