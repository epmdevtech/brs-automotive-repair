# Módulo de Conhecimento: Arquitetura Frontend BRS

## Metadados
- **Módulo**: `knowledge/modules/brs-frontend-architecture.md`
- **Domínio**: Arquitetura Web & Frontend
- **Responsável**: Engenharia EPMDEVTECH
- **Revisado em**: 2026-10-11
- **Aplicabilidade**: Alterações estruturais, rotas, componentes, estilos e build

---

## 1. Stack e Framework
- **Fullstack Framework**: TanStack Start `1.168+` (Vite 8 + Nitro SSR preset `cloudflare-module`).
- **Linguagem**: TypeScript 5.8+ em modo estrito (`strict: true`).
- **UI & Reatividade**: React 19.2+ com `@tanstack/react-query` e `@tanstack/react-router`.
- **Estilos**: Tailwind CSS v4 (`@tailwindcss/vite`) com variáveis CSS em `src/styles.css`.
- **Primitivas UI**: Radix UI (Accordion, Dialog, Drawer, Dropdown Menu, etc.).
- **Ícones**: Lucide React.
- **Testes**: Vitest 4.1+ com JSDOM e `@testing-library/react`.

---

## 2. Padrões de Roteamento e Estrutura de Página
- A navegação principal é uma landing page de página única ancorada (`src/routes/index.tsx` renderizando `Website` de `src/components/brs/website.tsx`).
- Âncoras suportadas:
  - `#inicio` (Hero)
  - `#servicos` (Catálogo de Funilaria, Pintura, Martelinho)
  - `#trabalho` (Filosofia de precisão, galeria e timeline de processo)
  - `#corretores` (Seção para corretores e seguradoras)
  - `#sobre` (História, princípios e serviço Leva e Traz)
  - `#contato` (FAQ e formulário de solicitação de avaliação)
- O scroll suave é configurado globalmente em `src/styles.css` com `scroll-padding-top: 100px` para compensar o header fixo.

---

## 3. Design Tokens e Cores Automotivas
Configurados em `src/styles.css`:
- `--background`: `oklch(0.14 0.005 260)` (Slate grafite escuro)
- `--card`: `oklch(0.2 0.008 260)`
- `--primary`: `oklch(0.73 0.1 82)` (Âmbar metálico aquecido)
- `--primary-foreground`: `oklch(0.15 0.005 260)`
- Tipografia Display: `Barlow Condensed` (pesos 500, 600, 700, 800) carregada via Google Fonts.
- Tipografia Body: `Manrope` (pesos 400, 500, 600, 700) carregada via Google Fonts.

---

## 4. Portas e Proxy Local
- Porta local do Vite: `5210` configurada estritamente (`server: { port: 5210, strictPort: true }` em `vite.config.ts`).
- Script de inicialização: `"dev": "vite dev --port 5210"`.
- Proxy Caddyfile: `http://brs.localhost` roteado para `localhost:5210`.
