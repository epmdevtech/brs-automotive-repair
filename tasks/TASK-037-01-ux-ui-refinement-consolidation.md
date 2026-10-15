# TASK-037-01 — Execução do Refinamento UX/UI, Consolidação e Hierarquia Editorial BRS

## Metadados

| Campo          | Valor                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Task ID        | `TASK-037-01`                                                          |
| Spec Ref       | `SPEC-037`                                                             |
| Título         | Execução do Refinamento UX/UI, Consolidação e Hierarquia Editorial BRS |
| Status         | Completed                                                              |
| Responsável    | Engenheiro de Software Sênior & Especialista em UX/UI                  |
| Data Início    | 2026-10-14                                                             |
| Data Conclusão | 2026-10-14                                                             |

---

## 1. Escopo de Trabalho

1. **Refatoração da Seção Hero (`src/components/brs/hero.tsx` & `src/components/brs/animated-hero.tsx`)**:
   - Fornecer explicitamente o CTA primário "Solicitar avaliação" (`/contato`) e secundário "Conhecer os serviços" (`/servicos`).
   - Remover marcas decorativas fictícias (`+ BRS.24`, coordenadas GPS) de `AnimatedHero`.
   - Eliminar duplicação entre os blocos de telemetria interna do Hero e o `trust-strip` externo, consolidando em até 3 diferenciais autênticos da BRS em Toledo.
2. **Despoluição e Protagonismo no Antes/Depois (`src/components/brs/home-before-after.tsx`)**:
   - Remover ruído visual secundário (etiquetas HUD `+ ALIGN.X`, `+ ALIGN.Y`, `ESTUDO DE CASO`, `TOLERÂNCIA < 1.0MM`, boxes aninhados de especificações técnicas).
   - Centrar a atenção no `BeforeAfterSlider` e no benefício de recuperação milimétrica sem excesso de massa.
   - Manter um CTA unificado direto para `/trabalhos` e a nota de transparência fotográfica.
3. **Refinamento Editorial de Especialidades e Estética (`src/components/brs/services.tsx`)**:
   - Remover tags cosméticas redundantes (`01 / ESPECIALIDADE`) das 3 especialidades canônicas.
   - Reestruturar a linha de Estética Automotiva & Proteção para um formato editorial compacto e horizontal, sem redundância de cards aninhados pesados.
4. **Consolidação de Diferenciais e Processo de Atendimento**:
   - Unificar a coexistência de `Philosophy` e `ProcessTimeline`, evitando duas seções de mesmo fundo cinza (`bg-secondary`) com argumentos redundantes.
   - Estruturar em uma narrativa lógica coesa: diferenciais reais integrados seguidos pelas 4 etapas de atendimento (Primeiro contato, Avaliação técnica, Orçamento e alinhamento, Reparação e entrega).
5. **Navegação Secundária e CTA Final**:
   - Aliviar o peso visual de `HomePathways` para não competir com a ação principal da página.
   - Garantir que `FinalCTA` seja direto, transparente e focado na conversão para avaliação e contato pelo Instagram oficial.
6. **Testes e Validação Contínua**:
   - Criar `src/test/ux-ui-refinement.test.tsx` cobrindo a nova hierarquia, ausência de elementos HUD decorativos e acessibilidade.
   - Garantir 100% dos testes Vitest passando, zero erros de linter e build do Vite/Nitro SSR verde.

---

## 2. Checklist de Execução

- [x] Refatorar `src/components/brs/hero.tsx` e `src/components/brs/animated-hero.tsx`
- [x] Refatorar `src/components/brs/home-before-after.tsx`
- [x] Refatorar `src/components/brs/services.tsx`
- [x] Consolidar narrativa de princípios e fluxo de atendimento em `src/components/brs/process-timeline.tsx` e `src/components/brs/philosophy.tsx` (ou seção unificada em `website.tsx`)
- [x] Ajustar `src/components/brs/home-pathways.tsx` e `src/components/brs/final-cta.tsx`
- [x] Criar suite de testes `src/test/ux-ui-refinement.test.tsx`
- [x] Executar e validar `bun run test` (todos os 30 arquivos de teste)
- [x] Executar e validar `bun run lint`
- [x] Executar e validar `bun run build`
- [x] Gerar `reviews/REVIEW-037-ux-ui-refinement-consolidation.md` e atualizar `PROJECT.md`
