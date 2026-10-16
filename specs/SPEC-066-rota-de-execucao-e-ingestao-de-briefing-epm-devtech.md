# SPEC-066 — Rota de Execução e Ingestão de Briefing Multinicho (EPM DevTech | BRS Reparações)

| Campo     | Valor                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| ID        | `SPEC-066`                                                                                                  |
| Status    | Approved                                                                                                    |
| Data      | 2026-10-16                                                                                                  |
| Autor     | Engenharia de Integrações & Arquiteto Frontend EPM DEVTECH                                                  |
| Tarefas   | `TASK-066-01`                                                                                               |
| Revisores | Engenharia de Software, Produto e Governança Universal SDD                                                  |
| Refs      | Universal SDD Framework; SPEC-027 (Proposta Comercial); SPEC-045 (Agendamento DDD); Protocolo EPM-Briefings |

---

## 1. Contexto e Problema

A **EPM DEVTECH** desenvolveu o motor padronizado `epm-briefings` para coleta e ingestão determinística de requisitos, dados cadastrais, regras de negócio e configurações de agendamento em múltiplos nichos.

Para a **BRS Reparações Automotivas**, é necessário disponibilizar uma rota web especializada e confidencial onde o cliente (ou a equipe de engenharia durante o alinhamento técnico) possa **executar, preencher, revisar e exportar o briefing completo**.

### Requisitos Mandatórios de Governança:

1. **Omissão Estrita de Menus**: A rota de briefing NÃO deve constar no menu de navegação do site (`primaryNavigation`), nem no `Header`, nem no `Footer`, nem em sitemaps públicos (`sitemap.xml`), preservando a privacidade institucional e o foco comercial do site público.
2. **SEO & Confidencialidade**: Configuração estrita de metadados `<meta name="robots" content="noindex, nofollow">`.
3. **Zero Hardcoding de Nicho**: Componentes e validações estruturados em schemas desacoplados (Zod / TypeScript), suportando atributos dinâmicos do nicho de oficina automotiva (marca/modelo/placa de veículo, sintoma, auto socorro, certificações técnicas).
4. **Conformidade de Acessibilidade e Contraste**: Validação em tempo de execução das cores fornecidas contra as diretrizes WCAG 2.2 AA (mínimo de 4.5:1 para texto padrão e 3.0:1 para elementos de destaque).
5. **Persistência e Exportação Ponta a Ponta**: Salvamento de rascunho com debounce no `localStorage`, opção de importação de JSON existente, e exportação determinística dos artefatos canônicos:
   - `briefing-completo.json` (todas as etapas preenchidas).
   - `booking-config.json` (configuração estruturada pronta para o motor `epm-booking`).
   - Resumo formatado para comunicação ágil via WhatsApp ou área de transferência.

---

## 2. Escopo e Requisitos Funcionais

### RF-066-01 — Módulo Canônico de Briefing (`src/lib/briefing.ts`)

1. Implementar schemas Zod estritos e tipagem TypeScript para todas as etapas:
   - `contratante`: Razão Social, Nome Fantasia, CNPJ com validação de dígitos verificadores, endereço de faturamento, e-mail financeiro e contatos.
   - `identidade_visual`: Cores primária e secundária hexadecimais, logotipo, referências e tom de voz.
   - `equipe`: Membros, bio, especialidade automotiva, certificações de fabricante (SENAI, Bosch, Montadoras) e permissão de agendamento online.
   - `servicos`: Serviços de reparação/estética, duração em minutos, intervalo/pausa pós-atendimento, regras de preço (exibir, a partir de, sob consulta) e modalidade (no box, leva e traz, socorro).
   - `regras_agenda`: Antecedência mínima e máxima, cancelamento, exigência de dados do veículo (marca/modelo/ano/placa/sintoma) e auto socorro.
   - `unidades`: Unidades físicas, endereços completos, acessibilidade PCD, estacionamento e telefones.
   - `conteudo`: Dores do cliente, público-alvo, missão, diferenciais e FAQ.
   - `tecnico_prazos`: Domínio, sistema de gestão atual e previsão de lançamento.
   - `pendencias`: Mapeamento de campos marcados como "Tenho pendência / Não tenho agora".
2. Implementar a função determinística `buildBookingConfig(briefingData)` para gerar a configuração canônica do sistema de agendamento.
3. Disponibilizar seed oficial com os dados da **BRS Reparações Automotivas** (`brsDefaultBriefing`) para inicialização com 1 clique ou restauração.
4. Implementar validador de taxa de contraste WCAG com cálculo de luminância relativa (`getContrastRatio`).

### RF-066-02 — Rota Dedicada `/briefing` no TanStack Router

1. Criar `src/routes/briefing.tsx` com `createFileRoute("/briefing")`.
2. Injetar metadados com `buildRouteHead({ noindex: true, title: "Portal de Briefing | EPM DevTech & BRS" })`.
3. Garantir isolamento: a rota não é inserida em `primaryNavigation` em `src/lib/brs.ts` e não afeta a navegação dos usuários regulares do site.

### RF-066-03 — Interface do Cliente para Execução do Briefing (`src/components/brs/briefing/`)

1. **Stepper Dinâmico**: Indicador visual das 9 etapas temáticas com status de completude e indicação de pendências.
2. **Autosave Reativo**: Persistência no `localStorage` sob a chave `brs_briefing_draft_v1` com indicador de "Rascunho salvo localmente".
3. **Ações Rápidas**:
   - Carregar dados oficiais pré-configurados da BRS em 1 clique.
   - Importar arquivo JSON (`briefing-completo.json` ou `booking-config.json`).
   - Limpar rascunho com confirmação.
4. **Calculadora de Contraste WCAG**: Feedback visual imediato na etapa de Identidade Visual alertando sobre conformidade de acessibilidade (Pass / Fail com ratio numérico).
5. **Revisão e Exportação**:
   - Download de `briefing-completo.json` formatado e validado.
   - Download de `booking-config.json` validado para o motor de agendamentos.
   - Cópia do JSON para a área de transferência com feedback Sonner.
   - Geração de mensagem estruturada para envio direto ao canal de atendimento da EPM DevTech.

---

## 3. Critérios de Aceite (AC)

- **AC-066-01**: A rota `/briefing` renderiza com sucesso em `http://brs.localhost/briefing`, sem erros de console ou de hidratação SSR.
- **AC-066-02**: A rota `/briefing` NÃO consta na barra de navegação superior (`Header`), nem no rodapé (`Footer`), nem no menu móvel.
- **AC-066-03**: O cabeçalho da página inclui `<meta name="robots" content="noindex, nofollow">`.
- **AC-066-04**: O cliente pode navegar por todas as etapas, preencher dados, marcar pendências e ver o progresso atualizado.
- **AC-066-05**: Na etapa de identidade visual, a alteração de cores calcula a luminância e exibe o índice de contraste WCAG com badge indicativo (Ex.: `4.8:1 - Conforme WCAG AA`).
- **AC-066-06**: O botão "Restaurar Dados da BRS" preenche os dados canônicos da oficina com Razão Social, CNPJ oficial, serviços de Funilaria, Pintura e Martelinho, e regras automotivas.
- **AC-066-07**: Ao concluir, os botões de exportação geram arquivos JSON válidos de acordo com os schemas Zod da EPM DEVTECH.
- **AC-066-08**: Suíte de testes automatizados cobre validação de schemas, cálculo de contraste, exportação de booking e renderização da rota com 100% de sucesso.
