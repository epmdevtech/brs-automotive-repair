# SPEC-064: Auditoria e Refatoração UX/UI — Conversão, Integridade Editorial, Home em 6 Blocos e SEO Canônico

| Campo   | Valor                                        |
| ------- | -------------------------------------------- |
| ID      | `SPEC-064`                                   |
| Status  | Approved                                     |
| Data    | 2026-10-15                                   |
| Autor   | UX/UI & Frontend Engineering (Universal SDD) |
| Tarefas | `TASK-064-01`                                |
| Revisão | `REVIEW-064`                                 |

---

## 1. Contexto e Motivação

Após auditoria completa de UX/UI, conversão, integridade de conteúdo, SEO técnico e performance da **BRS Reparações Automotivas** (`https://brs.epmdevtech.com.br`), foram identificados pontos críticos de melhoria:

1. **Integridade de Conteúdo**:
   - O comparador antes/depois na Home afirmava `"executados na BRS"` e exibia métricas técnicas (`"TOLERÂNCIA < 1.0MM"`, `"Gaps < 1mm conformes"`) sobre imagens ilustrativas.
   - A imagem ilustrativa `funilaria-depois.jpg` era reutilizada como imagem de fundo do CTA final.
   - O rodapé exibia a frase `"Demonstração institucional oficial · Fotografias ilustrativas temporárias"`, comprometendo a percepção da página publicada em produção.
   - O catálogo de estética trazia números sem respaldo técnico verificado (`"Eliminação de até 90% dos micro-riscos"` e `"até 1 a 3 anos"`).
   - A página `/servicos` exibia um botão `"Solicitar Avaliação Técnica via WhatsApp"`, contrariando a diretriz estrita de não exibir WhatsApp não confirmado (`whatsappConfirmed: false`).
2. **SEO, Dados Oficiais e Compartilhamento**:
   - `siteUrl` em `src/lib/brs.ts`, tags `canonical`, `og:url`, `og:image`, `twitter:image`, dados estruturados JSON-LD, `public/sitemap.xml`, `public/robots.txt` e `public/llms.txt` apontavam para `http://brs.localhost` em vez do domínio oficial `https://brs.epmdevtech.com.br`.
   - O endereço físico (`R. Barão do Rio Branco, 4892 - Gisela, Toledo - PR, 85905-625`) e o horário de funcionamento (`Segunda a sexta, das 08h às 18h`), confirmados no perfil oficial da empresa no Google, não constavam na fonte canônica (`src/lib/brs.ts`), no Schema.org `AutoBodyShop`, na Home, no Rodapé e na página de Contato.
3. **Conversão e Hierarquia na Home**:
   - O `<h1>` da Home exibia apenas o nome da empresa (`"BRS Reparações Automotivas."`), repetindo a marca já visível no cabeçalho, sem declarar o que a oficina faz e onde atua.
   - O Hero não possuía CTA primário de avaliação (`"Solicitar avaliação"`), apenas uma âncora interna (`"Ver especialidades"`).
   - Cada card de serviço na Home possuía dois links para o mesmo destino com rótulos variáveis (`"Conhecer funilaria"`, `"Conhecer pintura automotiva"`).
   - A seção de Estética e Proteção ocupava 3 colunas com links individuais `"Avaliar"` na Home.
   - O bloco `"Escolha por onde continuar"` repetia links já presentes no cabeçalho e rodapé e misturava argumentos B2B com a jornada B2C.
   - O CTA final competia visualmente com o botão secundário `"Conhecer o Instagram"`.
4. **Ruído Visual e Performance**:
   - Simulação de telemetria (`SignatureCanvas` com `OPTICAL HUD`, `VERNIZ`, `LASER` e retículas em canvas 60fps), coordenadas geográficas decorativas (`COORD: 24°43'S 53°44'W`), numeração duplicada no processo (`01` + `Etapa 01`) e repetição excessiva do termo `"padrão de fábrica"`.
   - Na página `/contato`, o título `"O primeiro passo é um diagnóstico transparente."` aparecia duplicado em `<h1>` e `<h2>`.
   - Os cards da Home carregavam `*-depois.jpg` (~326 KB a 496 KB) em vez dos assets otimizados `funilaria.jpg` (100 KB), `pintura.jpg` (111 KB) e `martelinho.jpg` (108 KB).

---

## 2. Escopo e Requisitos Funcionais

### RF-01: Fonte Canônica (`src/lib/brs.ts`), Endereço, Horário e Domínio de Produção

- Atualizar `company.siteUrl` para `"https://brs.epmdevtech.com.br"`.
- Incluir em `company` o endereço confirmado (`R. Barão do Rio Branco, 4892 - Gisela, Toledo - PR, 85905-625`) e horário de atendimento (`Segunda a sexta, das 08h às 18h`).
- Remover percentuais e prazos sem respaldo técnico em `aestheticServices` (`"até 90%"`, `"até 1 a 3 anos"`), substituindo por descrições técnicas honestas.
- Reduzir a repetição de `"padrão de fábrica"` nos textos de serviços e processo.

### RF-02: Arquitetura da Home em 6 Blocos com Função Única

1. **Hero (`Hero` + `AnimatedHero`)**:
   - `<h1>` objetivo declarando o que a BRS faz e onde atua: `"Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR."`
   - Subtítulo direto sobre atendimento a proprietários e segurados com diagnóstico transparente.
   - CTA principal `"Solicitar avaliação"` (`/contato`) visível sem rolagem em mobile e desktop.
   - Remoção do `SignatureCanvas` (HUD/partículas/laser), do rótulo `"OFICINA TÉCNICA"` e da âncora secundária `"Ver especialidades"`.
   - Imagem do Hero renderizada com `<img fetchPriority="high" loading="eager" />` e aviso discreto `"Fotografia ilustrativa"`.
2. **Serviços (`Services`)**:
   - 3 cards (`Funilaria automotiva`, `Pintura automotiva`, `Martelinho de ouro`) com título em `<h3>` (sem link duplicado no título), 1–2 frases diretas, imagem otimizada (`funilaria.jpg`, `pintura.jpg`, `martelinho.jpg`) com selo `"Fotografia ilustrativa"`, e **um único link por card** com rótulo consistente (`"Ver detalhes do serviço"`).
   - Estética e proteção condensada em uma única linha compacta (`"Também fazemos espelhamento de pintura, vitrificação cerâmica e polimento de para-brisa."`) com link para `/servicos#estetica-automotiva`.
3. **Confiança e Processo Consolidados (`ProcessTimeline` / `Philosophy`)**:
   - Unificar em um único bloco na Home (`id="processo"`):
     - Até 3 diferenciais verificáveis sem numeração e sem promessa de `"laudo"`: (1) Diagnóstico claro antes do serviço; (2) Orçamento e prazo alinhados antes da execução; (3) Leva e traz em Toledo conforme disponibilidade.
     - As 4 etapas do atendimento (`Primeiro contato`, `Avaliação técnica`, `Orçamento e alinhamento`, `Reparação e conferência`) em linha com sequência numérica única (`01` a `04`, sem `"Etapa 01"` duplicado) e observação de que escopo e prazo dependem de avaliação presencial.
4. **Trabalhos na Home e Rota `/trabalhos`**:
   - Remover da Home o comparativo antes/depois (`HomeBeforeAfter`) e o banner `MediaExpand` enquanto não houver fotos reais autorizadas da oficina.
   - Manter a rota `/trabalhos` ativa com aviso explícito de imagens ilustrativas e sem afirmar que os casos ilustrativos foram executados na BRS nem exibir métricas não aferidas (`< 1.0mm`).
5. **Corretores (`HomePathways`)**:
   - Substituir o grid de 3 colunas `"Escolha por onde continuar"` por uma faixa horizontal discreta (`"É corretor de seguros?"`) com link único para `/para-corretores`.
6. **CTA Final e Rodapé (`FinalCTA` + `MinimalFooter`)**:
   - `FinalCTA`: CTA único `"Solicitar avaliação"` (`/contato`), sem imagem reutilizada `funilaria-depois.jpg` no fundo e sem botão secundário `"Conhecer o Instagram"`, exibindo telefone `(45) 2035-9440`, endereço `R. Barão do Rio Branco, 4892 - Gisela, Toledo - PR` e horário `Segunda a sexta, das 08h às 18h`.
   - `MinimalFooter`: exibir Instagram `@brsreparacoes`, telefone, endereço confirmado, horário, links de navegação, razão social/CNPJ e link de privacidade. Remover a frase `"Demonstração institucional oficial · Fotografias ilustrativas temporárias."`.

### RF-03: Correções em Páginas Internas, SEO e Acessibilidade

- Em `/servicos` (`src/routes/servicos/index.tsx`), substituir `"Solicitar Avaliação Técnica via WhatsApp"` por `"Solicitar avaliação"`.
- Em `/contato` (`src/components/brs/contact.tsx` e `src/routes/contato.tsx`), eliminar a duplicação do título `"O primeiro passo é um diagnóstico transparente."` entre `<h1>` e `<h2>`, e exibir endereço e horário confirmados.
- Em `/sobre` (`src/routes/sobre.tsx`), exibir endereço e horário confirmados da oficina.
- Em `src/lib/seo.ts`, incluir `streetAddress`, `postalCode` e `openingHoursSpecification` no Schema.org `AutoBodyShop`.
- Atualizar todas as referências de `http://brs.localhost` em rotas JSON-LD, `public/sitemap.xml`, `public/robots.txt` e `public/llms.txt` para `https://brs.epmdevtech.com.br`.
- Aumentar a área de toque do botão de menu mobile no `Header` de `size-9` (36px) para `size-11` (44px).

---

## 3. Critérios de Aceitação

- [x] CA-01: A Home possui exatamente os 6 blocos funcionais definidos (Hero, Serviços, Confiança + Processo unificados, Faixa para Corretores, CTA Final e Rodapé).
- [x] CA-02: O `<h1>` da Home comunica os serviços e a cidade (`Funilaria, pintura em estufa e martelinho de ouro em Toledo-PR.`), acompanhado do botão primário `"Solicitar avaliação"` (`/contato`).
- [x] CA-03: Cada card de serviço na Home possui apenas 1 link com rótulo padronizado `"Ver detalhes do serviço"` e utiliza os assets otimizados (`funilaria.jpg`, `pintura.jpg`, `martelinho.jpg`).
- [x] CA-04: Nenhum elemento na Home ou páginas internas afirma que fotos ilustrativas foram executadas na BRS, exibe métricas não aferidas (`< 1.0mm`, `até 90%`, `1 a 3 anos`), cita WhatsApp não confirmado ou exibe `"Demonstração institucional oficial"`.
- [x] CA-05: SEO (`canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`) utiliza `https://brs.epmdevtech.com.br` e inclui endereço e horário oficiais.
- [x] CA-06: Todos os quality gates (`bun run test`, `bun run lint`, `bun run build`) passam com 100% de sucesso.
