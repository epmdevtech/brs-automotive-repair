# SPEC-032 — Redesign Awwwards Site of the Day: Hero, Showcase, Tipografia, Lenis e Coreografia GSAP

## Metadados

| Campo        | Valor                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-032`                                                                                                    |
| Título       | Redesign Awwwards Site of the Day da Home: Hero, Showcase, Paleta de Cores, Lenis Smooth Scroll e Motion GSAP |
| Data Criação | 2026-10-14                                                                                                    |
| Status       | Approved (Aprovada)                                                                                           |
| Autor        | Lead Creative Technologist & Motion Architect EPM DevTech                                                     |
| Prioridade   | Alta (P0)                                                                                                     |
| Impacto      | UI/UX da Página Inicial, Hero, Showcase Antes/Depois, MediaExpand, Scroll Global Lenis, Coreografia GSAP      |

---

## 1. Contexto e Motivação

O projeto BRS Reparações Automotivas consolidou uma arquitetura robusta multipágina em TanStack Start, com fontes canônicas de dados (`src/lib/brs.ts`), conformidade legal e SEO estruturado. Para elevar o website ao patamar internacional de excelência visual e interativa — padrão **Awwwards Site of the Day (SOTD)** —, a página inicial requer um salto estético, cinemático e de microinterações, mantendo integralmente a verdade do negócio, a conformidade de acessibilidade (WCAG AA), as rotas multipágina existentes e a estabilidade de produção.

Os principais pilares desta transformação são:

1. **Tipografia Editorial de Luxo**: Refinamento do emparelhamento Sora + Manrope com tracking calibrado, kerning óptico, micro-etiquetas técnicas e números tabulares para telemetria de oficina.
2. **Paleta de Cores e Atmosfera Automotiva Profunda**: Fundo obsidiana metálico (`#090b0e`), iluminação especular sutil simulando túnel de luz de estufa, acentos dourados/champagne enriquecidos (`#d8b368` / `oklch(0.76 0.11 82)`) e vidro fosco de alta fidelidade.
3. **Smooth Scrolling com Lenis**: Rolagem fluida com interpolação inercial via Lenis integrado de forma reativa e segura contra SSR, sincronizado diretamente com o ticker de animação do GSAP e desativado com `prefers-reduced-motion`.
4. **Coreografia de Movimento GSAP**: Entrada escalonada de elementos no Hero com curvas de interpolação precisas, micro-parallax reativo ao cursor sem re-renderizações (GSAP `quickTo`), showcase interativo Antes/Depois com telemetria técnica e transição cinematográfica no `MediaExpand`.

---

## 2. Requisitos e Critérios de Aceite

- **AC-032-01 (Smooth Scroll com Lenis & Sincronização GSAP)**:
  - Implementar `SmoothScrollProvider` em `src/components/ui/smooth-scroll-provider.tsx` utilizando `lenis` e `gsap`.
  - Sincronizar o evento `scroll` do Lenis com `ScrollTrigger.update` e o ticker do GSAP com `lenis.raf`.
  - Respeitar estritamente `prefers-reduced-motion`: quando ativo ou em SSR, o Lenis deve degradar para a rolagem nativa sem erros.
  - Integrar o provedor no layout raiz `SiteLayout` sem interferir na rolagem interna de modais Radix UI.
- **AC-032-02 (Paleta de Cores & Tokens de Luxo Automotivo)**:
  - Preservar variáveis CSS em `src/styles.css` e adicionar tokens para iluminação ambiente, brilhos especulares metálicos e glassmorphism refinado.
  - Ouro canônico e superfícies escuras mantendo contraste de legibilidade WCAG AA (texto principal e controles com taxa mínima de 4.5:1).
- **AC-032-03 (Hero Section Awwwards Standard)**:
  - Manter o H1 canônico com "BRS Reparações" em `text-white` e "Automotivas." em `text-primary`.
  - Manter o texto descritivo oficial contendo a menção a Toledo-PR e especialidades em `text-neutral-400`.
  - Manter o botão secundário exclusivo da Hero direcionando para `/servicos` com `.btn--secondary`.
  - Manter rodapé inferior com indicação de Toledo, Paraná e nota de conformidade fotográfica.
  - Adicionar status de precisão técnica com ponto luminoso pulsante ("OFICINA TÉCNICA ESPECIALIZADA • TOLEDO, PR").
  - Adicionar métricas de telemetria técnica (Colorimetria Computadorizada, Alinhamento a Laser, Padrão de Fábrica Preservado).
  - Animação de entrada e micro-interatividade fluida via GSAP/Framer Motion.
- **AC-032-04 (Showcase Section Antes/Depois & Telemetria Técnica)**:
  - Preservar o slider interativo acessível `BeforeAfterSlider` e links canônicos para `/trabalhos` e `/contato`.
  - Elevar a moldura do comparador com acabamento chanfrado metálico, halo de iluminação e leitor de especificações técnicas (gaps milimétricos, espessura de verniz, repuxamento a frio).
  - Adicionar revelação progressiva orquestrada via GSAP / ScrollTrigger.
- **AC-032-05 (MediaExpand Cinematográfico)**:
  - Suavizar a transição do `MediaExpand` com suporte a GSAP ScrollTrigger na rolagem, mantendo suporte ao fallback nativo CSS / IntersectionObserver.
- **AC-032-06 (Rastreabilidade e Quality Gates)**:
  - Todos os 175+ testes em `src/test/` devem passar sem regressões.
  - `bun run lint` com zero erros.
  - `bun run build` gerando bundle cliente e SSR Nitro com sucesso.

---

## 3. Arquitetura e Decisões Técnicas

- **Bibliotecas**: `lenis` para inércia de rolagem; `gsap` e `gsap/ScrollTrigger` para animações orquestradas na timeline e scroll; `framer-motion` mantido para transições de rotas e componentes UI existentes.
- **Prevenção de FOUC e Compatibilidade SSR**: Todos os hooks GSAP/Lenis utilizam guardas `typeof window !== "undefined"` e `useLayoutEffect` / `useEffect` seguros.
