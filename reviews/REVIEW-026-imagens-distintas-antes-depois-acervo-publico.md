# REVIEW-026: Imagens Distintas para Comparadores Antes/Depois e Eliminação de Repetição Visual no Acervo Público

## Metadados

| Campo   | Valor                                                 |
| ------- | ----------------------------------------------------- |
| ID      | REVIEW-026                                            |
| SPEC    | SPEC-026                                              |
| TASK    | TASK-026-01                                           |
| Status  | Aprovado                                              |
| Data    | 2026-10-12                                            |
| Revisor | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH) |

---

## 1. Resumo da Entrega

A **SPEC-026 / TASK-026-01** eliminou com precisão a repetição visual e o uso artificial de filtros CSS no site da **BRS Reparações Automotivas**.

Anteriormente, o comparador de imagens (`BeforeAfterSlider`) apresentava o mesmo arquivo base (`funilaria.jpg` / `pintura.jpg` / `martelinho.jpg`) para ambos os lados, alterando apenas filtros de saturação e contraste via CSS para simular avarias. Além disso, as mesmas três imagens eram reutilizadas repetidamente em páginas de serviços, corretores e seções institucionais.

Com esta entrega:

1. Foram introduzidos **3 pares fotográficos de alta definição e fotorrealismo**, genuinamente distintos entre o estado **Antes (Avaria/Preparo/Mossa)** e o estado **Depois (Restaurado/Verniz Espelhado/Liso)**;
2. Foram removidos todos os filtros CSS artificiais (`filter contrast-125`, `filter blur`, etc.);
3. Foram introduzidas **fotografias dedicadas e exclusivas** para as páginas e seções de serviços (`/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`, `/para-corretores`, `MediaExpand` e `FinalCTA`), acabando com a sensação de repetição;
4. 100% de conformidade com todos os Quality Gates (Vitest, Playwright, ESLint, Vite/Nitro SSR Build).

---

## 2. Inventário de Ativos Fotográficos Implementados

| Ativo Canônico            | Resolução / Formato  | Aplicação no Projeto                                     | Contexto Fotográfico                                                                                 |
| :------------------------ | :------------------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `funilaria-antes.jpg`     | 1376x768 (16:9) JPEG | `HomeBeforeAfter`, `ProjectGallery`                      | Para-lama de sedan preto com deformação pronunciada e vinco amassado sob luz de oficina              |
| `funilaria-depois.jpg`    | 1376x768 (16:9) JPEG | `HomeBeforeAfter`, `ProjectGallery`, `FinalCTA`          | Mesmo painel perfeitamente alinhado, vincos recuperados e reflexo espelhado                          |
| `pintura-antes.jpg`       | 1376x768 (16:9) JPEG | `ProjectGallery`                                         | Painel traseiro preparado com primer fosco, lixamento técnico e fita de mascaramento                 |
| `pintura-depois.jpg`      | 1376x768 (16:9) JPEG | `ProjectGallery`, `MediaExpand`                          | Verniz automotivo espelhado em estufa pressurizada com reflexo límpido das luzes de teto             |
| `martelinho-antes.jpg`    | 1376x768 (16:9) JPEG | `ProjectGallery`                                         | Porta metálica com mossa evidente revelada por linhas de zebra distorcidas em régua LED PDR          |
| `martelinho-depois.jpg`   | 1376x768 (16:9) JPEG | `ProjectGallery`                                         | Porta após martelinho de ouro, com linhas de reflexo perfeitamente retas e tinta original preservada |
| `funilaria-servico.jpg`   | 1376x768 (16:9) JPEG | `Services`, `/servicos/`, `/servicos/funilaria`          | Técnico especializado utilizando ferramentas milimétricas de alinhamento em carroceria escura        |
| `pintura-servico.jpg`     | 1376x768 (16:9) JPEG | `Services`, `/servicos/`, `/servicos/pintura-automotiva` | Pintor com macacão de proteção e máscara aplicando verniz com pistola HVLP em cabine pressurizada    |
| `martelinho-servico.jpg`  | 1376x768 (16:9) JPEG | `Services`, `/servicos/`, `/servicos/martelinho-de-ouro` | Especialista em PDR manipulando alavanca artesanal com régua de luz LED sobre chapa metálica         |
| `corretores-vistoria.jpg` | 1376x768 (16:9) JPEG | `/para-corretores`                                       | Regulador/vistoriador de seguros com tablet digital conferindo entrega de sedan preto recuperado     |

---

## 3. Arquivos Modificados e Impacto

1. **`src/components/brs/home-before-after.tsx`**:
   - Integração de `funilariaAntes` e `funilariaDepois`.
   - Remoção de filtros CSS de contraste/saturação.
   - Atualização de textos `alt` acessíveis para detalhamento real de avaria vs alinhamento.
2. **`src/components/brs/project-gallery.tsx`**:
   - Casos 01, 02 e 03 agora recebem pares autênticos e independentes (`funilariaAntes`/`funilariaDepois`, `pinturaAntes`/`pinturaDepois`, `martelinhoAntes`/`martelinhoDepois`).
   - Remoção de propriedades e classes `beforeImageClassName` com filtros simulados.
3. **`src/routes/servicos/funilaria.tsx`**:
   - Atualização para o ativo dedicado `funilariaServico`.
4. **`src/routes/servicos/pintura-automotiva.tsx`**:
   - Atualização para o ativo dedicado `pinturaServico`.
5. **`src/routes/servicos/martelinho-de-ouro.tsx`**:
   - Atualização para o ativo dedicado `martelinhoServico`.
6. **`src/routes/para-corretores.tsx`**:
   - Atualização para o ativo dedicado `corretoresVistoria`.
7. **`src/components/brs/services.tsx`**:
   - Atualização para o trio de fotografias de serviços contextuais `[funilariaServico, pinturaServico, martelinhoServico]`.
8. **`src/routes/servicos/index.tsx`**:
   - Atualização do mapa `serviceImages` para utilizar os ativos de serviço específicos.
9. **`src/components/brs/media-expand.tsx`**:
   - Atualização para `pinturaDepois` exibindo reflexo de alto sólidos sem repetição de foto antiga.
10. **`src/components/brs/final-cta.tsx`**:
    - Substituição da repetição de `brs-hero.jpg` por `funilariaDepois` em alta definição.

---

## 4. Evidências de Validação e Quality Gates

### 4.1 Testes Unitários (Vitest)

```bash
bun run test
```

- **Resultado**: 22 arquivos de teste executados, **144 testes aprovados (100% de sucesso)**.
- Inclui nova suíte `src/test/distinct-images-acervo.test.tsx` (4 testes) validando que todos os pares são arquivos distintos e que nenhuma classe de filtro artificial está presente.

### 4.2 Testes End-to-End (Playwright)

```bash
bunx playwright test
```

- **Resultado**: 28 testes E2E executados, **28 testes aprovados (100% de sucesso)**.
- Inclui nova suíte `e2e/distinct-images.spec.ts` validando via navegador real o carregamento de URLs distintas no slider da Home, nos 3 sliders de `/trabalhos` e nas rotas dedicadas de serviços.

### 4.3 Lint e Formatação

```bash
bun run lint
```

- **Resultado**: 0 erros. Conformidade com regras de ESLint e Prettier.

### 4.4 Compilação / Build de Produção

```bash
bun run build
```

- **Resultado**: Build concluído com sucesso em 1.19s pelo Vite + Nitro SSR (`preset: cloudflare-module`). Zero erros de bundle.

---

## 5. Rastreabilidade

- **Spec-Ref**: `SPEC-026`
- **Task-Ref**: `TASK-026-01`
- **Revisão Aprovada**: Sim
