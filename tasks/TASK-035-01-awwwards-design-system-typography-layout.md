# TASK-035-01 — Criação do DESIGN.md, Reformulação da Escala Tipográfica Fluida e Ritmo de Layout (Anti-AI Genericness)

## Metadados

| Campo        | Valor                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| ID           | `TASK-035-01`                                                                                           |
| SPEC         | [`SPEC-035`](../specs/SPEC-035-awwwards-design-system-typography-layout.md)                             |
| Título       | Criação do DESIGN.md, Reformulação da Escala Tipográfica Fluida e Ritmo de Layout (Anti-AI Genericness) |
| Data Criação | 2026-10-14                                                                                              |
| Status       | Completed (Concluído)                                                                                   |
| Responsável  | Creative Director & Principal Design Architect EPM DevTech                                              |
| Branch/Alvo  | `feature/awwwards-redesign`                                                                             |

---

## 1. Escopo de Trabalho

1. **Elaboração e Publicação de `DESIGN.md`**:
   - Criar `DESIGN.md` na raiz do projeto com os pilares da skill Awwwards:
     - Brief & Diagnóstico Canônico.
     - Concept Card (Ideia, Metáfora, Assinatura, Emoção, Verbo de Movimento, Screenshot).
     - Paleta de Cores Estrita por 5 Papéis (`ground`, `ink`, `muted`, `line`, `accent`, `curtain`).
     - Sistema de Tipografia (Sora, Manrope, Mono) e Escala Fluida (`--t-*`).
     - Sistema de Grid, Margens e Spacing Moods (`--space-*`).
     - Plano de Composição por Famílias de Layout (Poster, Index, Par Assimétrico, Parede de Galeria, Ledger, Finale).
     - Relatório do Teste de Anti-Genericalidade de IA (Remoção de gradientes roxos, sombras SaaS e glassmorphism indiscriminado).
2. **Atualização dos Tokens e Utilitários em `src/styles.css`**:
   - Integrar tokens fluidos `--t-mega`, `--t-xl`, `--t-l`, `--t-m`, `--t-body`, `--t-s`, `--t-xs`, `--t-micro`.
   - Adicionar classes e variáveis de ritmo `--space-tight`, `--space-normal`, `--space-airy`, `--space-viewport`.
   - Assegurar que estilos de cartões usem bordas técnicas e fundos discretos com alto contraste.
3. **Criação da Suíte de Testes `src/test/awwwards-design-system.test.tsx`**:
   - Verificar a integridade e conteúdo de `DESIGN.md`.
   - Validar a declaração dos tokens de escala e espaçamento em `src/styles.css`.
   - Garantir a ausência de classes e estilos genéricos de IA (gradientes roxos/violetas planos e kits de cards sem borda técnica).
4. **Execução dos Quality Gates**:
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Critérios de Aceitação Verificáveis

- [x] `DESIGN.md` criado na raiz do repositório contendo todas as seções normativas (Concept Card, Paleta, Tipografia, Grid, Composição, Anti-AI).
- [x] `src/styles.css` atualizado com a escala tipográfica fluida e spacing moods.
- [x] Ausência de gradientes genéricos roxos ou kits de cards flutuantes genéricos.
- [x] Suíte de testes `src/test/awwwards-design-system.test.tsx` criada e passando com 100% de sucesso.
- [x] 100% dos testes Vitest (`bun run test` - 28 arquivos, 195 testes) passam.
- [x] `bun run lint` sem erros e `bun run build` bem-sucedido.
