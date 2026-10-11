# TASK: Configuração de Makefile, Dockerfile e Docker Compose

## Metadados

| Campo        | Valor                                                 |
| ------------ | ----------------------------------------------------- |
| ID           | TASK-002-01                                           |
| Status       | Done                                                  |
| Responsável  | Engenharia DevOps EPMDEVTECH                          |
| SPEC         | SPEC-002                                              |
| Critérios    | AC-002-01, AC-002-02, AC-002-03, AC-002-04, AC-002-05 |
| Dependências | SPEC-002                                              |

---

## Objetivo

Implementar a automação de desenvolvimento e containerização para a BRS Reparações Automotivas criando `Makefile`, `Dockerfile`, `docker-compose.yml` e `.dockerignore`, com mapeamento estrito na porta `5210`.

---

## Escopo

### Incluído

- `Makefile` com comandos de ciclo local (`install`, `dev`, `build`, `lint`, `format`, `test`, `check`) e ciclo Docker (`up`, `down`, `docker-dev`, `docker-build`, `docker-logs`).
- `Dockerfile` multi-stage com `oven/bun:1-slim`.
- `docker-compose.yml` configurado com Live Reload, porta 5210 e healthcheck.
- `.dockerignore` com exclusão de `node_modules`, `.output`, `.wrangler`, etc.

### Não incluído

- Mudanças nas rotas ou dados da aplicação.

---

## Validação

| Critério/risco        | Teste, comando ou revisão | Evidência esperada                                                 |
| --------------------- | ------------------------- | ------------------------------------------------------------------ |
| AC-002-01             | `make help`               | Lista de comandos colorida aprovada                                |
| AC-002-02             | `make check`              | Lint, testes, build e matriz aprovados com 100%                    |
| AC-002-03             | `make docker-build`       | Imagem `brs-web` construída com sucesso                            |
| AC-002-04 / AC-002-05 | `make up` e `make down`   | Container iniciou com HTTP 200 na porta 5210 e desceu sem resíduos |

---

## Condição de conclusão

- [x] `Dockerfile` e `docker-compose.yml` operacionais.
- [x] `Makefile` testado com sucesso.
- [x] Verificações de Quality Gates aprovadas (`make check`).
- [x] Rastreabilidade SDD atualizada.
