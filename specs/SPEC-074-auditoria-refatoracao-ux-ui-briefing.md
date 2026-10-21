# SPEC-074 — Auditoria e refatoração UX/UI do briefing da Master Chapeação

## Metadados

| Campo          | Valor                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID             | SPEC-074                                                                                                                                                                                    |
| Título         | Auditoria e refatoração premium do formulário de briefing em 15 etapas                                                                                                                      |
| Status         | Approved                                                                                                                                                                                    |
| Responsável    | Senior Full Stack / UX-UI Engineer (Universal SDD)                                                                                                                                          |
| Revisores      | Produto / Engenharia / QA / Segurança                                                                                                                                                       |
| Criado         | 2026-10-20                                                                                                                                                                                  |
| Atualizado     | 2026-10-20                                                                                                                                                                                  |
| Liberação Alvo | Preview local/Vercel após validação; **sem promoção a produção sem autorização humana explícita**                                                                                           |
| Refs:          | Discovery: solicitação humana explícita de 2026-10-20; Design: N/A — mantém a identidade visual da SPEC-072/073; ADRs: `ADR-001` (Supabase) e `ADR-002` (máscaras e validadores no domínio) |

---

## Problema e resultado

O formulário de 15 etapas funciona e persiste no Supabase, mas foi auditado no
código e no navegador: campos cadastuais e de contato sem máscara nem validação
específica (CNPJ aceita qualquer texto, CEP sem máscara, telefones sem DDD),
tipos inadequados (ano de fundação e volumes como texto livre sem unidade),
selects usados para respostas mutuamente exclusivas curtas, ausência de lógica
condicional (perguntas que só fazem sentido depois de uma resposta), campos de
endereço agregados em um único texto livre, ausência de data civil em formato
brasileiro e uma tela de revisão que não destaca o que está faltando.

**Resultado esperado:** um formulário que orienta, valida com precisão, preserva
o que já foi preenchido, esconde perguntas irrelevantes com aviso explícito e
entrega ao administrador dados completos, legíveis e consistentes — reduzindo
retroatendimento do cliente.

**Fatos:** o formulário, os schemas Zod, a persistência e o painel administrativo
foram implementados na SPEC-073; 15 etapas, 228 campos; o E2E percorre as 15
etapas e grava no PostgreSQL.
**Restrição de compatibilidade:** os identificadores de campo persistidos
(`empresa.razaoSocial`, `empresa.cep`, …) **não mudam**; apenas novos campos
podem ser adicionados. Nenhum dado existente é apagado ou reinterpretado.

## Escopo

### No escopo (In scope)

- Matriz de auditoria das 15 etapas com problema, impacto, correção e teste.
- Domínio de máscaras e validadores (CEP, CNPJ com dígitos verificadores,
  telefone com DDD, data civil com calendário e bissextos, número decimal
  brasileiro) e serviço de consulta de CEP com timeout e falha não bloqueante.
- Schema Zod por etapa coerente com o novo domínio, validado no cliente e no
  servidor.
- Componentes reutilizáveis: entrada mascarada, data em segmentos dd/mm/aaaa,
  radio group, select acessível, número com unidade, bloco de endereço com
  consulta assistida de CEP.
- Perguntas condicionais com regra explícita de descarte e aviso ao cliente.
- Layout: agrupamento por assunto, hierarquia de etapa, progresso, indicação de
  obrigatório/opcional, ajuda contextual, navegação acessível e resumo de erros.
- Revisão final com pendências, documentos, autorização de publicação e
  confirmação explícita do envio.
- Acessibilidade ponta a ponta do formulário.
- Testes de domínio, componente e E2E.

### Fora do escopo (Out of scope)

- Publicação em produção, alteração de DNS e promoção de release.
- Novo backend, mudança de schema do banco ou migração de dados existentes.
- Matriz de requisitos de seguradoras e integração com elas.
- Publicação automática de fotos ou documentos no site.
- Cadastro de produtos, ERP ou qualquer módulo além do briefing.

## Comportamento Funcional

### Máscaras e validação

- **CEP**: máscara `00000-000`, aceita colagem com ou sem pontuação, valida 8
  dígitos, persiste o valor formatado e permite edição manual.
- **Consulta de CEP**: ViaCEP com debounce de 600 ms, timeout de 5 s, abort e
  tratamento de erro; o preenchimento automático **não sobrescreve** campos já
  editados pelo cliente e a falha da consulta **não bloqueia** o preenchimento.
- **CNPJ**: máscara `00.000.000/0000-00` e validação dos dígitos verificadores
  no cliente e no servidor; a resposta da validação não afirma existência nem
  regularidade cadastral.
- **Telefone**: máscara por comprimento (`(00) 0000-0000` / `(00) 00000-0000`),
  DDD válido e 10–11 dígitos; telefone e WhatsApp continuam separados.
- **Datas civis**: entrada em segmentos dd/mm/aaaa com navegação por teclado,
  validação de calendário (bissextos e datas impossíveis) e persistência
  canônica `YYYY-MM-DD`, sem conversão para timestamp UTC.
- **Números**: casa decimal e milhar pt-BR, unidade explícita, campo vazio nunca
  vira zero e nenhum `NaN` é aceito.

### Campos condicionais

- Regras declarativas por etapa: valor controlador → campos dependentes.
- Campo ocultado **não** é enviado e o schema segue a mesma regra.
- Valores já preenchidos em campo ocultado não são apagados em silêncio: o
  cliente recebe aviso e pode reexibir o campo.

### Completude e revisão

- Etapa 1 ganha endereço estruturado (logradouro, número, complemento, bairro),
  ano de fundação com faixa válida, tempo de mercado com unidade e pergunta
  condicional sobre outras unidades.
- Etapa 7 ganha unidade e natureza das informações (veículos por dia, dias úteis
  ou corridos) e tipos de prazo.
- Etapa 9 mantém um campo único de validades, porém com instrução explícita do
  formato por documento e sem tornar nenhum documento obrigatório.
- Etapa 12 ganha pergunta condicional sobre quais associações e frotas.
- Etapa 13 orienta a captura por categoria e explicita o que cada arquivo é.
- Etapa 14 separa o contato do responsável pelo site e explicita a autorização.
- A revisão final lista as 15 etapas, destaca ausentes e pendências, permite
  voltar à etapa, mostra a autorização de publicação registrada e exige
  confirmação explícita antes de enviar.

## Requisitos Não-Funcionais

- **Acessibilidade:** labels associados, `aria-describedby` para ajuda e erro,
  `aria-invalid`, resumo de erros focalizado, campos condicionais anunciados,
  navegação por teclado em todos os controles, foco visível, sem dependência
  exclusiva de cor.
- **Responsividade:** uma coluna no mobile, agrupamento por assunto no desktop,
  sem rolagem horizontal, alvos de toque adequados, teclado virtual coerente com
  o tipo do campo.
- **Compatibilidade:** sem dependências novas; React 19, TanStack Start, Zod e
  React Hook Form já instalados; `dist/client` sem SDK do Supabase.
- **Confiabilidade:** nenhuma perda de dado preenchido em falha de rede, de
  consulta de CEP ou de gravação; o envio só é confirmado pelo servidor.
- **Privacidade:** nenhum documento pessoal de colaborador é solicitado; o
  upload continua privado e a publicação continua sendo decisão separada.

## Critérios de Aceite

### AC-074-01

```yaml
id: AC-074-01
title: Matriz de auditoria das 15 etapas registrada
preconditions:
  - Código das 15 etapas inspecionado
action: Localizar a matriz de auditoria no repositório
expected_result: Cada uma das 15 etapas aparece com campo, problema, impacto, correção e teste
evidence_type: manual
```

### AC-074-02

```yaml
id: AC-074-02
title: CEP com máscara, validação e consulta assistida
preconditions:
  - Etapa 1 aberta
action: Digitar CEP com pontuação, colar CEP sem máscara, consultar um CEP existente e um CEP inexistente
expected_result: A entrada é mascarada como 00000-000; o CEP válido preenche apenas campos não editados; o CEP inválido ou a falha de rede não bloqueia o preenchimento e gera aviso
evidence_type: automated
```

### AC-074-03

```yaml
id: AC-074-03
title: CNPJ, telefone e data com validação específica
preconditions:
  - Etapa 1 e etapa 15 abertas
action: Informar CNPJ inválido, telefone com DDD inexistente e data 29/02 em ano não bissexto
expected_result: Cada entrada é recusada com mensagem específica; datas bissextas válidas e telefone válido são aceitos
evidence_type: automated
```

### AC-074-04

```yaml
id: AC-074-04
title: Perguntas condicionais com descarte explícito
preconditions:
  - Etapa 1 e etapa 12 abertas
action: Responder "não" para outras unidades e para associações/frotas
expected_result: Os campos dependentes são ocultados, deixam de ser enviados e o cliente recebe aviso de que a resposta será desconsiderada
evidence_type: automated
```

### AC-074-05

```yaml
id: AC-074-05
title: Controles de seleção adequados ao tipo de pergunta
preconditions:
  - Etapas 1, 2 e 3 abertas
action: Navegar por teclado nas perguntas de sim/não e nas listas de serviços
expected_result: Respostas mutuamente exclusivas curtas usam radio group navegável por teclado; listas extensas continuam selecionáveis com rótulo e foco visível
evidence_type: automated
```

### AC-074-06

```yaml
id: AC-074-06
title: Revisão final com pendências e confirmação explícita
preconditions:
  - Formulário parcialmente preenchido
action: Abrir a revisão e tentar enviar
expected_result: A revisão lista ausentes e pendências por etapa, permite voltar à etapa, exibe a autorização de publicação e só habilita o envio após confirmação explícita
evidence_type: automated
```

### AC-074-07

```yaml
id: AC-074-07
title: Layout, hierarquia e acessibilidade das etapas
preconditions:
  - Formulário aberto em viewport de 360px e de 1440px
action: Percorrer as etapas por teclado e inspecionar a hierarquia
expected_result: Uma coluna no mobile, agrupamento por assunto no desktop, sem rolagem horizontal, foco visível, erro associado ao campo e mudança de etapa anunciada
evidence_type: automated
```

### AC-074-08

```yaml
id: AC-074-08
title: Compatibilidade com os dados já persistidos
preconditions:
  - Briefing existente no banco com as 15 etapas gravadas
action: Abrir o briefing persistido e salvar novamente
expected_result: As respostas existentes são carregadas, os identificadores persistidos permanecem os mesmos e nenhum valor é apagado sem aviso
evidence_type: automated
```

### AC-074-09

```yaml
id: AC-074-09
title: Qualidade e não regressão
preconditions:
  - Implementação concluída
action: Executar lint, testes e build e o percurso E2E das 15 etapas
expected_result: Lint sem erros, suíte aprovada, build concluído e E2E verde com as 15 etapas gravadas
evidence_type: automated
```

## Abordagem Técnica

- `src/features/briefing/domain/masks.ts`: máscaras e validadores puros.
- `src/features/briefing/domain/cep-service.ts`: consulta de CEP com timeout.
- `src/features/briefing/domain/conditional.ts`: regras condicionais e descarte.
- `src/features/briefing/domain/section-schemas.ts`: schema por etapa usando os
  validadores do domínio.
- `src/features/briefing/ui/fields/`: componentes reutilizáveis (máscara, data,
  radio group, número, bloco de endereço).
- `src/features/briefing/ui/briefing-step-form.tsx` e `briefing-review.tsx`:
  integração dos componentes, agrupamento e revisão.
- `src/test/briefing-ux-spec074.test.ts(x)` e extensão de
  `e2e/briefing-15-etapas.spec.ts`.

## Entrega e Operações

- **Plano de implantação:** branch `feature/master-briefing-ux`; validação local
  e, se autorizado, preview.
- **Plano de migração:** nenhum dado é migrado; campos novos passam a existir
  apenas para novos preenchimentos.
- **Plano de rollback:** reverter os commits da branch; o schema do banco não
  muda.
- **Monitoramento:** observar falhas de gravação e de consulta de CEP.

## Riscos e Dependências

| Risco ou dependência                   | Impacto | Probabilidade | Mitigação                                                            | Responsável        |
| -------------------------------------- | ------- | ------------- | -------------------------------------------------------------------- | ------------------ |
| Dependência externa do ViaCEP          | Médio   | Média         | Timeout, tratamento de falha e edição manual sempre disponível       | Engenharia         |
| Campos condicionais apagando dado      | Alto    | Média         | Aviso explícito, confirmação e teste de persistência                 | Engenharia/Produto |
| Mudança de formato de valor persistido | Médio   | Baixa         | Persistir o valor mascarado como texto, sem alterar chaves nem tipos | Engenharia         |
| Escopo de 15 etapas com muitos campos  | Alto    | Alta          | Matriz de auditoria, correções priorizadas e testes por etapa        | Engenharia         |

## Questões Abertas

| Questão                                                        | Responsável   | Data limite       | Resolução                                              |
| -------------------------------------------------------------- | ------------- | ----------------- | ------------------------------------------------------ |
| Campo de texto livre ou lista fechada para "quais seguradoras" | Produto       | Antes da promoção | Mantido texto livre, sem inventar matriz de requisitos |
| Necessidade de coletar documentos de equipe além de contagem   | Produto / DPO | Antes da promoção | Nenhum dado pessoal é coletado nesta entrega           |

## Aprovação

| Papel      | Nome                                     | Decisão  | Data       | Notas                                       |
| ---------- | ---------------------------------------- | -------- | ---------- | ------------------------------------------- |
| Produto    | Solicitação humana explícita             | Approved | 2026-10-20 | Auditoria e refatoração UX/UI das 15 etapas |
| Design     | N/A — identidade existente preservada    | N/A      | 2026-10-20 | Sem troca de design system                  |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 | Branch isolada, sem deploy                  |
| QA         | Senior Full Stack / UX-UI Engineer (SDD) | Ready    | 2026-10-20 | Critérios automatizáveis definidos          |
