# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e este projeto adere ao [Universal SDD](UNIVERSAL_SDD_FRAMEWORK.md).

## [0.1.0] - 2026-10-11

### Adicionado

- Adoção completa do framework **Universal SDD** com governança de agentes, tarefas e especificações.
- Landing page institucional completa da **BRS Reparações Automotivas** (`src/components/brs/website.tsx`).
- Configuração centralizada e fonte única de verdade em `src/lib/brs.ts`.
- Design system automotivo escuro com Tailwind CSS v4, tipografia Barlow Condensed / Manrope e componentes Radix UI acessíveis.
- Seções temáticas: Início (Hero), Serviços (Funilaria, Pintura, Martelinho), Filosofia de trabalho, Galeria de projetos, Linha do tempo do processo, Parcerias com corretores de seguro, Serviço Leva e Traz, Sobre a oficina, FAQ e Formulário de Contato.
- Fluxo honesto de contato preparando mensagem para cópia no canal oficial (Instagram `@brsreparacoes`).
- Suíte de testes automatizados com Vitest (`src/test/brs.test.ts` e `src/test/app-routing.test.tsx`).
- Alocação e configuração estrita da porta local `5210` e proxy `http://brs.localhost` no Caddyfile.
- Especificação formal inicial `SPEC-001`, tarefa `TASK-001-01` e revisão `REVIEW-001`.
- Infraestrutura containerizada com `Dockerfile` multi-stage (`oven/bun:1-slim`) e `docker-compose.yml` na porta estrita `5210` (`SPEC-002`).
- Automação via `Makefile` com comandos de ciclo de vida (`help`, `install`, `dev`, `build`, `test`, `lint`, `format`, `check`, `up`, `down`, `docker-dev`, `docker-build`, `docker-logs`).
- Especificação `SPEC-002`, tarefa `TASK-002-01` e revisão `REVIEW-002`.
- Auditoria técnica profunda e modularização do monólito `website.tsx` em 15 submódulos de apresentação (`SPEC-003`).
- Refatoração do reporte de erros para módulo agnóstico `src/lib/error-reporting.ts` e localização das telas de erro (`src/lib/error-page.ts`, `src/routes/__root.tsx`) com tema automotivo escuro.
- Enriquecimento dos metadados de compartilhamento social com Open Graph `og:image` e Twitter Cards.
- Revisão editorial completa em língua portuguesa brasileira eliminando vícios e travessões longos.
- Especificação `SPEC-003`, tarefa `TASK-003-01` e revisão `REVIEW-003`.
- Esteira de Integração Contínua (CI/CD) com GitHub Actions (`.github/workflows/ci.yml`) validando lint, testes, build, rastreabilidade SDD e build Docker (`SPEC-004`).
- Especificação `SPEC-004`, tarefa `TASK-004-01` e revisão `REVIEW-004`.
- Refinamento avançado de UI e Motion Design sóbrio com tokens CSS reutilizáveis (`SPEC-005`).
- Entrada escalonada cinematográfica do Hero com revelação tipográfica por linha no título e header integrado.
- Transição cinematográfica `MediaExpand` entre Hero e Serviços orientada por rolagem nativa com degradação graciosa.
- Microinteração Spotlight nos cards de serviços para mouse com foco acessível via teclado.
- Revelação única de seções com `IntersectionObserver` e suporte completo a `prefers-reduced-motion`.
- Suíte com 10 testes unitários e de integração de movimento (`src/test/motion.test.tsx`).
- Especificação `SPEC-005`, tarefa `TASK-005-01` e revisão `REVIEW-005`.
- Seção Hero animada com biblioteca `framer-motion` v14 e componentes inspirados em 21st.dev (`SPEC-006`).
- Componente modular `src/components/brs/animated-hero.tsx` com variantes de stagger (`containerVariants`, `itemVariants`), header animado vindo do topo e botões de estilo glass translúcido com `backdrop-blur-md`.
- Suporte a `prefers-reduced-motion` no Hero via hook nativo `useReducedMotion()`.
- Testes unitários dedicados em `src/test/animated-hero.test.tsx` com cobertura de links, botões e ações de clique.
- Especificação `SPEC-006`, tarefa `TASK-006-01` e revisão `REVIEW-006`.
- Galeria interativa Antes/Depois com componente `BeforeAfterSlider` (`src/components/brs/before-after-slider.tsx`) com interação por mouse drag, touch swipe, controle via teclado (slider ARIA), handle com `ChevronsLeftRight` e mascaramento performático com `clip-path` CSS (`SPEC-007`).
- Modal Lightbox em alta definição integrado com `@radix-ui/react-dialog` em `src/components/brs/project-gallery.tsx` com navegação entre casos e detalhes técnicos.
- Efeito `CardSpotlight` dinâmico (`src/components/brs/card-spotlight.tsx`) com gradiente radial e máscara de matriz de micro-pontos metálicos guiados pelo cursor via `framer-motion`.
- Microinterações refinadas nos cards de serviços: elevação de ícones, iluminação de bordas e feedback tátil em botões (`active:scale-[0.98]`).
- 3 novas suítes de testes unitários (`src/test/before-after-slider.test.tsx`, `src/test/card-spotlight.test.tsx`, `src/test/project-gallery.test.tsx`).
- Especificação `SPEC-007`, tarefa `TASK-007-01` e revisão `REVIEW-007`.
- Expurgo total de resíduos e dependências da plataforma Lovable (`@lovable.dev/vite-tanstack-config`, `bunfig.toml`, `error-reporting.ts`, `AGENTS.md`) (`SPEC-008`).
- Migração para configuração limpa e nativa em `vite.config.ts` com plugins oficiais do TanStack Start e Nitro.
- Unificação do Header: eliminação da duplicidade de navbars, centralização de um único container fixed z-50 com backdrop blur e menu mobile responsivo.
- Redesign premium da seção Hero: badge âmbar elegante com pulso suave, tipografia H1 em alto contraste, gradientes eficientes WCAG AA+ e rodapé sutil da viewport.
- Nova suíte de testes unitários [`src/test/header.test.tsx`](src/test/header.test.tsx) validando a existência de exatamente um banner/header na página.
- Especificação `SPEC-008`, tarefa `TASK-008-01` e revisão `REVIEW-008`.
- Refinamento do sistema tipográfico da landing page com as famílias **Sora** e **Manrope** (`SPEC-009`).
- Otimização do Google Fonts em `src/routes/__root.tsx` carregando exclusivamente Sora (pesos 500, 600, 700) e Manrope (pesos 400, 500, 600) com `display=swap` e `preconnect`.
- Centralização de tokens tipográficos fluidos com `clamp()`, unitless line-heights, pesos canônicos e normalização com `font-size-adjust: from-font`, `text-wrap: balance` e `text-wrap: pretty` em `src/styles.css`.
- Refinamento visual de títulos, cartões de serviços, galeria, navegação e botões, eliminando estilos em caixa alta artificial agressiva e negrito 800 em favor de uma estética de engenharia automotiva técnica e precisa.
- Nova suíte de testes unitários [`src/test/typography.test.tsx`](src/test/typography.test.tsx) validando 6 requisitos do sistema tipográfico.
- Especificação `SPEC-009`, tarefa `TASK-009-01` e revisão `REVIEW-009`.
- Auditoria e implementação de Scroll Reveal Premium com tokens calibrados em `src/styles.css` (`--distance: 16px`, `--dur-reveal: 520ms`, `--stagger: 80ms`, `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`) (`SPEC-010`).
- Calibração do hook `useScrollReveal` com disparo aos 12% da viewport (`threshold: 0.12`, `rootMargin: "0px 0px -10% 0px"`) e execução estritamente única via `observer.unobserve()`.
- Integração de scroll reveal ordenado nas seções `Philosophy`, `Pickup`, `FAQAccordion` e `Contact`, mantendo Hero isolado sob Framer Motion sem duplicidades.
- Suporte a `prefers-reduced-motion: reduce` e fallback com conteúdo 100% visível no DOM caso JavaScript ou IntersectionObserver não estejam disponíveis.
- Nova suíte de testes unitários [`src/test/scroll-reveal.test.tsx`](src/test/scroll-reveal.test.tsx) com 11 testes cobrindo critérios de aceitação, unobserve e tokens de CSS.
- Especificação `SPEC-010`, tarefa `TASK-010-01` e revisão `REVIEW-010`.
- Expurgo definitivo do favicon residual da Lovable e implementação do pacote oficial de favicons e ícones da BRS Reparações Automotivas (`public/favicon.svg`, `public/favicon.ico`, `public/apple-touch-icon.png`, `public/favicon-96x96.png`, `public/web-app-manifest-192x192.png`, `public/web-app-manifest-512x512.png` e `public/site.webmanifest`) (`SPEC-011`).
- Atualização das tags de cabeçalho no RootRoute (`src/routes/__root.tsx`) com links canônicos de favicons e meta tag `theme-color`.
- Nova suíte de testes unitários [`src/test/favicon.test.tsx`](src/test/favicon.test.tsx) validando integridade de assets e metadados.
- Especificação `SPEC-011`, tarefa `TASK-011-01` e revisão `REVIEW-011`.
- Padronização cromática rigorosa da seção Hero: destaque do H1 (`text-primary`), badge overline (`border-primary/20 bg-primary/10 text-primary`), descrição (`text-neutral-400`), botão primário (`bg-primary text-primary-foreground hover:bg-primary/90`) sincronizado com a Navbar, e botão secundário com estética dark refinada (`SPEC-012`).
- Nova suíte de testes unitários [`src/test/hero-colors.test.tsx`](src/test/hero-colors.test.tsx) validando as 5 frentes cromáticas da Hero.
- Especificação `SPEC-012`, tarefa `TASK-012-01` e revisão `REVIEW-012`.
- Implementação do rodapé definitivo `MinimalFooter` (`src/components/ui/minimal-footer.tsx`) inspirado no 21st.dev e adaptado à identidade BRS, com layout responsivo de 4 colunas em desktop e empilhado no mobile (`SPEC-013`).
- Refatoração de `src/components/brs/footer.tsx` assegurando unicidade arquitetural de exatamente um elemento `footer` no DOM.
- Validação e restrição a canais de contato reais (Instagram oficial `@brsreparacoes` e telefone fixo `(45) 2035-9440`), âncoras válidas existentes, ano de copyright dinâmico e aviso de conformidade de imagem ilustrativa.
- Nova suíte de testes unitários [`src/test/minimal-footer.test.tsx`](src/test/minimal-footer.test.tsx) validando os 6 critérios de aceitação.
- Especificação `SPEC-013`, tarefa `TASK-013-01` e revisão `REVIEW-013`.
- Refatoração da arquitetura para site multipágina com 10 rotas reais em TanStack Start (`/`, `/servicos/`, `/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`, `/trabalhos`, `/para-corretores`, `/sobre`, `/contato`, `/privacidade` e `/404`) preservando layout único e navegação suave no root (`SPEC-014`).
- Módulo centralizador de SEO técnico e Schema.org JSON-LD (`src/lib/seo.ts`) com esquemas canônicos estruturados (`AutoBodyShop`, `Service`, `BreadcrumbList`, `WebPage`).
- Criação dos arquivos canônicos `public/sitemap.xml`, `public/robots.txt` e `public/llms.txt` otimizados para motores de busca e agentes LLM com avisos de conformidade fotográfica.
- Suíte completa de testes unitários e de integração [`src/test/multipage-seo-llm.test.tsx`](src/test/multipage-seo-llm.test.tsx).
- Especificação `SPEC-014`, tarefa `TASK-014-01` e revisão `REVIEW-014`.
- Sistema unificado de motion design e scroll reveal premium com tokens normativos (`src/lib/motion-system.ts`), componentes primitivos `<Reveal>` e `<ImageReveal>` e orquestração sóbria e técnica seção por seção (`SPEC-015`).
- Animação do Hero no mount (sem esperar scroll), zoom-out sutil da imagem de fundo (1.05 → 1.00) e escalonamento de entrada nítido sem impacto no LCP.
- Transição da Navbar no scroll com compressão de altura, backdrop-blur-md translúcido e borda refinada.
- Galeria de Projetos com convite interativo de 10% no divisor ao entrar na viewport e touch-pan-y no `BeforeAfterSlider` para navegação touch vertical desimpedida.
- Linha de progresso vertical nas etapas de atendimento (`ProcessTimeline`) vinculada ao scroll via `transform: scaleY` com ativação luminosa dos marcadores.
- Efeito parallax sutil na imagem de corretores restrito a desktop (`lg:` / `min-width: 1024px`) e desativado em telas menores.
- Suporte global a acessibilidade com `<MotionConfig reducedMotion="user">` no layout raiz e degradação suave sem layout shift.
- Nova suíte de testes unitários [`src/test/motion-system.test.tsx`](src/test/motion-system.test.tsx) validando os 10 critérios de aceitação.
- Especificação `SPEC-015`, tarefa `TASK-015-01` e revisão `REVIEW-015`.
