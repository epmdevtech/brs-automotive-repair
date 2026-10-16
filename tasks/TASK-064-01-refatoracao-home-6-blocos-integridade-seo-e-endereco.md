# TASK-064-01: Refatoração da Home em 6 Blocos, Integridade Editorial, SEO de Produção e Dados Oficiais

| Campo       | Valor                        |
| ----------- | ---------------------------- |
| ID          | `TASK-064-01`                |
| SPEC        | `SPEC-064`                   |
| Status      | Completed                    |
| Data        | 2026-10-15                   |
| Responsável | UX/UI & Frontend Engineering |

---

## 1. Objetivo

Implementar integralmente a especificação `SPEC-064`, reestruturando a Home em 6 blocos enxutos orientados à conversão, atualizando a fonte canônica (`src/lib/brs.ts`) e metadados SEO (`src/lib/seo.ts`, `public/*`) com o domínio de produção `https://brs.epmdevtech.com.br` e dados oficiais confirmados (endereço e horário de funcionamento), eliminando artefatos visuais decorativos e corrigindo inconsistências nas páginas internas e suítes de testes.

---

## 2. Checklist de Execução

- [x] Atualizar `src/lib/brs.ts` com `siteUrl: "https://brs.epmdevtech.com.br"`, endereço completo (`R. Barão do Rio Branco, 4892 - Gisela, Toledo - PR, 85905-625`), horário (`Segunda a sexta, das 08h às 18h`), remoção de números sem respaldo em `aestheticServices` e redução de repetição de `"padrão de fábrica"`.
- [x] Atualizar `src/lib/seo.ts`, `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` e schemas JSON-LD das rotas para `https://brs.epmdevtech.com.br`, incluindo endereço e horário no schema `AutoBodyShop`.
- [x] Refatorar `Hero` (`src/components/brs/hero.tsx`) e `AnimatedHero` (`src/components/brs/animated-hero.tsx`) com `<h1>` descritivo do serviço + cidade, CTA primário `"Solicitar avaliação"` (`/contato`), imagem com `fetchPriority="high"` e remoção do `SignatureCanvas` na Home.
- [x] Refatorar `Services` (`src/components/brs/services.tsx`) com 1 único link por card (`"Ver detalhes do serviço"`), imagens leves (`funilaria.jpg`, `pintura.jpg`, `martelinho.jpg`) e linha compacta de estética automotiva apontando para `/servicos#estetica-automotiva`.
- [x] Consolidar Confiança e Processo em `src/components/brs/process-timeline.tsx` (e atualizar `src/components/brs/philosophy.tsx`) com até 3 diferenciais verificáveis sem numeração e 4 etapas do atendimento em linha com numeração única (`01` a `04`).
- [x] Refatorar `HomePathways` (`src/components/brs/home-pathways.tsx`) em faixa horizontal discreta exclusiva para corretores de seguros (`/para-corretores`).
- [x] Refatorar `FinalCTA` (`src/components/brs/final-cta.tsx`) e `MinimalFooter` (`src/components/ui/minimal-footer.tsx`) com CTA único `"Solicitar avaliação"`, canais oficiais (telefone, endereço, horário, Instagram), remoção do fundo repetido `funilaria-depois.jpg` e remoção da frase `"Demonstração institucional oficial"`.
- [x] Atualizar `src/components/brs/website.tsx` para compor os 6 blocos da Home sem `HomeBeforeAfter`, `MediaExpand` ou seções duplicadas.
- [x] Corrigir páginas internas (`/servicos`, `/trabalhos`, `/contato`, `/sobre`) e componentes (`header.tsx`, `page-hero.tsx`, `service-page-layout.tsx`, `home-before-after.tsx`, `project-gallery.tsx`).
- [x] Atualizar suítes de testes em `src/test/` e validar com `bun run test`, `bun run lint`, `bun run build` e `python3 scripts/generate_traceability.py`.
