# SPEC-015: Sistema Unificado de Motion Design e Scroll Reveal Premium

## Metadados

| Campo           | Valor                                                                                   |
| --------------- | --------------------------------------------------------------------------------------- |
| ID              | SPEC-015                                                                                |
| Título          | Sistema Unificado de Motion Design e Scroll Reveal Premium — BRS Reparações Automotivas |
| Status          | Approved                                                                                |
| Autor           | Engenharia Frontend EPMDEVTECH & Antigravity AI                                         |
| Data de Criação | 2026-10-11                                                                              |
| Alvo            | `src/lib/`, `src/components/`, `src/test/`                                              |

---

## 1. Contexto & Diagnóstico

O site da **BRS Reparações Automotivas** possui layout e identidade visual premium já estabelecidos em TanStack Start (React 19, TypeScript, Tailwind CSS v4, Framer Motion v14).

Para transmitir os valores fundamentais da oficina — precisão técnica, acabamento refinado e confiabilidade —, as animações de scroll e de entrada precisam seguir uma filosofia de **contenção e sobriedade técnica**. O movimento deve parecer um reflexo direto do trabalho artesanal e mecânico da oficina: alinhado, limpo, fluido e controlado, sem saltos, oscilações (bounce), scrolljacking ou atrasos que prejudiquem a usabilidade ou o Largest Contentful Paint (LCP).

Esta especificação define a arquitetura centralizada do sistema de movimento, os tokens normativos, componentes primitivos reutilizáveis e a orquestração seção por seção de acordo com os requisitos estritos do projeto.

---

## 2. Tokens Normativos de Movimento

Todos os valores visuais de animação devem ser centralizados em `src/lib/motion-system.ts`:

- **Duração padrão**: 600ms a 800ms (revelação de máscaras de imagem pode atingir até 1000ms).
- **Curva padrão (Easing)**: Desaceleração suave `cubic-bezier(0.22, 1, 0.36, 1)`. Proibido bounce, spring elástico ou overshoot.
- **Deslocamento de entrada**: 16px a 24px no desktop, 12px no mobile. Sempre vertical (de baixo para cima).
- **Stagger entre itens de um grupo**: 80ms a 120ms (máximo de 4 a 5 itens por grupo).
- **Disparo**: Apenas uma vez (`once: true`), com margem de viewport de `-80px` (`margin: "-80px"`), permitindo que a animação inicie logo antes do elemento estar completamente visível.
- **Propriedades permitidas**: Estritamente `opacity`, `transform` e `clip-path`. Proibido animar `width`, `height`, `top`, `left`, `margin` ou `padding`.

---

## 3. Componentes Primitivos Reutilizáveis

1. `<Reveal>`:
   - Componente de fade + subida vertical com atraso (`delay`) e índice de escalonamento (`staggerIndex`) configuráveis.
   - Suporte transparente a SSR (sem flash de conteúdo invisível nem hidratação quebrada).
   - Detecção global de `prefers-reduced-motion`: degrada graciosamente para transição instantânea ou opacidade pura sem translação.

2. `<ImageReveal>`:
   - Revelação de imagens com máscara `clip-path` abrindo suavemente de baixo para cima como uma cortina de pintura automotiva.
   - Duração calibrada em ~950ms com easing padrão `[0.22, 1, 0.36, 1]`.
   - Suporte a `prefers-reduced-motion` exibindo a imagem imediatamente completa.

---

## 4. Orquestração Seção por Seção

1. **Hero (Acima da dobra)**:
   - Anima no carregamento da página (mount), **não** aguarda rolagem.
   - Sequência escalonada: overline/badge → título (H1) → descrição → botões de ação (CTAs).
   - Imagem de fundo entra com zoom-out suave (escala 1.05 → 1.00).
   - Zero impacto negativo no LCP e conteúdo imediatamente legível.
2. **Header**:
   - Transição suave na rolagem (passando de 40px): altura reduzida, fundo translúcido com `backdrop-blur-md` e borda sutil.
3. **Especialidades (Services - 3 cards)**:
   - Cards entram em stagger com fade + subida.
   - Imagens com `<ImageReveal>` (máscara de baixo para cima).
   - Numeração (`01 / ESPECIALIDADE`) entra ligeiramente antes do título e descrição.
4. **Padrão de Execução (Philosophy - 3 princípios)**:
   - Fade + subida em stagger.
   - Numeração proeminente (`01`, `02`, `03`) entra sutilmente antes dos textos explicativos.
5. **Galeria Antes/Depois (ProjectGallery & BeforeAfterSlider)**:
   - Animação simples de fade no contêiner da seção.
   - Slider sem animações contínuas de rolagem desnecessárias.
   - **Convite de interação**: ao entrar na viewport pela primeira vez, o divisor vertical realiza um deslocamento sutil (~10% do percurso) e retorna à posição inicial, sinalizando que é interativo. Cancelado imediatamente se o usuário interagir.
   - Touch action otimizado (`touch-pan-y`) para permitir rolagem vertical nativa sem travar o dispositivo móvel. Suporte integral a teclado e ARIA.
6. **Etapas do Atendimento (ProcessTimeline - 4 passos)**:
   - Linha de progresso vertical vinculada à rolagem nativa usando `transform: scaleY` (nunca altura).
   - Cada etapa ganha destaque luminoso/opacidade conforme a linha a alcança.
   - Fallback para movimento reduzido com a linha 100% preenchida.
7. **Para Corretores (PartnerSection)**:
   - Textos com fade + subida em stagger.
   - Parallax sutil na imagem (deslocamento máximo de 20px a 30px) ativo **exclusivamente** em desktops (`min-width: 1024px`) e desligado em celulares/tablets.
8. **Leva e Traz (Pickup), Sobre a BRS (About) e CTA Final (FinalCTA)**:
   - Fade + subida simples com `<Reveal>`. Foco limpo no botão de ação no CTA final.
9. **Dúvidas Frequentes (FAQAccordion)**:
   - Transição nativa do Radix Accordion preservada; cabeçalho da seção com `<Reveal>`.
10. **Formulário de Contato & Footer**:
    - Sem animação de scroll no formulário para evitar distração do usuário.
    - Footer com transição sutil de opacidade ou renderização direta.

---

## 5. Critérios de Aceitação (AC)

- **AC-015-01**: Todas as animações utilizam os tokens normativos de duração, curva e deslocamento centralizados em `src/lib/motion-system.ts`.
- **AC-015-02**: Nenhuma animação manipula propriedades além de `opacity`, `transform` e `clip-path`.
- **AC-015-03**: A seção Hero anima no carregamento inicial e nunca permanece invisível aguardando scroll.
- **AC-015-04**: Animações de entrada disparam uma única vez (`once: true`).
- **AC-015-05**: Com `prefers-reduced-motion` ativo, o site é 100% legível, sem translações intensas, com parallax desligado e timeline em estado concluído.
- **AC-015-06**: O slider Antes/Depois suporta toque sem travar a rolagem vertical da página e executa o convite de 10% cancelável ao interagir.
- **AC-015-07**: A linha de progresso das etapas é orientada por rolagem via `transform: scaleY` e possui fallback para movimento reduzido.
- **AC-015-08**: O efeito de parallax existe apenas no desktop e não ultrapassa 30px de deslocamento.
- **AC-015-09**: Nenhum texto, cópia, cor, tipografia ou regra de negócio foi alterada.
- **AC-015-10**: Todos os quality gates (`bun run test`, `bun run lint`, `bun run build`) passam com 100% de sucesso.
