# SPEC-029 — Refatoração Canônica: Website Multipágina com Arquitetura de Rotas Dedicadas

## Metadados

| Campo     | Valor                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------- |
| ID        | `SPEC-029`                                                                                           |
| Título    | Refatoração Canônica: Website Multipágina com Arquitetura de Rotas Dedicadas (TanStack Router)       |
| Status    | Approved                                                                                             |
| Autor     | Staff Software Architect & Lead Frontend Engineer EPM DevTech                                        |
| Data      | 13/10/2026                                                                                           |
| Motivação | Diretiva humana mandatória: o projeto BRS é um website multipágina com rotas reais, não landing page |

---

## 1. Contexto e Justificativa

O projeto da **BRS Reparações Automotivas** é uma plataforma digital multipágina completa estruturada em **TanStack Start** e **TanStack Router**, dotada de rotas canônicas profundas e independentes:

- `/` — Início (visão executiva, contextualização e roteamento para as áreas);
- `/servicos` — Catálogo geral de especialidades técnicas;
- `/servicos/funilaria` — Rota especializada dedicada à Funilaria Automotiva;
- `/servicos/pintura-automotiva` — Rota especializada dedicada à Pintura em Estufa e Colorimetria;
- `/servicos/martelinho-de-ouro` — Rota especializada dedicada ao Martelinho de Ouro (PDR);
- `/trabalhos` — Rota de Portfólio, Galeria e Comparador Interativo Antes/Depois;
- `/para-corretores` — Rota exclusiva para Corretores de Seguros e Gestão de Sinistros;
- `/sobre` — Rota Institucional sobre a oficina, equipe e rigor técnico;
- `/contato` — Rota dedicada para avaliação técnica e agendamento de orçamento;
- `/privacidade` — Rota de políticas e conformidade legal;
- `/proposta/$slug` — Rota de Proposta Comercial personalizada.

Entretanto, remanesciam no repositório contratos conceituais históricos que faziam menção a "landing page institucional" ou "página única ancorada". Por instrução humana expressa, todas as diretrizes arquiteturais, regras de agentes, especificações comerciais do módulo **EPM Web** e testes do projeto foram refatorados para afirmar e proteger o projeto como um **Website Institucional Multipágina Completo com Arquitetura de Rotas Dedicadas**.

---

## 2. Requisitos e Critérios de Aceite

- [x] **AC-029-01**: Atualização do [`AGENTS.md`](../AGENTS.md) removendo a diretriz obsoleta de página única ancorada e instituindo como regra obrigatória a concepção do projeto como **Website Multipágina com Rotas Especializadas**.
- [x] **AC-029-02**: Atualização do [`PROJECT.md`](../PROJECT.md) registrando a arquitetura multipágina com rotas em `TanStack Router` e eliminando referências a landing page.
- [x] **AC-029-03**: Refatoração do módulo de domínio comercial [`src/lib/proposta.ts`](../src/lib/proposta.ts):
  - No módulo **EPM Web**: detalhamento dos entregáveis das 10 rotas especializadas independentes;
  - Nos pacotes sugeridos (`bundles`): atualização de todas as menções para website multipágina;
  - Na FAQ e escopos: explicitação de que o cliente recebe um website multipágina autônomo com URLs próprias;
  - Na proposta piloto: atualização de `Landing Page Institucional` para `Website Institucional Multipágina & Arquitetura de Rotas`.
- [x] **AC-029-04**: Atualização de suítes de testes unitários e de integração (`src/test/proposta-route.test.tsx`, `src/test/header.test.tsx`, `src/test/proposta.test.ts`).
- [x] **AC-029-05**: Validação integral com 100% de aprovação nos Quality Gates automáticos (Vitest, ESLint, Vite+Nitro build, Playwright E2E).
