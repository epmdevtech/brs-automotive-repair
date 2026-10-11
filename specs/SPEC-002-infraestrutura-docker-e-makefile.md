# SPEC: Infraestrutura Containerizada com Docker, Docker Compose e Automação via Makefile

## Metadados

| Campo                               | Valor                        |
| ----------------------------------- | ---------------------------- |
| ID                                  | SPEC-002                     |
| Status                              | Implemented                  |
| Responsável                         | Engenharia DevOps EPMDEVTECH |
| Revisores                           | Engenharia / QA EPMDEVTECH   |
| Criado                              | 2026-10-11                   |
| Atualizado                          | 2026-10-11                   |
| Lançamento alvo                     | `0.1.0`                      |
| Briefing de UX relacionado          | N/A (Infraestrutura e DX)    |
| Especificação de design relacionada | N/A                          |
| ADRs relacionadas                   | N/A                          |

---

## Problema e resultado

O projeto necessita de automação uniforme e padronizada para execução local, build, quality gates e orquestração de containers com Docker e Docker Compose, alinhado aos padrões da EPMDEVTECH e aos princípios do Universal SDD.

### Resultado Desejado

- `Makefile` completo com comandos auto-documentados via `make help`, abrangendo desenvolvimento, testes, lint, quality gates e ciclo de vida Docker (`build`, `up`, `down`, `dev`, `logs`).
- `Dockerfile` multi-estágio otimizado utilizando `oven/bun:1-slim`, garantindo paridade de ambiente, tempos rápidos de build e segurança.
- `docker-compose.yml` para desenvolvimento ágil com Live Reload (HMR), expondo a porta estrita `5210` mapeada no host conforme a regra canônica do projeto.
- `.dockerignore` para evitar vazamento de dependências locais e artefatos de compilação para dentro das imagens.

---

## Escopo

### No escopo (In scope)

- Criação de `Makefile` com suporte a `help`, `install`, `dev`, `build`, `lint`, `format`, `test`, `check`, `up`, `down`, `docker-dev`, `docker-build`, `docker-up`, `docker-down`, `docker-logs`.
- Criação de `Dockerfile` multi-estágio (`deps`, `dev`, `builder`, `runner`).
- Criação de `docker-compose.yml` com serviço `web`, mapeamento de porta `5210:5210`, variáveis de ambiente e healthcheck.
- Criação de `.dockerignore`.
- Validação e sincronização com os quality gates e rastreabilidade SDD.

### Fora do escopo (Out of scope)

- Alterações em regras de negócio ou componentes de interface visual.

---

## Critérios de Aceitação

- [AC-002-01] O comando `make help` deve listar todos os comandos disponíveis formatados com cores e descrições claras.
- [AC-002-02] O comando `make check` deve executar lint, testes, build e geração da matriz de rastreabilidade.
- [AC-002-03] O arquivo `Dockerfile` deve compilar sem erros através de `docker build` ou `docker compose build`.
- [AC-002-04] O arquivo `docker-compose.yml` deve iniciar o serviço na porta estrita `5210` sem conflitos com outros projetos.
- [AC-002-05] Os comandos `make up` e `make down` devem iniciar e finalizar os containers com sucesso.
