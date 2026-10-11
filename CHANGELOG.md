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
