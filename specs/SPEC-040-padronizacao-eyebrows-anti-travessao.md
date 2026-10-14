# SPEC-040 — Padronização Tipográfica dos Rótulos de Seção (Eyebrows) e Remoção de Travessões e Pseudo-elementos Artificiais

## Metadados

| Campo        | Valor                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-040`                                                                                           |
| Título       | Padronização Tipográfica dos Rótulos de Seção (Eyebrows) e Remoção de Travessões Artificiais         |
| Data Criação | 2026-10-14                                                                                           |
| Status       | Approved (Aprovada)                                                                                  |
| Autor        | Engenheiro Frontend Sênior & Especialista em UX/UI Design EPM DevTech                                |
| Prioridade   | Alta (P0)                                                                                            |
| Impacto      | `src/styles.css`, `src/components/brs/*`, `src/routes/*`                                              |

---

## 1. Contexto e Motivação

Identificou-se na aplicação a presença de um padrão repetitivo de travessão decorativo antes de cada rótulo de seção (`eyebrow` / section tags), gerado através do pseudo-elemento CSS `.eyebrow::before` (`width: 20px; height: 1px; background: var(--primary)`).

Esse padrão:
1. Confere aspecto estereotipado e genérico de templates gerados por IA.
2. Desloca horizontalmente o texto do rótulo, quebrando o alinhamento óptico com os títulos principais (`h1`/`h2`) das seções.
3. Cria poluição visual desnecessária em interfaces institucionais que prezam por precisão técnica, minimalismo e sofisticação editorial.

---

## 2. Requisitos e Critérios de Aceite

### AC-040-01 — Remoção Completa de Travessões e Pseudo-elementos em Eyebrows
- Eliminar integralmente o pseudo-elemento `.eyebrow::before` em `src/styles.css`.
- Assegurar a ausência de travessões (`—`, `-`), traços horizontais ou marcadores gráficos decorativos pré-fixados aos rótulos de seção em todos os componentes da aplicação.
- Limpar pontos decorativos redundantes dentro de tags de eyebrow (ex.: em `media-expand.tsx`).

### AC-040-02 — Refinamento Tipográfico Normativo da Classe `.eyebrow`
- Atualizar a classe `.eyebrow` em `src/styles.css` e tokens correspondentes com as seguintes diretrizes:
  - `font-size`: `0.75rem` (`text-xs`, 12px)
  - `font-weight`: `var(--weight-semibold)` (600) ou `var(--weight-medium)` (500)
  - `letter-spacing`: `0.2em` / `tracking-[0.2em]` (uppercase espaçado e legível)
  - `text-transform`: `uppercase`
  - `color`: `var(--primary)` (dourado/âmbar normativo da BRS)
  - Alinhamento vertical e óptico perfeito e flush com o título principal (`h1`/`h2`) subsequente.

### AC-040-03 — Verificação Global e Consistência em Todas as Rotas
- Garantir que todos os rótulos de seção (Hero, Especialidades, Antes/Depois, Filosofia, Processo, Linha de Estética, Contato, Rotas de Serviços, Sobre, Corretores, Trabalhos e Proposta) sigam o mesmo padrão limpo e sem traços órfãos.

### AC-040-04 — Quality Gates e Testes Automatizados
- Criar a suíte `src/test/eyebrows-standardization.test.tsx` validando que nenhum elemento `.eyebrow` renderiza travessões no início ou traços órfãos, e que as propriedades tipográficas normativas são cumpridas.
- Garantir 100% dos testes Vitest passando, zero erros no linter e build de produção bem-sucedido.
