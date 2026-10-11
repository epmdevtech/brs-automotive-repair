# SPEC: Refinamento do Sistema Tipográfico com Sora e Manrope

## Metadados

| Campo                               | Valor                                                         |
| ----------------------------------- | ------------------------------------------------------------- |
| ID                                  | SPEC-009                                                      |
| Status                              | Implemented                                                   |
| Responsável                         | Engenharia Front-end EPMDEVTECH                               |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH                 |
| Criado                              | 2026-10-11                                                    |
| Atualizado                          | 2026-10-11                                                    |
| Lançamento alvo                     | `0.1.0`                                                       |
| Briefing de UX relacionado          | Refinamento Tipográfico Premium Editorial Dark Automotivo     |
| Especificação de design relacionada | Swiss/German Technical Automotive Typography Guidelines       |
| ADRs relacionadas                   | N/A                                                           |

---

## Problema e resultado

A landing page da BRS Reparações Automotivas utilizava a fonte condensada *Barlow Condensed* herdada do template inicial para títulos, com tamanhos estáticos rígidos, estilos em caixa alta excessiva (`uppercase`), pesos ultra-pesados (`font-extrabold` / 800) e alturas de linha comprimidas que passavam uma impressão visual genérica ou excessivamente agressiva.

Para transmitir um posicionamento técnico, sofisticado, de alta precisão e extrema confiança automotiva, a direção de design definiu uma nova combinação tipográfica canônica:
- **Títulos e Headings (H1, H2, H3, H4, Display)**: Família **Sora**, utilizando predominantemente pesos médios e semi-bold (500 e 600), com geometria limpa, proporções abertas e acabamento editorial.
- **Corpo de texto, Navegação, Botões, Formulários e Microdados**: Família **Manrope**, utilizando pesos regular, medium e semibold (400, 500 e 600), com excelente legibilidade e ritmo de leitura fluida.

### Resultado Desejado

1. Atualização do carregamento em `src/routes/__root.tsx` para carregar exclusivamente os pesos necessários de **Sora** (500, 600, 700) e **Manrope** (400, 500, 600) via Google Fonts com otimização `display=swap` e `preconnect`.
2. Centralização de tokens tipográficos em `src/styles.css` e `@theme inline`:
   - `--font-display`: `"Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
   - `--font-body`: `"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
   - Escala fluida baseada em `clamp()` para H1 hero, H2 seções, H3 cards e corpo de texto.
   - Normalização visual com `font-size-adjust: from-font` para estabilidade visual contra layout shift (CLS).
3. Eliminação do excesso de caixa alta artificial (`uppercase`) em cards de serviços, galeria de projetos e títulos de seção, preservando caixa alta apenas em micro-rótulos (eyebrows/badges) com tracking controlado.
4. Ajuste harmonioso de `line-height` (unitless), `letter-spacing` e larguras máximas (`max-width: 24ch` em títulos, `max-width: 65ch` em parágrafos) com `text-wrap: balance` em títulos e `text-wrap: pretty` em textos corridos.
5. Preservação integral do layout, estrutura, imagens, funcionalidades, formulários e regras de negócio de Toledo-PR.
6. Aprovação total de todos os Quality Gates automáticos (`make check`).

---

## Escopo

### No escopo (In scope)

- Atualização de links de fontes Google Fonts em `src/routes/__root.tsx`.
- Centralização dos tokens de família, pesos, escala fluida e line-heights em `src/styles.css`.
- Aplicação de regras base em `@layer base` (`font-size-adjust: from-font`, `text-wrap: balance` em headings, `text-wrap: pretty` em parágrafos).
- Refinamento de hierarquia e remoção de caixa alta/negrito desnecessários em `src/components/brs/hero.tsx`, `services.tsx`, `project-gallery.tsx`, `partner-section.tsx`, `philosophy.tsx`, `process-timeline.tsx`, `pickup.tsx`, `about.tsx`, `contact-form.tsx` e `header.tsx`.
- Adição de testes unitários para o sistema tipográfico em `src/test/typography.test.tsx`.
- Validação completa com `bun run test`, `bun run lint` e `bun run build`.

### Fora do escopo (Out of scope)

- Alteração da identidade de cores (preto profundo, grafite e âmbar/dourado).
- Mudança na cópia comercial dos textos ou canais de contato.
- Modificação na mecânica de animações ou de componentes de diálogo/slider.

---

## Critérios de Aceitação

- [AC-009-01] O Google Fonts em `src/routes/__root.tsx` deve carregar as famílias Sora (500, 600, 700) e Manrope (400, 500, 600) com `display=swap` e preconnect.
- [AC-009-02] As variáveis CSS `--font-display` e `--font-body` devem apontar respectivamente para Sora e Manrope, com fallbacks de sistema seguros.
- [AC-009-03] A escala de títulos deve adotar valores fluidos com `clamp()` e alturas de linha unitless confortáveis, com `text-wrap: balance`.
- [AC-009-04] Textos corridos e parágrafos devem adotar Manrope com peso 400/500, `line-height` entre 1.6 e 1.7 e `text-wrap: pretty`.
- [AC-009-05] Os títulos de cards de serviços e galeria devem utilizar pesos 500/600 em caixa normal (sem `uppercase` agressivo forçado), transmitindo refinamento editorial.
- [AC-009-06] Todos os Quality Gates (`make check`) devem passar com 100% de sucesso.
