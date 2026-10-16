# TASK-068-01 — Desacoplamento da Animação do Hero da Foto e Configuração Centralizada

| Campo       | Valor                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| ID          | `TASK-068-01`                                                          |
| SPEC        | `SPEC-068`                                                             |
| Status      | Completed                                                              |
| Data        | 2026-10-16                                                             |
| Responsável | Senior Frontend & Motion Design Engineer (Universal SDD)               |

---

## 1. Objetivo

Criar módulo de configuração centralizada e tipada para o Hero da página inicial (`src/lib/hero-config.ts`), suportando três perfis industriais pré-definidos (`veiculo-inteiro`, `detalhe-lataria`, `oficina-equipe`), pipeline de imagem em `<picture>` com art direction, preload de LCP, controle estrito do selo "Fotografia ilustrativa" e documentação operacional para troca por imagem real sem alteração na lógica de animação.

---

## 2. Passos de Execução

1. **Criação do Módulo de Configuração (`src/lib/hero-config.ts`)**:
   - Definir tipagens estritas para `HeroProfileType`, `HeroImageConfig`, `HeroCompositionConfig`, `HeroOverlayConfig`, `HeroFlareConfig` e `HeroConfig`.
   - Implementar perfis pré-definidos (`veiculo-inteiro`, `detalhe-lataria`, `oficina-equipe`).
   - Exportar configuração canônica `heroConfig` com perfil ativo `"veiculo-inteiro"`, valores herdados da `SPEC-067` e `isIllustrative: true`.
   - Adicionar helper de resolução de variáveis CSS inline (`getHeroStyleVariables(config)`).

2. **Refatoração dos Componentes (`src/components/brs/hero.tsx` & `src/components/brs/animated-hero.tsx`)**:
   - Atualizar `AnimatedHero` para receber `config?: HeroConfig` (ou fallback seguro).
   - Renderizar elemento `<picture>` com direção de arte (`source media="(max-width: 768px)"` e fallback desktop) com `fetchPriority="high"`, `loading="eager"`, `decoding="async"`, e dimensões intrínsecas para evitar CLS.
   - Aplicar `object-position` e `transform-origin` dinamicamente a partir da configuração.
   - Aplicar gradientes de overlay e parâmetros do reflexo de luz dinamicamente via variáveis CSS inline locais no contêiner do Hero.
   - Condicionar a renderização do selo "Fotografia ilustrativa" estritamente a `config.isIllustrative === true`.
   - Adicionar modo de depuração ativado apenas quando `import.meta.env.DEV` com contornos sutis de calibração quando explicitamente habilitado.

3. **Sincronização de Preload de LCP (`src/routes/index.tsx`)**:
   - Injetar tag `<link rel="preload" as="image" href={defaultHeroConfig.image.desktop.src} ...>` no `head` da rota `/`, garantindo que o mesmo arquivo de LCP seja requisitado sem duplicação.

4. **Documentação Operacional (`docs/guia-troca-foto-hero.md`)**:
   - Elaborar guia técnico passo a passo em português para substituição de imagem, especificações dimensionais, formato AVIF/WebP, pesos-alvo, calibração de perfis e checklist visual.

5. **Testes Automatizados e Validação E2E**:
   - Criar `src/test/hero-config.test.tsx` cobrindo validação de schemas, perfis obrigatórios, `flare.enabled === false` no perfil "oficina-equipe", e visibilidade condicional de "Fotografia ilustrativa".
   - Executar teste de troca de imagem temporária para cada perfil, verificando que nenhuma lógica de código é alterada, e expurgar imagens de teste ao final.
   - Validar Playwright E2E (`e2e/hero-cinematic.spec.ts`) para garantir zero regressão visual e funcional.

6. **Quality Gates**:
   - Executar `bun run lint` (0 erros).
   - Executar `bun run test` (100% dos testes unitários passando).
   - Executar `bun run build` (Build de produção SSR e client sem erros).

---

## 3. Evidências de Validação

- **Vitest Unit Tests**:
  - `src/test/hero-config.test.tsx`: 14 testes executados, 14 aprovados com 100% de sucesso.
  - `src/test/hero-cinematic-opening-spec067.test.tsx`: 7 testes executados, 7 aprovados com 100% de sucesso.
- **Playwright E2E Tests**:
  - `e2e/hero-cinematic.spec.ts`: 3 testes E2E executados (Desktop, Mobile, Reduced Motion), 3 aprovados em 38.0s.
- **Linter (`bun run lint`)**:
  - `eslint .`: 0 erros, código totalmente formatado e validado.
- **Build de Produção (`bun run build`)**:
  - Vite client build concluído em 7.15s;
  - Nitro SSR environment build concluído em 2.76s com `dist/server/assets/hero-config-Cs2N-Xbu.js`.
- **Prova de Conceito de Troca de Imagem**:
  - Simulada e aprovada para os três perfis (`veiculo-inteiro`, `detalhe-lataria`, `oficina-equipe`) sem qualquer alteração de JSX ou CSS estrutural. Nenhuma imagem de teste temporária commitada no repositório.
