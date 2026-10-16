# SPEC-067 — Hero com Abertura Cinematográfica, Zoom Lento e Reflexo de Luz na Lataria

| Campo       | Valor                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| ID          | `SPEC-067`                                                               |
| Status      | Approved                                                                 |
| Data        | 2026-10-16                                                               |
| Autor       | Senior Frontend & Motion Design Engineer (Universal SDD)                 |
| Tarefas     | `TASK-067-01`                                                            |
| Revisores   | Engenharia de Software, UX/UI Design e Governança EPM DEVTECH            |
| Refs        | Universal SDD Framework; SPEC-032 (Awwwards Redesign); SPEC-064 (Home SEO) |

---

## 1. Contexto e Problema

A página inicial da **BRS Reparações Automotivas** possui uma fotografia principal de alto impacto visual (Hero LCP). No entanto, todos os elementos da interface apareciam de forma imediata e a imagem de fundo possuía um overlay escuro excessivo em toda a extensão, ocultando os reflexos naturais da pintura e lataria do veículo.

Para proporcionar uma experiência digital de nível internacional (Awwwards standard) condizente com a precisão artesanal e tecnologia de ponta da oficina de funilaria, pintura em estufa e martelinho de ouro, é necessária uma **sequência de abertura cinematográfica coreografada**, com entrada faseada dos elementos da interface, clareamento do veículo, início suave de zoom lento e a passagem de um reflexo de luz único sobre a lataria do carro (simulando o brilho sobre um verniz recém-polido).

---

## 2. Escopo e Requisitos Funcionais

### RF-067-01 — Sequência Temporal de Entrada (CSS Keyframes & Variáveis)
1. Centralizar tempos em variáveis CSS parametrizáveis no `:root` e no componente Hero:
   - `0,0 s`: Imagem de fundo visível desde o primeiro paint (LCP preservado, sem layout shift, sem opacidade 0). Nenhuma UI visível inicialmente.
   - `0,8 s`: Header institucional entra (fade-in + translateY de -12px para 0, duração 0,7 s).
   - `1,5 s`: Eyebrow ("OFICINA TÉCNICA ESPECIALIZADA • TOLEDO, PR") entra (fade-in + translateY de 12px para 0).
   - `1,8 s`: Título H1 entra (fade-in + translateY de 16px para 0, duração 0,9 s).
   - `2,4 s`: Parágrafo de diagnóstico e orçamento entra suavemente.
   - `2,9 s`: Grupo de CTAs (Solicitar avaliação e Ligação telefônica) entra.
   - `3,4 s`: Linha inferior (endereço, horário e aviso de fotografia ilustrativa) entra.
   - `~4,2 s`: Com toda a UI visível, inicia o zoom lento da imagem de fundo (escala de 1.00 para 1.10 em 24 s no desktop, com `transform-origin` no enquadramento do veículo).
   - `~4,6 s`: Disparo do reflexo de luz sobre a lataria (duração 1,8s a 2,2s, passagem única).
2. Versão Mobile (telas <= 768px):
   - Sequência acelerada (total ~3s).
   - Zoom suave de 1.00 para 1.05.
   - Reflexo com duração de 1,4s.
   - `object-position` ajustado para garantir enquadramento do veículo.

### RF-067-02 — Reflexo de Luz na Lataria (Light Flare Pass)
1. Elemento decorativo dedicado (`hero-light-flare`) posicionado dentro do container do Hero com `overflow: hidden`.
2. Empilhamento estrito de camadas (Z-Index):
   - Camada 1 (base): Imagem de fundo com animação de zoom.
   - Camada 2: Reflexo de luz (`hero-light-flare`).
   - Camada 3: Gradiente de legibilidade escuro posicionado atrás do texto (esquerda).
   - Camada 4: Conteúdo textual, botões e interações (UI).
   * O reflexo nunca passa por cima do texto.
3. Estilização da faixa de reflexo: inclinação diagonal de ~20 graus, gradiente de transparente para branco quente ligeiramente dourado (`rgba(255, 248, 230, 0.35)` / tonalidade da marca BRS) e volta para transparente, com bordas suavizadas.
4. Animação de `translateX`, cruzando o capô e para-lama da esquerda para a direita uma única vez (`iteration-count: 1`, `fill-mode: forwards`), terminando com opacidade 0 e remoção de `will-change`.

### RF-067-03 — UX, Interatividade e SSR Estrito
1. **SSR Paridade**: O texto completo do H1, eyebrow, descrição, botões e microdados deve constar no HTML original retornado pelo servidor. Proibido o uso de `display: none` ou renderização condicional em JS para esconder o conteúdo inicial.
2. **Interatividade Precoce**: Links e botões permanecem focáveis e clicáveis desde o início (sem bloqueio de `pointer-events`).
3. **Interação Antecipa a Abertura (Fast-Forward)**: Caso o usuário role a página, clique, toque ou pressione qualquer tecla durante a animação de abertura, a UI é imediatamente revelada em seu estado 100% visível, e o zoom da imagem continua normalmente sem sobressaltos.
4. **Flag em Escopo de Módulo (`hasPlayedIntro`)**:
   - `hasPlayedIntro = false` no servidor e na primeira passagem de hidratação.
   - Vira `true` após a primeira execução no cliente.
   - Navegações internas posteriores via SPA para `/` renderizam o Hero imediatamente no estado final com o zoom ativo e sem repetir a abertura nem o reflexo.
5. **Acessibilidade (`prefers-reduced-motion: reduce`)**:
   - Supressão imediata de zoom, reflexo, deslocamentos e delays. Todo o conteúdo é renderizado estático e 100% visível.
6. **Page Visibility**: Se a aba for ocultada (`document.visibilityState === "hidden"`), a animação é pausada ou concluída.

### RF-067-04 — Ajustes Editoriais e de Contraste no Hero
1. Clarear o overlay sobre o veículo: gradiente escuro focado no lado esquerdo com fade-in sincronizado com a entrada do texto.
2. H1: aplicar `text-wrap: balance` e espaços inseparáveis (`&nbsp;`) para evitar quebras inadequadas em "martelinho&nbsp;de&nbsp;ouro" e "pintura&nbsp;em&nbsp;estufa".
3. Terminologia unificada: substituir "cabine" por "estufa" no parágrafo descritivo.
4. Linha inferior: aumentar tamanho da fonte e contraste de "Fotografia ilustrativa" e endereço/horário para legibilidade perfeita.
5. Adicionar CTA secundário de ligação com o telefone existente no site: `(45) 2035-9440` (`tel:+554520359440`).

---

## 3. Critérios de Aceite (AC)

- **AC-067-01**: Na primeira carga da home, apenas a fotografia de fundo é exibida nos primeiros 0,8s; a seguir, header, eyebrow, h1, descrição, CTAs e rodapé entram na sequência e tempos estipulados.
- **AC-067-02**: O zoom lento na imagem inicia após a UI estar visível (~4,2s) e atinge escala de 1.10 em ~24s sem deslocar o texto.
- **AC-067-03**: O reflexo de luz cruza a lataria do veículo uma única vez, posicionando-se visualmente atrás do gradiente de legibilidade e do texto, terminando invisível.
- **AC-067-04**: O H1 e todo o conteúdo textual estão presentes no HTML inicial gerado pelo SSR.
- **AC-067-05**: Ao interagir (scroll, clique, teclado), a animação de entrada da UI completa imediatamente.
- **AC-067-06**: Ao navegar para outra rota e retornar para `/`, a sequência de abertura não se repete.
- **AC-067-07**: Sob `prefers-reduced-motion: reduce`, toda a composição aparece estável e visível sem zoom ou reflexo.
- **AC-067-08**: Quality gates aprovados: `bun run test`, `bun run lint` e `bun run build`.
