# SPEC-027 — Rota de Proposta Comercial Personalizada (BRS Reparações Automotivas | EPM DevTech)

## Metadados

| Campo          | Valor                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| ID             | `SPEC-027`                                                                                           |
| Status         | Approved (Aprovado)                                                                                  |
| Responsável    | Staff Frontend Engineer & Especialista Comercial EPM DevTech                                         |
| Revisores      | Engenharia, Produto, UX/UI Design e QA EPMDEVTECH                                                    |
| Criado         | 2026-10-13                                                                                           |
| Atualizado     | 2026-10-13                                                                                           |
| Liberação Alvo | 0.2.0                                                                                                |
| Refs:          | Universal SDD Framework; SPEC-022 (Design Tokens); SPEC-023 (Anti-Card Slop); SPEC-014 (SEO/Routing) |

---

## 1. Problema e Resultado

### Problema

A EPM DevTech precisa apresentar uma proposta comercial personalizada de presença digital para a **BRS Reparações Automotivas**, detalhando o escopo técnico, investimentos aprovados, cronograma e entregáveis, além de possibilitar que o cliente expresse seu interesse em avançar para a etapa de briefing de forma transparente e profissional.

No entanto, o site da BRS não dispunha de uma rota dedicada para propostas, e não se deve utilizar landing pages genéricas nem replicar modelos ou valores de outros segmentos (como a proposta odontológica de referência). É fundamental ter uma experiência nativa ao ecossistema da BRS, com tipografia Sora/Manrope, paleta grafite/dourado, respeito às diretrizes Anti-Card Slop e um modelo de dados seguro, desacoplado e tipado.

### Resultado Desejado

Implementar a rota dinâmica `/proposta/$slug` e `/proposta` no TanStack Router, renderizando uma experiência comercial editorial de alta conversão dividida em 10 seções temáticas modulares. A proposta deve ser alimentada por um módulo canônico de dados (`src/lib/proposta.ts`), com validação rigorosa de campos comerciais obrigatórios antes da liberação, bloqueio de placeholders fictícios, metadados com `noindex, nofollow`, e fluxo honesto de manifestação de interesse com diálogo explicativo para transição ao briefing.

---

## 2. Escopo

### No escopo (In scope)

1. **Módulo de Tipos e Dados de Negócio (`src/lib/proposta.ts`)**:
   - Definição tipada de `CommercialProposal`, `ProposalStatus`, `ProposalInvestment`, `CommercialItem`, `ProjectPhase`, `FaqItem`.
   - Repositório de propostas estruturado com dados reais para o projeto da BRS (`brs-digital-presence`).
   - Validador comercial `validateProposalCompleteness()` para certificar que valores, cliente e escopo estão 100% preenchidos antes de permitir envio ao cliente.
   - Formatador monetário brasileiro estrito `formatCurrencyBRL()`.
   - Gerador de mensagem padronizada de manifestação de interesse `generateAcceptanceMessage()`.
2. **Rotas TanStack Router**:
   - `src/routes/proposta/$slug.tsx`: visualização da proposta individualizada por identificador seguro.
   - `src/routes/proposta/index.tsx`: rota sem slug que direciona para a proposta ativa ou instrui consulta.
   - Tratamento de proposta não encontrada ou inexistente com estado 404 contextual e amigável.
   - Tratamento de proposta em rascunho com aviso de configuração pendente para a equipe.
3. **Arquitetura Visual e Editorial (10 Seções Modulares)**:
   - Seção 1: Identificação da proposta, cliente, título, autoria EPM DevTech e data de emissão.
   - Seção 2: Diagnóstico e objetivos pretendidos para o setor automotivo (Toledo-PR).
   - Seção 3: Solução proposta com benefícios práticos.
   - Seção 4: Escopo claro e entregáveis (Incluído vs. Não incluído/Contratado à parte).
   - Seção 5: Investimento inequívoco com formatação em Reais (implantação, entrada, saldo e ausência de mensalidade surpresa).
   - Seção 6: Condições comerciais, formas de pagamento e ressalva contratual.
   - Seção 7: Etapas cronológicas do desenvolvimento até a publicação.
   - Seção 8: Prazos estimados e responsabilidades mútuas (EPM DevTech e BRS).
   - Seção 9: Perguntas Frequentes (FAQ) em acordeão acessível Radix UI.
   - Seção 10: Aceite comercial e transição ao briefing (CTA principal "Tenho interesse nesta proposta" e secundário "Quero esclarecer uma dúvida").
4. **Fluxo de Conversão e Transição para Briefing**:
   - Modal acessível (`Dialog` Radix) para confirmação de interesse.
   - Notificação transparente de que a ação não constitui assinatura jurídica irrevogável nem cobrança automática.
   - Preparação de mensagem formatada para WhatsApp comercial confirmado da EPM DevTech ou cópia para área de transferência.
5. **SEO, Confidencialidade e Acessibilidade**:
   - Tag `<meta name="robots" content="noindex, nofollow">` nas rotas de proposta.
   - Omissão estrita do sitemap público (`public/sitemap.xml`) e menus públicos.
   - Navegação por teclado, contraste AA e respeito a `prefers-reduced-motion`.
6. **Suíte de Testes Automatizados**:
   - Testes unitários para regras de negócio e validações comerciais em `src/test/proposta.test.ts`.
   - Testes de renderização de componentes e rotas da proposta em `src/test/proposta-route.test.tsx`.

### Fora do escopo (Out of scope)

- Criação de banco de dados SQL ou sistema complexo de autenticação por senha (a infraestrutura é frontend estático com SSR Nitro).
- Assinatura digital com certificado ICP-Brasil (a rota destina-se a manifestação comercial de interesse pré-briefing).
- Alteração no sitemap público ou inclusão da proposta na navbar pública.
- Alteração ou regressão em páginas existentes (`/`, `/servicos`, `/trabalhos`, `/contato`, etc.).

---

## 3. Comportamento Funcional

1. **Carregamento da Proposta**:
   - O cliente acessa `/proposta/brs-digital-presence` (ou slug correspondente).
   - O componente busca a proposta via `getProposalBySlug(slug)`.
   - Se não existir: exibe tela de "Proposta não encontrada", com botão de retorno e canal de contato com a EPM DevTech.
   - Se o status for `draft` e faltarem campos obrigatórios: renderiza aviso informativo de "Proposta em elaboração comercial".
   - Se o status for `ready` ou `accepted`: renderiza a proposta completa com as 10 seções habilitadas.
2. **Navegação Rápida por Âncoras**:
   - Barra horizontal adesiva (sticky sub-nav) com links para `#visao-geral`, `#solucao`, `#escopo`, `#investimento`, `#condicoes`, `#etapas`, `#faq` e `#manifestar-interesse`.
3. **Apresentação de Investimento**:
   - Valores exibidos com `R$`, separadores de milhar e centavos (`R$ 3.800,00`).
   - Indicação expressa de que não há cobrança de mensalidade mandatória ou taxas ocultas de manutenção recorrente, esclarecendo a responsabilidade de custos diretos de terceiros (domínio anual e hospedagem).
4. **Manifestação de Interesse**:
   - Ao clicar no CTA principal, abre-se o modal de confirmação.
   - O modal explica com transparência o próximo passo: agendamento da reunião de alinhamento e envio do formulário de briefing.
   - O cliente pode acionar o encaminhamento para o canal de atendimento da EPM DevTech ou copiar o texto estruturado com os dados da proposta.

---

## 4. Requisitos Não-Funcionais

- **Segurança e Privacidade**: A rota possui diretiva `noindex, nofollow`, não expõe tokens privados nem dados confidenciais de terceiros.
- **Acessibilidade**: Conformidade com WCAG 2.1 AA. Todos os botões, links e acordeões com nomes acessíveis, focus rings e estados ARIA.
- **Performance e SSR**: Compatível com SSR Nitro e hidratação React 19 sem flashes de conteúdo ou erros de layout.
- **Design Editorial Premium**: Tipografia Sora nos títulos, Manrope no corpo, acentos em ouro metálico `#c8a96a`, fundo grafite escuro e observância do princípio Anti-Card Slop (SPEC-023).

---

## 5. Critérios de Aceitação

### AC-027-01: Resolução de Rotas e Isolamento Público

```yaml
id: AC-027-01
title: Rota de proposta acessível por URL direta e ausente dos menus públicos
preconditions:
  - TanStack Router configurado e executando
action: Navegar diretamente para /proposta e /proposta/:slug
expected_result:
  - A rota resolve com sucesso a visualização da proposta
  - A rota não é listada na navbar pública primária nem no sitemap público
evidence_type: automated
```

### AC-027-02: Tratamento de Proposta Não Encontrada

```yaml
id: AC-027-02
title: Tratamento elegante de identificador de proposta inexistente
preconditions:
  - Rota /proposta/$slug acessada
action: Fornecer um slug não cadastrado (ex.: /proposta/inexistente-xyz)
expected_result:
  - Exibe tela de "Proposta não localizada ou expirada"
  - Fornece botão de retorno à home e contato com a equipe comercial
evidence_type: automated
```

### AC-027-03: Validação de Completude e Prevenção de Placeholders

```yaml
id: AC-027-03
title: Bloqueio de publicação com campos obrigatórios vazios ou inválidos
preconditions:
  - Objeto de proposta instanciado com dados parciais ou valores zerados não configurados
action: Executar validateProposalCompleteness()
expected_result:
  - Identifica campos faltantes e impede publicação como pronta para envio
evidence_type: automated
```

### AC-027-04: Apresentação Transparente do Investimento

```yaml
id: AC-027-04
title: Formatação brasileira de moeda e explicitação de custos recorrentes
preconditions:
  - Proposta pronta renderizada
action: Inspecionar a Seção de Investimento
expected_result:
  - Exibe valores com símbolo R$ e pontuação brasileira correta
  - Deixa explícito se há ou não mensalidade e os momentos de pagamento do saldo
evidence_type: automated
```

### AC-027-05: Escopo Discriminado (Incluído vs. Não Incluído)

```yaml
id: AC-027-05
title: Exibição clara de entregáveis garantidos e itens fora de escopo
preconditions:
  - Proposta pronta renderizada
action: Inspecionar a Seção de Escopo
expected_result:
  - Renderiza lista de itens incluídos com marcações visuais positivas
  - Renderiza lista de exclusões e serviços opcionais à parte para evitar ambiguidades
evidence_type: automated
```

### AC-027-06: Acordeão Acessível de Perguntas Frequentes

```yaml
id: AC-027-06
title: Navegação por teclado e interação com o FAQ comercial
preconditions:
  - Usuário foca nas perguntas do FAQ
action: Acionar tecla Enter ou clique no AccordionTrigger
expected_result:
  - Revela a resposta correspondente expandindo o conteúdo com transição suave
  - Atributos aria-expanded e aria-controls atualizados dinamicamente
evidence_type: accessibility
```

### AC-027-07: Fluxo Honesto de Manifestação de Interesse

```yaml
id: AC-027-07
title: Modal de transição para o briefing sem alegação de assinatura jurídica
preconditions:
  - Cliente visualiza os botões de ação final
action: Clicar em "Tenho interesse nesta proposta"
expected_result:
  - Abre modal com explicações da etapa seguinte (alinhamento e briefing)
  - Disponibiliza cópia de mensagem e encaminhamento ao canal da EPM DevTech
evidence_type: automated
```

### AC-027-08: Quality Gates e Diretivas de Confidencialidade

```yaml
id: AC-027-08
title: 100% de sucesso em testes, lint, build e diretiva noindex
preconditions:
  - Código implementado no repositório
action: Executar bun run test, bun run lint, bun run build
expected_result:
  - Zero falhas nos testes Vitest
  - Zero erros de ESLint e Prettier
  - Build do Vite e Nitro SSR concluído com êxito
  - Meta robots com "noindex, nofollow" presente na proposta
evidence_type: automated
```

---

## 6. Abordagem Técnica

1. **`src/lib/proposta.ts`**:
   - Modelagem de dados canônica e exportação da proposta piloto real da BRS (`brs-digital-presence`).
   - Funções auxiliares `formatCurrencyBRL()`, `getProposalBySlug()`, `validateProposalCompleteness()`, `generateAcceptanceMessage()`.
2. **Componentes da Proposta (`src/components/brs/proposal/`)**:
   - `proposal-view.tsx`: Orquestrador da visualização completa da proposta.
   - `proposal-hero.tsx`: Seção 1 (Identificação, título, autoria EPM DevTech).
   - `proposal-nav.tsx`: Sub-navegação adesiva por âncoras.
   - `proposal-opportunity.tsx`: Seção 2 (Diagnóstico e objetivos).
   - `proposal-solution.tsx`: Seção 3 (Solução proposta e diferenciais).
   - `proposal-scope.tsx`: Seção 4 (Entregáveis incluídos vs. contratados à parte).
   - `proposal-investment.tsx`: Seção 5 (Valores, parcelamento, ausência de mensalidade).
   - `proposal-conditions.tsx`: Seção 6 (Condições comerciais e regras de início/publicação).
   - `proposal-timeline.tsx`: Seção 7 (Etapas de desenvolvimento até a entrega).
   - `proposal-responsibilities.tsx`: Seção 8 (Prazos e responsabilidades mútuas).
   - `proposal-faq.tsx`: Seção 9 (FAQ comercial em acordeão).
   - `proposal-acceptance.tsx`: Seção 10 (CTAs de conversão e modal de transição para briefing).
   - `proposal-not-found.tsx`: Estado elegante para proposta não encontrada.
3. **Rotas TanStack Router**:
   - `src/routes/proposta/$slug.tsx`
   - `src/routes/proposta/index.tsx`
4. **Metadados**:
   - Inclusão de `meta: [{ name: "robots", content: "noindex, nofollow" }]` em `buildRouteHead()`.

---

## 7. Riscos e Mitigações

| Risco                                             | Impacto | Probabilidade | Mitigação                                                                                               |
| ------------------------------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| Cliente interpretar clique como contrato assinado | Alto    | Média         | Textos explícitos no modal e no botão clarificando que a ação é manifestação de interesse pré-briefing. |
| Divulgação pública inadvertida no Google          | Alto    | Baixa         | Tag `noindex, nofollow` estrita e ausência da rota no `sitemap.xml` público.                            |
| Inclusão de valores ou dados de outro cliente     | Alto    | Baixa         | Arquitetura tipada centralizada por slug; validação de completude `validateProposalCompleteness()`.     |

---

## 8. Aprovação

| Papel      | Nome                    | Decisão  | Data       | Notas                                                 |
| ---------- | ----------------------- | -------- | ---------- | ----------------------------------------------------- |
| Produto    | EPMDEVTECH Product Team | Approved | 2026-10-13 | Escopo alinhado à estratégia de vendas do projeto BRS |
| Design     | Staff UX/UI Designer    | Approved | 2026-10-13 | Design tokens e Anti-Card Slop validados              |
| Engenharia | Staff Frontend Engineer | Approved | 2026-10-13 | Roteamento TanStack Start e SSR Nitro validados       |
| QA         | QA Engineer             | Ready    | 2026-10-13 | Critérios de aceitação rastreáveis e verificáveis     |
