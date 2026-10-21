# REVIEW-074 — Auditoria e refatoração UX/UI do briefing da Master Chapeação

| Campo      | Valor                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| ID         | REVIEW-074                                                                                           |
| SPEC/TASK  | `SPEC-074` / `TASK-074-01` a `TASK-074-04`                                                           |
| Status     | Approved                                                                                             |
| Data       | 2026-10-20                                                                                           |
| Revisor    | Senior Full Stack / UX-UI Engineer (Universal SDD)                                                   |
| Evidências | `bun run lint`, `bun run test`, `bun run build`, E2E Playwright, inspeção visual em desktop e mobile |

---

## 1. Sumário

As 15 etapas do briefing foram auditadas campo a campo no código e no navegador. A
auditoria está registrada em [`docs/auditoria-briefing-15-etapas.md`](../docs/auditoria-briefing-15-etapas.md)
com problema, impacto, correção e teste por item. As correções foram implementadas:
máscaras e validadores passaram para o domínio (CEP, CNPJ com dígitos verificadores,
telefone com DDD, data civil com calendário e bissextos, número pt-BR), o endereço
passou a ser estruturado com consulta assistida de CEP opcional, perguntas
condicionais passaram a existir com descarte explícito, o layout passou a agrupar
por assunto, respostas curtas e mutuamente exclusivas passaram a usar radio group
acessível, o resumo de erros passou a ser focalizado e a revisão final passou a
mostrar a situação de cada etapa, as autorizações registradas e a exigir
confirmação explícita antes do envio.

## 2. Correções por eixo

| Eixo         | Antes                      | Depois                                                                                                   |
| ------------ | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| CNPJ         | texto livre, sem validação | máscara `00.000.000/0000-00` + dígitos verificadores no cliente e no servidor                            |
| CEP          | texto livre                | máscara `00000-000`, validação, consulta ViaCEP com debounce/timeout e preenchimento só de campos vazios |
| Telefone     | `type="tel"` sem máscara   | máscara por comprimento, DDD válido, 10–11 dígitos                                                       |
| Data         | entrada ISO (`AAAA-MM-DD`) | segmentos `dd/mm/aaaa` com navegação por teclado, calendário validado e persistência `YYYY-MM-DD`        |
| Endereço     | um campo de texto          | logradouro, número, complemento, bairro, cidade, UF e CEP                                                |
| Números      | texto livre sem unidade    | rótulos com unidade, validação inteira ehelp de contexto                                                 |
| Seleção      | tudo em `<select>`         | radio group para respostas curtas mutuamente exclusivas; listas de itens seguem em select                |
| Condicionais | inexistentes               | 6 regras declarativas com descarte no envio e aviso ao cliente                                           |
| Revisão      | lista de respostas         | situação por etapa, pendências, autorizações, documentos e confirmação explícita                         |
| Erros        | só em campo obrigatório    | resumo de erros com link e foco no primeiro campo inválido                                               |

## 3. Defeitos encontrados e corrigidos durante a execução

1. **Validação do React Hook Form quebrada por ids pontuados**: o "." do id era
   interpretado como caminho aninhado, produzindo `{"empresa": {...}}` e erro
   falso em toda etapa. Corrigido com nomes internos `__` traduzidos de volta.
2. **Campos de e-mail, telefone, número e data em branco invalidavam o schema**,
   o que impedia o servidor de gravar a etapa. Vazios passaram a contar como "não
   respondido".
3. **Consulta de CEP nunca disparava**: o `useEffect` dependia de um callback
   instável e o temporizador de debounce era cancelado a cada renderização.
   Corrigido com referência estável.
4. **Submissão nativa do login antes da hidratação**, expondo a senha na URL.

## 4. Critérios de Aceite

| Critério  | Verificação                                          | Resultado |
| --------- | ---------------------------------------------------- | --------- |
| AC-074-01 | Matriz de auditoria com as 15 etapas                 | Atendido  |
| AC-074-02 | CEP com máscara, validação e consulta assistida      | Atendido  |
| AC-074-03 | CNPJ, telefone e data com validação específica       | Atendido  |
| AC-074-04 | Perguntas condicionais com descarte explícito        | Atendido  |
| AC-074-05 | Controles de seleção adequados ao tipo de pergunta   | Atendido  |
| AC-074-06 | Revisão final com pendências e confirmação explícita | Atendido  |
| AC-074-07 | Layout, hierarquia e acessibilidade                  | Atendido  |
| AC-074-08 | Compatibilidade com os dados já persistidos          | Atendido  |
| AC-074-09 | Qualidade e não regressão                            | Atendido  |

## 5. Evidências de Validação

| Gate      | Comando / verificação                                   | Resultado                                                                                             |
| --------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Lint      | `bun run lint`                                          | 0 erros; 7 warnings pré-existentes de `react-refresh`                                                 |
| Testes    | `bun run test`                                          | 62 arquivos e 509 testes aprovados                                                                    |
| Build     | `bun run build`                                         | Cliente e SSR concluídos; nenhum SDK do Supabase no `dist/client`                                     |
| E2E       | `bunx playwright test e2e/briefing-15-etapas.spec.ts`   | 1 teste aprovado (1,1 min): 15 etapas, envio confirmado, 15 seções gravadas, RLS e auditoria isoladas |
| Visual    | Capturas em 1440px e 390px (`e2e-screenshots/ux-*.png`) | Layout em duas colunas no desktop, uma coluna no mobile, overflow horizontal de 0 px                  |
| Typecheck | `bunx tsc --noEmit` filtrando `src/features/briefing`   | Sem erros nos arquivos da entrega                                                                     |

Suítes dedicated: `src/test/briefing-ux-spec074.test.tsx` (25 casos: máscaras,
validadores, consulta de CEP com sucesso/timeout/falha, condicionais, schema e
componentes).

## 6. Riscos e Pendências

- **Consulta de CEP depende de serviço externo**: com debounce, timeout e
  tratamento de falha; a edição manual permanece sempre disponível. Não há
  garantia de disponibilidade do ViaCEP.
- **Valores já persistidos**: campos antigos continuam válidos (a validação
  observa os dígitos), sem migração e sem alteração de identificador.
- **Novos campos por etapa** (`empresa.unidadesAdicionais`,
  `servicos.terceirizadosDetalhe`, `servicos.volumesPorEspecialidade`,
  `equipe.condicoesAmpliacao`, `fornecedores.pecasContratanteDetalhes`,
  `credenciamento.quaisAssociacoes`, `credenciamento.quaisFrotas`,
  `capacidade.prazoBase`, `qualidade.prazoGarantia`, `site.responsavelConteudo`,
  `empresa.enderecoNumero`, `empresa.enderecoComplemento`, `empresa.bairro`)
  existem apenas para novos preenchimentos.
- **Checklist longo de itens** continua em `<select>` (estrutura, equipamentos,
  processos, serviços, sistemas, fotos) para evitar paredes de rádio; é uma
  decisão de densidade, registrada na auditoria.
- **Sem deploy**: nenhum commit em `main`, nenhuma promoção e nenhum DNS
  alterado.

## 7. Aprovação

| Papel      | Nome                                     | Decisão  | Date       |
| ---------- | ---------------------------------------- | -------- | ---------- |
| Produto    | Solicitação humana explícita             | Approved | 2026-10-20 |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 |
| QA         | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 |
