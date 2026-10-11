# SPEC: Galeria Interativa Antes/Depois com Lightbox e Serviços com CardSpotlight

## Metadados

| Campo                               | Valor                                                          |
| ----------------------------------- | -------------------------------------------------------------- |
| ID                                  | SPEC-007                                                       |
| Status                              | Implemented                                                    |
| Responsável                         | Engenharia Front-end EPMDEVTECH                                |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH                  |
| Criado                              | 2026-10-11                                                     |
| Atualizado                          | 2026-10-11                                                     |
| Lançamento alvo                     | `0.1.0`                                                        |
| Briefing de UX relacionado          | Galeria Antes/Depois + Lightbox & CardSpotlight Aceternity/21st |
| Especificação de design relacionada | Dark Automotive Premium Design System                          |
| ADRs relacionadas                   | N/A                                                            |

---

## Problema e resultado

A apresentação da excelência técnica da BRS Reparações Automotivas (Toledo/PR) exige demonstração tangível de recuperação de veículos:
1. **Galeria de Projetos**: Os proprietários de veículos e corretores de seguros precisam avaliar a precisão da funilaria, da pintura em estufa e do martelinho de ouro. Um slider interativo de Antes e Depois com suporte a ampliação em Lightbox permite inspecionar cada detalhe em alta definição.
2. **Seção de Serviços**: O catálogo de especialidades deve transmitir precisão e tecnologia avançada através de microinterações discretas e o efeito de iluminação dinâmica focal (`CardSpotlight`), onde o cursor do usuário ilumina sutilmente a chapa grafite dos cards.

### Resultado Desejado

1. Criação do componente `BeforeAfterSlider` com interação de arrasto por mouse, touch swipe, controle via teclado (acessibilidade), handle vertical centralizado com ícones indicadores, badges sutis "Antes" e "Depois" e mascaramento CSS fluido a 60fps.
2. Implementação de modal Lightbox no `ProjectGallery` utilizando `@radix-ui/react-dialog` e `framer-motion` (`AnimatePresence`) para permitir inspeção do slider em alta definição e navegação contínua entre os casos.
3. Criação do componente `CardSpotlight` baseado em `framer-motion` (`useMotionValue`, `useMotionTemplate`) com gradiente radial que segue o cursor, padrão de matriz gráfica sutil, e garantia de compatibilidade com SSR e React 19.
4. Refinamento das microinterações da seção `Services` (transições de bordas com tom âmbar, elevação de ícones e clique tátil `active:scale-[0.98]`).
5. Suporte obrigatório a `prefers-reduced-motion` e preservação dos quality gates com zero dependências externas adicionais.

---

## Escopo

### No escopo (In scope)

- Criação de `src/components/brs/before-after-slider.tsx`.
- Criação de `src/components/brs/card-spotlight.tsx`.
- Atualização de `src/components/brs/project-gallery.tsx` com slider interativo e Lightbox modal ampliado.
- Atualização de `src/components/brs/services.tsx` com `CardSpotlight` e microinterações de hover/focus/active.
- Criação de testes unitários automatizados em `src/test/` para `BeforeAfterSlider` e `CardSpotlight`.
- Garantia de conformidade com os dados reais da BRS e notas de mídia ilustrativa.

### Fora do escopo (Out of scope)

- Instalação de novos pacotes NPM (utilizar exclusivamente as dependências existentes no `package.json`).
- Modificação de rotas do TanStack Router ou dados comerciais em `src/lib/brs.ts`.

---

## Critérios de Aceitação

- [AC-007-01] O componente `BeforeAfterSlider` deve permitir arrasto por ponteiro (mouse/touch), ajuste via teclado e renderizar divisor vertical com ícones `ChevronsLeftRight` e badges com fade suave.
- [AC-007-02] O Lightbox no `ProjectGallery` deve abrir em diálogo Radix UI com animação suave via `framer-motion`, permitindo navegar entre itens e interagir com o slider ampliado.
- [AC-007-03] O componente `CardSpotlight` deve guiar um foco de luz radial com `framer-motion` sem repaints custosos nem erros de hidratação SSR.
- [AC-007-04] Os cards de serviço devem apresentar microinterações refinadas nos ícones, bordas e botões de chamada com clique tátil.
- [AC-007-05] `make check` deve aprovar 100% dos testes Vitest, ESLint, compilação Nitro SSR e matriz de rastreabilidade.
