# SPEC-049: Detalhe Expansível do Processo Completo do Cliente e Garantia de Seed Ativo no Painel de Agendamentos

## Metadados

| Campo       | Valor                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| SPEC ID     | SPEC-049                                                                                              |
| Título      | Detalhe Expansível do Processo Completo do Cliente e Garantia de Seed Ativo no Painel de Agendamentos |
| Status      | Aprovado                                                                                              |
| Data        | 2026-10-15                                                                                            |
| Autor       | Engenheiro de Software Sênior & Arquiteto TanStack Fullstack                                          |
| Relacionado | SPEC-045, SPEC-046, SPEC-047, SPEC-048                                                                |

---

## 1. Contexto e Motivação

Durante a homologação prática do painel de agendamento dos técnicos (`/agendamentos`), observou-se que clientes ou avaliadores podem encontrar a grade vazia (0 atendimentos, 0 confirmados, 0 coletas) caso o armazenamento local já contenha registros legados de testes anteriores em outras datas. Além disso, o operador da oficina e avaliadores necessitam de um mecanismo claro para inspecionar em profundidade a jornada de cada cliente: ao selecionar qualquer agendamento na grade, lista ou rota Leva e Traz, deve expandir uma visão detalhada exibindo todo o histórico do processo, destacando com precisão quando o cliente realizou o cadastro, a pré-OS de avarias, dados do veículo e opções operacionais integradas.

---

## 2. Requisitos Funcionais

1. **Garantia de Seed Ativo e Resiliente no Painel**:
   - O método `ensureSeedData` deve verificar se existem agendamentos para o dia visualizado ou se os dados demonstrativos precisam ser inseridos/mesclados.
   - Caso o painel carregue com 0 atendimentos para a data corrente (`currentDate`), a aplicação deve injetar automaticamente os agendamentos demonstrativos realistas, garantindo que a grade nunca seja apresentada vazia em ambiente demonstrativo.
   - Preservar integridade dos registros criados pelo usuário enquanto garante a presença dos atendimentos de demonstração da BRS.

2. **Modal / Drawer Expansível do Processo do Cliente (`CustomerProcessDialog`)**:
   - Ao clicar em qualquer card de agendamento na grade diária, na lista cronológica ou no roteiro Leva e Traz, deve abrir um diálogo com acessibilidade Radix UI.
   - **Registro de Cadastro ("Quando cadastrou")**: Exibir em destaque a data e hora exata da submissão do formulário (`createdAt`), formatada na timezone oficial (`America/Sao_Paulo`), com cálculo de tempo relativo decorrido (ex: _"Cadastrado hoje às 08:30 (há 3 horas)"_) e identificação da origem ("Auto-Agendamento Web BRS").
   - **Linha do Tempo Visual do Atendimento (Timeline)**:
     - Etapa 1: _Intake & Cadastro Online Concluído_ (com timestamp do cadastro).
     - Etapa 2: _Confirmação Automática na Grade Técnica_ (sem necessidade de aprovação da oficina).
     - Etapa 3: _Recepção Presencial ou Rota Leva e Traz_ (endereço de Toledo-PR se aplicável).
     - Etapa 4: _Vistoria Técnica & Perícia Estrutural_ (com o especialista atribuído).
     - Etapa 5: _Orçamento & Sinistro_ (particular vs. cobertura de seguradora).
     - Etapa 6: _Execução & Entrega com Garantia BRS_.
   - **Ficha do Veículo**: Marca, modelo, ano, placa estilizada padrão Mercosul, cor e tipo de acabamento da pintura.
   - **Diagnóstico Técnico de Avarias (Anamnese)**: Tipo de dano, áreas afetadas com badges visuais, descrição livre da colisão/avaria informada e indicação de sinistro/seguradora.
   - **Logística & Deslocamento**: Presencial na oficina vs. Leva e Traz com endereço completo em Toledo-PR, ponto de referência e pessoa de contato.
   - **Ações Rápidas**:
     - Botão direto para WhatsApp com mensagem da Pré-OS pronta.
     - Botão para cópia do resumo estruturado para a Ordem de Serviço da oficina.
     - Transição de status (Concluir Atendimento, Cancelar, Reabrir).
     - Ação de impressão/exportação técnica.

---

## 3. Critérios de Aceitação

- **AC-049-01**: Ao carregar a página `/agendamentos` e logar, a grade do dia exibe os 5 agendamentos distribuídos entre os técnicos (Bruno, Técnico Martelinho, Técnico Pintura), totalizando 5 atendimentos, 5 confirmados e 2 coletas Leva e Traz.
- **AC-049-02**: Clicar em qualquer card de agendamento abre o componente `CustomerProcessDialog`.
- **AC-049-03**: O modal exibe claramente o horário de cadastro (`createdAt`), o protocolo, a timeline de 6 etapas, os dados do cliente, do veículo e da anamnese de avarias.
- **AC-049-04**: As ações de WhatsApp, cópia de Pré-OS e transição de status funcionam dentro do modal expansível.
- **AC-049-05**: 100% de sucesso nos testes automatizados (`bun run test`), conformidade no linter (`bun run lint`) e compilação do bundle (`bun run build`).
