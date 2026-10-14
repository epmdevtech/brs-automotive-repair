# SPEC-039 — Refinamento da Hero Section e Transição Direta para Especialidades

## Metadados

| Campo        | Valor                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-039`                                                                                           |
| Título       | Refinamento da Hero Section e Transição Direta para Especialidades                                   |
| Data Criação | 2026-10-14                                                                                           |
| Status       | Approved (Aprovada)                                                                                  |
| Autor        | Engenheiro Frontend Sênior & Especialista em UX/UI Design EPM DevTech                                |
| Prioridade   | Alta (P0)                                                                                            |
| Impacto      | `src/components/brs/hero.tsx`, `animated-hero.tsx`, `services.tsx`, `philosophy.tsx`, `website.tsx`, `styles.css` |

---

## 1. Contexto e Motivação

Identificou-se ruído visual, redundância de conteúdo e um padrão genérico gerado por IA na Hero Section e na transição para a seção de Especialidades na Home page da BRS Reparações Automotivas:

1. **Faixa Redundante de Micro-Benefícios (`trust-strip`)**:
   - Uma barra com itens de lista solta ("Reparação e pintura técnica de precisão", "Diagnóstico honesto e transparente", "Serviço de leva e traz em Toledo-PR") localizada imediatamente abaixo do Hero.
   - Gera quebra visual artificial, excesso de contêineres e redundância semântica com o restante da página.
2. **Conflito com o Botão Secundário do Hero**:
   - Havia duplicidade entre links no rodapé do Hero e no grupo de botões principais ("Ver especialidades" vs "Conhecer os serviços").
   - O botão secundário do Hero deve atuar com estilo outline/ghost e rolagem suave (smooth scroll) diretamente para `#especialidades`.
3. **Excesso de Tags Soltas sobre Toledo-PR**:
   - Repetição da localização em badges, microdados e rodapé do Hero competindo com o título principal. A localização deve ser sutil e discreta no eyebrow institucional e microcopy editorial.
4. **Espaçamento e Conexão Direta com Especialidades**:
   - Conectar o final da Hero Section diretamente à seção de "Especialidades", garantindo respiro visual adequado (`py-16` a `py-24`).
   - Incorporar organicamente os diferenciais ("Diagnóstico honesto e transparente", "Serviço de leva e traz") na seção de diferenciais/filosofia e nos serviços técnicos, eliminando blocos vazios intermediários.

---

## 2. Requisitos e Critérios de Aceite

### AC-039-01 — Remoção Completa da Faixa Redundante (`trust-strip`)
- Excluir o elemento `<div className="trust-strip">` e seus filhos `<div className="trust-item">` em `src/components/brs/hero.tsx`.
- Limpar as classes CSS correspondentes em `src/styles.css` para evitar classes orfãs.
- Remover imports não utilizados (`Wrench`, `Handshake`, `Truck`, etc.).

### AC-039-02 — Hierarquia do Hero e Botão Secundário com Smooth Scroll
- Garantir que o CTA primário ("Solicitar avaliação" -> `/contato`) seja o ponto focal dominante do Hero.
- Configurar o botão secundário ("Ver especialidades") com peso visual secundário (estilo outline/ghost `.btn--secondary`) e destino `#especialidades`.
- Integrar rolagem suave (smooth scroll) para âncoras locais no Hero através de `useSmoothScroll` com respeito estrito a `prefers-reduced-motion`.
- Limpar tags soltas repetitivas de Toledo-PR no rodapé do Hero, preservando a identificação elegante no eyebrow (`Oficina Técnica Especializada • Toledo, PR`) e nota discreta de fotografia ilustrativa.

### AC-039-03 — Conexão Direta com Especialidades e Incorporação Orgânica de Diferenciais
- Conectar o Hero diretamente à seção de Especialidades na `HomePageContent`, mantendo respiro visual normativo (`py-16` no mobile e `py-24` no desktop).
- Assegurar que a seção de Especialidades responda tanto ao seletor `#servicos` quanto à âncora `#especialidades`.
- Incorporar os 3 diferenciais centrais ("Reparação e pintura técnica de precisão", "Diagnóstico honesto e transparente", "Serviço de leva e traz em Toledo-PR") organicamente nos pilares de `Philosophy`, sem criar blocos intermediários vazios.

### AC-039-04 — Qualidade de Código, Acessibilidade e Quality Gates
- Zero classes CSS ou imports órfãos no projeto.
- Criar a suíte de testes `src/test/hero-especialidades-refinement.test.tsx` validando todos os critérios AC-039-01 a AC-039-03.
- Garantir 100% de sucesso nos testes automatizados (`bun run test`), zero erros no linter (`bun run lint`) e build de produção bem-sucedido (`bun run build`).
