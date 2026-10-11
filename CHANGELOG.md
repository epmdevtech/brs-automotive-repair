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
