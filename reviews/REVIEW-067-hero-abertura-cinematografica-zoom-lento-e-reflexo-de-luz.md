# REVIEW-067 — Revisão de Engenharia: Hero com Abertura Cinematográfica, Zoom Lento e Reflexo de Luz

| Campo       | Valor                                                    |
| ----------- | -------------------------------------------------------- |
| SPEC        | `SPEC-067`                                               |
| TASK        | `TASK-067-01`                                            |
| Data        | 2026-10-16                                               |
| Status      | Aprovado                                                 |
| Revisor     | Senior Frontend & Motion Design Engineer (Universal SDD) |

---

## 1. Resumo da Implementação

Foi implementada com sucesso a abertura cinematográfica para a seção Hero da página inicial da BRS Reparações Automotivas, cumprindo com precisão milimétrica todas as diretrizes de UX, motion design e performance web da especificação `SPEC-067`.

### Principais Destaques Arquiteturais:
- **CSS Puro para Sequência e Motion**: Eliminação de sobreposição concorrente de engines na mesma árvore do Hero (Framer Motion removido do Hero; mantido GSAP estritamente para o halo interativo de cursor). Todo o sequenciamento de revelação, slow zoom da imagem e reflexo de luz único foi implementado via `@keyframes` CSS e variáveis customizadas parametrizáveis no `:root`.
- **4 Camadas Visuais Estritas**:
  1. *Camada 1 (Inferior)*: Foto de alta resolução com prioridade máxima de carregamento (`fetchpriority="high"`, `loading="eager"`, sem `display:none`) e zoom lento de 1.00 para 1.10 ao longo de 24s.
  2. *Camada 2*: Faixa de reflexo de luz dourada (`hero-light-flare`) com passagem diagonal única sobre a lataria do veículo (`iteration-count: 1`, `fill-mode: forwards`), calibrada com `mix-blend-mode: soft-light` e término 100% invisível.
  3. *Camada 3*: Gradiente de legibilidade escuro à esquerda e aberto/claro à direita sobre o veículo para preservar o brilho e acabamento da pintura.
  4. *Camada 4 (Superior)*: Interface do usuário (Header, Eyebrow, H1, Descrição, CTAs e Rodapé do Viewport) revelados progressivamente com atrasos escalonados.
- **Interatividade Contínua & Skip Precoce**:
  Nenhum clique ou foco é bloqueado durante a abertura (`pointer-events` ativos). Se o visitante rolar (`wheel`), tocar (`touchstart`), teclar (`keydown`) ou clicar (`click`), a introdução é instantaneamente completada (`hero-intro-complete`), exibindo todos os elementos sem saltos visuais.
- **Persistência de Sessão SPA em Memória**:
  Uso de flag volátil de módulo (`hero-cinematic-state.ts`), garantindo valor `false` no servidor (sem hydration mismatch) e transição para `true` após a primeira reprodução. Navegações subsequentes pelo router TanStack exibem o Hero estável sem re-executar a introdução.
- **Acessibilidade e Reduced Motion**:
  Compatibilidade total com `@media (prefers-reduced-motion: reduce)`, desativando imediatamente a animação e exibindo a composição estável.

---

## 2. Arquivos Modificados e Criados

| Arquivo | Natureza | Descrição |
| --- | --- | --- |
| `specs/SPEC-067-hero-abertura-cinematografica-zoom-lento-e-reflexo-de-luz.md` | Novo | Especificação de arquitetura e requisitos aprovada |
| `tasks/TASK-067-01-hero-abertura-cinematografica-zoom-lento-e-reflexo-de-luz.md` | Novo | Plano de tarefas detalhado e concluído |
| `src/lib/hero-cinematic-state.ts` | Novo | Módulo seguro com flag de estado SPA em memória |
| `src/styles.css` | Modificado | Tokens `:root`, keyframes CSS e regras para as 4 camadas |
| `src/components/brs/header.tsx` | Modificado | Animação `heroHeaderDrop` restrita à home na primeira visita |
| `src/components/brs/hero.tsx` | Modificado | H1 balanceado com espaços inseparáveis e unificação "estufa" |
| `src/components/brs/animated-hero.tsx` | Modificado | Estrutura de 4 camadas, listeners de skip e visibilidade |
| `src/test/hero-cinematic-opening-spec067.test.tsx` | Novo | Suíte unitária/integração com 7 testes dedicados |
| `e2e/hero-cinematic.spec.ts` | Novo | Suíte E2E Playwright validando desktop, mobile e reduced-motion |
| `src/test/hero-colors.test.tsx` | Modificado | Atualização para compatibilidade com "estufa" e espaços |
| `src/test/monochromatic-headings.test.tsx` | Modificado | Normalização de espaços inseparáveis no H1 |
| `src/test/typography.test.tsx` | Modificado | Normalização de espaços inseparáveis no H1 |
| `PROJECT.md` | Modificado | Registro canônico da SPEC-067 e TASK-067-01 |

---

## 3. Evidências de Qualidade e Gates

1. **Linter**:
   ```bash
   $ bun run lint
   ✖ 7 problems (0 errors, 7 warnings)
   ```
2. **Testes Unitários / Integração**:
   ```bash
   $ bun vitest run
   55 test files passed (100% sucesso)
   ```
3. **Testes End-to-End**:
   ```bash
   $ bun x playwright test e2e/hero-cinematic.spec.ts
   3 passed (31.2s)
   ```
4. **Compilação SSR / Produção**:
   ```bash
   $ bun run build
   ✓ built in 1.91s (Vite + Nitro SSR)
   ```

---

## 4. Parecer do Revisor

Aprovado para mesclagem no branch canônico sem qualquer restrição técnica pendente.
