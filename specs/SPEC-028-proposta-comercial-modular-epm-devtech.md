# SPEC-028 — Proposta Comercial Modular EPM DevTech para BRS Reparações Automotivas

## Metadados

| Campo          | Valor                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| ID             | `SPEC-028`                                                                                             |
| Status         | Approved (Aprovado)                                                                                    |
| Responsável    | Software Architect, Product Manager & Staff Frontend Engineer EPM DevTech                              |
| Revisores      | Engenharia, Produto, UX/UI Design e QA EPMDEVTECH                                                      |
| Criado         | 2026-10-13                                                                                             |
| Atualizado     | 2026-10-13                                                                                             |
| Liberação Alvo | 0.3.0                                                                                                  |
| Refs:          | Universal SDD Framework; SPEC-027 (Proposta Base); SPEC-022 (Design Tokens); SPEC-023 (Anti-Card Slop) |

---

## 1. Problema e Visão Geral

A EPM DevTech precisa apresentar à **BRS Reparações Automotivas** uma proposta comercial de software sob medida para o segmento automotivo que vá além de um orçamento de site institucional estático. A BRS deve compreender a amplitude de soluções digitais disponíveis, permitindo avaliar um **portfólio modular de produtos**, cada um com escopo delimitado, limitações explícitas, dependências técnicas, preços de implantação transparentes e custos recorrentes discriminados.

### Objetivos do Negócio e do Usuário

1. Compreender o que é entregue em cada um dos 6 módulos e qual dor operacional ou comercial cada solução atende na oficina (funilaria, pintura e martelinho de ouro).
2. Avaliar combinações sugeridas (pacotes de entrada, captação, gestão, operação completa e ecossistema total).
3. Utilizar um seletor interativo de módulos com cálculo dinâmico e transparente do investimento total, diferenciando valores fechados de itens com precificação "a partir de".
4. Discriminar custos de infraestrutura e serviços externos (domínio, hospedagem, provedor WhatsApp) para nunca confundir custos recorrentes com implantação.
5. Permitir a manifestação de interesse estruturada direcionada aos canais oficiais da EPM DevTech sem simular falsos contratos ou persistência fictícia.
6. Garantir experiência responsiva de alto padrão em dispositivos móveis (smartphones), tablets e desktops.

---

## 2. Arquitetura da Informação (10 Seções Canônicas)

- **Seção A — Abertura Personalizada**:
  Título: _"Uma estrutura digital preparada para a próxima fase da BRS."_  
  Subtítulo e metadados de autoria da EPM DevTech, cliente BRS Reparações Automotivas, data de emissão, validade e identificador.
- **Seção B — Diagnóstico e Oportunidades**:
  Oportunidades do setor automotivo em Toledo-PR a validar no briefing (sem falsas presunções de problemas existentes).
- **Seção C — Portfólio Modular de 6 Soluções**:
  1. **EPM Web** (Presença digital automotiva) — R$ 2.490,00
  2. **EPM Booking Auto** (Solicitações de avaliação e agendamento) — R$ 3.990,00
  3. **EPM CRM Auto** (Gestão comercial e relacionamento) — R$ 4.990,00
  4. **EPM Oficina** (Gestão de ordens de serviço e fotos de entrada) — R$ 7.490,00
  5. **EPM Connect** (Notificações e integrações WhatsApp/e-mail) — A partir de R$ 1.990,00
  6. **EPM Insights** (Indicadores comerciais e operacionais) — R$ 2.490,00
     _Cada módulo com escopo-base, fora do escopo, dependências e seletor de interesse._
- **Seção D — Matriz Comparativa Responsiva**:
  Tabela comparativa por objetivo, recursos, dependências e investimento, adaptada para telas estreitas.
- **Seção E — Combinações Sugeridas (Pacotes Pré-configurados)**:
  - Alternativa 1: Presença Digital (R$ 2.490,00)
  - Alternativa 2: Captação e Agendamento (R$ 6.480,00)
  - Alternativa 3: Gestão Comercial (R$ 7.480,00)
  - Alternativa 4: Operação Digital (R$ 18.960,00)
  - Alternativa 5: Ecossistema Expandido (R$ 23.440,00*)
    _Botões de atalho para selecionar os módulos correspondentes em 1 clique._
- **Seção F — Custos Recorrentes e Despesas Externas**:
  Painel independente para domínio, hospedagem, provedor WhatsApp e suporte sob demanda ("A definir conforme infraestrutura e escopo").
- **Seção G — Condições Comerciais e Pagamento**:
  Formas de pagamento (50% entrada / 50% homologação), parcelamento no cartão corporativo, desconto no PIX e ressalva contratual.
- **Seção H — Etapas de Execução do Projeto**:
  Fluxo visual das 9 etapas: Apresentação → Manifestação → Alinhamento → Briefing → Escopo/Contrato → Orçamento definitivo → Desenvolvimento → Homologação → Publicação.
- **Seção I — Perguntas Frequentes (FAQ)**:
  Acordeão acessível esclarecendo contratação modular, adições futuras, WhatsApp e briefing.
- **Seção J — CTA e Manifestação de Interesse com Resumo Dinâmico**:
  Resumo em tempo real dos módulos selecionados, cálculo de total, aviso de valor referencial ("a partir de") e modal acessível gerando mensagem estruturada para WhatsApp ou e-mail da EPM DevTech.

---

## 3. Critérios de Aceite (Acceptance Criteria)

- **AC-028-01 (Rota Semântica & Privacidade)**: A rota canônica `/proposta/brs-reparacoes` carrega diretamente no TanStack Router sem links na navegação pública, com meta tag `noindex, nofollow` e ausência no sitemap.
- **AC-028-02 (Catálogo Centralizado Tipado)**: Todos os 6 produtos, preços, descrições e pacotes residem em módulo canônico de dados (`src/lib/proposta.ts`), sem duplicação de preços no JSX.
- **AC-028-03 (Seletor Interativo e Cálculo Dinâmico)**: O usuário pode marcar/desmarcar módulos individualmente ou aplicar um pacote pré-definido, com atualização imediata do subtotal e sinalização de preços "a partir de".
- **AC-028-04 (Matriz Comparativa Responsiva)**: Matriz comparativa que se adapta confortavelmente em mobile (<640px), tablet (640px-1024px) e desktop (>1024px) sem quebrar o layout.
- **AC-028-05 (Segregação de Custos)**: Custos de implantação são rigorosamente segregados de custos recorrentes e despesas diretas de terceiros.
- **AC-028-06 (Acessibilidade e Resiliência)**: Conformidade com WCAG 2.1 AA (contraste, foco visível, touch targets $\ge 44$px, sem dependência de animações bloqueantes com opacidade zero).
- **AC-028-07 (Fluxo Honesto de Manifestação de Interesse)**: O modal de conversão pré-formata a mensagem com os módulos selecionados para envio real via WhatsApp ou e-mail da EPM DevTech, sem falsa alegação de contrato assinado.
- **AC-028-08 (Quality Gates Automatizados)**: 100% de aprovação em Vitest (`bun run test`), ESLint (`bun run lint`), Build Nitro SSR (`bun run build`) e Playwright E2E.
