# TASK-079-01 — Proposta Comercial Modular Master em Rota Dedicada

## Metadados

| Campo        | Valor                                             |
| ------------ | ------------------------------------------------- |
| ID           | TASK-079-01                                       |
| Status       | Completed                                         |
| Data         | 2026-10-26                                        |
| Responsável  | Senior Frontend / UX/UI & EPM DevTech             |
| SPEC         | SPEC-079                                          |
| Critérios    | AC-079-01 a AC-079-08                             |
| Dependências | SPEC-027, SPEC-028, SPEC-071                      |

## Objetivo

Entregar `/proposta/masterchapeacao` como a proposta comercial modular da Master
Chapeação e Pinturas, contendo o catálogo de 6 produtos automotivos, combinações
calculadas dinamicamente, matriz comparativa, custos externos segregados,
condições comerciais, 9 etapas de projeto, FAQ e CTA honesto com canal
confirmado da EPM DevTech.

## Escopo

### Incluído

- Modelagem tipada de `ProposalModule` e `ModuleBundle` com centavos inteiros (`implementationPriceCents`), `priceType` e categorização.
- Objeto canônico `masterChapeacaoProposal` configurado com `isModularPortfolio: true`, logo oficial `/master/logo.webp`, dados da Master e canal confirmado de e-mail.
- Rota estática `src/routes/proposta/masterchapeacao.tsx` com `noindex, nofollow`.
- Atualização de componentes da proposta (`ProposalModulesCatalog`, `ProposalComparisonMatrix`, `ProposalBundles`, `ProposalModularAcceptance`, `ProposalView`, `ProposalNav`).
- Botão principal "Tenho interesse nesta proposta" e secundário "Quero esclarecer uma dúvida".
- Testes rigorosos cobrindo os 8 critérios de aceitação.
- Quality gates e documentação SDD sincronizada.

### Excluído

- Alterar dados da proposta BRS original (`master-digital-presence`).
- Criar agendamento real, backend ou CRM nesta rota comercial.
- Inventar contatos telefônicos ou WhatsApp não confirmados.
- Menus públicos ou sitemap.

## Etapas

- [x] Registrar SPEC-079 e TASK-079-01 atualizadas.
- [x] Atualizar tipagem e catálogo dos 6 módulos e combinações em `src/lib/proposta.ts`.
- [x] Implementar `masterChapeacaoProposal` modular em `src/lib/proposta.ts`.
- [x] Ajustar componentes visuais (`ProposalModulesCatalog`, `ProposalComparisonMatrix`, `ProposalModularAcceptance`, `ProposalView`, `ProposalNav`).
- [x] Adicionar testes de rota, catálogo, cálculos em centavos, combinações, isolamento e CTA em `src/test/proposta-masterchapeacao.test.tsx`.
- [x] Executar quality gates: `bun run lint`, `bun run test`, `bun run build`.
- [x] Atualizar `CHANGELOG.md`, `PROJECT.md` e gerar matriz de rastreabilidade.

## Validação

| Critério/risco       | Teste, comando ou revisão                                | Evidência esperada                         |
| -------------------- | -------------------------------------------------------- | ------------------------------------------ |
| AC-079-01, AC-079-02 | `bun run test src/test/proposta-masterchapeacao.test.tsx` | Rota dedicada e identidade Master intactas |
| AC-079-03, AC-079-04 | Teste automatizado de catálogo e totais em centavos      | 6 módulos e combinações corretas           |
| AC-079-05, AC-079-06 | Inspeção de custos e matriz comparativa                  | Segregação e responsividade OK             |
| AC-079-07            | Teste do diálogo de manifestação e envio por e-mail      | Sem falsos envios ou contatos fictícios    |
| AC-079-08            | `bun run lint`, `bun run test`, `bun run build`           | Quality gates 100% verdes                  |

## Resultado

- **Escopo implementado**:
  - Catálogo central dos 6 módulos em centavos inteiros (`implementationPriceCents`):
    - EPM Web: R$ 2.490,00 (249000 centavos) — produto de entrada
    - EPM Booking Auto: R$ 3.990,00 (399000 centavos) — primeira evolução sugerida
    - EPM CRM Auto: R$ 4.990,00 (499000 centavos)
    - EPM Oficina: R$ 7.490,00 (749000 centavos)
    - EPM Connect: A partir de R$ 1.990,00 (199000 centavos, `priceType: 'from'`)
    - EPM Insights: R$ 2.490,00 (249000 centavos)
  - 5 combinações calculadas dinamicamente: 249000, 648000, 748000, 1896000 e 2344000 centavos.
  - Custos recorrentes segregados: domínio, hospedagem, storage, mensageria, e-mail, suporte sob demanda e integrações.
  - Rota estática `/proposta/masterchapeacao` renderizando a proposta modular completa com `noindex, nofollow` e logo oficial `/master/logo.webp`.
  - Botão principal "Tenho interesse nesta proposta", botão secundário "Quero esclarecer uma dúvida", e e-mail confirmado `contato@epmdevtech.com.br`.
- **Evidências de validação**:
  - `bun run test`: 68 arquivos de teste passaram, 553 testes aprovados (100% sucesso).
  - `bun run lint`: 0 erros ESLint + Prettier.
  - `bun run build`: build Vite + Nitro SSR compilado com sucesso.
  - `python3 scripts/generate_traceability.py`: matriz atualizada.
