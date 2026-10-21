# SPEC-075 — Exportação de evidência em PDF do briefing no painel administrativo

## Metadados

| Campo          | Valor                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ID             | SPEC-075                                                                                                                 |
| Título         | Exportação de evidência em PDF do briefing pelo painel administrativo                                                     |
| Status         | Approved                                                                                                                 |
| Responsável    | Senior Full Stack / UX-UI Engineer (Universal SDD)                                                                       |
| Revisores      | Produto / Engenharia / QA                                                                                                |
| Criado         | 2026-10-20                                                                                                                |
| Atualizado     | 2026-10-20                                                                                                                |
| Liberação Alvo | Branch `feature/master-briefing-ux`; sem promoção a produção sem autorização humana                                        |
| Refs:          | Discovery: solicitação humana explícita de 2026-10-20; Design: N/A — documento institucional com a identidade existente; ADRs: `ADR-001`, `ADR-002` e `ADR-003` |

---

## Problema e resultado

A SPEC-074 entregou o percurso E2E das 15 etapas e um gerador de evidência em PDF
executado por script avulso (`scripts/briefing-evidence-pdf.ts`). A EPM DevTech
precisa do documento como parte do fluxo de trabalho: revisar um briefing no
painel e baixar a evidência correspondente, sem depender de executar um script
manual.

**Resultado esperado:** no detalhe do briefing, o administrador baixa um PDF A4
com os dados do registro persistido — identificação, situação, as 15 etapas com
campo e resposta, pendências e trilha de auditoria — gerado no servidor, com
autorização verificada antes de qualquer leitura.

**Restrições:** nenhuma dependência nova de geração de PDF (o runtime de
produção é o Node da Vercel, sem Chromium); a exportação usa o mesmo registro do
banco, com as mesmas garantias de RLS; o documento é interno e declara que o
envio não representa credenciamento.

## Escopo

### No escopo (In scope)

- Escritor de PDF sem dependência externa, no servidor, com fontes padrão e
  codificação WinAnsi (acentos pt-BR).
- Documento de evidência: cabeçalho, dados do briefing, 15 etapas com respostas e
  pendências, trilha de auditoria e rodapé com paginação.
- Server Function de exportação, restrita ao papel `admin`, que resolve o
  briefing pelo identificador e devolve o arquivo.
- Botão "Baixar evidência (PDF)" no detalhe do briefing, com estado de
  carregamento e mensagem de erro honesta.
- Testes de unidade do escritor e do documento, teste de autorização e E2E do
  download.

### Fora do escopo (Out of scope)

- Dependência de biblioteca de PDF, headless Chromium no servidor ou renderização
  no cliente.
- Envio por e-mail, agendamento de envio ou armazenamento de PDFs.
- Exportação pública (sem sessão) ou por link direto.
- Relatórios agregados, filtros novos no painel ou gráficos.

## Comportamento Funcional

- O botão aparece apenas para administradores e fica desabilitado enquanto a
  exportação está em andamento.
- A Server Function exige sessão válida e papel `admin`; identifica o briefing
  pelo `briefingId` e lê respostas, arquivos e auditoria no servidor.
- Em falha de autorização, a resposta é `forbidden` e a interface informa que a
  operação não foi permitida, sem gerar arquivo.
- Em falha de leitura, a interface exibe a mensagem normalizada do serviço.
- O PDF gerado contém: empresa, identificador, situação, datas, aviso de que os
  dados são de análise e não de credenciamento, as 15 etapas (rótulo, resposta e
  marcação de pendência), o total de respostas, a trilha de auditoria e a
  paginação.
- O nome do arquivo inclui o identificador do briefing e a data, para evitar
  sobrescrita acidental.

## Requisitos Não-Funcionais

- **Segurança:** a leitura e a montagem do documento acontecem no servidor, com
  autorização verificada; o PDF nunca é gerado a partir de dados do navegador.
- **Privacidade:** o documento é interno da EPM DevTech; o cliente não tem acesso
  ao gerador nem ao arquivo.
- **Confiabilidade:** erro de geração não produz arquivo parcial; o download só
  ocorre com o PDF completo e íntegro.
- **Compatibilidade:** sem dependência nova; Node 20 LTS; saída PDF 1.4 legível
  por leitores padrão.
- **Acessibilidade:** o botão tem rótulo descritivo, estado de carregamento
  anunciado e foco visível.

## Critérios de Aceite

### AC-075-01

```yaml
id: AC-075-01
title: Escritor de PDF sem dependência externa
preconditions:
  - Documento com textos acentuados e várias páginas
action: Gerar o PDF e extrair seu texto com uma ferramenta externa
expected_result: Arquivo PDF 1.4 válido, com número de páginas correto e texto em português legível
evidence_type: automated
```

### AC-075-02

```yaml
id: AC-075-02
title: Documento de evidência com as 15 etapas
preconditions:
  - Briefing persistido com respostas e auditoria
action: Montar o documento e inspecionar o texto extraído
expected_result: O texto contém identificação do briefing, situação, as 15 etapas com respostas, pendências e eventos de auditoria
evidence_type: automated
```

### AC-075-03

```yaml
id: AC-075-03
title: Exportação restrita ao administrador
preconditions:
  - Usuário com papel client autenticado
action: Chamar a Server Function de exportação
expected_result: A operação é recusada com erro de autorização e nenhum arquivo é gerado
evidence_type: automated
```

### AC-075-04

```yaml
id: AC-075-04
title: Download pelo painel administrativo
preconditions:
  - Administrador autenticado no detalhe de um briefing
action: Clicar em "Baixar evidência (PDF)"
expected_result: O navegador baixa um arquivo PDF válido com o nome previsto e o documento corresponde ao briefing exibido
evidence_type: automated
```

### AC-075-05

```yaml
id: AC-075-05
title: Qualidade e não regressão
preconditions:
  - Implementação concluída
action: Executar lint, testes, build e o percurso E2E completo
expected_result: Lint sem erros, suíte aprovada, build concluído e E2E verde
evidence_type: automated
```

## Abordagem Técnica

- `src/features/briefing/server/pdf/pdf-writer.ts`: escritor PDF 1.4 sem
  dependência (objetos, xref, fluxos de conteúdo, WinAnsi/CP1252, Helvetica).
- `src/features/briefing/server/pdf/briefing-document.ts`: composição do documento
  de evidência a partir do registro (cabeçalho, etapas, auditoria, rodapé).
- `src/features/briefing/server/pdf-service.ts`: autorização, leitura do
  registro e devolução do arquivo em base64.
- `src/features/briefing/server/functions.ts`: Server Function `exportBriefingPdf`.
- `src/features/briefing/ui/admin/briefing-admin-detail.tsx`: botão, estado de
  carregamento e download.

## Entrega e Operações

- **Plano de implantação:** sem migração, sem mudança de ambiente; a exportação
  nasce com o deploy da branch.
- **Plano de migração:** não aplicável.
- **Plano de rollback:** reverter o commit da branch; nenhuma alteração de dados.
- **Monitoramento:** falhas de geração aparecem como mensagem na interface e
  são registradas em log do servidor.

## Riscos e Dependências

| Risco ou dependência | Impacto | Probabilidade | Mitigação | Responsável |
| -------------------- | ------- | ------------- | --------- | ----------- |
| Escritor PDF próprio acumular defeitos | Alto | Média | Validação com extração de texto e contagem de páginas em teste automatizado | Engenharia |
| Documento grande para muitas respostas | Médio | Baixa | Paginação automática e limite de caracteres por linha | Engenharia |
| Vazamento de dados entre clientes | Alto | Baixa | Exportação restrita a `admin`, verificada no servidor | Engenharia / Segurança |
| Fonte padrão sem acentuação completa | Médio | Baixa | Codificação WinAnsi com mapa explícito e teste de texto acentuado | Engenharia |

## Questões Abertas

| Questão | Responsável | Data limite | Resolução |
| ------- | ----------- | ----------- | --------- |
| Assinatura, numeração de páginas e carimbo de recebimento no documento | Produto | Antes da promoção | Não incluído nesta entrega; requer definição do padrão documental |
| Envio automático do PDF ao cliente por e-mail | Produto | Antes da promoção | Fora de escopo: envio de respostas completas por e-mail é proibido |

## Aprovação

| Papel      | Nome                                    | Decisão  | Data       | Notas                                          |
| ---------- | --------------------------------------- | -------- | ---------- | ---------------------------------------------- |
| Produto    | Solicitação humana explícita           | Approved | 2026-10-20 | Exportação de evidência a partir do painel     |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 | Sem dependência nova, geração no servidor      |
| QA         | Senior Full Stack / UX-UI Engineer (SDD) | Ready    | 2026-10-20 | Critérios automatizáveis com extração de texto  |
