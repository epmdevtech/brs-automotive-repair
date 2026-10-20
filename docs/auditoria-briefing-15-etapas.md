# Auditoria UX/UI e de dados — briefing da Master Chapeação (15 etapas)

| Campo      | Valor                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Referência | `SPEC-074` / `TASK-074-01`                                                                                          |
| Data       | 2026-10-20                                                                                                          |
| Método     | Inspeção do código das 15 etapas, do schema Zod, da persistência e execução no navegador (dev server na porta 5210) |

Legenda de impacto: **Alto** (impede o envio, gera erro confuso ou dado
incorreto), **Médio** (gera dúvida ou retrabalho), **Baixo** (polimento).

---

## Visão geral

| #   | Etapa                                 | Campos | Obrig. | Pend. | Selec. | Diagnóstico resumido                                                                                                                                                                              |
| --- | ------------------------------------- | ------ | ------ | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Identificação da empresa              | 21     | 2      | 3     | 3      | CNPJ e CEP em texto livre sem máscara/validação; endereço agregado em um campo; ano e tempo de mercado sem unidade; "outras unidades" sem pergunta complementar; "atende aos sábados" como select |
| 02  | Serviços e especialidades             | 21     | 0      | 0     | 14     | 13 perguntas com as mesmas 4 opções em select (resposta mutuamente exclusiva curta); "terceirizado" não abre detalhe; não há indicação de tipos de veículos por categoria                         |
| 03  | Estrutura física                      | 24     | 0      | 0     | 19     | Excesso de selects curtos; "estrutura do imóvel" sem área em m²; campos de metragem livres                                                                                                        |
| 04  | Equipamentos e ferramentas            | 19     | 0      | 0     | 17     | "não possui equipamento" convive com pergunta de marca/modelo; sem condição nem contagem                                                                                                          |
| 05  | Equipe e responsabilidades            | 12     | 0      | 0     | 1      | Contagens sem unidade ("quantos profissionais"); nomes de responsáveis sem cargo; "ampliar equipe" sem condição                                                                                   |
| 06  | Processos operacionais                | 21     | 0      | 0     | 17     | Selects curtos; fluxo sem campos de prazo/responsável por etapa                                                                                                                                   |
| 07  | Capacidade operacional e prazos       | 11     | 0      | 0     | 2      | Volume, capacidade e prazos em texto livre, sem unidade (veículos/dia) e sem distinguir dias úteis de corridos                                                                                    |
| 08  | Qualidade, garantia e rastreabilidade | 12     | 0      | 0     | 6      | Selects curtos; sem campo de prazo de garantia                                                                                                                                                    |
| 09  | Documentação e regularidade           | 16     | 0      | 0     | 13     | Validades em campo único sem instrução de formato; 13 selects com as mesmas 4 opções                                                                                                              |
| 10  | Sistemas e tecnologia                 | 13     | 0      | 0     | 11     | Selects curtos sem indicação de sistema                                                                                                                                                           |
| 11  | Fornecedores e terceiros              | 8      | 0      | 0     | 2      | Pergunta de terceirização sem condição; sem indicação de fornecedor principal                                                                                                                     |
| 12  | Interesse em credenciamento           | 13     | 0      | 0     | 5      | "quais seguradoras" em texto livre sem exemplos; "associações"/"frotas" sem pergunta complementar                                                                                                 |
| 13  | Fotos e portfólio                     | 16     | 0      | 13    | 14     | Sem orientação de captura por categoria; sem indicação de tamanho/formato aceito; autorização por foto existe, mas sem texto de consentimento                                                     |
| 14  | Informações para o site               | 12     | 0      | 0     | 2      | Telefone e e-mail sem máscara; autorizações em select sem texto de consentimento; falta contato do responsável pelo site                                                                          |
| 15  | Observações e confirmação             | 9      | 3      | 1     | 0      | Data em formato ISO; declarações sem texto de consentimento encadeado; sem resumo do que será enviado                                                                                             |

---

## Matriz de correções

### Etapa 1 — Identificação da empresa

| Campo                                  | Problema                                              | Impacto | Correção                                                                                                                                                               | Teste                                         |
| -------------------------------------- | ----------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `empresa.cnpj`                         | Texto livre, sem máscara e sem dígitos verificadores  | Alto    | Máscara `00.000.000/0000-00`, validação de DV no cliente e no servidor, mensagem "CNPJ inválido"                                                                       | Válido/inválido (DV)                          |
| `empresa.cep`                          | Sem máscara, sem validação de 8 dígitos, sem consulta | Médio   | Entrada mascarada `00000-000`, validação, consulta assistida com debounce/timeout e preenchimento apenas de campos não editados                                        | Máscara, CEP válido, CEP inexistente, timeout |
| `empresa.endereco`                     | Logradouro, número e bairro no mesmo texto            | Médio   | Endereço estruturado: `empresa.endereco` (logradouro, preservado), `empresa.enderecoNumero`, `empresa.enderecoComplemento`, `empresa.bairro`; manual sempre disponível | Preenchimento manual e por CEP                |
| `empresa.anoFundacao`                  | Texto livre, aceita qualquer valor                    | Médio   | Ano com faixa válida (1900–ano atual) e mensagem específica                                                                                                            | Ano válido/inválido                           |
| `empresa.tempoMercado`                 | Texto livre sem unidade                               | Médio   | Rótulo com unidade ("Anos de atuação") e exemplo                                                                                                                       | —                                             |
| `empresa.telefone`, `empresa.whatsapp` | Sem máscara, sem DDD válido                           | Médio   | Máscara por comprimento, DDD 11–99, 10–11 dígitos; permissões separadas                                                                                                | Telefone válido/inválido                      |
| `empresa.email`                        | Validação por regex genérica                          | Baixo   | Trim e validação de estrutura simples                                                                                                                                  | E-mail válido/inválido                        |
| `empresa.estado`                       | Select nativo com 27 UFs                              | Baixo   | Mantido (lista completa e correta); style de select unificado com foco visível                                                                                         | —                                             |
| `empresa.atendeSabado`                 | Select para 3 opções mutuamente exclusivas            | Médio   | Radio group acessível                                                                                                                                                  | Teclado e foco                                |
| `empresa.outrasUnidades`               | Sem pergunta complementar                             | Médio   | Campo condicional "Quais outras unidades e em quais municípios?"                                                                                                       | Ocultar e limpar                              |
| `empresa.regiaoAtendida`               | Texto livre sem exemplo                               | Baixo   | Ajuda contextual com exemplo (raio/municípios)                                                                                                                         | —                                             |

### Etapa 2 — Serviços e especialidades

| Campo                               | Problema                                                                      | Impacto | Correção                                                                            | Teste                  |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------- | ---------------------- |
| `servicos.*` (13 campos)            | Select com 4 opções para resposta mutuamente exclusiva                        | Médio   | Radio group em tela cheia para o bloco de especialidades; descrição curta por opção | Navegação por teclado  |
| `servicos.atividadesTerceirizadas`  | Só é perguntado sobre terceirização quando a pergunta deveria ser condicional | Alto    | Regra condicional: exibir o detalhe quando qualquer serviço for "terceirizado"      | Condicional e descarte |
| `servicos.tiposVeiculos`            | Texto livre sem exemplos                                                      | Médio   | Ajuda com exemplos (categoria, aplicação)                                           | —                      |
| `servicos.encaminhamentoSeguradora` | Select curto                                                                  | Baixo   | Radio group                                                                         | —                      |
| —                                   | Não há como o cliente indicar volume por especialidade                        | Médio   | Novo campo opcional `servicos.volumesPorEspecialidade` (texto livre com instrução)  | —                      |

### Etapa 3 — Estrutura física

| Campo                               | Problema                                    | Impacto | Correção                                                              | Teste        |
| ----------------------------------- | ------------------------------------------- | ------- | --------------------------------------------------------------------- | ------------ |
| `estrutura.*` (19 selects)          | Excesso de selects curtos                   | Médio   | Radio group para itens de sim/não; campo de metragem com unidade (m²) | Teclado      |
| `estrutura.areaUtil` (se existente) | Área sem unidade                            | Médio   | Rótulo com "m²" e validação numérica                                  | Número pt-BR |
| —                                   | Não há indicação de tipo de imóvel com área | Baixo   | Ajuda contextual                                                      | —            |

### Etapa 4 — Equipamentos e ferramentas

| Campo                                      | Problema                               | Impacto | Correção                                                      | Teste                  |
| ------------------------------------------ | -------------------------------------- | ------- | ------------------------------------------------------------- | ---------------------- |
| `equipamentos.*` (17 selects)              | Respostas curtas em select             | Médio   | Radio group nos itens com até 4 opções                        | Teclado                |
| `equipamentos.*` (marca/modelo/quantidade) | Pedidos mesmo quando o item não existe | Alto    | Regra condicional por item: detalhes só quando o item existir | Condicional e descarte |
| —                                          | Não há contagem agregada               | Baixo   | Novo campo opcional `equipamentos.quantidadeTotal`            | —                      |

### Etapa 5 — Equipe e responsabilidades

| Campo                               | Problema              | Impacto | Correção                                                                           | Teste       |
| ----------------------------------- | --------------------- | ------- | ---------------------------------------------------------------------------------- | ----------- |
| `equipe.totalColaboradores` e afins | Contagens sem unidade | Médio   | Rótulo com "pessoas" e validação numérica inteira                                  | Número      |
| `equipe.resp*` (4 campos)           | Pedem nome de pessoa  | Baixo   | Rótulo "Responsável por … (função)" com ajuda "não informe CPF nem dados pessoais" | —           |
| `equipe.ampliar`                    | Sem condição          | Baixo   | Regra condicional: condições de ampliação                                          | Condicional |

### Etapa 6 — Processos operacionais

| Campo                      | Problema          | Impacto | Correção                                      | Teste   |
| -------------------------- | ----------------- | ------- | --------------------------------------------- | ------- |
| `processos.*` (17 selects) | Selects curtos    | Médio   | Radio group                                   | Teclado |
| `processos.prazos*`        | Prazo sem unidade | Médio   | Rótulo com "dias" e natureza (úteis/corridos) | —       |

### Etapa 7 — Capacidade operacional e prazos

| Campo                                         | Problema                                               | Impacto | Correção                                                                                                   | Teste        |
| --------------------------------------------- | ------------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------- | ------------ |
| `capacidade.mediaRecebidos`, `mediaEntregues` | Sem unidade nem natureza                               | Alto    | Rótulo com "veículos por dia" e ajuda; validação numérica                                                  | Número pt-BR |
| `capacidade.servicosSimultaneos`              | Sem unidade                                            | Médio   | Rótulo com "veículos simultâneos"                                                                          | Número       |
| `capacidade.prazoSimples`, `prazoComplexos`   | Prazo sem unidade e sem distinguir dias úteis/corridos | Alto    | Rótulo "Prazo médio (dias úteis)" + novo campo `capacidade.prazoBase` (select: dias úteis / dias corridos) | Opção válida |
| `capacidade.indicadores`                      | Opções sem descrição                                   | Baixo   | Ajuda explicando o que significa cada indicador                                                            | —            |

### Etapa 8 — Qualidade, garantia e rastreabilidade

| Campo                     | Problema                 | Impacto | Correção                                                               | Teste   |
| ------------------------- | ------------------------ | ------- | ---------------------------------------------------------------------- | ------- |
| `qualidade.*` (6 selects) | Selects curtos           | Médio   | Radio group                                                            | Teclado |
| —                         | Não há prazo de garantia | Alto    | Novo campo `qualidade.prazoGarantia` (texto com unidade em dias/meses) | —       |
| `qualidade.fotos`         | Sem orientação           | Baixo   | Ajuda exigindo antes/depois                                            | —       |

### Etapa 9 — Documentação e regularidade

| Campo                       | Problema                                         | Impacto | Correção                                                                                                                 | Teste   |
| --------------------------- | ------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------ | ------- |
| `documentos.*` (13 selects) | Mesmas 4 opções em select                        | Médio   | Radio group com rótulos "Disponível", "Pendente", "Não se aplica", "Precisa confirmar"                                   | Teclado |
| `documentos.validades`      | Campo único sem instrução de formato nem vínculo | Alto    | Rótulo "Validades por documento" + ajuda com formato (`documento — DD/MM/AAAA`) e instrução de que pode deixar em branco | —       |
| `documentos.responsavel`    | Pede pessoa sem cargo                            | Baixo   | Rótulo "Responsável pela guarda dos documentos (função)"                                                                 | —       |
| —                           | Não há indicação de anexo por documento          | Alto    | Orientação na etapa de documentos: cada item aceita arquivo pela etapa 13, com tamanho e formato                         | —       |

### Etapa 10 — Sistemas e tecnologia

| Campo                           | Problema       | Impacto | Correção    | Teste   |
| ------------------------------- | -------------- | ------- | ----------- | ------- |
| `sistemas.*` (11 selects)       | Selects curtos | Médio   | Radio group | Teclado |
| `sistemas.lista` (se existente) | Sem exemplo    | Baixo   | Ajuda       | —       |

### Etapa 11 — Fornecedores e terceiros

| Campo            | Problema                                 | Impacto | Correção                                                                | Teste                  |
| ---------------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------- | ---------------------- |
| `fornecedores.*` | Pergunta de terceirização sem condição   | Alto    | Regra condicional: detalhes de fornecedor/terceirização só quando "sim" | Condicional e descarte |
| —                | Não há indicação do fornecedor principal | Baixo   | Novo campo opcional `fornecedores.principais`                           | —                      |

### Etapa 12 — Interesse em credenciamento

| Campo                                  | Problema                  | Impacto | Correção                                                                                | Teste                  |
| -------------------------------------- | ------------------------- | ------- | --------------------------------------------------------------------------------------- | ---------------------- |
| `credenciamento.seguradoras`           | Texto livre sem exemplos  | Médio   | Ajuda com exemplos do mercado e alerta de que a lista de requisitos é confirmada depois | —                      |
| `credenciamento.associacoes`, `frotas` | Sem pergunta complementar | Médio   | Campos condicionais "Quais associações/frotas"                                          | Condicional e descarte |
| `credenciamento.volume`                | Sem unidade               | Médio   | Rótulo com "veículos por mês"                                                           | —                      |
| `credenciamento.regiao`                | Texto livre               | Baixo   | Ajuda                                                                                   | —                      |

### Etapa 13 — Fotos e portfólio

| Campo                  | Problema                           | Impacto | Correção                                                                                  | Teste            |
| ---------------------- | ---------------------------------- | ------- | ----------------------------------------------------------------------------------------- | ---------------- |
| `fotos.*` (13 selects) | Selects curtos                     | Médio   | Radio group                                                                               | Teclado          |
| Todos                  | Sem orientação de captura          | Alto    | Ajuda por categoria com enquadramento e privacidade (sem rostos/placas identificáveis)    | —                |
| Upload                 | Sem indicação de formato e tamanho | Médio   | Texto explícito: JPEG/PNG/WEBP/HEIC/PDF, até 10 MB por arquivo, sem publicação automática | Limite de upload |

### Etapa 14 — Informações para o site

| Campo                                                    | Problema                                 | Impacto | Correção                                                         | Teste    |
| -------------------------------------------------------- | ---------------------------------------- | ------- | ---------------------------------------------------------------- | -------- |
| `site.telefone`, `site.whatsapp`                         | Sem máscara                              | Médio   | Máscara e validação de telefone                                  | Telefone |
| `site.email`                                             | Validação genérica                       | Baixo   | Trim e validação de estrutura                                    | E-mail   |
| `site.autorizacaoImagens`, `site.autorizacaoInformacoes` | Select sem texto de consentimento        | Alto    | Radio group com o texto da autorização exibido junto da pergunta | Teclado  |
| —                                                        | Não há responsável pelo conteúdo do site | Médio   | Novo campo `site.responsavelConteudo`                            | —        |

### Etapa 15 — Observações e confirmação

| Campo                                           | Problema                                              | Impacto | Correção                                                                        | Teste                                  |
| ----------------------------------------------- | ----------------------------------------------------- | ------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| `confirmacao.data`                              | Entrada ISO, sem calendário                           | Alto    | Entrada dd/mm/aaaa com segmentos, validação de data e persistência `YYYY-MM-DD` | Data válida, 29/02 não bissexto, 31/04 |
| `confirmacao.veracidade`, `confirmacao.ciencia` | Declarações sem texto encadeado                       | Alto    | Texto do consentimento exibido acima dos checkboxes, com destaque no resumo     | —                                      |
| `confirmacao.autorizacaoPublicacao`             | Autorização de publicação como item opcional genérico | Alto    | Mantida como decisão separada e refletida explicitamente no resumo final        | Revisão                                |

### Transversal (todas as etapas)

| Problema                                               | Impacto | Correção                                                                             | Teste      |
| ------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------ | ---------- |
| Erros de validação só apareciam em campos obrigatórios | Alto    | Mensagem exibida em qualquer campo com erro, com `aria-invalid` e `aria-describedby` | Componente |
| Sumário de erros não focava o primeiro campo inválido  | Alto    | Resumo de erros com link para o campo e foco programático                            | Componente |
| Troca de etapa não era anunciada                       | Médio   | Região `aria-live` anunciando a etapa e o progresso                                  | Componente |
| Campos condicionais não existiam                       | Alto    | Regras declarativas + aviso de descarte                                              | Domínio    |
| Formulário sem agrupamento por assunto                 | Médio   | `fieldset`/`legend` por assunto dentro da etapa                                      | Componente |
| Sem revisão com pendências por etapa                   | Alto    | Revisão com ausentes, pendências, documentos, autorização e confirmação final        | Componente |
| Telefone sem placeholder/unidade                       | Baixo   | Placeholders com máscara esperada                                                    | —          |

---

## Itens deliberadamente **não** alterados

| Item                                                     | Motivo                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Identificadores dos campos já persistidos                | Compatibilidade: nenhum dado gravado é reinterpretado                              |
| `empresa.cnpj` preenchido com formato livre antigo       | A validação passa a aceitar o formato mascarado e também o não mascarado (dígitos) |
| Lista de UFs                                             | Já é completa e correta (27)                                                       |
| Número de etapas (15) e títulos                          | Rastreabilidade com a SPEC-072/073 e com a matriz de auditoria                     |
| Escolha de não coletar CPF/documentos de colaboradores   | Minimização de dados (LGPD)                                                        |
| Escolha de não criar matriz de requisitos de seguradoras | Seria inventar informação não confirmada                                           |
