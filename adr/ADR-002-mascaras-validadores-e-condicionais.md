# ADR-002 — Máscaras, validadores e regras condicionais no domínio do briefing

| Campo     | Valor                              |
| --------- | ---------------------------------- |
| ID        | ADR-002                            |
| Status    | Accepted                           |
| Data      | 2026-10-20                         |
| Decisores | Engenharia EPMDEVTECH              |
| Refs:     | SPEC-074; TASK-074-02; TASK-074-03 |

## Contexto

A auditoria do formulário de 15 etapas mostrou que CNPJ, CEP e telefone são
tratados como texto livre, datas usam entrada ISO sem calendário, e várias
perguntas de sim/não dependem de outras respostas sem qualquer lógica. A
validação atual é feita por um único `buildSectionSchema`, o mesmo objeto serve
ao React Hook Form e ao servidor, e qualquer lógica nova precisa ser
implementada uma única vez para não divergir.

## Decisão

1. **Máscaras e validadores no domínio puro** (`src/features/briefing/domain/masks.ts`),
   sem dependência de DOM: CEP `00000-000`, CNPJ `00.000.000/0000-00` com
   dígitos verificadores, telefone por comprimento com DDD válido, data civil
   `dd/mm/aaaa` com calendário e bissextos e número decimal pt-BR.
2. **Persistência canônica por tipo**, declarada no campo (`format`):
   - datas civis → `YYYY-MM-DD`, sem conversão para UTC;
   - máscaras de texto → valor formatado, com validação sobre os dígitos;
   - números → texto com separadores pt-BR, nunca `NaN` e nunca vazio virando 0.
3. **Um único schema por etapa**, alimentado pelo mesmo domínio, usado pelo
   cliente e pelo servidor; a validação do servidor é a que vale.
4. **Regras condicionais declarativas** (`domain/conditional.ts`): campo
   controlador → campos dependentes. Campo ocultado não é enviado, o schema
   respeita a mesma regra e o cliente é avisado de que a resposta será
   desconsiderada — nunca há apagamento silencioso.
5. **Consulta de CEP como enriquecimento opcional** (`domain/cep-service.ts`):
   debounce, timeout, abort e falha não bloqueante; a edição manual permanece
   sempre disponível e campos já editados não são sobrescritos.
6. **Componentes de interface reutilizáveis** em `ui/fields/`, sem dependência
   de biblioteca externa: entrada mascarada, data em segmentos, radio group,
   número com unidade e bloco de endereço.

### Alternativas consideradas

| Alternativa                                           | Motivo da recusa                                                                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Biblioteca de máscaras (ex.: `react-imask` / `imask`) | Dependência nova para um conjunto pequeno de formatos; regra do projeto é não adicionar dependências sem necessidade demonstrada. |
| Máscara apenas visual (CSS/placeholder)               | Não valida nem normaliza; o prompt proíbe máscara como único mecanismo de validação.                                              |
| Regras condicionais só na interface                   | Divergiria do schema do servidor e permitiria enviar dados contraditórios.                                                        |
| Campo de data nativo ISO com calendário do navegador  | Exige digitar `AAAA-MM-DD`, não atende o padrão brasileiro nem o requisito de segmentos.                                          |

## Consequências

**Positivas**

- CNPJ, CEP, telefone e data passam a ser validados de verdade, no cliente e no
  servidor, com mensagem específica.
- A data persistida é canônica e não muda de dia por fuso horário.
- Perguntas irrelevantes deixam de existir para o cliente e de ser enviadas.
- A consulta de CEP é um ganho opcional: a falha externa não bloqueia nada.

**Negativas**

- O domínio ganhou um módulo de máscaras a ser mantido junto das regras de
  negócio.
- Campos condicionais exigem aviso na interface e teste de persistência.
- Valores antigos sem máscara continuam legíveis e válidos (validação por
  dígitos), sem migração.

## Situação de implantação

Implementado na branch `feature/master-briefing-ux`, com cobertura de teste de
domínio, componente e E2E.
