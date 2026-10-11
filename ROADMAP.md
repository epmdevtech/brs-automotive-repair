# ROADMAP: BRS Reparações Automotivas

Planejamento de evolução da presença digital da BRS Reparações Automotivas sob o framework **Universal SDD**.

---

## Status Atual

- **Versão**: `0.1.0`
- **Fase**: Landing Page Institucional Concluída / Pré-Publicação
- **Framework**: Universal SDD Compliant

---

## Marcos (Milestones)

### Fase 1: Landing Page Institucional & Design System (Concluída ✅)

- [x] Construção da página institucional completa em TanStack Start + Tailwind CSS v4 (`SPEC-001`).
- [x] Implementação de navegação ancorada suave (`#inicio`, `#servicos`, `#trabalho`, `#corretores`, `#sobre`, `#contato`).
- [x] Galeria de serviços, linha do tempo do processo de reparo e seção para corretores de seguros.
- [x] Acordeão de dúvidas frequentes (FAQ) com Radix UI.
- [x] Fluxo honesto de contato preparando mensagem para cópia no canal oficial (Instagram `@brsreparacoes`).
- [x] Testes automatizados das regras comerciais em Vitest (`src/test/brs.test.ts`).
- [x] Configuração da porta local `5210` e proxy `http://brs.localhost` no Caddyfile.
- [x] Infraestrutura containerizada Docker multi-stage e automação via Makefile (`SPEC-002`).
- [x] Auditoria técnica, modularização de componentes e refinamento editorial profissional (`SPEC-003`).
- [x] Esteira de CI/CD automatizada com GitHub Actions para quality gates e validação Docker (`SPEC-004`).

---

### Fase 2: Pré-requisitos para Publicação Definitiva (Em Andamento 🟡)

- [ ] **Identidade Visual e Logo Real**: Substituir o logotipo tipográfico provisório pelo logo original fornecido pelo proprietário da BRS.
- [ ] **Acervo Fotográfico Real**: Substituir as imagens ilustrativas atuais (`brs-hero.jpg`, `funilaria.jpg`, etc.) por fotografias autorizadas das instalações da oficina e equipe em Toledo-PR.
- [ ] **Comparativo Antes/Depois**: Implementar componente visual de slider/comparativo somente quando fotos reais autorizadas de reparos concluídos estiverem disponíveis.
- [ ] **Canal WhatsApp Oficial**: Validar e confirmar número oficial de WhatsApp com o proprietário antes de habilitar integração direta na página.
- [ ] **Aprovação Formal de Conteúdo**: Validação do posicionamento e textos pelo proprietário da oficina.
- [ ] **SEO e Sitemap Final**: Geração de sitemap XML e envio aos motores de busca após deploy em domínio público oficial.

---

### Fase 3: Evolução e Recursos Futuros (Planejado ⚪)

- [ ] Formulário de agendamento online integrado com notificação direta.
- [ ] Área de acompanhamento de status do reparo para clientes e segurados.
- [ ] Integração com avaliações do Google Meu Negócio via API/widget.
