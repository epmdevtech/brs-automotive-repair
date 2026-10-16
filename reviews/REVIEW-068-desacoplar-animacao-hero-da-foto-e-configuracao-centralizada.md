# REVIEW-068 — Revisão de Engenharia: Desacoplamento da Animação do Hero da Foto e Configuração Centralizada

| Campo       | Valor                                                    |
| ----------- | -------------------------------------------------------- |
| SPEC        | `SPEC-068`                                               |
| TASK        | `TASK-068-01`                                            |
| Data        | 2026-10-16                                               |
| Status      | Aprovado                                                 |
| Revisor     | Senior Frontend & Motion Design Engineer (Universal SDD) |

---

## 1. Resumo da Implementação

Foi implementada com sucesso a arquitetura de desacoplamento entre a sequência de animação do Hero e o arquivo de imagem na página inicial da BRS Reparações Automotivas, cumprindo com rigor absoluto os requisitos da especificação `SPEC-068`.

### Principais Destaques Arquiteturais:
- **Módulo Único de Configuração Tipada (`src/lib/hero-config.ts`)**:
  Centraliza 100% dos aspectos dependentes da imagem em uma estrutura TypeScript estrita: caminhos desktop e mobile, dimensões intrínsecas para prevenção de CLS, texto alternativo acessível e semântica decorativa, enquadramento (`object-position`) e ponto de ancoragem do zoom (`transform-origin`) por breakpoint, gradientes de legibilidade por lado/dispositivo, e parâmetros físicos do reflexo de luz.
- **Três Perfis Pré-Definidos Calibrados**:
  1. `veiculo-inteiro`: Carro completo, zoom ancorado no veículo (75% 50%) e reflexo de luz ativo sobre a lataria/capô (ângulo 115°, opacidade de pico 0.32). Preserva 1:1 o resultado visual da SPEC-067 com a foto ilustrativa atual (Porsche).
  2. `detalhe-lataria`: Close-up de pintura, polimento e verniz; ponto de ancoragem centralizado (60% 50%), reflexo de luz mais largo (largura 70%) e opacidade moderada (0.25).
  3. `oficina-equipe`: Instalações físicas, maquinários, estufa e profissionais; reflexo de luz ESTRITAMENTE DESATIVADO (`enabled: false`, opacidade 0) para prevenir brilhos artificiais indesejados sobre pessoas e ferramentas.
- **Injeção de Estilos via Variáveis CSS Inline Dinâmicas**:
  Em vez de modificar classes ou regras CSS estáticas, o componente `AnimatedHero` consome um conjunto de variáveis CSS locais geradas por `getHeroStyleVariables(config)` e aplicadas diretamente no elemento contêiner do Hero (`--hero-object-position`, `--hero-transform-origin`, `--hero-flare-*`, `--hero-overlay-*`).
- **Pipeline de Imagem com Art Direction via `<picture>`**:
  Suporte nativo a `<picture>` com `<source media="(max-width: 768px)">` e variante de alta resolução para desktop, com `loading="eager"`, `decoding="async"`, `fetchPriority="high"` e `width`/`height` explícitos.
- **Preload de LCP Sincronizado**:
  A rota `src/routes/index.tsx` consome a mesma fonte da imagem do Hero via `defaultHeroConfig.image.desktop.src`, garantindo que o navegador realize o preload do arquivo exato no HTML inicial.
- **Controle Estrito de Foto Ilustrativa**:
  O microdado "Fotografia ilustrativa" no rodapé do Hero é estritamente condicionado ao booleano `config.isIllustrative === true`. Ao configurar `isIllustrative: false` para uma foto real da oficina, o selo é automaticamente removido.
- **Modo Debug para Calibração Visual**:
  Inclusão de HUD de depuração ativado exclusivamente em desenvolvimento quando `import.meta.env.DEV && debugMode`, exibindo overlay com perfil ativo, transform-origin e contorno do flare sem vazar bytes para o bundle de produção.
- **Guia Operacional Passo a Passo em Português (`docs/guia-troca-foto-hero.md`)**:
  Documento didático e completo cobrindo preparação de imagens reais, compressão WebP/AVIF, seleção de perfis, checklist visual de 7 passos e troubleshooting.

---

## 2. Arquivos Modificados e Criados

| Arquivo | Natureza | Descrição |
| --- | --- | --- |
| `specs/SPEC-068-desacoplar-animacao-hero-da-foto-e-configuracao-centralizada.md` | Novo | Especificação de arquitetura e requisitos aprovada |
| `tasks/TASK-068-01-desacoplar-animacao-hero-da-foto-e-configuracao-centralizada.md` | Novo | Plano de tarefas detalhado e concluído |
| `src/lib/hero-config.ts` | Novo | Módulo canônico de tipagem, perfis e helpers CSS |
| `src/components/brs/hero.tsx` | Modificado | Suporte à prop opcional `config` e controle estrito do selo ilustrativo |
| `src/components/brs/animated-hero.tsx` | Modificado | Renderização em `<picture>`, injeção de variáveis CSS dinâmicas e modo debug |
| `src/styles.css` | Modificado | Consumo das variáveis CSS locais `--hero-*` |
| `src/routes/index.tsx` | Modificado | Preload de LCP dinâmico referenciando `defaultHeroConfig` com `fetchPriority="high"` |
| `docs/guia-troca-foto-hero.md` | Novo | Guia operacional completo para troca por foto real |
| `src/test/hero-config.test.tsx` | Novo | Suíte unitária/integração com 14 testes para perfis, flare, picture e troca de fotos |
| `e2e/hero-cinematic.spec.ts` | Modificado | Sincronização de hidratação sob reduced-motion e verificação E2E |
| `PROJECT.md` | Modificado | Registro canônico da SPEC-068 e TASK-068-01 |

---

## 3. Evidências de Qualidade e Gates

1. **Linter**:
   ```bash
   $ bun run lint
   ✖ 7 problems (0 errors, 7 warnings)
   ```
   Zero erros de linting e Prettier.

2. **Testes Unitários / Integração**:
   - `src/test/hero-config.test.tsx`: 14 testes aprovados (100% de sucesso).
   - `src/test/hero-cinematic-opening-spec067.test.tsx`: 7 testes aprovados (100% de sucesso).
   - `src/test/public-tracking-page.test.tsx`: 8 testes aprovados.

3. **Testes End-to-End (Playwright)**:
   - `e2e/hero-cinematic.spec.ts`: 3 cenários (Desktop, Mobile, Reduced Motion) aprovados com sucesso.

4. **Build de Produção**:
   - `bun run build` executado com sucesso: cliente e servidor SSR compilados sem falhas com `dist/server/assets/hero-config-Cs2N-Xbu.js`.

5. **Prova de Conceito de Troca de Imagem**:
   - Testada simulação de substituição de foto para cada um dos 3 perfis.
   - Constatado que nenhuma alteração no código de animação, keyframes ou JSX é necessária para efetuar a troca de imagens.
   - Nenhuma imagem temporária ou de teste foi mantida no repositório.

---

## 4. Próximos Passos e Itens Pendentes (Fora do Escopo)

1. **Fotografia Real da Oficina**: Aguardar envio de fotos reais autorizadas das instalações da BRS para substituição definitiva seguindo o `docs/guia-troca-foto-hero.md`.
2. **Metadados de Compartilhamento Social (`og:image`)**: Alinhar e atualizar a imagem de OpenGraph quando a imagem definitiva estiver disponível.
3. **Domínio de Produção em Metadados**: Observado que alguns metadados de desenvolvimento apontam para `http://brs.localhost` enquanto em produção deve vigorar `https://brs.epmdevtech.com.br`, conforme documentado em itens fora de escopo.
