# SPEC-023 — Anti-Card Slop, Arquitetura Editorial de UI & Design Automotivo Premium

## Metadados

| Campo               | Valor                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| **Identificador**   | `SPEC-023`                                                              |
| **Título**          | Anti-Card Slop, Arquitetura Editorial de UI & Design Automotivo Premium |
| **Data de Criação** | 2026-10-12                                                              |
| **Status**          | Aprovada                                                                |
| **Autor**           | Staff Design Engineer & Frontend Architect (EPMDEVTECH)                 |
| **Contexto**        | Refatoração de UI/UX em todo o frontend do site BRS Reparações          |

---

## 1. Visão Geral e Motivação

O projeto da BRS Reparações Automotivas possui uma base técnica sólida (TanStack Start, React 19, Tailwind CSS v4, Motion Design com Framer Motion e SEO estruturado). Contudo, a evolução incremental gerou acúmulo de **padrões visuais genéricos de IA ("card slop")**:

- Grades repetitivas de 3 cards idênticos em sequência com bordas, sombras e fundos duplicados.
- Ícones encapsulados em pequenos quadrados arredondados com fundos coloridos sem função informativa real.
- Badges decorativos flutuantes sobrepostos a fotografias.
- Caixas fechadas para cada benefício, etapa ou diferencial, fragmentando a leitura.
- Ausência de continuidade editorial e hierarquia estrutural com hairlines (divisores finos).

Esta especificação define a transição do paradigma **Container-First** para **Content-First, Containers-Last**, introduzindo:

1. **Composição Editorial Assimétrica e Ampla**: protagonismo à tipografia (Sora e Manrope) e à fotografia automotiva em alta resolução.
2. **Divisores Estruturais e Hairlines**: substituição de caixas flutuantes por linhas de grade contínuas (`border-y`, `divide-x`, `divide-y`).
3. **Listas Editoriais e Ledgers**: numeração refinada (`01`, `02`, `03`) em escala mono/micro, tipografia expressiva e CTAs contextuais sem redundância.
4. **Camadas Tonais Sutis**: profundidade via contraste suave de superfícies escuras, eliminando sombras pesadas sem propósito.
5. **Preservação Canônica e Contratos**: fidelidade às informações reais de contato (`brs.ts`), conformidade WCAG 2.1 AA, SSR íntegro e 100% dos testes unitários/E2E verdes.

---

## 2. Requisitos Funcionais e Critérios de Aceite

### AC-023-01: Desestruturação de Cards na Seção de Serviços da Homepage (`Services`)

- **Dado** a seção `#servicos` na página inicial,
- **Quando** o usuário visualizar as três especialidades (Funilaria, Pintura, Martelinho),
- **Então** os blocos não devem ser cards flutuantes isolados com sombras pesadas e ícones encapsulados em caixinhas coloridas;
- **E** devem ser organizados em uma estrutura editorial contínua com divisores estruturais compartilhados ou linhas de matriz, destacando fotografia com zoom suave, numeração `01 / ESPECIALIDADE`, tipografia sênior e CTA de navegação contextual.

### AC-023-02: Eliminação de Cards Repetitivos em `HomePathways` e `ProjectGallery`

- **Dado** o componente `HomePathways` e a galeria `ProjectGallery` na homepage e `/trabalhos`,
- **Quando** renderizados,
- **Então** os 3 blocos de direcionamento institucional de `HomePathways` devem adotar divisores estruturais compartilhados (`border-y`, `divide-x`/`divide-y`) em vez de contêineres individuais flutuantes `bg-card/60 p-6`;
- **E** os casos de `ProjectGallery` devem integrar o slider de antes/depois diretamente na grade editorial sem molduras infladas e sombras artificiais.

### AC-023-03: Refatoração da Visão Geral de Serviços (`/servicos`)

- **Dado** a rota `/servicos`,
- **Quando** inspecionadas as 3 especialidades detalhadas e o Guia de Triagem,
- **Então** os 3 serviços devem ser apresentados em faixas editoriais amplas de 12 colunas delimitadas por divisores finos (`border-b border-border/60`), sem caixas de card encapsuladas (`rounded-xl border border-border bg-card/60`);
- **E** os ícones em caixinhas coloridas (`size-8 rounded-sm bg-primary/10`) devem ser removidos em favor de alinhamento tipográfico editorial;
- **E** o "Guia de Triagem" deve usar uma matriz contínua com bordas compartilhadas (`divide-x`/`divide-y`) em vez de 3 cards independentes.

### AC-023-04: Refatoração do Template Comum de Serviços (`ServicePageLayout`)

- **Dado** as páginas de serviço específicas (`/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`),
- **Quando** renderizadas,
- **Então** a seção de "Aplicações e Limitações" deve ser estruturada como duas colunas editoriais complementares separadas por hairlines, sem contêineres de cards fechados nem ícones em quadradinhos decorativos;
- **E** as "Fases do Processo" devem ser dispostas em matriz editorial com divisores compartilhados e numeração limpa (`Fase 01`, `02`, `03`);
- **E** a lista de "Outros Serviços" deve adotar links editoriais com divisores horizontais.

### AC-023-05: Refatoração Institucional (`/sobre` e `/para-corretores`)

- **Dado** as rotas `/sobre` e `/para-corretores`,
- **Quando** renderizadas,
- **Então** os pilares e compromissos devem ser estruturados como matrizes com divisores estruturais em vez de caixas fechadas com ícones encapsulados;
- **E** o badge flutuante sobre a fotografia de `/para-corretores` deve ser eliminado, mantendo a fotografia límpida e profissional;
- **E** o bloco de contato em `/contato` deve eliminar molduras decorativas em volta dos ícones de telefone e Instagram.

### AC-023-06: Quality Gates e Não-Regressão

- **Dado** a execução da suíte de testes e validação de qualidade,
- **Quando** rodados `bun run test`, `bun run lint`, `bun run build` e `bunx playwright test`,
- **Então** todos os testes unitários e E2E devem passar com 100% de sucesso, sem erros de linter ou quebra de tipos TypeScript.

---

## 3. Matriz de Componentes Afetados

| Componente / Arquivo                         | Padrão Anterior (Card Slop)                                                           | Padrão Proposto (Editorial Premium)                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/components/brs/services.tsx`            | 3 cards com `CardSpotlight bg-card/95 shadow-lg` e ícones encapsulados em quadradinho | Grade editorial com bordas compartilhadas, divisores finos, numeração `01 / ESPECIALIDADE`, sem ícone em caixinha |
| `src/components/brs/home-pathways.tsx`       | 3 cards isolados com `border border-border bg-card/60 p-6`                            | Matriz com bordas compartilhadas e hairlines (`border-y divide-x/divide-y`), tipografia editorial                 |
| `src/routes/servicos/index.tsx`              | 3 cards volumosos `rounded-xl border bg-card/60`, Guia com 3 cards separados          | Linhas editoriais amplas de 12 colunas com `border-b`, Guia em matriz contínua compartilhada                      |
| `src/components/brs/service-page-layout.tsx` | Cards para Aplicações, Limitações e Fases com ícones em quadradinhos coloridos        | Colunas editoriais com separadores hairlines, matriz contínua de fases, navegação editorial                       |
| `src/routes/para-corretores.tsx`             | Badge decorativo na foto e 3 cards de compromissos com ícones em caixinhas            | Fotografia límpida sem badges sobrepostos, 3 compromissos em matriz com bordas compartilhadas                     |
| `src/routes/sobre.tsx`                       | 3 cards de princípios com ícones em caixinhas e bloco com background decorativo       | Princípios em matriz com divisores estruturais, bloco institucional tipográfico refinado                          |
| `src/components/brs/contact.tsx`             | Ícones de telefone e Instagram dentro de quadradinhos decorativos                     | Apresentação editorial direta dos canais com tipografia forte e alinhamento preciso                               |
| `src/components/brs/project-gallery.tsx`     | 3 cards pesados com `bg-card border-border/80 shadow-md`                              | Galeria editorial com bordas compartilhadas contínuas e integração direta dos sliders                             |
