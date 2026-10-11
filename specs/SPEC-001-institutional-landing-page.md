# SPEC: Landing Page Institucional BRS & Design System Automotivo

## Metadados

| Campo | Valor |
|---|---|
| ID | SPEC-001 |
| Status | Implemented |
| Responsável | Engenharia EPMDEVTECH |
| Revisores | Produto / Design / Engenharia / QA |
| Criado | 2026-10-11 |
| Atualizado | 2026-10-11 |
| Lançamento alvo | `0.1.0` |
| Briefing de UX relacionado | Conforme diretrizes da marca BRS |
| Especificação de design relacionada | Design System Dark Automotive (Barlow Condensed / Manrope / Amber Accent) |
| ADRs relacionadas | N/A |

---

## Problema e resultado

A **BRS Reparações Automotivas** necessitava de uma presença web moderna, confiável e orientada à conversão para clientes de Toledo-PR e região. A solução requer apresentação dos 3 serviços principais (Funilaria, Pintura e Martelinho de Ouro), suporte a proprietários particulares e corretores de seguros, com honestidade sobre canais de contato e classificação clara de imagens ilustrativas.

---

## Escopo

### No escopo (In scope)
- Landing page institucional de página única ancorada (`#inicio`, `#servicos`, `#trabalho`, `#corretores`, `#sobre`, `#contato`).
- Header fixo com detecção de scroll, navegação responsiva e menu móvel.
- Catálogo dos 3 serviços confirmados com cards e ícones temáticos.
- Seção de filosofia de trabalho, galeria de serviços e linha do tempo de 4 etapas do reparo.
- Seção de parceria comercial dedicada a corretores de seguro.
- Destaque do serviço Leva e Traz na cidade de Toledo-PR.
- Acordeão acessível de dúvidas frequentes (FAQ) via Radix UI.
- Formulário honesto de solicitação de avaliação com gerador de mensagem para o Instagram `@brsreparacoes`.
- Configuração estrita de rede local na porta `5210` e proxy `http://brs.localhost` no Caddyfile.

### Fora do escopo (Out of scope)
- Backend próprio ou persistência de banco de dados no estágio atual.
- Disparo de WhatsApp antes da confirmação formal do número pelo proprietário.
- Uso de fotos ilustrativas como evidência de trabalhos reais ou instalações físicas.

---

## Critérios de Aceitação

- [AC-001-01] O cabeçalho deve fornecer links ancorados suaves para todas as 6 seções principais e botão de ação direta para `#contato`.
- [AC-001-02] As 3 especialidades (Funilaria, Pintura, Martelinho de ouro) devem ser renderizadas a partir da fonte única de verdade `src/lib/brs.ts`.
- [AC-001-03] O formulário de contato deve validar obrigatoriedade de nome, telefone com DDD e descrição do problema.
- [AC-001-04] O formulário deve gerar uma mensagem estruturada pronta para cópia com um clique, sem enviar requisições de rede falsas.
- [AC-001-05] Nenhum link ou menção ativa a WhatsApp deve existir enquanto `whatsappConfirmed` for `false`.
- [AC-001-06] Todos os testes automatizados em `src/test/brs.test.ts` e `src/test/app-routing.test.tsx` devem passar com sucesso.
- [AC-001-07] A aplicação deve rodar estritamente na porta 5210 sem colisão de portas locais.
