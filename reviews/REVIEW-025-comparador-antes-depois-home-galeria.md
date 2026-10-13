# REVIEW-025: Comparador Antes e Depois: Home, Galeria e Componente Reutilizável

## Metadados

| Campo   | Valor                                                 |
| ------- | ----------------------------------------------------- |
| ID      | REVIEW-025                                            |
| SPEC    | SPEC-025                                              |
| TASK    | TASK-025-01                                           |
| Status  | Aprovado                                              |
| Data    | 2026-10-12                                            |
| Revisor | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH) |

---

## 1. Resumo da Entrega

A **SPEC-025 / TASK-025-01** implementou com rigor técnico e estético o comparador interativo de imagens **Antes e Depois**, totalmente integrado à página inicial (Home) e reutilizável na galeria da página de trabalhos (`/trabalhos`).

A solução atende integralmente às exigências de acessibilidade por teclado e toque, semântica ARIA de slider, ausência de dependências redundantes e respeito irrestrito à transparência de imagem e integridade comercial da BRS Reparações Automotivas.

---

## 2. Escopo Implementado e Detalhes Arquiteturais

### 2.1 Componente Compartilhado Reutilizável (`src/components/brs/before-after-slider.tsx`)

- **Manipulação por Toque e Mouse**: Pointer Events nativos com `setPointerCapture` e `releasePointerCapture`, preservando a rolagem vertical (`touch-pan-y`) em dispositivos móveis e bloqueando seleção acidental de imagens ou arrastes horizontais espúrios.
- **Navegação Completa por Teclado**:
  - `role="slider"`, `tabIndex={0}`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow={Math.round(position)}`.
  - Setas direcionais (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) ajustando em saltos de $\pm 5\%$.
  - `PageDown` e `PageUp` ajustando em saltos ampliados de $\pm 10\%$.
  - `Home` ($0\%$) e `End` ($100\%$).
  - Anel de foco acessível de alto contraste (`focus-visible:outline-2 focus-visible:outline-primary`).
- **Affordance e Feedback Visual**:
  - Instrução discreta (`hint = "Arraste para comparar"`) em badge de vidro escuro no rodapé do slider, que desvanece suavemente durante o arraste (`opacity-0`) para não obstruir a visão da peça reparada.
  - Alça central com ícone `ChevronsLeftRight` e realce sutil no hover/arraste.
- **Performance e Carregamento**:
  - Recorte acelerado por hardware via CSS `clipPath: inset(0 ${100 - position}% 0 0)` sem causar reflows de layout.
  - Suporte ao atributo `priority` para carregamento imediato (`loading="eager"`, `fetchPriority="high"`, `decoding="sync"`) em seções prioritárias e `loading="lazy"` em seções secundárias.

### 2.2 Seção de Demonstração na Home (`src/components/brs/home-before-after.tsx`)

- **Posicionamento**: Inserida imediatamente abaixo dos botões de ação do Hero e sua faixa de atributos, compondo a hierarquia definida:
  1. Conteúdo atual do Hero;
  2. CTAs existentes ("Conhecer os serviços", "Ver especialidades");
  3. Comparador interativo de Antes e Depois;
  4. Identificação do caso ("Funilaria de Precisão & Alinhamento Estrutural");
  5. CTA para a galeria completa com link canônico para `/trabalhos`;
  6. Continuação natural das demais seções da Home (`MediaExpand`, `Services`, etc.).
- **Composição Editorial Assimétrica**:
  - Desktop ($\ge 1024\text{px}$): Grid de 12 colunas, reservando 7 colunas para o slider visual e 5 colunas para a coluna editorial/textual.
  - Mobile ($< 1024\text{px}$): Empilhamento vertical fluido com largura total disponível, mantendo área de toque confortável e sem overflow horizontal.

### 2.3 Reutilização na Galeria de Trabalhos (`/trabalhos` e `ProjectGallery`)

- A página `/trabalhos` e seu módulo `ProjectGallery` compartilham exatamente a mesma implementação do `BeforeAfterSlider`, tanto na grade de casos quanto no modal Lightbox de alta definição, evitando qualquer duplicação de lógica ou código.

### 2.4 Transparência Fotográfica e Integridade

- Em todas as instâncias, foi mantida a nota explícita de conformidade exigida pelas diretrizes da BRS: esclarecimento honesto de que o acervo fotográfico real está em documentação em Toledo-PR com autorização de clientes, utilizando imagens demonstrativas dos métodos técnicos sem forjar comparações falsas.

---

## 3. Evidências de Validação e Quality Gates

| Validação                          | Comando / Ferramenta               | Resultado                                     | Status          |
| :--------------------------------- | :--------------------------------- | :-------------------------------------------- | :-------------- |
| **Testes Unitários & Integração**  | `bun run test` (Vitest)            | **21 arquivos de teste, 140 testes passando** | Aprovado (100%) |
| **Testes End-to-End (E2E)**        | `bunx playwright test`             | **25 testes E2E aprovados**                   | Aprovado (100%) |
| **Análise Estática & Linter**      | `bun run lint` (ESLint + Prettier) | **0 erros**                                   | Aprovado        |
| **Compilação & Build de Produção** | `bun run build` (Vite + Nitro SSR) | **Build SSR gerado sem advertências**         | Aprovado        |

---

## 4. Conclusão

Todos os requisitos da **SPEC-025** foram satisfeitos com excelência técnica, rigor em acessibilidade e fidelidade ao design system automotivo da BRS Reparações Automotivas.
