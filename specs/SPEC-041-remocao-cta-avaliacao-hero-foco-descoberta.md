# SPEC-041 — Remoção do CTA de Avaliação da Hero Section e Foco na Descoberta de Serviços

## Metadados

| Campo        | Valor                                                                               |
| ------------ | ----------------------------------------------------------------------------------- |
| ID           | `SPEC-041`                                                                          |
| Título       | Remoção do CTA de Avaliação da Hero Section e Foco na Descoberta de Serviços        |
| Data Criação | 2026-10-14                                                                          |
| Status       | Approved (Aprovada)                                                                 |
| Autor        | Engenheiro Frontend Sênior & Especialista em UI/UX Design EPM DevTech               |
| Prioridade   | Alta (P0)                                                                           |
| Impacto      | `src/components/brs/hero.tsx`, `src/components/brs/animated-hero.tsx`, `src/test/*` |

---

## 1. Contexto e Motivação

Atualmente na Hero Section da Home, há dois botões lado a lado: "Solicitar avaliação" (preenchido com link para `/contato`) e "Ver especialidades" (outline com destino `#especialidades`).

Como o botão de conversão "Avaliação" já está destacado e visível de forma fixa e flutuante na barra de navegação superior (`Header`), a presença de outro botão idêntico na Hero gera:

1. **Duplicidade desnecessária de CTA**: Dois botões para `/contato` competem na mesma primeira dobra de tela (Header + Hero).
2. **Dispersão do foco do visitante**: O primeiro objetivo cognitivo ao entrar na Home de uma oficina de precisão é compreender o catálogo técnico e a qualidade dos serviços prestados.
3. **Sobrecarga visual no mobile**: Dois botões empilhados ou lado a lado ocupam área vertical valiosa em telas móveis.

A remoção do CTA "Solicitar avaliação" da Hero Section elimina a redundância e direciona todo o foco para a descoberta das especialidades técnicas da oficina ("Ver especialidades"), mantendo a conversão direta sempre acessível no Header e nas seções finais.

---

## 2. Requisitos e Critérios de Aceite

### AC-041-01 — Remoção do Botão "Solicitar Avaliação" na Hero Section

- Remover a propriedade `ctaButton` de `src/components/brs/hero.tsx`.
- Eliminar manipuladores de eventos e elementos exclusivos da ação de avaliação dentro da Hero.
- O Header permanece como ponto único e exclusivo de conversão primária de avaliação na primeira dobra.

### AC-041-02 — Ajuste e Destaque do Botão "Ver Especialidades"

- Manter o botão "Ver especialidades" como CTA focal único da Hero Section.
- Ajustar o container de ações (`hero-cta-group`) para exibição limpa sem `gap` residual ou espaçamento órfão.
- Preservar a variante estilística elegante `.btn--secondary` (outline sutil com iluminação dourada no hover).
- Adicionar ícone de indicação de rolagem/descida (`ArrowDown` ou `ChevronDown`) com microinteração de descida no hover.
- Garantir destino âncora `#especialidades` com rolagem suave inercial (`useSmoothScroll`).

### AC-041-03 — Responsividade e Acessibilidade (Tap Target ≥ 44px)

- Garantir altura mínima de toque de 44px (`min-h-[44px]`) e alinhamento visual harmônico à esquerda no desktop e mobile.
- Preservar acessibilidade total por teclado, foco visível e compatibilidade com `prefers-reduced-motion`.

### AC-041-04 — Quality Gates e Proteção Automatizada

- Criar a suíte `src/test/hero-single-cta-discovery.test.tsx` validando que:
  - O botão "Solicitar avaliação" NÃO existe dentro da Hero Section.
  - O botão "Ver especialidades" é o CTA único da Hero Section, apontando para `#especialidades`.
  - O Header mantém seu CTA de avaliação íntegro.
- Atualizar asserções de testes legados que esperavam o botão na Hero.
- Garantir 100% de sucesso nos testes (`bun run test`), zero erros no linter (`bun run lint`) e build aprovado (`bun run build`).
