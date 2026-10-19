# AGENTS.md — Protocolo para Agentes de IA e Engenharia (Universal SDD)

Este repositório adota o **Universal SDD (Spec-Driven Development)** integrado aos padrões da EPMDEVTECH. Qualquer agente autônomo, assistente de IA (Antigravity, Claude, ChatGPT, Gemini, Copilot, Cursor, Windsurf) ou desenvolvedor humano deve cumprir os protocolos e restrições descritos neste documento.

---

## 1. Diretrizes Arquiteturais e Regras de Negócio do Projeto Master

- **Fonte Única de Verdade**: Mantenha as informações da empresa, serviços e validação do formulário de contato no módulo seguro para navegador [`src/lib/brs.ts`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/src/lib/brs.ts). Todos os componentes e testes devem importar dele.
- **Website Multipágina com Rotas Especializadas**: O projeto é um website multipágina moderno estruturado com TanStack Router e TanStack Start, com rotas completas dedicadas (`/` para Início, `/servicos` para Visão Geral de Serviços, `/servicos/funilaria` para Funilaria, `/servicos/pintura-automotiva` para Pintura, `/servicos/martelinho-de-ouro` para Martelinho, `/trabalhos` para Portfólio & Comparador Antes/Depois, `/para-corretores` para Parceiros e Seguros, `/sobre` para Institucional, `/contato` para Avaliação Técnica, `/privacidade` para Políticas de Privacidade, e `/proposta/$slug` para Apresentação Comercial). NUNCA reduza ou trate o projeto como uma landing page de página única.
- **Fluxo de Contato Honesto**: O formulário de contato prepara uma mensagem formatada para cópia manual no canal oficial confirmado (Instagram `@masterchapeacao2022`). Nunca persista dados no frontend nem simule envio falso, evitando dependência de WhatsApp não confirmado ou backend desnecessário.
- **Mídia Ilustrativa**: Qualquer mídia genérica ou ilustrativa deve ser explicitamente identificada como ilustrativa. Nunca apresente imagens ilustrativas como evidência de instalações reais da oficina ou reparos concluídos.
- **Porta Local e Proxy**: O frontend roda na porta **5210** em modo estrito (`strictPort: true` no Vite e `--port 5210` no package.json). O domínio local configurado no Caddy é `http://brs.localhost`.

---

## 2. Ordem de Leitura Obrigatória

Antes de propor ou executar qualquer alteração:

1. Leia [`PROJECT.md`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/PROJECT.md) para absorver o estado canônico, stack e regras ativas;
2. Identifique o workflow ativo em [`workflows/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/workflows/);
3. Leia o contrato do papel ativo em [`agents/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/agents/);
4. Localize a SPEC aprovada em [`specs/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/specs/);
5. Localize a TASK atribuída em [`tasks/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/tasks/);
6. Consulte padrões em [`standards/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/standards/), ADRs em [`adr/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/adr/) e conhecimento em [`knowledge/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/knowledge/).

> [!CAUTION]
> Na ausência de SPEC aprovada e TASK atribuída, **não inicie implementação**.

---

## 3. Hierarquia de Instruções

Quando houver conflito entre informações, obedeça a esta precedência:

1. Instruções humanas explícitas e atuais;
2. SPEC aprovada da mudança em [`specs/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/specs/);
3. [`PROJECT.md`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/PROJECT.md) e ADRs aceitos em [`adr/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/adr/);
4. Workflows e perfis ativos;
5. Padrões normativos em [`standards/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/standards/);
6. Base de conhecimento auxiliar em [`knowledge/`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/knowledge/).

---

## 4. Regras Obrigatórias e Quality Gates

- **Não invente requisitos**: Limite-se estritamente ao escopo aprovado. Se houver dúvida funcional ou comercial, pergunte ao humano.
- **Quality Gates Automáticos**:
  - Testes: `bun run test` (Vitest) deve passar com 100% de sucesso.
  - Linter: `bun run lint` (ESLint + Prettier) deve passar sem erros.
  - Compilação / Build: `bun run build` (Vite + Nitro SSR) deve passar sem falhas.
- **Rastreabilidade Mecanizada**:
  Toda implementação vinculada a uma TASK aprovada deve conter nos commits os trailers:
  ```text
  Spec-Ref: SPEC-NNN
  Task-Ref: TASK-NNN-XX
  ```
- **Orçamento de Contexto (Context Budget)**:
  Carregue [`docs/context-budget.md`](file:///home/elessandro/%C3%81rea%20de%20Trabalho/Dev/EPMDEVTECH_Clientes/Master/docs/context-budget.md) e recupere seletivamente apenas os módulos de `knowledge/` necessários.
- **Encerramento e Handover**:
  Ao concluir uma tarefa, reporte sempre:
  1. Escopo implementado;
  2. Arquivos alterados;
  3. Evidências de validação (testes, lint, build);
  4. Riscos, desvios ou dependências pendentes;
  5. Documentos sincronizados.
