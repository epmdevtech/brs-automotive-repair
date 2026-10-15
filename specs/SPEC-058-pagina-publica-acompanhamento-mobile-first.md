# SPEC-058: Página Pública de Acompanhamento do Reparo Mobile-First (WCAG 2.2 AA & Projeção Segura)

## Metadados

| Campo       | Valor                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-058                                                                                          |
| Título      | Página Pública de Acompanhamento Mobile-First, Acessível (WCAG 2.2 AA) e Projeção Segura de Dados |
| Status      | Aprovado                                                                                          |
| Data        | 2026-10-15                                                                                        |
| Autor       | Staff Product Designer & Engenheiro Front-end Sênior                                              |
| Módulo      | `routes/acompanhar` & `features/booking`                                                          |
| Dependência | SPEC-050, SPEC-054, SPEC-055, SPEC-056, SPEC-057 (Linha do Tempo Operacional RBAC)                |

---

## 1. Visão Geral e Princípio de Experiência

A página pública de acompanhamento da **BRS Reparações Automotivas** (Toledo-PR) é o ponto de contato direto do cliente final com o status de seu veículo. O cliente recebe um link por WhatsApp/SMS, abre no smartphone e precisa responder, em poucos segundos, à pergunta essencial: **"Como está o meu carro agora?"**.

### Princípios de Design & Engenharia

1. **Mobile-First & Acima da Dobra (Hero de Status)**: Em telas de 360×640 px, o status atual, protocolo, segmento de progresso e canal de contato devem ser visíveis sem necessidade de rolagem.
2. **Isolamento de Layout (Anti-Header de Marketing)**: A rota transacional `/acompanhar` não deve carregar o header fixo flutuante de marketing do site público (com botões de navegação geral e CTA "Avaliação"), possuindo um header enxuto no fluxo (`position: sticky`, sólido, sem sobreposição de conteúdo).
3. **Projeção Pública Segura (LGPD & Privacy)**: O frontend consome estritamente uma projeção pública segura (DTO Público), ocultando nomes completos, observações internas de pátio, justificativas de correções e IDs de sistema. Placas sempre mascaradas (`BCX-***4`).
4. **Reutilização da Fonte Canônica (`etapas.config.ts`)**: A página projeta as 6 etapas oficiais do sistema operacional BRS em sentence case, sem duplicação de regras de negócio.
5. **Acessibilidade Estrita (WCAG 2.2 AA)**: Alvos de toque ≥44×44px, contraste de texto ≥4.5:1 sobre tema Dark Premium institucional, suporte a zoom de 400% e reflow em 320px sem rolagem horizontal.

---

## 2. Diagnóstico dos Defeitos Anteriores

- **D1 & D2 (P0)**: Header de marketing flutuante (`SiteLayout`) invadia o topo da página, cobrindo os cartões de cabeçalho e exibindo botões irrelevantes para quem já é cliente.
- **D3 (P0)**: Fase atual ficava abaixo da dobra no mobile; cliente precisava rolar para saber o status.
- **D4 (P1)**: Rótulo "Aguardando" repetido 4 vezes gerava ambiguidade; etapa de aprovação de orçamento não oferecia call-to-action direto para o cliente.
- **D5 (P1)**: Tipografia reduzida (<12px) e contrastes baixos nos metadados.
- **D6 & D7 (P1)**: Jargões técnicos ("Ciclo técnico BRS"), títulos em caixa alta e ausência de indicador de última sincronização ou status offline.
- **D8 & D9 (P2)**: Marcadores circulares desalinhados verticalmente do título e ausência de contato rápido no mobile.
- **D10 (P2)**: Exposição de dados internos e ausência de cabeçalhos estritos de privacidade (`noindex`, `no-referrer`, `no-store`).

---

## 3. Arquitetura de Correções (F1 a F10)

### F1: Layout Próprio da Rota

- Isola `/acompanhar` em `src/components/brs/site-layout.tsx`.
- Header enxuto: altura 56px no mobile e 64px no desktop (`--header-h`), `position: sticky; top: 0`, fundo sólido `#0b0d10`, borda inferior 1px `#262626`.
- Header contém Logo BRS (link para home), chip de protocolo e CTA "Falar com a oficina" (desktop).
- Container do header alinhado milimetricamente ao container do conteúdo (`max-w-[1120px]`).

### F2: Hero de Status Acima da Dobra

- Visível sem rolagem em 360×640 px:
  - H1 único semântico: "Acompanhamento do reparo".
  - Eyebrow mono com protocolo e botão de cópia de 1 clique (alvo ≥44px com feedback acessível).
  - H2 com fase atual em linguagem clara (ex.: "Veículo recebido na oficina") e próxima etapa.
  - Segmento de progresso de 6 barras acessível (`role="progressbar"`).
  - Indicador de sincronização ("Atualizado agora" / "Atualizado há X min").
  - Botão de âncora suave "Ver etapa atual".
  - Variante de Aprovação de Orçamento: destaque visual quando na etapa 4 com CTA prioritário para o cliente.

### F3: Veículo e Protocolo Compacto

- Grid responsivo de pares rótulo/valor com tipografia equilibrada (rótulos 12px, valores 15–16px).
- Placa mascarada (`BCX-***4`) e técnico responsável apenas com primeiro nome se disponível.

### F4: Linha do Tempo Responsiva

- `<ol aria-label="Etapas do reparo">` com `aria-current="step"` na fase ativa.
- Marcadores de 24px perfeitamente alinhados à primeira linha do título (topo 0, line-height 24px).
- Conectores de 2px coloridos de acordo com o status (verde para trechos concluídos, slate-700 para pendentes).
- Etapas futuras sem selo repetido "Aguardando"; apenas marcador ordinal discreto.
- Mobile (<640px): cards recolhíveis para etapas concluídas; atual sempre expandida.
- Desktop (≥1024px): layout em duas colunas (`grid-cols-[360px_minmax(0,1fr)]`) com painel esquerdo sticky.

### F5: Contraste & Tema Dark Premium

- `color-scheme: dark`. Fundo `#0b0d10`, cartões `#13161b` e `#191d24`.
- Textos com contrastes auditados: principal ≥12:1, secundário ≥8:1, metadados ≥5:1, todos acima de 4.5:1.
- Foco visível com anel dourado de 2px e offset 2px.

### F6: Contato Rápido

- Integração telefônica (`tel:4520359440`) e WhatsApp institucional com mensagem pré-formatada.
- Barra inferior fixa no mobile (<768px) com padding de segurança no `main` (`pb-20`). Desativada em modo paisagem celular.

### F7: Copy em Sentence Case & Estado ao Vivo

- Textos empáticos orientados ao cliente para todas as 6 etapas.
- Alerta visual e funcional quando sem conexão com botão "Tentar novamente".
- Anúncio de transições de etapa em `aria-live="polite"`.

### F8: Estados da Interface

- Skeleton sem salto de layout (CLS = 0).
- Estado para link inválido ou expirado (mensagem genérica sem expor existência).
- Estado de erro de rede e serviço concluído/cancelado.

### F9: Privacidade e DTO Público

- Projeção de dados segura via função pura `toPublicCustomerTrackingDto`.
- Metadados de segurança: `noindex, nofollow`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`.

### F10: Acessibilidade & Responsividade

- Reflow perfeito de 320px a 2560px sem scroll horizontal.
- Suporte total a zoom de 200% e 400%.
- Respeito a `prefers-reduced-motion`.

---

## 4. Quality Gates

- `bun run test`: 100% dos testes passando.
- `bun run lint`: 0 erros.
- `bun run build`: compilação limpa do Vite + Nitro SSR.
- Rastreabilidade SDD sincronizada.
