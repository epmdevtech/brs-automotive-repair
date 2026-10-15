# TASK-051-01: Reformulação de UX/UI dos Status Operacionais, Badges, Indicadores e Filtros no Painel BRS

## Metadados

| Campo              | Valor                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Task ID            | TASK-051-01                                                          |
| Spec Ref           | SPEC-051                                                             |
| Status             | Concluído                                                            |
| Data de Atribuição | 2026-10-15                                                           |
| Data de Conclusão  | 2026-10-15                                                           |
| Responsável        | Engenheiro de Software Sênior, Product Designer & TanStack Fullstack |

---

## 1. Escopo de Implementação

1. **Revisão Semântica das Cores e Rótulos (`status.ts`)**:
   - Mapear `PENDING` para Aberto (Azul);
   - Mapear `CONFIRMED` para Em Andamento (Âmbar);
   - Mapear `COMPLETED` para Concluído (Verde);
   - Mapear `CANCELLED` para Cancelado (Vermelho);
   - Mapear `NO_SHOW` para Fechado / Não Compareceu (Cinza);
   - Suporte a transição para `NO_SHOW` na FSM e exportação de utilitários de estilo e ícones.

2. **Criação do Componente de Badge Padronizado (`status-badge.tsx`)**:
   - Componente acessível com ícone SVG, texto legível e contraste WCAG AA;
   - Usado na grade, lista, modal de processo e rotas públicas.

3. **Redesign dos Cards na Grade Diária (`admin-grid-view.tsx`)**:
   - Fundo neutro off-white, eliminando a predominância de verde;
   - Borda lateral esquerda semântica (`border-l-4`) associada ao status;
   - Protocolo em cor neutra e `StatusBadge` explícito.

4. **Inclusão do Status na Visualização em Lista (`admin-grid-view.tsx`)**:
   - Adicionar badge de status em cada registro da lista;
   - Hierarquia clara de escaneamento visual para analistas.

5. **Barra de Filtros Operacionais por Status**:
   - Filtro interativo: Todos, Abertos, Em Andamento, Concluídos, Cancelados;
   - Filtragem síncrona na grade e lista.

6. **Indicadores Numéricos no Topo (KPIs)**:
   - Métricas calculadas por situação: Total, Em Andamento, Concluídos, Abertos/Cancelados.

7. **Clarificação dos Botões no Modal (`customer-process-dialog.tsx`)**:
   - Rótulo explícito "Fechar Janela" para desambiguação com encerramento de atendimento;
   - Opção de encerramento administrativo (Não Compareceu / Fechado) se aplicável.

8. **Testes Automatizados & Quality Gates**:
   - Testar semântica das cores, badges, contadores de KPI, filtros por status e atualização imediata pós-mutação;
   - `bun run test` 100% verde;
   - `bun run lint` 0 erros;
   - `bun run build` sem erros;
   - Atualizar `PROJECT.md` e sincronizar matriz de rastreabilidade.
