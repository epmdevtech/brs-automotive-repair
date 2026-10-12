# TASK: Sistema Unificado de Motion Design e Scroll Reveal Premium

## Metadados

| Campo        | Valor                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| ID           | TASK-015-01                                                                                                  |
| Status       | Done                                                                                                         |
| Responsável  | Engenharia Frontend EPMDEVTECH                                                                               |
| SPEC         | SPEC-015                                                                                                     |
| Critérios    | AC-015-01, AC-015-02, AC-015-03, AC-015-04, AC-015-05, AC-015-06, AC-015-07, AC-015-08, AC-015-09, AC-015-10 |
| Dependências | SPEC-015                                                                                                     |

---

## Objetivo

Implementar o sistema de movimento e scroll reveal premium unificado para o site da BRS Reparações Automotivas, centralizando tokens em `src/lib/motion-system.ts`, criando os componentes primitivos `<Reveal>` e `<ImageReveal>`, integrando as microinterações e orquestrações seção a seção (Hero, Header, Especialidades, Padrão de Execução, Galeria com convite de interação de 10%, Linha de Progresso com scroll das Etapas, Parallax desktop em Corretores, etc.), assegurando total acessibilidade com `prefers-reduced-motion` e validando tudo via testes automatizados.

---

## Escopo

### Incluído

1. **Tokens Centrais (`src/lib/motion-system.ts`)**:
   - Duração (600-800ms, mask reveal até 1000ms).
   - Easing `[0.22, 1, 0.36, 1]`.
   - Deslocamento vertical (16-24px desktop, 12px mobile).
   - Stagger (80-120ms).
   - Viewport (`once: true`, `margin: "-80px"`).
2. **Primitivos de Animação**:
   - `<Reveal>` em `src/components/brs/reveal.tsx`.
   - `<ImageReveal>` em `src/components/brs/image-reveal.tsx`.
3. **Orquestração por Seção**:
   - Hero com zoom-out (1.05 → 1.00) no background e revelação escalonada no load em `src/components/brs/animated-hero.tsx`.
   - Header com compressão e blur ao rolar em `src/components/brs/header.tsx`.
   - Especialidades com stagger, `<ImageReveal>` e numeração antecipada em `src/components/brs/services.tsx`.
   - Padrão de Execução com stagger e números destacados em `src/components/brs/philosophy.tsx`.
   - Galeria Antes/Depois com convite interativo de 10% cancelável e `touch-pan-y` em `src/components/brs/before-after-slider.tsx`.
   - Etapas do atendimento com linha de progresso vertical vinculada ao scroll via `transform: scaleY` em `src/components/brs/process-timeline.tsx`.
   - Corretores com parallax sutil exclusivo para desktop em `src/components/brs/partner-section.tsx`.
   - Leva e Traz, Sobre a BRS e CTA Final com `<Reveal>` suave.
   - Formulário sem animação de scroll.
4. **Testes Unitários & Validação**:
   - Suíte de testes `src/test/motion-system.test.tsx`.
   - Execução de `bun run test`, `bun run lint` e `bun run build`.

---

## Critérios de Aceitação

- [x] AC-015-01: Tokens normativos centralizados em `src/lib/motion-system.ts`.
- [x] AC-015-02: Propriedades limitadas a `opacity`, `transform` e `clip-path`.
- [x] AC-015-03: Hero anima no load inicial sem depender de scroll.
- [x] AC-015-04: Animações disparam uma única vez (`once: true`).
- [x] AC-015-05: Suporte a `prefers-reduced-motion` com desativação de parallax e preenchimento integral da timeline.
- [x] AC-015-06: Slider Antes/Depois com convite de 10%, touch vertical não bloqueado (`touch-pan-y`) e ARIA completo.
- [x] AC-015-07: Linha vertical de progresso nas etapas usando `transform: scaleY`.
- [x] AC-015-08: Parallax sutil na imagem de corretores apenas em desktop.
- [x] AC-015-09: Nenhum texto, cor, link ou regra de negócio alterada.
- [x] AC-015-10: 100% dos testes, lint e build passando.
