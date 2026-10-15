# TASK-056-01: Refinamento UX/UI, Acessibilidade (WCAG 2.2 AA) e Isolamento de Layout da Rota /login

## Metadados

| Campo       | Valor                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| Task ID     | TASK-056-01                                                                                                   |
| Spec Ref    | SPEC-056                                                                                                      |
| Título      | Refinamento UX/UI, Acessibilidade WCAG 2.2 AA e Isolamento Arquitetural de Layout da Rota /login e Painel BRS |
| Status      | Concluído                                                                                                      |
| Data        | 2026-10-15                                                                                                    |
| Responsável | Staff Product Designer & Engenheiro Front-end Sênior                                                          |
| Módulo      | `features/booking` & `routes/login`                                                                           |

---

## 1. Escopo de Trabalho

1. **P0 — Isolamento de Layout & Modo Demo**:
   - Atualizar `src/components/brs/site-layout.tsx` para isolar rotas `/login` e `/agendamentos`, eliminando `<Header />`, `<Footer />` e `<BackToTop />`.
   - Reposicionar modo demo para baixo do botão principal em `src/features/booking/ui/admin/login-form.tsx` e `src/features/booking/ui/admin/demo-banner.tsx`, com botão outline largura total e popover de credenciais sem texto truncado.

2. **P1 — Composição, Tipografia, Contraste & Campos**:
   - Ajustar grid para `lg:grid-cols-[minmax(440px,42%)_1fr]` e `min-h-dvh` em `src/features/booking/ui/admin/auth-split-layout.tsx`.
   - Elevar contrastes para padrão WCAG 2.2 AA (subtítulos ≥4.5:1, microcopy ≥12px, inputs 16px).
   - Ajustar placeholders (e-mail neutro, senha sem placeholder) e botão mostrar/ocultar senha com 40×40px e `aria-pressed`.
   - Ajustar link "Esqueci minha senha" com alvo ≥24px e diálogo acessível.
   - Atualizar textos para sentence case e linguagem direta de oficina (sem jargões técnicos).

3. **P2 — Acentos Visuais & Pré-visualização**:
   - Padronizar acentos institucionais em dourado (`text-amber-500` / `#D4AF37` / `#B8860B`) e verde exclusivo para estados de sucesso.
   - Incluir mini-card estático de pré-visualização do produto com `ProcessStepper` no painel direito em resoluções ≥1280px (`aria-hidden`).

4. **Validação & Quality Gates**:
   - Rodar testes Vitest (`bun run test`).
   - Rodar linter (`bun run lint`).
   - Rodar build Vite + Nitro SSR (`bun run build`).
   - Sincronizar matriz de rastreabilidade SDD.

---

## 2. Checklists de Validação

- [x] /login e /agendamentos não renderizam header/footer públicos nem elementos fixed/sticky do site.
- [x] Sem rolagem vertical da página em 1366×768, 1440×900, 1920×1080 e 2560×1440; sem rolagem horizontal em nenhuma largura.
- [x] Formulário ≤400px e centralizado; coluna entre 440px e 42%; conteúdo do painel ≤560px e centralizado.
- [x] Nenhum texto truncado com reticências em títulos ou rótulos de ação.
- [x] Contraste ≥4.5:1 (texto normal) e ≥3:1 (texto grande, bordas de input, ícones, foco).
- [x] Nenhum texto <12px; inputs a 16px; alvos ≥44px (botões/inputs) e ≥24px (links).
- [x] Demo desligado: zero credencial, botão ou nota de demo no DOM.
- [x] Senha sem placeholder; e-mail neutro; "Esqueci minha senha" com ação real.
- [x] Um único h1; Tab lógico; foco visível; Escape fecha popovers.
- [x] Estados de erro, loading e demo sem deslocamento de layout.
- [x] Copy sem jargão técnico e em sentence case.
