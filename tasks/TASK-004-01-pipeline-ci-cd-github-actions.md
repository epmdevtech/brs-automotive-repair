# TASK: Implementação da Esteira de CI/CD com GitHub Actions

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-004-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia DevOps EPMDEVTECH                                     |
| SPEC         | SPEC-004                                                         |
| Critérios    | AC-004-01, AC-004-02, AC-004-03, AC-004-04, AC-004-05             |
| Dependências | SPEC-004                                                         |

---

## Objetivo

Implementar a esteira de integração contínua (CI) através do GitHub Actions (`.github/workflows/ci.yml`), garantindo a execução automatizada de testes, linter, build de produção, validação de rastreabilidade do Universal SDD e validação da compilação da imagem Docker.

---

## Escopo

### Incluído

- Criação do diretório `.github/workflows/`
- Criação de `.github/workflows/ci.yml` com:
  - Gatilhos para `push` e `pull_request` nos branches `main` e `develop`.
  - Job `quality-gates`: checkout, setup bun com cache, `bun install --frozen-lockfile`, `bun run lint`, `bun test`, `bun run build`, verificação da matriz de rastreabilidade.
  - Job `docker-build`: checkout, docker build para assegurar sanidade da imagem.
- Atualização da documentação (`PROJECT.md`, `README.md`, `CHANGELOG.md`, `ROADMAP.md`).
- Validação local e geração da matriz de rastreabilidade.

### Não incluído

- Credenciais de nuvem privada ou CD de produção para servidores externos.

---

## Validação

| Critério/risco | Teste, comando ou revisão               | Evidência esperada                                |
| -------------- | --------------------------------------- | ------------------------------------------------- |
| AC-004-01      | Validação de sintaxe YAML               | YAML bem formatado sem erros de parse             |
| AC-004-02      | Inspeção dos gatilhos `on:`             | Branches `main` e `develop` monitoradas           |
| AC-004-03      | Validação dos passos de quality gates   | Comandos idênticos aos padronizados no Makefile   |
| AC-004-04      | Validação do job Docker                 | Build Docker executável no runner Ubuntu          |
| AC-004-05      | `make check` local                      | 100% dos gates aprovados localmente               |

---

## Condição de conclusão

- [x] `.github/workflows/ci.yml` criado e validado.
- [x] Documentação de CI/CD refletida nos manuais do projeto.
- [x] Matriz de rastreabilidade gerada com sucesso.
- [x] Review formal `REVIEW-004` aprovado.
- [x] Commit realizado com os trailers `Spec-Ref: SPEC-004` e `Task-Ref: TASK-004-01`.
