# SPEC-031 — Dados Cadastrais, Governança Institucional e Histórico do Fundador Bruno

## Metadados

| Campo        | Valor                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-031`                                                                                                          |
| Título       | Integração de Dados Cadastrais Oficiais (Razão Social, CNPJ, Fundação) e Histórico de Experiência do Fundador Bruno |
| Data Criação | 2026-10-13                                                                                                          |
| Status       | Approved (Aprovada)                                                                                                 |
| Autor        | Software Architect & Product Strategist EPM DevTech                                                                 |
| Prioridade   | Alta (P0)                                                                                                           |
| Impacto      | Institucional, Legal/LGPD, SEO Local, Credibilidade de Marca, Rodapé, Página Sobre                                  |

---

## 1. Contexto e Motivação

O cliente forneceu os dados de registro oficial e referência corporativa da empresa:

- **Razão Social**: `Brs Comercio de Pecas Automotivas LTDA`
- **Nome Fantasia**: `Brs Comercio de Pecas Automotivas`
- **CNPJ**: `53.877.400/0001-46` (sem pontuação: `53877400000146`)
- **Data de Fundação Formal**: `09/02/2024`
- **Fundador & Liderança Técnica**: **Bruno**, atuando no segmento de peças, funilaria e reparação automotiva há vários anos.

Apresentar esses dados confere:

1. **Transparência Legal e Fiscal**: O CNPJ ativo e a razão social oficial no rodapé e na página de privacidade asseguram conformidade com as boas práticas comerciais e a LGPD.
2. **Autoridade e Credibilidade Técnica**: O histórico do fundador Bruno no setor automotivo demonstra que, muito embora a personalidade jurídica tenha sido formalizada em 09/02/2024, a experiência prática, precisão operacional e reputação no segmento já possuem anos de consolidação.
3. **SEO Estruturado**: Atributos como `legalName`, `taxID`, `foundingDate` e `founder` fortalecem a entidade `AutoBodyShop` perante mecanismos de busca e inteligências artificiais de resposta (LLMs).

---

## 2. Requisitos e Critérios de Aceite

- **AC-031-01 (Fonte Única de Verdade em `src/lib/brs.ts`)**:
  - `company` deve conter:
    - `legalName: "Brs Comercio de Pecas Automotivas LTDA"`
    - `tradeName: "Brs Comercio de Pecas Automotivas"`
    - `cnpj: "53.877.400/0001-46"`
    - `cnpjRaw: "53877400000146"`
    - `foundedDate: "2024-02-09"`
    - `foundedFormatted: "09/02/2024"`
    - `founder: { name: "Bruno", role: "Fundador e Especialista Técnico", experienceYearsText: "Anos de experiência consolidada no segmento automotivo", ... }`
- **AC-031-02 (Rodapé Institucional)**:
  - `MinimalFooter` (`src/components/ui/minimal-footer.tsx`) deve exibir discretamente a razão social e o CNPJ formatado no rodapé inferior.
- **AC-031-03 (Página Institucional "A BRS" - `/sobre`)**:
  - Apresentar a liderança de Bruno, contextualizando que a abertura formal da empresa em 2024 une anos de experiência prática e especialização do fundador no setor de funilaria, pintura e comércio de peças automotivas.
- **AC-031-04 (Página de Privacidade - `/privacidade`)**:
  - Identificar a controladora de dados com a razão social `Brs Comercio de Pecas Automotivas LTDA` e o CNPJ `53.877.400/0001-46`.
- **AC-031-05 (SEO e Schemas Estruturados - `src/lib/seo.ts`)**:
  - `buildAutoBodyShopSchema()` deve incorporar `legalName`, `taxID: "53877400000146"`, `foundingDate: "2024-02-09"` e `founder: { "@type": "Person", "name": "Bruno" }`.
- **AC-031-06 (Testes e Quality Gates)**:
  - Testes unitários em `src/test/brs.test.ts` e de SEO/rodapé devem cobrir os novos campos.
  - Vitest, Lint, Build e Playwright devem passar com 100% de sucesso.
