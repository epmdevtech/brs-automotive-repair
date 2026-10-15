# TASK-057-01: Implementação da Linha do Tempo Operacional com RBAC e Trilha de Auditoria

## Metadados

| Campo       | Valor                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| Task ID     | TASK-057-01                                                                                              |
| Spec Ref    | SPEC-057                                                                                                 |
| Título      | Implementação da Linha do Tempo Operacional com RBAC, Trilha de Auditoria e Acessibilidade (WCAG 2.2 AA) |
| Status      | Concluído                                                                                                |
| Data        | 2026-10-15                                                                                               |
| Responsável | Staff Product Designer & Engenheiro Front-end Sênior                                                     |
| Módulo      | `features/booking`                                                                                       |

---

## 1. Escopo de Trabalho

1. **Configuração e Tipagem Canônica (`etapas.config.ts`)**:
   - Centralizar as 6 etapas normativas, regras de conclusão, rótulos de progresso e tipos `marco` vs `atividade`.
2. **Modelo de Dados & Funções Puras (`etapas.ts`)**:
   - Implementar `estadoEtapas`, `etapaAtual`, `progresso`, `situacao` e `podeExecutar`.
   - Implementar formatador seguro de data/hora (`America/Sao_Paulo`) sem partículas órfãs ("às" ou "por").
3. **Mutações com Pré-condição e Idempotência**:
   - Operações `concluirEtapa`, `desfazerEtapa` (janela de 10s), `reverterEtapa` (justificativa ≥10 chars) e `pedirAtualizacao` (cooldown 15m).
4. **Interface Visual (`TimelineOperacional`)**:
   - Stepper horizontal alinhado com altura de 3 linhas em desktop (≥1024px) e vertical em mobile.
   - Painel de ação dinâmico por papel, alerta de inatividade (>120min), Sheet de histórico e Dialog de reversão.
5. **Atualização dos Consumidores**:
   - Adaptar `ProcessStepper`, `customer-process-dialog.tsx`, `kanban-board.tsx` e `admin-grid-view.tsx` para as 6 etapas canônicas.
6. **Qualidade e Testes**:
   - Suíte abrangente `src/test/etapas-timeline-rbac.test.tsx` cobrindo todas as permissões, derivações e formatadores.

---

## 2. Checklists de Validação

- [x] Cada etapa só pode ser concluída pelo papel definido; os demais veem "Aguardando: <papel>".
- [x] Concluir exige 1 toque e tem "Desfazer" por 10 s; sem modal para o avanço normal.
- [x] Reverter exige justificativa ≥10 caracteres e fica no histórico; técnico não reverte.
- [x] Cada etapa concluída mostra hora e autor; nenhum "às" ou "por" solto em nenhum caso de dado ausente.
- [x] Etapas 1 e 2 (marcos) nunca exibem "Em execução" nem selo de tempo parado.
- [x] Selo "Sem atualização há X h" só em atividades atuais acima do limite.
- [x] Dois usuários concluindo a mesma etapa: um sucesso, o outro recebe aviso de conflito, sem duplicar evento.
- [x] Cabeçalho mostra "Etapa X de 6 · N concluída(s)".
- [x] Stepper horizontal alinhado em ≥1024px e vertical abaixo disso, sem rolagem horizontal em 390, 768, 1024, 1366, 1920.
- [x] Contraste ≥4.5:1 (incluir "Pendente"); alvos ≥44px; leitor de tela anuncia etapa atual e mudanças.
- [x] Mini-stepper, abas com contador e Kanban refletem as 6 etapas reais a partir das mesmas funções derivadas.
- [x] Testes unitários passando com 100% de sucesso.
