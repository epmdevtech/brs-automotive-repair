# SPEC-062: Refinamento UX/UI Responsivo do CTA do Header e Menu Móvel BRS

## Metadados

| Campo       | Valor                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| Spec ID     | SPEC-062                                                                       |
| Título      | Ocultação do CTA do Header no Mobile e Padronização do Rótulo no Menu Hambúrguer |
| Status      | Aprovado                                                                       |
| Data        | 2026-10-15                                                                     |
| Autor       | Staff UX/UI Designer & Frontend Engineer                                       |
| Módulo      | `components/brs/header.tsx`                                                    |
| Dependência | SPEC-016, SPEC-021, SPEC-022, SPEC-024, SPEC-060, SPEC-061                     |

---

## 1. Visão Geral e Diagnóstico de UX/UI

Ao inspecionar a interface da BRS em dispositivos móveis (ex.: viewport de 370px conforme captura `/home/elessandro/Imagens/Capturas de tela/Captura de tela de 2026-10-15 20-37-08.png`), foram identificados dois pontos de atrito visual e responsividade:

1. **Superlotação da Cápsula Flutuante no Mobile**:
   Na barra superior (`Header`), o botão CTA ("Avaliação ↗" ou "Solicitar avaliação ↗") era renderizado mesmo em larguras de tela estreitas (`< sm`), ficando espremido entre o logotipo da BRS e o botão do menu hambúrguer. Em telas de 320px a 400px, essa sobrecarga visual compromete a elegância editorial de luxo automotivo e restringe a área de toque.
2. **Prolixidade do Botão de Conversão no Menu Hambúrguer**:
   Dentro do painel aberto pelo botão hambúrguer (`#mobile-nav`), o botão exibia o texto "SOLICITAR AVALIAÇÃO ↗". O usuário solicitou que, dentro do menu móvel, o botão contenha apenas a mensagem direta "Avaliação" ("AVALIAÇÃO ↗"), tornando o elemento mais limpo, direto e perfeitamente equilibrado na grade móvel.

---

## 2. Princípios de Engenharia e Design Especialista (UX/UI)

1. **Clareza e Respiração no Navbar Móvel**:
   - Em viewports mobile (`< sm`), o navbar flutuante deve exibir exclusivamente a identidade da marca (`Brand`) à esquerda e o alternador do menu (`button[aria-label="Abrir menu de navegação"]`) à direita.
   - O botão CTA da barra superior recebe a classe utilitária responsiva `hidden sm:inline-flex`, reaparecendo suavemente em tablets e desktops (`>= 640px`) onde o espaço horizontal é abundante.
2. **CTA Conciso e Focado no Menu Hambúrguer**:
   - No menu gaveta móvel (`#mobile-nav`), o botão de ação principal direcionando para `/contato` adota o rótulo conciso "Avaliação" (ou "AVALIAÇÃO ↗"), evitando quebras de linha em dispositivos ultra-compactos e mantendo hierarquia limpa.
3. **Preservação de Acessibilidade (WCAG 2.2 AA)**:
   - Mantido tap target mínimo de 44px (`h-11`).
   - Mantido contraste cromático ouro/dourado de alto impacto com tipografia nítida e ícone vetorial direcional `ArrowUpRight`.
   - Navegação por teclado e leitores de tela permanecem 100% suportados.

---

## 3. Requisitos Funcionais e Critérios de Aceite

- [x] **AC-062-01**: Ocultar o botão CTA da cápsula do Header em viewports mobile (`< sm`) através de `hidden sm:inline-flex`.
- [x] **AC-062-02**: No menu móvel (`#mobile-nav`), alterar o rótulo do botão CTA para "Avaliação" acompanhado do ícone direcional `ArrowUpRight`.
- [x] **AC-062-03**: Em viewports desktop/tablet (`>= sm`), preservar o botão CTA com acesso direto a `/contato`.
- [x] **AC-062-04**: 100% dos testes do Vitest aprovados (`bun run test`).
- [x] **AC-062-05**: Linter e compilação sem falhas (`bun run lint`, `bun run build`).
- [x] **AC-062-06**: Matriz de rastreabilidade Universal SDD atualizada.
