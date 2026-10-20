# DESIGN.md — Especificação de Design e Direção Criativa (Awwwards Standard)

> **Projeto:** Master Chapeação e Pinturas (Toledo — PR)  
> **Padrão de Qualidade:** Awwwards Site of the Day (Design 40%, Usability 30%, Creativity 20%, Content 10%)  
> **Framework Metodológico:** Universal SDD (Spec-Driven Development)

---

## 1. Brief & Diagnóstico Canônico

- **Objeto & Identidade:** A Master Chapeação e Pinturas é uma oficina técnica especializada em funilaria estrutural, pintura em estufa de pressão positiva e martelinho de ouro sediada em Toledo, Paraná. Constituída em 2023, opera com base na preservação estrita do padrão de montadora (folgas originais, vincos de fábrica e ausência de massa plástica excessiva).
- **Público-Alvo:**
  1. Motoristas e proprietários de veículos exigentes que buscam restauração técnica honesta e acabamento cirúrgico;
  2. Corretores de seguros e reguladores de sinistro que necessitam de previsibilidade, laudos claros e cumprimento estrito de prazos sob a prerrogativa legal de livre escolha de oficina;
  3. Clientes corporativos de propostas comerciais personalizadas (apresentações individualizadas EPM DevTech).
- **Objetivo da Experiência:** Superar a percepção habitual de oficina mecânica convencional e estabelecer a Master como um centro de alta precisão estética e engenharia automotiva, combinando tipografia de contraste monumental, iluminação especular de estufa, telemetria técnica e micro-interações fluidas.

---

## 2. Concept Card (Pilar Criativo do Projeto)

```text
Ideia:        Oficina técnica de restauração automotiva de precisão onde cada intervenção preserva vincos, tolerâncias e padrão de montadora.
Metáfora:     Atelier de calibração cirúrgica e laboratório de colorimetria digital de alta tecnologia.
Assinatura:   Comparador óptico antes/depois interativo com shader/canvas de alta resolução e telemetria de gaps milimétricos.
Emoção:       Confiança técnica inabalável, precisão industrial, sofisticação e transparência cirúrgica.
Verbo Motion: "Calibrar e desdobrar com alinhamento a laser" (snap suave de precisão, inércia mecânica limpa, desaceleração pura [0.22, 1, 0.36, 1], zero bounce).
Screenshot:   Hero cinemático com iluminação especular de estufa, telemetria de tolerâncias, coordenadas reais de Toledo (24°43'S 53°44'W) e tipografia Sora em contraste marcante.
```

---

## 3. Paleta de Cores Estrita por 5 Papéis Funcionais

A paleta de cores rejeita convenções genéricas e emana diretamente do universo da oficina automotiva de elite (chassis grafite, chapas de aço escovado, estufa pressurizada com luz especular e sinalizadores de calibração):

| Papel Funcional | Valor Hex / Token                   | Semântica no Universo Master                             | Relação de Contraste                 |
| :-------------- | :---------------------------------- | :---------------------------------------------------- | :----------------------------------- |
| **Ground**      | `#0b0d10` (`oklch(0.14 0.005 260)`) | Chassis grafite profundo, negro automotivo            | Fundo imersivo principal             |
| **Ink**         | `#f3f4f6` (`oklch(0.98 0 0)`)       | Aço polido claro, reflexo metálico                    | > 14:1 contra o ground (AAA)         |
| **Muted**       | `#9ca3af` (`oklch(0.73 0.01 260)`)  | Cinza técnico de telemetria e especificações          | >= 5.8:1 contra o ground (AA)        |
| **Line**        | `rgba(255, 255, 255, 0.14)`         | Hairline de gap milimétrico e separadores             | Traço cirúrgico de 1px               |
| **Accent**      | `#e01b24` (`--brand-primary`)        | Vermelho da logo, extraído de "MASTER"                | 4.83:1 com branco (AA)               |
| **Accent Text** | `#f26b6f` (`--brand-text-accent`)    | Vermelho claro para texto pequeno sobre fundo escuro  | 6.59:1 contra o ground (AA)          |
| **Accent Soft** | `rgb(224 27 36 / 0.12)`              | Glows, badges e fundos sutis                          | Uso decorativo de baixa opacidade    |
| **Curtain**     | `#060709`                           | Cortina escura de transição contínua entre páginas    | Máscara de wipe de rota              |

---

## 4. Sistema Tipográfico e Escala Fluida

A tipografia é o vetor primário de expressão plástica do site. O sistema combina a geometria industrial da **Sora** para títulos e display com a legibilidade humana da **Manrope** para blocos de leitura técnica e **JetBrains Mono / Space Mono** para telemetria.

### 4.1 Famílias Tipográficas

- **Display / Títulos:** `Sora, sans-serif` — Tracking negativo progressivo (`-0.035em` a `-0.02em`), leading apertado (`0.92` a `1.12`), `text-wrap: balance`.
- **Corpo / Leitura:** `Manrope, sans-serif` — Otimizado para leitura técnica a 15-17px, leading `1.55` a `1.65`, `text-wrap: pretty`, medida máxima de `65ch`.
- **Telemetria / Dados:** `font-mono (JetBrains Mono / Space Mono)` — Numerais tabulares (`tabular-nums`), coordenadas geográficas, códigos de catálogo (`CAT.02`, `POR.03`) e carimbos de data/hora.

### 4.2 Escala Fluida de Tipos (Tokens CSS)

```css
/* Escala Fluida em src/styles.css */
--t-mega: clamp(3.5rem, 1.5rem + 8vw, 7.5rem); /* Display monumental, H1 de entrada */
--t-xl: clamp(2.25rem, 1.25rem + 3.8vw, 4.5rem); /* Títulos de páginas e chamadas hero */
--t-l: clamp(1.75rem, 1.15rem + 1.8vw, 2.75rem); /* Títulos de seções principais */
--t-m: clamp(1.25rem, 1.05rem + 0.6vw, 1.625rem); /* Subtítulos e títulos de cartões */
--t-body: clamp(0.9375rem, 0.9rem + 0.15vw, 1.0625rem); /* Corpo de leitura (15px - 17px) */
--t-s: 0.875rem; /* Texto de apoio e botões secundários (14px) */
--t-xs: 0.75rem; /* Legendas, badges e metadados (12px) */
--t-micro: 0.6875rem; /* Telemetria técnica, chips e coordenadas (11px) */
```

---

## 5. Grid, Ritmo de Layout e Spacing Moods

O layout rejeita a monotonia de espaçamentos uniformes fixos e adota quatro **estados de ritmo vertical (spacing moods)**:

### 5.1 Grid Estrutural

- **Desktop (>= 1024px):** 12 colunas com `grid-template-columns: repeat(12, minmax(0, 1fr))`, gutter fluido de `clamp(1rem, 0.5rem + 2vw, 2.5rem)`.
- **Mobile (390px - 768px):** 4 colunas com margem lateral de 16px a 24px, recomposição deliberada de pilhas verticais sem quebra de overflow.

### 5.2 Spacing Moods (Ritmo Vertical)

```css
--space-tight: clamp(2rem, 1.5rem + 1.5vw, 3.5rem); /* Subseções, filtros, grupos de telemetria */
--space-normal: clamp(4rem, 2.5rem + 3vw, 6.5rem); /* Ritmo padrão entre seções de conteúdo */
--space-airy: clamp(6.5rem, 4rem + 5vw, 10rem); /* Transições temáticas e grandes respiros */
--space-viewport: min(100svh, 860px); /* Heroes e palcos cinemáticos de tela cheia */
```

### 5.3 Regras de Forma e Raio

- `--radius-sm: 4px;` — Botões de ação, inputs técnicos, chips de telemetria (arestas nítidas de engenharia).
- `--radius-lg: 12px;` — Painéis de diagnóstico, containers de imagem e modais estruturados.

---

## 6. Plano de Composição por Famílias de Layout

Cada página e seção do ecossistema Master utiliza uma família de layout distinta, evitando a repetição monótona:

1. **Poster / Split Frame (`PageHero`):** Título expressivo à esquerda em `--t-xl`, coordenadas técnicas superiores (`COORD: 24°43'S 53°44'W`), badges de telemetria e moldura técnica ou imagem ilustrativa à direita.
2. **Matriz Editorial com Bordas Compartilhadas (`ServicePageLayout`):** Aplicações vs Limitações técnicas sem cartões soltos, divididas por hairlines finos de 1px a 10% de opacidade.
3. **Sequência Linear de Engenharia (`Etapas do Processo`):** Blocos numerados 01 a 04 com numerais tabulares e explicações objetivas.
4. **Comparador Óptico de Precisão (`/trabalhos` e Home):** Slider de alta definição antes/depois com arrasto suave, inspeção de gaps e suporte pleno a navegação por teclado (ArrowLeft/ArrowRight).
5. **Ledger Editorial B2B (`/para-corretores`):** Lista estruturada de diretrizes técnicas com linhas de divisão limpas, ressaltando o direito de livre escolha de oficina.
6. **Painel de Avaliação Honesta (`/contato`):** Formulário client-side seguro (sem simulações falsas de envio) com preparação de mensagem formatada para cópia e envio direto nos canais oficiais confirmados (`@masterchapeacao2022` e telefone).
7. **Apresentação Comercial Confidencial (`/proposta/$slug`):** Proposta executiva modular de engenharia digital EPM DevTech, com coordenadas, índice `PRO.08`, detalhamento de escopo transparente e ausência explícita de mensalidades ocultas.

---

## 7. Anti-AI Genericness Audit (Erradicação de Estilos Genéricos)

A auditoria contra os "AI Tells" (vícios estilísticos de inteligência artificial generativa) estabelece as seguintes garantias obrigatórias:

| Vício Comum de IA                                           | Diretriz e Solução Adotada na Master                                                                                                                                     | Status de Conformidade               |
| :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------- |
| **Gradientes roxos/azuis planos** (`#6366f1` / `#a855f7`)   | Banidos integralmente do CSS e componentes. Iluminação ambiente baseada exclusivamente em halos pontuais de estufa automotiva (ouro metálico Master e verde calibração). | **100% Livre de Roxo/Azul Genérico** |
| **Kits de 3 cards flutuantes idênticos com sombras suaves** | Substituídos por matrizes editoriais com bordas hairlines compartilhadas (`border-white/10`), pares assimétricos e listas tipo ledger.                                | **100% Arquitetural e Editorial**    |
| **Heróis centralizados sobre nuvem difusa**                 | Adotada estrutura assimétrica (Sora Display à esquerda, telemetria em chips nítidos e painel de engenharia à direita).                                                | **100% Padrão Awwwards Poster**      |
| **Métricas ou depoimentos inventados**                      | Falsas alegações como "99% clientes satisfeitos" são terminantemente proibidas. Dados reais: CNPJ oficial, localização em Toledo-PR e equipe técnica.                  | **100% Honesto e Conforme**          |
| **Glassmorphism indiscriminado**                            | Rejeitado blur decorativo em todos os elementos. Apenas painéis técnicos pontuais utilizam leve backdrop blur com bordas de precisão de 1px.                          | **100% Controlado**                  |
| **Cursor nativo ocultado**                                  | O cursor nativo do sistema operacional permanece sempre visível. Efeitos magnéticos atuam como suplemento tátil e nunca barram o cursor padrão.                       | **100% Acessível**                   |
| **Scroll-jacking que trava a rolagem**                      | Lenis provê inércia suave respeitando o scroll nativo do browser; em nenhum momento a rolagem é sequestrada ou bloqueada.                                             | **100% Fluido e 60 FPS**             |
| **Ignorar reduced-motion**                                  | Toda animação GSAP, Canvas e transições de página respeita estritamente `prefers-reduced-motion` com desativação imediata.                                            | **100% WCAG AA**                     |

---

## 8. Verificação e Quality Gates

- **QA Visual:** Inspeção em telas de 390px (mobile), 768px (tablet), 1280px (laptop) e 1920px (desktop grande).
- **Testes Automatizados:** Suíte dedicada `src/test/awwwards-design-system.test.tsx` garantindo a persistência do `DESIGN.md`, conformidade de tokens tipográficos e ausência de estilos genéricos.
- **Auditoria de Código:** `bun run test` (100% aprovação), `bun run lint` (0 erros) e `bun run build` (geração de bundle SSR sem falhas).
