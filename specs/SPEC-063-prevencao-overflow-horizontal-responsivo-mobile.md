# SPEC-063: Prevenção e Blindagem Contra Estouro de Layout e Overflow Horizontal no Modo Mobile

## Metadados

| Campo       | Valor                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| Spec ID     | SPEC-063                                                                       |
| Título      | Blindagem Contra Estouro de Layout (Horizontal Overflow) em Dispositivos Móveis |
| Status      | Aprovado                                                                       |
| Data        | 2026-10-15                                                                     |
| Autor       | Staff UX/UI Designer & Performance Engineer                                    |
| Módulo      | `styles.css`, `routes/__root.tsx`, `components/brs/*`, `components/ui/*`       |
| Dependência | SPEC-016, SPEC-020, SPEC-022, SPEC-035, SPEC-040, SPEC-060, SPEC-061, SPEC-062 |

---

## 1. Visão Geral e Diagnóstico da Falha no Mobile

Conforme registrado na captura de tela do usuário (`/home/elessandro/Imagens/Capturas de tela/Captura de tela de 2026-10-15 20-40-54.png`), em visualização mobile (dispositivos estreitos de 320px a 390px, como 370px):

1. **Estouro do Eixo Horizontal (Horizontal Overflow / Scroll Lateral Indesejado)**:
   A página permitia rolagem horizontal livre. Ao arrastar ou interagir com o dispositivo, o conteúdo era deslocado lateralmente para a esquerda, ocultando partes essenciais como o logo da BRS, o início do título principal H1 ("BRS Reparações Automotivas."), a descrição e o botão de ação "Ver especialidades".
2. **Causas Raiz Identificadas**:
   - **Ausência de contenção estrita no Root e Body**: As regras globais de `html` e `body` em `src/styles.css` não definiam `overflow-x: clip; max-width: 100%; width: 100%`, permitindo que qualquer elemento ou animação com coordenadas periféricas expandisse a largura rolável do documento.
   - **Rigidez do `.eyebrow`**: A classe `.eyebrow` possuía `display: flex;` com `--tracking-eyebrow: 0.2em` sem `flex-wrap: wrap`, fazendo com que frases longas como `"Oficina Técnica Especializada • Toledo, PR"` alcançassem mais de 430px de largura sem quebra de linha em telas de 370px.
   - **Falta de contenção em contêineres principais (`SiteLayout`, `PageTransition`, `AnimatedHero`)**: Os contêineres estruturais não isolavam o eixo X com classes utilitárias modernas (`overflow-x-clip`, `max-w-full`, `w-full`), propagando qualquer estouro pontual para a raiz da viewport móvel.
   - **Dimensionamento tipográfico do `.brand` no mobile**: Em larguras muito reduzidas, a assinatura secundária `"REPARAÇÕES AUTOMOTIVAS"` com espaçamento largo aumentava a pressão sobre o espaço horizontal da cápsula do header.

---

## 2. Princípios de Engenharia e Boas Práticas Especialistas de UX/UI

1. **Contenção Estrita com `overflow-x: clip`**:
   - Adotar `overflow-x: clip; max-width: 100%;` em `html`, `body`, no layout raiz (`SiteLayout`), na transição de páginas (`PageTransition`) e nos contêineres de hero.
   - O uso de `clip` em vez de `hidden` é o padrão moderno do CSS que impede vazamento no eixo X sem criar um novo contexto de rolagem nem quebrar elementos com `position: sticky` ou a rolagem inercial do Lenis.
2. **Flexibilidade e Responsividade no Rótulo `.eyebrow`**:
   - Configurar `.eyebrow` com `flex-wrap: wrap`, `max-width: 100%` e `word-break: break-word`, garantindo que rótulos longos quebrem harmoniosamente em dispositivos móveis sem romper o grid.
3. **Calibragem de Espaçamentos e Padding em Telas Pequenas**:
   - Ajustar `.page-width` em telas `<= 767px` com `calc(100% - 32px)` e `max-width: 100%`.
   - Ajustar paddings horizontais do header e da cápsula para `px-3 sm:px-6` em mobile, garantindo respiração sem risco de colisão.
4. **Preservação de 100% da Acessibilidade e WCAG 2.2 AA**:
   - Textos permanecem legíveis, sem sobreposições e com contraste cromático intacto.
   - Eliminação de rolagem horizontal acidental, melhorando substancialmente a usabilidade em dispositivos táteis.

---

## 3. Requisitos Funcionais e Critérios de Aceite

- [x] **AC-063-01**: Eliminar integralmente o scroll horizontal indesejado no mobile através de `overflow-x: clip; max-width: 100%;` em `html`, `body` e contêineres de layout.
- [x] **AC-063-02**: Permitir quebra de linha responsiva nos rótulos `.eyebrow` com `flex-wrap: wrap; max-width: 100%`.
- [x] **AC-063-03**: Proteger `AnimatedHero`, `SiteLayout` e `PageTransition` com blindagem `overflow-x-clip w-full max-w-full`.
- [x] **AC-063-04**: 100% dos testes do Vitest aprovados (`bun run test`).
- [x] **AC-063-05**: Linter e Build de produção aprovados com 0 erros (`bun run lint`, `bun run build`).
- [x] **AC-063-06**: Matriz de rastreabilidade Universal SDD atualizada.
