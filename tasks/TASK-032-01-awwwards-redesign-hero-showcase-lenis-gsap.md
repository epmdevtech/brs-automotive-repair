# TASK-032-01 — Redesign Awwwards da Home (Hero & Showcase), Lenis e GSAP

## Metadados

| Campo        | Valor                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| ID           | `TASK-032-01`                                                                          |
| SPEC         | [`SPEC-032`](../specs/SPEC-032-awwwards-redesign-hero-showcase-lenis-gsap.md)          |
| Título       | Implementação do Redesign Awwwards da Home, Smooth Scroll com Lenis e Coreografia GSAP |
| Data Criação | 2026-10-14                                                                             |
| Status       | Completed (Concluída)                                                                  |
| Responsável  | Lead Creative Technologist & Motion Architect                                          |
| Branch/Alvo  | `main`                                                                                 |

---

## 1. Escopo de Trabalho

1. **Instalação e Configuração do Lenis & GSAP**:
   - `lenis` e `gsap` instalados via Bun.
   - Criado `src/components/ui/smooth-scroll-provider.tsx` e `src/hooks/use-smooth-scroll.ts` com desacoplamento seguro de SSR e sincronização GSAP ScrollTrigger.
   - Integrado no `SiteLayout` em `src/components/brs/site-layout.tsx`.
2. **Design Tokens & Variáveis CSS**:
   - Atualizado `src/styles.css` com novos tokens de luz automotiva, reflexos especulares e classes Awwwards (`.glass-panel-luxury`, `.glass-panel-gold`, `.led-status-pulse`, `.telemetry-chip`).
3. **Redesign do Hero**:
   - Atualizado `src/components/brs/animated-hero.tsx` e `src/components/brs/hero.tsx` incorporando a estética Awwwards SOTD:
     - Badge técnico iluminado com LED pulsante de status de Toledo, PR.
     - Tipografia refinada e telemetria automotiva em 3 pilares técnicos (Colorimetria, Alinhamento, Diagnóstico).
     - Efeito micro-parallax suave ao movimento do cursor via GSAP sem gargalo de performance.
     - Preservação total do H1 canônico, botão secundário `/servicos` e rodapé de viewport.
4. **Redesign da Seção Showcase (Antes & Depois)**:
   - Atualizado `src/components/brs/home-before-after.tsx` com telemetria técnica de gaps, moldura automotiva chanfrada, halo luminoso e coreografia de entrada GSAP ScrollTrigger.
5. **Redesign do MediaExpand**:
   - Otimizado `src/components/brs/media-expand.tsx` com halo luminoso e legenda técnica de estufa de pintura com pressão positiva.
6. **Suíte de Testes e Quality Gates**:
   - Adicionado `src/test/awwwards-home.test.tsx` cobrindo o provedor de smooth scroll, novos badges de telemetria e integridade dos critérios de aceite.
   - Executados `bun run test` (25 arquivos, 180 testes com 100% de sucesso), `bun run lint` (0 erros) e `bun run build` (sucesso).

---

## 2. Critérios de Aceitação Verificáveis

- [x] `SmoothScrollProvider` inicializa o Lenis no cliente com sincronia com o ticker do GSAP e desativa em `prefers-reduced-motion`.
- [x] O H1 do Hero preserva estritamente `BRS Reparações` (text-white) e `Automotivas.` (text-primary).
- [x] O Hero exibe o badge técnico de telemetria da oficina e os 3 pilares técnicos de acabamento.
- [x] O comparador Antes/Depois preserva o slider interativo acessível e exibe o bloco editorial de especificações milimétricas de alinhamento.
- [x] O `MediaExpand` executa transição fluida sem causar overflow horizontal ou quebra de layout.
- [x] 100% dos testes Vitest passam (`bun run test` - 25 arquivos, 180 testes).
- [x] `bun run lint` sem erros e `bun run build` bem-sucedido.
