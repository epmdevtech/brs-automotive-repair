# REVIEW-059: Correção do Build e Servidor de Produção SSR TanStack Start (Resolução do Erro 500)

## Metadados

| Campo   | Valor                                          |
| ------- | ---------------------------------------------- |
| ID      | REVIEW-059                                     |
| SPEC    | SPEC-059                                       |
| TASK    | TASK-059-01                                    |
| Status  | Aprovado                                       |
| Data    | 2026-10-15                                     |
| Revisor | Staff DevOps & Fullstack Engineer (EPMDEVTECH) |

---

## 1. Resumo da Entrega e Resolução do Defeito

A **SPEC-059 / TASK-059-01** diagnosticou e sanou em definitivo o erro 500 (`Failed to load resource: the server responded with a status of 500 ()`) que ocorria ao acessar a aplicação em ambiente de produção / preview.

### Diagnóstico Técnico Concluído

1. O arquivo `vite.config.ts` mantinha um resquício de build (`nitro({ defaultPreset: "cloudflare-module" })`).
2. O Nitro interceptava a fase de bundling do Vite 8 e compilava o servidor em formato Cloudflare Worker em `.output/server/index.mjs`, suprimindo o compilador nativo do `@tanstack/react-start`.
3. Por consequência, o diretório `dist/server/server.js` esperado pelo servidor de preview do TanStack Start (`previewServerPlugin`) nunca era gerado.
4. Qualquer tentativa de executar a aplicação via `bun run preview`, `make preview` ou pelo container Docker de produção (`runner`) resultava em `ERR_MODULE_NOT_FOUND: Cannot find module '.../dist/server/server.js'`, retornando status HTTP 500 imediato na rota raiz `(index):1`.
5. O `Dockerfile` (estágio `runner`) copiava `/app/.output` em vez de `/app/dist`, impedindo o funcionamento do container de produção.

### Medidas Implementadas

1. **`vite.config.ts`**:
   - Remoção do import `nitro/vite` e do plugin condicional `nitro`.
   - Restauração do fluxo oficial do TanStack Start SSR (`tanstackStart({ server: { entry: "server" } })`), compilando cliente para `dist/client` e servidor SSR para `dist/server/server.js`.
2. **`Dockerfile`**:
   - Ajuste do estágio `runner` para copiar `/app/dist` em vez de `/app/.output`.
3. **`docker-compose.yml`**:
   - Remoção de volumes legados `.output` e `.nitro`, adicionando volume `/app/dist`.
4. **`Makefile`**:
   - Atualização da documentação do comando `build` para refletir `TanStack Start SSR`.
5. **Suíte de Testes Automatizados**:
   - Adicionada suíte `src/test/production-build.test.ts` (4 testes) validando que `vite.config.ts` não possui dependência de Nitro, `Dockerfile` copia `dist`, `docker-compose.yml` está limpo e `dist/server/server.js` é gerado com exportação do método `fetch`.
   - Teste de integração do servidor de preview validando resposta HTTP 200 com documento HTML completo (65 KB) e conteúdo BRS pré-renderizado.

---

## 2. Evidências de Validação e Quality Gates

### 2.1 Testes Unitários e de Integração (Vitest)

```bash
bun run test
```

- **Resultado**: 49 arquivos de teste executados, **355 testes aprovados (100% de sucesso)**.
- Duração total: ~149s. Zero regressões.

### 2.2 Linter de Código (ESLint)

```bash
bun run lint
```

- **Resultado**: 0 erros. Conformidade estrita com o linter do projeto.

### 2.3 Compilação de Produção (Vite)

```bash
bun run build
```

- **Resultado**: Compilação cliente concluída em ~4.1s e compilação SSR concluída em ~1.6s.
- Artefatos gerados:
  - `dist/client/`: Assets estáticos, scripts e estilos otimizados.
  - `dist/server/server.js`: Entrypoint SSR funcional.

### 2.4 Verificação do Servidor de Preview / Produção

- Inicialização do preview (`bun run preview`).
- Requisição `GET http://127.0.0.1:5219/`:
  - `Status: 200 OK`
  - `Content-Type: text/html; charset=utf-8`
  - `HTML length: 65.232 bytes`
  - Presença de conteúdo institucional e metadados SSR confirmada.
  - Zero ocorrências de erro 500 ou `ERR_MODULE_NOT_FOUND`.

---

## 3. Arquivos Modificados

| Arquivo                                                            | Modificação                                                                                                |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `vite.config.ts`                                                   | Remoção do plugin `nitro/vite` e restauração do compilador SSR nativo TanStack Start                       |
| `Dockerfile`                                                       | Atualização do estágio `runner` para copiar `/app/dist` em vez de `/app/.output`                           |
| `docker-compose.yml`                                               | Remoção de volumes legados `.output` e `.nitro`, isolamento de `dist`                                      |
| `Makefile`                                                         | Atualização editorial da descrição do comando `build`                                                      |
| `src/test/production-build.test.ts`                                | Nova suíte de testes automatizados com 4 asserções de integridade do build de produção e ausência de Nitro |
| `specs/SPEC-059-correcao-build-producao-ssr-tanstack-start.md`     | Especificação formal do defeito, causa raiz e requisitos de aceitação                                      |
| `tasks/TASK-059-01-correcao-build-producao-ssr-tanstack-start.md`  | Tarefa de engenharia rastreável                                                                            |
| `reviews/REVIEW-059-correcao-build-producao-ssr-tanstack-start.md` | Revisão formal de aprovação da entrega                                                                     |
| `PROJECT.md`                                                       | Registro da SPEC-059 e TASK-059-01 na governança canônica                                                  |
| `docs/traceability-matrix.md`                                      | Matriz de rastreabilidade sincronizada                                                                     |

---

## 4. Rastreabilidade

- **Spec-Ref**: `SPEC-059`
- **Task-Ref**: `TASK-059-01`
- **Revisão Aprovada**: Sim
