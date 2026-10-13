# REVIEW-024: Correção do Menu Hamburguer no Desktop, Remoção do Ícone Flutuante e Botão Voltar ao Topo

## Metadados

| Campo   | Valor                                                 |
| ------- | ----------------------------------------------------- |
| ID      | REVIEW-024                                            |
| SPEC    | SPEC-024                                              |
| TASK    | TASK-024-01                                           |
| Status  | Aprovado                                              |
| Data    | 2026-10-12                                            |
| Revisor | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH) |

---

## 1. Resumo da Entrega

A **SPEC-024 / TASK-024-01** solucionou em definitivo a anomalia visual de exibição do menu hamburguer em telas desktop ($\ge 1024\text{px}$), eliminou o botão flutuante de telefone/whatsapp no canto inferior direito e implementou um componente acessível e refinado de **Voltar ao Topo** (`BackToTop`), integrado globalmente em todas as rotas do projeto BRS Reparações Automotivas.

---

## 2. Escopo Implementado e Mudanças Arquiteturais

### 2.1 Resolução da Causa Raiz do Menu Hamburguer no Desktop

- **Causa Raiz Identificada**: O botão do menu hamburguer em `src/components/brs/header.tsx` utilizava o componente `<Button>` que injeta a classe canônica `.btn`. Em `src/styles.css`, `.btn` foi definido fora de qualquer `@layer` com `display: inline-flex`. Na especificação de cascata CSS, regras não-camadas (`unlayered`) possuem precedência absoluta sobre regras declaradas dentro de `@layer` do Tailwind CSS v4 (como `@media (width >= 64rem) { .lg\:hidden { display: none; } }`). Portanto, `display: inline-flex` sobrepujava `display: none` em viewports desktop.
- **Correção Aplicada**:
  1. O toggle do menu em `src/components/brs/header.tsx` foi convertido para um `<button type="button">` sem a classe `.btn`, eliminando a imposição do estilo não-camada e permitindo que o utilitário `lg:hidden` opere com total fidelidade.
  2. Em `src/styles.css`, foram adicionadas regras explícitas de proteção para que modificadores de ocultação responsiva (`.btn.hidden`, `.btn.md\:hidden`, `.btn.lg\:hidden`) apliquem `display: none` sem risco de sobreposição por estilos de botão.

### 2.2 Remoção do Botão Flutuante de Telefone

- O botão fixo `<Button variant="automotive" size="icon" className="fixed bottom-5 right-5 z-20 size-12 rounded-sm shadow-xl md:hidden">` foi integralmente removido de `src/components/brs/site-layout.tsx`.
- Eliminação da poluição visual no rodapé móvel e prevenção de confusão comercial com canais não confirmados.

### 2.3 Botão Premium "Voltar ao Topo" (`BackToTop`)

- Criação de `src/components/ui/back-to-top.tsx`:
  - **Detecção de Scroll**: Permanece oculto (`opacity-0 translate-y-3 pointer-events-none invisible`, `tabIndex = -1`) enquanto o usuário estiver no topo ($\text{scrollY} \le 400\text{px}$).
  - **Transição Suave**: Ao rolar além de $400\text{px}$, transiciona suavemente para visível e interativo (`opacity-100 translate-y-0 pointer-events-auto visible`, `tabIndex = 0`).
  - **Acionamento**: Ao clicar ou acionar via teclado, executa rolagem suave ao topo (`window.scrollTo({ top: 0, behavior: 'smooth' })`), com degradação graciosa para scroll instantâneo caso `prefers-reduced-motion` esteja ativado.
  - **Design Tokens & Estética Automotiva**: Dimensões acessíveis de $44 \times 44\text{px}$ (`size-11`), raio normativo de $4\text{px}$ (`var(--radius-sm)`), fundo dark glassmorphism (`bg-neutral-900/85 backdrop-blur-md`), borda sutil com acento dourado champanhe no hover (`border border-white/10 hover:border-primary/50`), ícone `ArrowUp` (18px) e anel de foco de alto contraste.
  - **Integração Global**: Renderizado diretamente em `src/components/brs/site-layout.tsx`, cobrindo todas as páginas e rotas do portal.

---

## 3. Evidências de Validação e Quality Gates

| Validação                          | Comando / Ferramenta               | Resultado                                                               | Status          |
| :--------------------------------- | :--------------------------------- | :---------------------------------------------------------------------- | :-------------- |
| **Testes Unitários & Integração**  | `bun run test` (Vitest)            | **20 arquivos de teste, 135 testes passando**                           | Aprovado (100%) |
| **Testes End-to-End (E2E)**        | `bunx playwright test`             | **Nova suíte `header-nav-and-back-to-top.spec.ts` + suítes existentes** | Aprovado (100%) |
| **Análise Estática & Linter**      | `bun run lint` (ESLint + Prettier) | **0 erros**                                                             | Aprovado        |
| **Compilação & Build de Produção** | `bun run build` (Vite + Nitro SSR) | **Build SSR gerado sem advertências**                                   | Aprovado        |

---

## 4. Conclusão

Todos os critérios de aceitação (AC-024-01, AC-024-02 e AC-024-03) foram rigorosamente atendidos dentro dos padrões de engenharia e governança Universal SDD.
