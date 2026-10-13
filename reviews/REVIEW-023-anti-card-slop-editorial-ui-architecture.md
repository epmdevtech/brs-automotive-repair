# REVIEW-023: Anti-Card Slop, Editorial UI Architecture & Premium Automotive Design

## Metadados

| Campo   | Valor                                                   |
| ------- | ------------------------------------------------------- |
| ID      | REVIEW-023                                              |
| SPEC    | SPEC-023                                                |
| TASK    | TASK-023-01                                             |
| Status  | Aprovado                                                |
| Data    | 2026-10-12                                              |
| Revisor | Staff Design Engineer & Frontend Architect (EPMDEVTECH) |

---

## 1. Resumo da Entrega

A **SPEC-023 / TASK-023-01** eliminou com sucesso os padrões genéricos de "card slop" (grades monótonas de 3 a 4 caixas com sombras pesadas, ícones encapsulados em quadradinhos decorativos e badges flutuantes sobre imagens) em todo o ecossistema digital da BRS Reparações Automotivas.

A interface foi refatorada sob uma **arquitetura editorial de UI**, priorizando tipografia marcante, matrizes contínuas com divisores estruturais discretos (`hairlines` em `border-y`, `divide-x`, `divide-y`), linhas expansivas de 12 colunas para serviços com fotografias integradas e hierarquia visual rigorosa, mantendo a sobriedade e sofisticação automotiva (fundo escuro, detalhes em ouro champanhe `#C8A96A`).

---

## 2. Escopo Implementado e Mudanças Arquiteturais

### 2.1 Eliminação do Card Slop

- **Hero & Para Corretores**: Remoção de badges decorativos flutuantes sobre fotografias (eliminando sobreposições desnecessárias sobre as fotos reais/ilustrativas de veículos).
- **Serviços na Homepage (`src/components/brs/services.tsx`)**: Extinção dos 3 cards fechados com sombras flutuantes. Substituição por uma matriz editorial aberta com bordas compartilhadas (`border-y border-white/10` e `divide-y md:divide-y-0 md:divide-x divide-white/10`), zoom fotográfico sutil no hover (`group-hover:scale-105 transition-transform duration-500`) e links de contextualização técnica.
- **Pillares Estratégicos (`src/components/brs/home-pathways.tsx`)**: Remoção de cards encapsulados. Introdução de uma matriz contínua com divisores estruturais discretos, tipografia editorial e numeração limpa (`01`, `02`, `03`), preservando os atributos `data-reveal` e `--i` para continuidade das animações de scroll.
- **Galeria de Projetos (`src/components/brs/project-gallery.tsx`)**: Substituição da grade de cards flutuantes por uma matriz editorial contínua com hairlines compartilhadas, integrando controles de comparação Antes/Depois, visualização em Lightbox acessível e metadados contextuais.
- **Visão Geral de Serviços (`src/routes/servicos/index.tsx`)**:
  - Os 3 serviços principais foram convertidos para linhas horizontais expansivas de 12 colunas, com grande destaque visual para as fotografias, descrição cirúrgica, lista editorial de indicações técnicas e link de transição fluida.
  - O "Guia de Triagem Técnica" e a faixa "Serviço Leva e Traz" foram convertidos para blocos editoriais integrados com divisores finos.
- **Template Comum de Serviços (`src/components/brs/service-page-layout.tsx`)**:
  - As seções de "Quando é indicado" e "Limitações técnicas" foram reestruturadas como duas colunas editoriais abertas separadas por divisor vertical (`border-l border-white/10`).
  - As 4 etapas do processo operacional deixaram de ser cards fechados e tornaram-se uma matriz de 4 colunas com divisores estruturais e numeração editorial (`01`, `02`, `03`, `04`).
  - A navegação "Outros Serviços Especializados" foi convertida para um ledger editorial limpo.
- **Páginas Institucionais (`/para-corretores.tsx` e `/sobre.tsx`)**:
  - Remoção de containers isolados e caixas com sombras pesadas.
  - Implementação de matrizes contínuas com bordas compartilhadas para os pilares e diferenciais, com tipografia hierárquica e numeração suave.
- **Canais de Contato (`src/components/brs/contact.tsx`)**: Remoção de caixas e molduras ao redor dos ícones de telefone e Instagram, mantendo tipografia direta, links funcionais e contraste preciso.

### 2.2 Integridade das Regras de Negócio e Contratos

- Preservação absoluta dos dados da empresa centralizados em `src/lib/brs.ts` (Toledo-PR, telefone `(45) 2035-9440`, Instagram `@brsreparacoes`, zero menção a WhatsApp não confirmado).
- Manutenção dos seletores e classes canônicas de botões (`.btn`, `.btn--primary`, `.btn--secondary`, `.btn--link`), garantindo estabilidade nos fluxos de conversão e acessibilidade.
- Todos os testes de motion design, atributos `data-reveal` e delays escalonados (`--i`) foram preservados e validados.

---

## 3. Evidências de Validação e Quality Gates

| Validação                          | Comando / Ferramenta               | Resultado                                 | Status          |
| :--------------------------------- | :--------------------------------- | :---------------------------------------- | :-------------- |
| **Testes Unitários & Integração**  | `bun run test` (Vitest)            | 19 arquivos de teste, 132 testes passando | Aprovado (100%) |
| **Testes End-to-End (E2E)**        | `bunx playwright test`             | 19 testes ponta a ponta executados        | Aprovado (100%) |
| **Análise Estática & Linter**      | `bun run lint` (ESLint + Prettier) | 0 erros, formatação estrita               | Aprovado        |
| **Compilação & Build de Produção** | `bun run build` (Vite + Nitro SSR) | Build gerado em ~1.1s sem advertências    | Aprovado        |

---

## 4. Conclusão

A refatoração atende integralmente aos requisitos da **SPEC-023**, elevando o patamar estético do portal da BRS Reparações Automotivas para o nível editorial de marcas automotivas e de design de alto padrão, sem abrir mão da fidelidade às regras de negócio e da cobertura completa de testes.
