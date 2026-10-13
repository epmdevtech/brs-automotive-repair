# SPEC-030 — Incorporação dos Serviços de Estética Automotiva, Proteção e Acabamento

## Metadados

| Campo     | Valor                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------- |
| ID        | `SPEC-030`                                                                                                |
| Título    | Incorporação dos Serviços de Estética Automotiva, Vitrificação, Espelhamento e Polimento de Para-brisa    |
| Status    | Approved                                                                                                  |
| Autor     | Staff Software Architect & Lead Frontend Engineer EPM DevTech                                             |
| Data      | 13/10/2026                                                                                                |
| Motivação | Novos dados comerciais captados para a BRS: Espelhamento, Vitrificação Cerâmica e Polimento de Para-brisa |

---

## 1. Contexto e Motivação

Dados comerciais captados para a **BRS Reparações Automotivas** confirmaram que, além do seu núcleo tradicional de restauração estrutural veicular (Funilaria de precisão, Pintura automotiva em estufa e Martelinho de ouro / PDR), a oficina também executa serviços especializados de estética automotiva, proteção de superfícies e recuperação óptica:

1. **Espelhamento de pintura**: polimento técnico refinado de corte, refino e lustro para nivelamento do verniz, eliminação de micro-riscos, teias de aranha (swirls) e hologramas, atingindo brilho de alta profundidade.
2. **Vitrificação cerâmica**: aplicação de coating cerâmico (vitrificador nanotecnológico) que forma uma camada protetora sobre o verniz com dureza elevada, proteção contra raios ultravioleta, repelência hidrofóbica a água e sujidades, e durabilidade estendida.
3. **Polimento de para-brisa**: recuperação técnica de vidros automotivos para remoção de marcas causadas por palhetas ressecadas, manchas de chuva ácida e micro-riscos superficiais, restabelecendo a visibilidade e transparência óptica sem necessidade de substituição prematura do vidro original.

---

## 2. Decisão Arquitetural e Modelagem de Dados

Para preservar a estabilidade da arquitetura multipágina e a fidelidade aos testes de regressão existentes:

1. As 3 especialidades centrais estruturais em [`src/lib/brs.ts`](../src/lib/brs.ts) (`services`: Funilaria, Pintura, Martelinho de ouro) continuam com suas rotas dedicadas canônicas (`/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`).
2. É introduzida a nova coleção canônica exportada em [`src/lib/brs.ts`](../src/lib/brs.ts):
   ```ts
   export interface AestheticServiceDetail {
     slug: string;
     title: string;
     short: string;
     tagline: string;
     description: string;
     applications: string[];
     limitations: string[];
     benefits: string[];
   }
   export const aestheticServices: AestheticServiceDetail[] = [...];
   ```
3. A lista combinada de serviços oferecidos para seleção no formulário de contato é exportada como:
   ```ts
   export const allOfferedServices = [
     ...services.map((s) => s.short),
     ...aestheticServices.map((s) => s.short),
   ];
   ```
4. Na rota `/servicos`:
   - Adição de uma seção editorial de destaque: **Estética Automotiva & Proteção de Superfícies** com os 3 novos serviços detalhados tecnicamente, suas indicações e limitações transparentes (ex.: riscos profundos na base exigem repintura; trincas ou quebras no vidro não são políveis).
5. Na página inicial (`/`):
   - Inclusão de menção às soluções complementares de estética automotiva na seção de serviços e no direcionamento de contato.
6. No formulário de contato (`ContactForm`):
   - Atualização do `<select>` para permitir a escolha direta de Espelhamento, Vitrificação ou Polimento de para-brisa.
7. No SEO (`src/lib/seo.ts`):
   - Atualização do schema `AutoBodyShop` e dados estruturados para motores de busca e LLMs.

---

## 3. Critérios de Aceite

- [ ] **AC-030-01**: `src/lib/brs.ts` define e exporta `aestheticServices` e `allOfferedServices` com dados de Espelhamento, Vitrificação Cerâmica e Polimento de Para-brisa.
- [ ] **AC-030-02**: A rota `/servicos` exibe com rigor visual e editorial a nova seção de Estética Automotiva & Proteção.
- [ ] **AC-030-03**: A página inicial (`src/components/brs/services.tsx`) apresenta a integração dos serviços de estética automotiva com link contextual para `/servicos`.
- [ ] **AC-030-04**: O formulário de contato (`ContactForm`) disponibiliza os 6 serviços para seleção e prepara a mensagem de contato com o serviço escolhido.
- [ ] **AC-030-05**: Schema de SEO em `src/lib/seo.ts` contempla as novas atividades comerciais da oficina.
- [ ] **AC-030-06**: Suíte de testes unitários (`src/test/brs.test.ts` e afins) expandida e validada com 100% de sucesso.
- [ ] **AC-030-07**: Quality Gates (Vitest, ESLint, Prettier, Vite+Nitro build, Playwright E2E) aprovados sem falhas.
