# SPEC-079 — Proposta Comercial Modular Master em Rota Dedicada

## Metadados

| Campo        | Valor                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| ID           | SPEC-079                                                                                                          |
| Título       | Proposta comercial modular da Master Chapeação e Pinturas em `/proposta/masterchapeacao`                          |
| Status       | Approved                                                                                                          |
| Responsável  | Senior Frontend / UX/UI & EPM DevTech                                                                             |
| Revisores    | Produto / Engenharia / QA                                                                                         |
| Criado       | 2026-10-26                                                                                                        |
| Atualizado   | 2026-10-26                                                                                                        |
| Refs:        | Solicitação humana explícita de 2026-10-26; `SPEC-027`, `SPEC-028`, `SPEC-071`; `src/lib/proposta.ts`             |

---

## 1. Problema e Visão Geral

A EPM DevTech precisa apresentar à **Master Chapeação e Pinturas** uma proposta comercial de software sob medida para o segmento de reparação e estética automotiva em Toledo-PR que vá além de um orçamento estático. A proposta constitui um **portfólio modular de soluções digitais**, onde cada módulo possui escopo, preço, exclusões, dependências e contratação próprios, permitindo que a Master contrate apenas o que fizer sentido para o seu momento operacional.

### Narrativa Comercial
- **EPM Web (R$ 2.490,00)** é a porta de entrada indispensável.
- **EPM Booking Auto (R$ 3.990,00)** é a primeira evolução sugerida, com destaque visual moderado e honesto (rótulo "Primeira evolução sugerida"), sem esconder os demais módulos e sem sugerir que é obrigatório.
- A Master começa pela presença digital de alta fidelidade e evolui de forma sustentável, sem assumir o custo ou complexidade de um sistema completo no primeiro dia.
- Esta entrega é estritamente uma **PÁGINA COMERCIAL CONSULTIVA**. Nenhum agendamento em tempo real, CRM, OS ou painel administrativo falso é persistido; os módulos só serão desenvolvidos se expressamente contratados.

---

## 2. Escopo

### No escopo

1. **Objeto de Domínio Canônico (`masterChapeacaoProposal`) em `src/lib/proposta.ts`**:
   - Catálogo de 6 módulos com modelagem tipada em centavos inteiros (`implementationPriceCents`), `priceType` (`fixed` | `from`), entregáveis, exclusões, dependências e notas comerciais.
   - 5 combinações sugeridas calculadas a partir do catálogo:
     - Presença Digital: R$ 2.490,00 (249000 centavos)
     - Captação e Agendamento: R$ 6.480,00 (648000 centavos)
     - Gestão Comercial: R$ 7.480,00 (748000 centavos)
     - Operação Digital: R$ 18.960,00 (1896000 centavos)
     - Ecossistema Expandido: R$ 23.440,00* (2344000 centavos, referência inicial)
   - Segregação estrita de custos recorrentes e despesas de terceiros (domínio, hospedagem, storage, mensageria, suporte sob demanda), nunca somados na implantação.
   - 9 etapas de projeto e condições comerciais completas (50% entrada / 50% homologação).
   - Contato oficial da EPM DevTech restrito ao e-mail confirmado `contato@epmdevtech.com.br` (sem telefone ou WhatsApp fictício).

2. **Rota Dedicada `/proposta/masterchapeacao`**:
   - Rota estática em `src/routes/proposta/masterchapeacao.tsx` com metadados `noindex, nofollow` e canonical próprio.
   - Fora dos menus públicos, rodapé e sitemap.
   - Acesso direto pela URL e resiliência ao refresh.

3. **Arquitetura Visual e Componentes Modulares**:
   - Identidade visual automotiva Master (preto/vermelho/branco/neutro, anti-card slop, tipografia Sora/Manrope).
   - Hero com logo oficial (`/master/logo.webp`), identificação da empresa e status da proposta.
   - Catálogo de módulos com seletor interativo em tempo real e rótulos ("Produto de entrada" e "Primeira evolução sugerida").
   - Matriz comparativa responsiva (tabela estruturada em desktop, layout empilhado legível em mobile).
   - Painel independente de custos recorrentes e despesas externas.
   - Seção de condições comerciais, responsabilidades e 9 etapas do projeto.
   - FAQ alinhado ao escopo sem promessas irreais.
   - CTA interativo com resumo dinâmico, ação principal ("Tenho interesse nesta proposta"), ação secundária ("Quero esclarecer uma dúvida") e diálogo com cópia de mensagem e envio via `mailto:`.

4. **Isolamento e Qualidade**:
   - A proposta original da BRS (`master-digital-presence`) permanece intacta e inalterada.
   - Quality gates 100% verdes (`bun run test`, `bun run lint`, `bun run build`).
   - Rastreabilidade SDD documentada.

### Fora do escopo

- Implementar agendamento em tempo real, backend de ordens de serviço, CRM ou integrações com bancos de dados de produção nesta entrega comercial.
- Invenção de dados do cliente, CNPJ não confirmado, prazos contratuais garantidos ou números de telefone/WhatsApp fictícios.
- Alteração da navegação ou páginas públicas existentes do site.
- Publicar a rota em menus, rodapé ou indexação de buscadores.

---

## 3. Critérios de Aceitação

### AC-079-01: Rota dedicada acessível e isolada
```yaml
id: AC-079-01
title: Rota dedicada disponível e confidencial
action: Acessar /proposta/masterchapeacao diretamente pela URL.
expected_result: A página renderiza a proposta modular da Master com robots noindex, nofollow, fora dos menus públicos e funcionando no refresh.
evidence_type: automated
```

### AC-079-02: Identidade oficial da Master Chapeação
```yaml
id: AC-079-02
title: Identidade visual e marca Master
action: Inspecionar hero, logo, títulos e referências textuais.
expected_result: Logo oficial (/master/logo.webp) exibido no hero, nome da Master Chapeação e Pinturas, autoria da EPM DevTech, sem resíduos visíveis da BRS.
evidence_type: automated / visual
```

### AC-079-03: Catálogo central dos 6 módulos e modelagem monetária
```yaml
id: AC-079-03
title: Catálogo dos 6 módulos automotivos
action: Inspecionar o catálogo em src/lib/proposta.ts e sua renderização.
expected_result: >-
  EPM Web (R$ 2.490,00 / 249000 centavos, produto de entrada), EPM Booking Auto
  (R$ 3.990,00 / 399000 centavos, primeira evolução sugerida), EPM CRM Auto (R$ 4.990,00 / 499000 centavos),
  EPM Oficina (R$ 7.490,00 / 749000 centavos), EPM Connect (a partir de R$ 1.990,00 / 199000 centavos, priceType 'from'),
  EPM Insights (R$ 2.490,00 / 249000 centavos). Cada módulo com escopo, exclusões e dependências.
evidence_type: automated
```

### AC-079-04: Combinações calculadas dinamicamente
```yaml
id: AC-079-04
title: Totais das combinações sugeridas
action: Verificar o cálculo das combinações no catálogo.
expected_result: >-
  Presença Digital (249000 centavos / R$ 2.490,00), Captação e Agendamento (648000 centavos / R$ 6.480,00),
  Gestão Comercial (748000 centavos / R$ 7.480,00), Operação Digital (1896000 centavos / R$ 18.960,00)
  e Ecossistema Expandido (2344000 centavos / R$ 23.440,00, rotulado como referência inicial).
evidence_type: automated
```

### AC-079-05: Segregação de custos recorrentes e terceiros
```yaml
id: AC-079-05
title: Não inclusão de custos recorrentes no total de implantação
action: Inspecionar a seção de custos recorrentes e o resumo de investimento.
expected_result: Domínio, hospedagem, storage, mensageria e suporte constam como despesas externas ou sob demanda, nunca somadas ao total de implantação.
evidence_type: automated
```

### AC-079-06: Matriz comparativa responsiva e etapas do projeto
```yaml
id: AC-079-06
title: Matriz comparativa e ciclo de 9 etapas
action: Inspecionar matriz comparativa e etapas de execução.
expected_result: >-
  Matriz exibe Solução, Objetivo, Recursos Principais, Dependências e Implantação sem overflow horizontal no mobile.
  9 etapas de execução explicam que a manifestação de interesse não gera vínculo contratual imediato.
evidence_type: automated / visual
```

### AC-079-07: CTA honesto e canal de contato confirmado
```yaml
id: AC-079-07
title: Ações de conversão sem falsos envios
action: Acionar "Tenho interesse nesta proposta" e verificar opções de contato.
expected_result: >-
  Diálogo exibe resumo dinâmico, pré-formatação da mensagem e envio apenas pelo e-mail confirmado
  contato@epmdevtech.com.br. Nenhum telefone ou WhatsApp fictício é exposto. Nenhum backend falso simula persistência.
evidence_type: automated
```

### AC-079-08: Quality gates e rastreabilidade
```yaml
id: AC-079-08
title: Validação técnica completa
action: Executar bun run lint, bun run test, bun run build e gerar matriz de rastreabilidade.
expected_result: Todos os gates 100% verdes sem falhas.
evidence_type: automated
```
