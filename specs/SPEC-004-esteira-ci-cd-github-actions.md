# SPEC: Esteira de Integração Contínua (CI/CD) com GitHub Actions

## Metadados

| Campo                               | Valor                                     |
| ----------------------------------- | ----------------------------------------- |
| ID                                  | SPEC-004                                  |
| Status                              | Implemented                               |
| Responsável                         | Engenharia DevOps EPMDEVTECH              |
| Revisores                           | Engenharia / QA EPMDEVTECH                |
| Criado                              | 2026-10-11                                |
| Atualizado                          | 2026-10-11                                |
| Lançamento alvo                     | `0.1.0`                                   |
| Briefing de UX relacionado          | N/A (DevOps e Automação CI/CD)            |
| Especificação de design relacionada | N/A                                       |
| ADRs relacionadas                   | N/A                                       |

---

## Problema e resultado

Para assegurar qualidade contínua em cada pull request e push nos branches principais (`main` e `develop`), o projeto requer uma esteira de automação no GitHub Actions. A esteira deve validar de forma determinística os quality gates do Universal SDD (linting, suíte de testes Vitest, compilação de produção e integridade da matriz de rastreabilidade), além de testar a compilação do container Docker.

### Resultado Desejado

- Criação do workflow `.github/workflows/ci.yml` acionado em eventos de `push` e `pull_request` nos branches `main` e `develop`.
- Job de Quality Gates (`quality-gates`):
  - Checkout do repositório com histórico suficiente para geração de rastreabilidade.
  - Instalação do runtime Bun (`oven-sh/setup-bun@v2`).
  - Instalação estrita de dependências (`bun install --frozen-lockfile`).
  - Verificação de linter e formatação (`bun run lint`).
  - Execução dos testes automatizados com Vitest (`bun test`).
  - Compilação cliente e Nitro SSR (`bun run build`).
  - Verificação da matriz de rastreabilidade do Universal SDD (`python3 scripts/generate_traceability.py`).
- Job de Validação Docker (`docker-build`):
  - Teste de compilação da imagem multi-estágio (`docker build -t brs-web:ci .`) para garantir que o ambiente conteinerizado permanece operacional.

---

## Escopo

### No escopo (In scope)

- Criação do diretório `.github/workflows/` e do workflow `.github/workflows/ci.yml`.
- Configuração de cache de dependências do Bun.
- Execução isolada e paralela dos jobs de validação de qualidade e build Docker.
- Suporte a gatilhos em `push` e `pull_request` para `main` e `develop`.
- Documentação dos workflows no `PROJECT.md`, `README.md` e `Makefile`.

### Fora do escopo (Out of scope)

- Deploy contínuo em nuvem pública (CD para produção), aguardando credenciais e domínio definitivo da BRS.
- Modificação de regras de negócio ou layout do frontend.

---

## Critérios de Aceitação

- [AC-004-01] O workflow `.github/workflows/ci.yml` deve ter sintaxe YAML válida para GitHub Actions.
- [AC-004-02] O workflow deve ser disparado em `push` e `pull_request` direcionados aos branches `main` e `develop`.
- [AC-004-03] O job `quality-gates` deve executar `bun run lint`, `bun test`, `bun run build` e validação de rastreabilidade com sucesso.
- [AC-004-04] O job `docker-build` deve validar o `Dockerfile` multi-stage no runner do GitHub Actions.
- [AC-004-05] Os quality gates locais (`make check`) devem permanecer 100% íntegros.
