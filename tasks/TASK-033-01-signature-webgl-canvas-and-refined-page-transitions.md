# TASK-033-01 — Implementação da Signature WebGL/Canvas Experience e Transições Refinadas

## Metadados

| Campo        | Valor                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| ID           | `TASK-033-01`                                                                          |
| SPEC         | [`SPEC-033`](../specs/SPEC-033-signature-webgl-canvas-and-refined-page-transitions.md) |
| Título       | Implementação da Experiência Signature Canvas/WebGL e Transições de Página Refinadas   |
| Data Criação | 2026-10-14                                                                             |
| Status       | Completed (Concluída)                                                                  |
| Responsável  | Lead Creative Technologist & WebGL / Motion Architect                                  |
| Branch/Alvo  | `feature/awwwards-redesign`                                                            |

---

## 1. Escopo de Trabalho

1. **Desenvolvimento do Componente SignatureCanvas**:
   - Criado `src/components/brs/signature-canvas.tsx`:
     - Sistema de partículas com física inercial (pigmentos metálicos dourados e laser de alinhamento).
     - Interatividade: atração/repulsão com o cursor do mouse e onda de dispersão ao clique.
     - Controles HUD sutis de alternância de modo ("Verniz Metálico" vs. "Alinhamento a Laser").
     - Proteção de pointer events (`pointer-events-none` nas áreas transparentes) para não interferir nos cliques da UI.
     - Pausa em segundo plano via `visibilitychange` e desativação com `prefers-reduced-motion`.
2. **Integração no Hero**:
   - Atualizado `src/components/brs/animated-hero.tsx` incorporando o canvas de partículas como camada atmosférica signature entre o background da imagem e os elementos de texto.
3. **Refinamento de PageTransition**:
   - Atualizado `src/components/ui/page-transition.tsx`:
     - Adicionada barra indicadora de varredura laser na navegação de rotas com brilho dourado (`RouteProgressBar`).
     - Transição de entrada suave combinando fade, escala e deslocamento vertical mínimo (8px) com easing `[0.22, 1, 0.36, 1]`.
     - Preservação integral do gerenciamento de estado da UI e de roteamento.
4. **Suíte de Testes e Validação**:
   - Criado `src/test/signature-canvas.test.tsx` testando renderização, modos de visualização, acessibilidade e respeito a reduced motion.
   - Executados `bun run test` (26 arquivos de teste, 184 testes com 100% de sucesso), `bun run lint` (0 erros) e `bun run build` (sucesso).

---

## 2. Critérios de Aceitação Verificáveis

- [x] `SignatureCanvas` inicializa o contexto 2D/WebGL e renderiza partículas sem bloquear a interação do usuário nos botões da página.
- [x] O canvas pausa a execução quando a aba está oculta ou sob `prefers-reduced-motion`.
- [x] O Hero integra a experiência canvas preservando 100% dos textos, H1, badges e links.
- [x] O `PageTransition` anima transições de rota de forma cinemática sem afetar estados de formulário ou scroll restoration.
- [x] 100% dos testes Vitest passam (`bun run test` - 26 arquivos, 184 testes).
- [x] `bun run lint` sem erros e `bun run build` bem-sucedido.
