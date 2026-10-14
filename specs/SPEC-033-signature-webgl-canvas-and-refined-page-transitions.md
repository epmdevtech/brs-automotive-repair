# SPEC-033 — Signature Interactive WebGL/Canvas Experience e Transições de Página Refinadas

## Metadados

| Campo        | Valor                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-033`                                                                                                                  |
| Título       | Experiência Signature Interativa WebGL/Canvas de Partículas & Laser e Transições de Página Cinemáticas sem Quebra de Estado |
| Data Criação | 2026-10-14                                                                                                                  |
| Status       | Approved (Aprovada)                                                                                                         |
| Autor        | Lead Creative Technologist & WebGL / Motion Architect EPM DevTech                                                           |
| Prioridade   | Alta (P0)                                                                                                                   |
| Impacto      | Experiência Visual Signature, Canvas/WebGL Interativo no Hero, Transições de Rota no SiteLayout, Governança SDD             |

---

## 1. Contexto e Motivação

Após a consolidação do padrão Awwwards Site of the Day na página inicial (SPEC-032), o projeto BRS Reparações Automotivas dá o passo definitivo de diferenciação artística e técnica internacional: a introdução de uma **experiência signature interativa em WebGL/Canvas** combinada a **transições de página cinemáticas refinadas**.

Em oficinas de alto padrão, a precisão milimétrica da funilaria e a pureza do verniz na estufa de pintura são guiadas por feixes de alinhamento a laser e dispersão homogênea de pigmentos metálicos. A experiência signature traduz essa física automotiva para a tela:

1. **Signature Canvas/WebGL Experience**:
   - Uma simulação interativa de partículas metálicas de pigmento automotivo e feixes laser de alinhamento estrutural que reagem dinamicamente à velocidade e posição do cursor/touch, com modos selecionáveis (Partículas de Verniz, Alinhamento a Laser, Varredura de Estufa).
   - Execução fluida em 60/120fps sem bloquear cliques ou interações em botões, formulários ou rotas.
   - Ciclo de vida robusto: pausa automática em segundo plano (`document.visibilityState === 'hidden'`), descarte seguro de recursos no unmount e respeito absoluto a `prefers-reduced-motion`.
2. **Transições de Página Cinemáticas Refinadas**:
   - Elevação do componente `PageTransition` no `SiteLayout` com indicador óptico de varredura laser na troca de rota, curva de aceleração de luxo (`[0.22, 1, 0.36, 1]`) e suporte progressivo à View Transitions API nativa dos navegadores modernos.
   - **Garantia de Estado Inalterado**: O roteamento do TanStack Router, os parâmetros de URL, os formulários com validação Zod, os estados de modais Radix UI e o comparador antes/depois mantêm seu estado e integridade funcional sem qualquer regressão.

---

## 2. Requisitos e Critérios de Aceite

- **AC-033-01 (Signature Interactive WebGL/Canvas Experience)**:
  - Criar `src/components/brs/signature-canvas.tsx` com renderização interativa em canvas acelerada por hardware.
  - Implementar física de partículas metálicas douradas/obsidianas com atração/dispersão ao movimento do mouse e onda de dispersão ao clique.
  - Disponibilizar modos de visualização acessíveis: _Verniz Metálico_ e _Alinhamento a Laser_.
  - Configurar camadas com `pointer-events-none` nas áreas de conteúdo para garantir que botões, links e formulários funcionem 100% livres de interceptação.
  - Respeitar `prefers-reduced-motion`: renderizar gradiente estático de alta fidelidade sem loop de animação contínuo.
  - Implementar limpeza de memória no desmontar do componente (`cancelAnimationFrame`, remoção de listeners).
- **AC-033-02 (Integração na Experiência da Home sem Quebra de Layout)**:
  - Integrar o `SignatureCanvas` na seção Hero (`AnimatedHero`), harmonizando o fundo com a fotografia existente e overlays de contraste WCAG AA+.
  - Manter visíveis e funcionais os textos, badges de telemetria, CTAs e rodapé da viewport.
- **AC-033-03 (Transições de Página Cinemáticas Refinadas)**:
  - Atualizar `src/components/ui/page-transition.tsx` com entrada refinada de rota (fade + leve escala inercial e deslocamento suave) e indicador de varredura de progresso dourado no topo.
  - Suportar progressivamente `document.startViewTransition` mantendo fallback elegante para todos os navegadores.
  - Preservar a restauração de scroll e o ciclo de vida do TanStack Router.
- **AC-033-04 (Isolamento de Estado da Interface)**:
  - O estado do formulário de contato, do slider antes/depois e das rotas parametrizadas (`/proposta/$slug`) não deve sofrer redefinições acidentais nem vazamentos de memória.
- **AC-033-05 (Quality Gates e Rastreabilidade)**:
  - Suíte de testes automatizados com novos testes cobrindo o `SignatureCanvas` e as transições refinadas.
  - 100% dos testes Vitest devem passar sem regressões.
  - `bun run lint` com 0 erros.
  - `bun run build` gerando pacotes cliente e SSR Nitro com sucesso.

---

## 3. Arquitetura e Decisões Técnicas

- **Canvas nativo otimizado**: Renderização direta em canvas 2D/WebGL sem dependências pesadas externas (evitando overheads de bundle de 3 a 5MB do Three.js), garantindo carregamento instantâneo (< 10KB de código) e 120fps consistentes.
- **DPR Scaling**: Compensação automática de densidade de pixels (`window.devicePixelRatio`) para nitidez máxima em telas Retina e 4K.
- **Acessibilidade**: Se o usuário tiver preferência de movimento reduzido ativada, a animação de partículas não consome ciclos de CPU/GPU e exibe estado estático elegante.
