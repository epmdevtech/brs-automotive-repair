# SPEC-068 — Desacoplamento da Animação do Hero da Foto e Configuração Centralizada

| Campo       | Valor                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------- |
| ID          | `SPEC-068`                                                                                        |
| Título      | Desacoplamento da Animação do Hero da Foto e Configuração Centralizada                            |
| Status      | Approved                                                                                          |
| Data        | 2026-10-16                                                                                        |
| Autor       | Senior Frontend & Motion Design Engineer (Universal SDD)                                          |
| Escopo      | Hero da página inicial (`/`), módulo de configuração tipada, `<picture>` art-direction e guia    |

---

## 1. Contexto e Motivação

Na `SPEC-067`, foi implementada a sequência cinematográfica no Hero da página inicial: revelação faseada da UI, zoom lento suave e passagem única de reflexo de luz sobre a lataria do veículo.

No entanto, as coordenadas de corte (`object-position`), ponto de ancoragem do zoom (`transform-origin`), gradiente de legibilidade e a região geométrica do reflexo de luz foram calibrados de forma rígida para a foto atual (Porsche escuro ilustrativo).

Esta especificação (`SPEC-068`) estabelece a **Fase 2**: desacoplar completamente a animação da foto, centralizando todos os parâmetros que dependem da imagem em uma configuração única tipada em TypeScript com três perfis industriais pré-calibrados (`veiculo-inteiro`, `detalhe-lataria`, `oficina-equipe`). Isso permite que a fotografia seja substituída por uma imagem real definitiva da oficina sem que qualquer linha de lógica de animação, timing CSS ou estrutura JSX precise ser editada.

---

## 2. Princípios Arquiteturais e Diretrizes Estritas

1. **Zero Regressão Visual no Perfil Padrão**: A configuração ativa atual deve mapear para o perfil `"veiculo-inteiro"`, reproduzindo com exatidão matemática o enquadramento, zoom e reflexo já aprovados na `SPEC-067`.
2. **Configuração Centralizada e Tipada (`src/lib/hero-config.ts`)**:
   - Imagem: caminhos desktop e mobile, dimensões intrínsecas (`width`, `height`), `alt` e flag `decorative`.
   - Composição: `object-position` e `transform-origin` do zoom responsivos por breakpoint (`desktop` e `mobile`).
   - Overlay de Legibilidade: alinhamento do texto (`left` ou `right`) e intensidades de gradiente para desktop e mobile.
   - Reflexo de Luz (Flare): chave `enabled: boolean`, posição relativa em porcentagem (`top`, `left`, `width`, `height`), inclinação (`angle` em graus) e opacidade máxima (`maxOpacity`).
   - Aviso de Foto Ilustrativa: flag booleano estrito `isIllustrative: boolean`. Se `false`, o selo "Fotografia ilustrativa" não é renderizado. Nunca exibir para foto real, nunca omitir para foto ilustrativa.
3. **Três Perfis Arquiteturais de Foto**:
   - `"veiculo-inteiro"`: zoom ativo, reflexo ativo na lataria (configuração do veículo atual).
   - `"detalhe-lataria"`: zoom ativo, reflexo mais largo e com opacidade ligeiramente menor para superfícies contínuas de pintura.
   - `"oficina-equipe"`: zoom ativo, reflexo **obrigatoriamente desativado** (`enabled: false`), pois brilhos sobre pessoas ou maquinários parecem artificiais.
4. **Pipeline de Imagem com Art Direction (`<picture>`)**:
   - Suporte a `<picture>` com `<source media="(max-width: 768px)">` e variantes WebP/AVIF com fallback seguro.
   - Dimensões explícitas `width` e `height` para zero CLS.
   - Elemento LCP com `fetchpriority="high"`, `loading="eager"` e preload sincronizado no head da rota `/`.
   - Margem de resolução: imagem com folga mínima de 10% acima do viewport para suportar o zoom de 1.10 sem artefatos ou pixelização.
5. **Modo de Depuração em Desenvolvimento (Tree-shakeable)**:
   - Disponível estritamente sob `import.meta.env.DEV`, exibindo contornos da região segura do assunto e da área do reflexo para calibração rápida ao trocar de imagem, sem impactar o bundle de produção.
6. **Documentação Operacional Completa (`docs/guia-troca-foto-hero.md`)**:
   - Guia passo a passo em português para que o proprietário ou uma LLM possa substituir a foto e calibrar os perfis sem inspecionar o código de animação.

---

## 3. Critérios de Aceite (Acceptance Criteria)

- **AC-068-01**: A foto e seus parâmetros de enquadramento, zoom, reflexo e aviso de ilustração derivam exclusivamente do módulo `src/lib/hero-config.ts`.
- **AC-068-02**: O perfil `"veiculo-inteiro"` mantém paridade visual absoluta com a implementação da `SPEC-067`.
- **AC-068-03**: O perfil `"oficina-equipe"` possui `flare.enabled === false`.
- **AC-068-04**: O selo `"Fotografia ilustrativa"` só é renderizado quando `isIllustrative === true`.
- **AC-068-05**: A imagem utiliza elemento `<picture>` com direção de arte e `preload` no head apontando para o arquivo correto de LCP.
- **AC-068-06**: Todas as regras não negociáveis (SSR, acessibilidade, reduced-motion, skip precoce, sem erros de hidratação) permanecem ativas e verificadas via Vitest e Playwright.
- **AC-068-07**: Nenhum arquivo ou imagem temporária de teste permanece no repositório.
