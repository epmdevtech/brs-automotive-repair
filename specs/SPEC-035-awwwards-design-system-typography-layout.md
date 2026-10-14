# SPEC-035 — Criação do DESIGN.md, Reformulação da Escala Tipográfica Fluida e Ritmo de Layout (Anti-AI Genericness)

## Metadados

| Campo        | Valor                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-035`                                                                                                        |
| Título       | Criação do DESIGN.md, Reformulação da Escala Tipográfica Fluida e Ritmo de Layout (Anti-AI Genericness)           |
| Data Criação | 2026-10-14                                                                                                        |
| Status       | Approved (Aprovada)                                                                                               |
| Autor        | Creative Director & Principal Design Architect EPM DevTech                                                        |
| Prioridade   | Alta (P0)                                                                                                         |
| Impacto      | Raiz do projeto (`DESIGN.md`), tokens em `src/styles.css`, escala tipográfica fluida e ritmo editorial das seções |

---

## 1. Contexto e Motivação

Conforme estabelecido no fluxo normativo de excelência em `~/.agents/skills/awwwards/SKILL.md`:

1. **Artefato Canônico `DESIGN.md`**: Os sites premiados com _Site of the Day_ exigem a documentação explícita de seu conceito central (Brief, Concept Card, Metáfora, Verbo de Movimento, Paleta Nomeada por Papéis, Tipografia e Plano de Composição por Famílias de Layout).
2. **Escala Tipográfica Fluida**: A tipografia é responsável pela maior parte da pontuação de Design no júri Awwwards. O projeto deve adotar uma escala fluida (`clamp(...)`) com contrastes marcantes entre Display e Texto (`--t-mega`, `--t-xl`, `--t-l`, `--t-m`, `--t-body`, `--t-s`, `--t-xs`, `--t-micro`), tracking negativo progressivo para títulos e leading otimizado para legibilidade corporal (16-18px, 1.55-1.65).
3. **Ritmo de Layout & Espaçamento Deliberado**: Evitar espaçamentos verticais estáticos e monótonos; implementar "spacing moods" deliberados (`--space-tight`, `--space-normal`, `--space-airy`, `--space-viewport`) organizados sob um grid de 12 colunas com gutter fluido.
4. **Remoção e Blindagem Contra Padrões Genéricos de IA (Anti-AI Genericness)**:
   - Eliminar ou banir qualquer gradiente roxo/azul plano, nuvens de cor genéricas ou cards flutuantes idênticos com drop shadows suaves.
   - Adotar composições arquiteturais de alta precisão (hairlines finos de 1px a 10% de opacidade, matrizes editoriais divididas, pares assimétricos, chips de telemetria técnica e haloa de iluminação automotiva de estufa).
5. **Preservação e Conformidade**:
   - Manter a fonte única de verdade dos dados da oficina em `src/lib/brs.ts`.
   - Preservar o roteamento multipágina em `@tanstack/react-router`.
   - Cumprir 100% dos quality gates de testes, linter e build.

---

## 2. Requisitos e Critérios de Aceite

- **AC-035-01 (Criação do Artefato Canônico `DESIGN.md`)**:
  - Criar `DESIGN.md` na raiz do repositório conforme especificação da skill Awwwards (Fases 0, 1 e 2).
  - Incluir o Concept Card (Ideia, Metáfora, Assinatura, Emoção, Verbo de Movimento, Frame de Destaque).
  - Definir a paleta estrita de 5 papéis funcionais (`ground`, `ink`, `muted`, `line`, `accent`, `curtain`).
  - Mapear a tipografia ativa (Sora + Manrope + Mono), escala de tipos, regras de forma e famílias de composição por seção.
  - Documentar explicitamente o teste de anti-genericalidade de IA.
- **AC-035-02 (Reformulação dos Tokens de Escala Tipográfica Fluida em `src/styles.css`)**:
  - Definir os tokens fluidos `--t-mega`, `--t-xl`, `--t-l`, `--t-m`, `--t-body`, `--t-s`, `--t-xs`, `--t-micro`.
  - Configurar tracking negativo proporcional (`-0.035em` a `-0.02em`) para display e `text-wrap: balance` nos títulos.
  - Garantir corpo de texto entre 15px e 17px com `max-width: 65ch` e `text-wrap: pretty`.
- **AC-035-03 (Ritmo de Layout & Spacing Moods)**:
  - Implementar classes e tokens de espaçamento vertical consciente:
    - `--space-tight` (subseções, filtros, grupos de telemetria).
    - `--space-normal` (ritmo padrão entre seções principais).
    - `--space-airy` (grandes transições e respiros narrativos).
    - `--space-viewport` (seções de entrada e heroes).
- **AC-035-04 (Erradicação e Blindagem contra Estilos Genéricos de IA)**:
  - Garantir ausência total de gradientes roxos planos, glassmorphism excessivo ou kits genéricos de 3 cards flutuantes com sombras suaves.
  - Assegurar que os cartões adotem bordas técnicas estruturadas (`border-white/10`), fundos discretos (`bg-white/[0.02]` ou `bg-card/40`) e alinhamentos de precisão.
- **AC-035-05 (Validação e Quality Gates)**:
  - Adicionar suite de testes `src/test/awwwards-design-system.test.tsx` cobrindo a existência do `DESIGN.md`, tokens CSS, ausência de gradientes genéricos e conformidade de tipografia.
  - 100% dos testes Vitest devem passar sem regressões.
  - `bun run lint` sem erros e `bun run build` bem-sucedido.
