# SPEC: Refinamento de UI, Motion Design e Microinterações

## Metadados

| Campo                               | Valor                                         |
| ----------------------------------- | --------------------------------------------- |
| ID                                  | SPEC-005                                      |
| Status                              | Implemented                                   |
| Responsável                         | Engenharia de Software EPMDEVTECH             |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH |
| Criado                              | 2026-10-11                                    |
| Atualizado                          | 2026-10-11                                    |
| Lançamento alvo                     | `0.1.0`                                       |
| Briefing de UX relacionado          | Direção de arte BRS: premium, confiança       |
| Especificação de design relacionada | Dark Automotive Premium Design System         |
| ADRs relacionadas                   | N/A                                           |

---

## Problema e resultado

O site da BRS já possui estrutura, conteúdo e identidade definidos, mas o hero, os serviços e as transições entre seções são estáticos. O objetivo é adicionar uma camada de art direction com movimento sóbrio (entrada do hero, transição por expansão de mídia durante a rolagem, spotlight nos serviços, entradas discretas nas seções e CTAs refinados), sem alterar conteúdo comercial, rotas, formulários ou destinos de links.

### Decisões de pesquisa (21st.dev)

| Referência                    | Dependência original | Decisão                                                                                   |
| ----------------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| Animated Hero Section         | `framer-motion`      | Referência de sequência. Implementado com CSS (`animation-delay` escalonado).             |
| Text Reveal                   | `motion`             | Referência de revelação por linha. Implementado com máscara CSS por linha.                |
| Scroll-driven Hero (expansão) | N/A (scroll-driven)  | Padrão adaptado: expansão limitada via `clip-path`, sem sequestro de rolagem.             |
| Spotlight / Card Spotlight    | `framer-motion`      | Referência de iluminação. Implementado com variáveis CSS `--mx/--my` e `radial-gradient`. |

Nenhuma dependência é adicionada: a stack não possui Motion e os efeitos são viáveis com CSS e `IntersectionObserver`.

---

## Escopo

### No escopo (In scope)

- Tokens de movimento (duração, easing, distância, stagger) em `src/styles.css`.
- Hero: fade da fotografia sem afetar LCP, entrada escalonada (eyebrow, linhas do título, subtítulo, descrição, CTAs) e header integrado.
- Transição `MediaExpand` entre hero e serviços (expansão limitada da imagem por progresso de rolagem).
- Microinteração Spotlight nos cards de serviço (somente ponteiro fino com hover) e foco por teclado.
- Refino dos botões: transição, feedback ativo, seta direcional, foco visível e área de toque.
- Entradas discretas (uma vez) em: apresentação, galeria, processo, corretores e CTA final.
- Testes unitários dos utilitários de movimento.

### Fora do escopo (Out of scope)

- Comparador antes/depois (não existem fotografias reais pareadas; proibido inventar resultados).
- Vídeo, WebGL, partículas, bibliotecas de animação novas.
- Alterações de texto comercial, rotas, formulários, dados de contato ou destinos de CTAs.

---

## Critérios de Aceitação

- [AC-005-01] O hero apresenta sequência de entrada curta (até ~1,3 s) sem layout shift e sem atrasar o LCP.
- [AC-005-02] A transição `MediaExpand` usa rolagem nativa (sem scroll hijacking), dimensões previsíveis e estado final completo sem JavaScript.
- [AC-005-03] Os cards de serviço têm spotlight e borda dourada apenas com `(hover: hover) and (pointer: fine)`, e conteúdo integralmente acessível sem hover.
- [AC-005-04] Os botões possuem foco visível, feedback ativo e área de toque mínima de 44 px nos CTAs editoriais.
- [AC-005-05] As entradas de seção ocorrem uma única vez, mantêm conteúdo visível sem JavaScript e não ocultam conteúdo de leitores de tela.
- [AC-005-06] Com `prefers-reduced-motion: reduce`, parallax, expansão e deslocamentos são desativados e o conteúdo permanece visível e funcional.
- [AC-005-07] Nenhuma dependência nova em `package.json`; `make check` aprovado.
