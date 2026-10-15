# REVIEW-041 — Validação da Remoção do CTA de Avaliação da Hero Section e Foco na Descoberta de Serviços

## 1. Metadados

| Campo   | Valor                                                                               |
| ------- | ----------------------------------------------------------------------------------- |
| SPEC    | [`SPEC-041`](../specs/SPEC-041-remocao-cta-avaliacao-hero-foco-descoberta.md)       |
| TASK    | [`TASK-041-01`](../tasks/TASK-041-01-remocao-cta-avaliacao-hero-foco-descoberta.md) |
| Data    | 2026-10-14                                                                          |
| Status  | Aprovado (100% dos Quality Gates Cumpridos)                                         |
| Revisor | Quality Gate Lead & Senior Frontend/UX-UI Engineer EPM DevTech                      |

---

## 2. Sumário da Entrega

Otimização da jornada do usuário e eliminação de redundância na primeira dobra da Home da **BRS Reparações Automotivas**:

1. **Remoção de CTA Duplicado de Avaliação na Hero Section (`AC-041-01`)**:
   - Como o botão de conversão "Avaliação" já é apresentado em posição de destaque fixo no `Header`, o botão secundário para `/contato` dentro da Hero foi excluído.
   - Eliminou-se a concorrência visual entre dois botões de mesmo destino na primeira dobra.
2. **Destaque do Botão "Ver Especialidades" (`AC-041-02`)**:
   - Mantido como CTA focal único da Hero Section, apontando para `#especialidades`.
   - Adicionado ícone de indicação de rolagem para baixo (`ArrowDown`) com animação sutil no hover (`group-hover:translate-y-1`).
   - Mantida a variante estilística elegante `.btn--secondary` com iluminação dourada e rolagem inercial suave (`useSmoothScroll`).
3. **Responsividade, Alinhamento e Tap Target (`AC-041-03`)**:
   - Container `hero-cta-group` sem espaçamentos órfãos de múltiplos botões.
   - Área de toque mínima de 44px (`min-h-[44px]`), garantindo conformidade com padrões de acessibilidade móvel (WCAG 2.1 AA).
4. **Proteção Automatizada Anti-Regressão (`AC-041-04`)**:
   - Implementada a suíte `src/test/hero-single-cta-discovery.test.tsx` validando que o Hero não renderiza link para `/contato` e que o Header mantém o CTA canônico intacto.

---

## 3. Matriz de Conformidade dos Critérios de Aceite

| Critério      | Descrição                                                                      | Status   | Evidência                                                                                  |
| ------------- | ------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| **AC-041-01** | Remoção de CTA duplicado de avaliação na Hero                                  | Aprovado | `src/components/brs/hero.tsx` atualizado; validado em `hero-single-cta-discovery.test.tsx` |
| **AC-041-02** | Botão "Ver especialidades" como CTA único com ícone de descida e smooth scroll | Aprovado | `src/components/brs/animated-hero.tsx` atualizado com `ArrowDown` e `min-h-[44px]`         |
| **AC-041-03** | Responsividade e área de toque mínima de 44px (WCAG 2.1 AA)                    | Aprovado | Classe `min-h-[44px]` e `hero-cta-group` sem gap órfão                                     |
| **AC-041-04** | Cobertura de testes e Quality Gates 100% aprovados                             | Aprovado | Vitest (34 suítes, 224 testes passando), ESLint (0 erros) e Build Nitro SSR                |

---

## 4. Evidências dos Quality Gates

- **Testes Automatizados (Vitest)**:
  - 34 arquivos de teste executados.
  - 224 testes aprovados com 100% de sucesso (`bun run test`).
- **Linter (ESLint + Prettier)**:
  - 0 erros e 0 avisos em todo o projeto (`bun run lint`).
- **Build de Produção (Vite + Nitro SSR)**:
  - Compilação concluída com sucesso sem erros de tipagem (`bun run build`).
