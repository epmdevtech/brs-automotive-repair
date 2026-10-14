# SPEC-036 — Integração do Motion Engine (Lenis + GSAP ScrollTrigger), Componentes Interativos e Transições Suaves de Página

## Metadados

| Campo        | Valor                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-036`                                                                                                       |
| Título       | Integração do Motion Engine (Lenis + GSAP ScrollTrigger), Componentes Interativos e Transições Suaves de Página  |
| Data Criação | 2026-10-14                                                                                                       |
| Status       | Approved (Aprovada)                                                                                              |
| Autor        | Lead Motion Designer & Principal Interactive Engineer EPM DevTech                                                |
| Prioridade   | Alta (P0)                                                                                                        |
| Impacto      | Motion Engine global, Lenis, GSAP ScrollTrigger, Parallax, Contadores Numéricos, Before/After Slider, Transições |

---

## 1. Contexto e Motivação

Conforme estabelecido nas regras de engenharia de movimento e no fluxo normativo de excelência em `~/.agents/skills/awwwards/SKILL.md` (e referências `references/engine.md` e `references/motion.md`):

1. **Vida Além da Primeira Dobra (Hero)**: O website da BRS possui arquitetura sólida e rotas completas (`/`, `/servicos`, `/trabalhos`, etc.), porém as seções internas requerem coreografia viva, fluida e contínua que guie os olhos do visitante através de scroll suave e revelações progressivas.
2. **Motion Engine com Único Relógio (Single Clock Sync)**:
   - Lenis configurado como motor de scroll suave inercial global em todas as rotas.
   - Sincronização estrita com o `gsap.ticker` do GSAP (`gsap.ticker.add(...)` e `gsap.ticker.lagSmoothing(0)`), evitando múltiplos loops de `requestAnimationFrame` desalinhados.
   - `ScrollTrigger.refresh()` disparado sincronamente nas transições entre páginas para manter os cálculos geométricos íntegros.
3. **Coreografia de Entrada das Seções Internas**:
   - **Revelação progressiva de texto**: Títulos, subtítulos e parágrafos coreografados com curvas de luxo e staggers deliberados.
   - **Imagens com parallax sutil**: Movimento óptico scrubbed em fotos de oficina e acabamento (`yPercent: -6` a `6`), sem alterar layout ou causar overflow.
   - **Contadores numéricos animados**: Passos de processo (`01` a `04`) e métricas de precisão técnica com números tabulares animados ao entrar na viewport.
4. **Componentes Interativos Específicos**:
   - **Antes e Depois Interativo**: Slider de precisão com arrasto tátil/mouse, suporte total a teclado (`role="slider"`, ARIA) e aceleração por GPU (`clip-path`) para demonstrar recuperação de lataria e polimento.
   - **Microinterações Refinadas de Hover**: Bordas hairline iluminadas em dourado automotivo (`primary/40`), translação direcional de ícones de navegação e micro-escalas sem qualquer gradiente roxo/azul plano.
5. **Transições de Página Cinematográficas**:
   - Transição suave entre rotas eliminando quebras ou flashes de carregamento brusco, complementada por varredura laser superior dourada transitória.
6. **Acessibilidade e Fallback Normativo**:
   - Respeito irrestrito a `prefers-reduced-motion`: quando ativo, scroll inercial, parallax, animações de números e transições colapsam instantaneamente para seus estados finais estáticos legíveis.
   - Zero erros no Vitest, zero avisos de lint e build Vite/Nitro SSR 100% verde.

---

## 2. Requisitos e Critérios de Aceite

- **AC-036-01 (Motion Engine Global Lenis + GSAP)**:
  - Garantir inicialização e sincronização contínua do Lenis em todas as rotas através de `SmoothScrollProvider`.
  - Vincular o tick do Lenis ao GSAP Ticker e atualizar `ScrollTrigger.update()` no scroll do Lenis.
  - Adicionar refresh automático do ScrollTrigger (`ScrollTrigger.refresh()`) na troca de rotas para assegurar cálculo correto de posições.
- **AC-036-02 (Contadores Numéricos Animados - NumericCounter)**:
  - Criar componente reutilizável `NumericCounter` com suporte a GSAP ScrollTrigger (ou hook equivalente) que anima números inteiros ou com prefixo/sufixo ao entrar na viewport.
  - Aplicar nos passos do `ProcessTimeline` (`01` a `04`) e métricas técnicas da oficina.
  - Fallback imediato para o número final estático sob `prefers-reduced-motion`.
- **AC-036-03 (Imagens com Parallax Sutil - ParallaxImage)**:
  - Criar componente ou utilitário `ParallaxImage` utilizando GSAP ScrollTrigger com scrub suave para fotos de serviços e acabamento.
  - Efeito suave de profundidade sem layout shift (usando `overflow-hidden` no container e transform percentual controlado).
  - Desativado de forma segura sob `prefers-reduced-motion`.
- **AC-036-04 (Componente Interativo Antes e Depois - BeforeAfterSlider)**:
  - Manter e aperfeiçoar o slider interativo com suporte a drag (mouse/touch), teclado (Setas, PageUp/Down, Home, End), badges de antes/depois com opacidade fluida e indicador visual de affordance.
  - Integrado na página inicial (`HomeBeforeAfter`) e na galeria de trabalhos (`ProjectGallery`).
- **AC-036-05 (Microinterações Refinadas nos Cards de Serviços e Botões)**:
  - Cards de serviços e especialidades com bordas técnicas (`border-white/10` -> `hover:border-primary/40`), sombras sutis de luz ambiente (`hover:shadow-primary/5`), translações do ícone de seta (`ArrowUpRight`) e zoom suave da imagem.
  - Botões primários e secundários refinados com feedback tátil no `:active` e `:focus-visible`, sem gradientes genéricos.
- **AC-036-06 (Transições Suaves de Página)**:
  - Validar e refinar `PageTransition` para garantir troca suave entre as rotas do TanStack Router sem quebras visuais ou interrupção do scroll restoration.
  - Manter indicador superior dourado transitório.
- **AC-036-07 (Quality Gates e Testes)**:
  - Criar suite `src/test/awwwards-motion-engine.test.tsx` cobrindo o motor de scroll, contadores numéricos, antes/depois e acessibilidade `prefers-reduced-motion`.
  - Passar 100% dos testes Vitest.
  - `bun run lint` sem violações e `bun run build` bem-sucedido.
