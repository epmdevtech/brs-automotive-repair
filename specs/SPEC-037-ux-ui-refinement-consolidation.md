# SPEC-037 — Refinamento UX/UI, Consolidação Visual e Otimização da Hierarquia Editorial BRS

## Metadados

| Campo        | Valor                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-037`                                                                                                    |
| Título       | Refinamento UX/UI, Consolidação Visual e Otimização da Hierarquia Editorial BRS                              |
| Data Criação | 2026-10-14                                                                                                    |
| Status       | Approved (Aprovada)                                                                                           |
| Autor        | Engenheiro de Software Sênior & Especialista em UX/UI, Design Systems e CRO EPM DevTech                       |
| Prioridade   | Alta (P0)                                                                                                     |
| Impacto      | Home Page, Hero, Comparador Antes/Depois, Serviços, Estética, Processo/Filosofia, Pathways, Final CTA, Mobile |

---

## 1. Contexto e Diagnóstico de UX/UI (Fase 1)

O website institucional multipágina da **BRS Reparações Automotivas** foi estruturado com alta tecnologia (TanStack Start, Nitro SSR, Vite, GSAP e Lenis), possuindo rotas dedicadas (`/`, `/servicos`, `/trabalhos`, `/para-corretores`, `/sobre`, `/contato`, `/proposta`).

Após auditoria técnica e visual minuciosa (Fase 1), identificou-se a necessidade de desobstruir a interface de elementos puramente decorativos ou redundantes, restaurando a nobreza editorial e o foco em conversão e clareza informativa.

### Matriz de Diagnóstico Interno

| Critério | Diagnóstico Identificado no Código Atual | Resolução Normativa (SPEC-037) |
|---|---|---|
| **Fragmentação visual** | Hero continha marcas HUD artificiais (`+ BRS.24 // REF:TLD-PR`, `COORD: 24°43'S...`), 3 blocos de telemetria interna (`showTelemetryMetrics`) seguidos imediatamente por um `trust-strip` externo de 4 cards, gerando dois blocos de argumentos idênticos empilhados. | Unificar a proposta de valor do Hero em uma apresentação sóbria: Título expressivo, descrição clara, CTAs duplos complementares e até 3 diferenciais verdadeiros e essenciais. |
| **Redundância semântica** | As seções `Philosophy` (3 princípios em cinza escuro) e `ProcessTimeline` (4 etapas no mesmo tom cinza escuro) estavam justapostas, repetindo cópias quase idênticas sobre precisão milimétrica, transparência e compromisso com o proprietário. | Consolidar a narrativa de compromisso técnico e fluxo de atendimento em uma única seção fluida e de hierarquia bem definida, eliminando caixas de texto duplicadas. |
| **Hierarquia e ruído no Antes/Depois** | O comparador na Home continha múltiplos badges redundantes (`ESTUDO DE CASO // PRECISÃO 01`, `TOLERÂNCIA < 1.0MM`, `+ ALIGN.X`, `+ ALIGN.Y`, 2 caixinhas de specs de oficina, e 2 CTAs simultâneos). | Centralizar o protagonismo visual no `BeforeAfterSlider`, mantendo interação tátil/teclado de precisão, texto editorial conciso sobre a preservação da geometria da chapa e CTA único direcionado para `/trabalhos`. |
| **Densidade e repetição em Serviços e Estética** | O catálogo apresentava tags decorativas desnecessárias (`01 / ESPECIALIDADE`), e a seção de estética repetia a estrutura de 3 cards aninhados pesados logo abaixo dos 3 serviços principais. | Limpar as tags cosméticas das 3 especialidades e redesenhar a linha de estética automotiva em um bloco editorial elegante e compacto, destacando o benefício central de cada solução. |
| **Navegação e Caminhos** | O bloco `HomePathways` ("Escolha por onde continuar") disputava atenção com a hierarquia principal da página. | Reduzir o peso visual de `HomePathways`, tornando os links institucionais diretos e limpos, funcionando como suporte sem competir com a conversão em avaliação técnica. |
| **Mobile e Conversão** | No mobile, a sobreposição de tags de telemetria, cards de filosofia e timeline vertical excessivamente espaçada gerava rolagem cansativa e empurrava o contato principal para longe. | Simplificar o espaçamento vertical, reduzir nós desnecessários e posicionar CTAs objetivos e acessíveis com foco direto na solicitação de avaliação. |
| **Acessibilidade & Integridade** | Garantir preservação das regras canônicas de contraste WCAG AA, navegação completa por teclado, suporte a `prefers-reduced-motion` e integridade das rotas multipágina. | Preservar 100% da segurança por tipos, links semânticos, SEO e atributos ARIA. |

---

## 2. Escopo Arquitetural e Critérios de Aceite

### AC-037-01 — Refatoração e Clareza do Hero
- Preservar o visual automotivo sofisticado com `SignatureCanvas` discreto e tipografia fluida.
- Incluir o CTA Primário "Solicitar avaliação" direcionando para `/contato` com destaque visual e o CTA Secundário "Conhecer os serviços" direcionando para `/servicos`.
- Eliminar marcas de telemetria HUD genéricas (`+ BRS.24`, coordenadas GPS) e unificar os diferenciais reais (oficina técnica em Toledo-PR, diagnóstico honesto, serviço leva e traz) em uma faixa sóbria de 3 itens, sem blocos concorrentes.

### AC-037-02 — Protagonismo no Comparador Antes/Depois
- Eliminar badges e molduras decorativas fictícias (`ALIGN.X`, `ALIGN.Y`, `ESTUDO DE CASO // PRECISÃO 01`, `TOLERÂNCIA < 1.0MM`).
- Manter o `BeforeAfterSlider` interativo acessível por toque, mouse e teclado (`role="slider"`).
- Redação editorial focada no alinhamento milimétrico e recuperação estrutural sem excesso de massa.
- CTA direto para `/trabalhos` e nota transparente confirmando caráter técnico das imagens até consolidação do acervo de Toledo.

### AC-037-03 — Especialidades Principais e Anti-Card Slop
- Preservar as 3 especialidades canônicas (Funilaria, Pintura em Estufa e Martelinho de Ouro) com imagens otimizadas, títulos claros e navegação contextual.
- Remover marcadores redundantes (`01 / ESPECIALIDADE`), aliviando o peso dos containers e bordas.

### AC-037-04 — Linha Compacta de Estética e Proteção de Superfícies
- Reorganizar os serviços complementares (Espelhamento, Vitrificação Cerâmica, Polimento de Para-brisa) em uma apresentação editorial horizontal compacta.
- Destacar o benefício primário de cada serviço sem repetição da anatomia de cards pesados da seção anterior.
- Manter links contextuais para detalhes e solicitação de avaliação.

### AC-037-05 — Consolidação de Princípios e Etapas de Atendimento
- Eliminar a redundância de duas seções cinzas independentes (`Philosophy` e `ProcessTimeline`).
- Apresentar em uma única seção harmoniosa:
  1. Faixa compacta com os 3 pilares técnicos reais (Atenção aos detalhes, Comunicação clara e compromisso com o proprietário).
  2. A sequência linear das 4 etapas de atendimento (Primeiro contato, Avaliação técnica, Orçamento e alinhamento, Reparação e entrega).
- Descrições curtas e ágeis no mobile, sem marcadores visuais excessivos.

### AC-037-06 — Navegação Complementar (Pathways) e Final CTA de Alta Conversão
- Simplificar `HomePathways` para que funcione como um guia editorial limpo para `/sobre`, `/trabalhos` e `/para-corretores`.
- Assegurar que `FinalCTA` conduza o visitante de forma direta e sem ruído ao agendamento de avaliação em Toledo (`/contato`) e ao canal oficial confirmado (Instagram `@brsreparacoes`).

### AC-037-07 — Quality Gates, Testes e Acessibilidade
- Implementar suite de testes `src/test/ux-ui-refinement.test.tsx` validando os requisitos refinados da Home.
- Manter 100% de sucesso nos testes existentes (Vitest).
- `bun run lint` sem violações e `bun run build` bem-sucedido.
