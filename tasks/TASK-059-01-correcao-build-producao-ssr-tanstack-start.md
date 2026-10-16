# TASK-059-01: Correção do Build e Servidor de Produção SSR TanStack Start (Resolução do Erro 500)

## Metadados

| Campo       | Valor                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Task ID     | TASK-059-01                                                                                    |
| Spec Ref    | SPEC-059                                                                                       |
| Título      | Remoção do Plugin Nitro e Alinhamento do Bundle de Produção e Dockerfile no TanStack Start SSR |
| Status      | Concluído                                                                                      |
| Data        | 2026-10-15                                                                                     |
| Responsável | Staff DevOps & Fullstack Engineer                                                              |
| Módulo      | `build`, `vite.config.ts`, `Dockerfile`, `docker-compose.yml`                                  |

---

## 1. Escopo de Implementação

1. **Refatoração do `vite.config.ts`**:
   - Excluir o import `import { nitro } from "nitro/vite";`.
   - Excluir a inclusão condicional do plugin `nitro({ defaultPreset: "cloudflare-module" })`.
   - Preservar `tanstackStart({ server: { entry: "server" } })` e os demais plugins (`tailwindcss()`, `react()`).
2. **Atualização do `Dockerfile`**:
   - No estágio `runner`, alterar `COPY --from=builder /app/.output ./.output` para `COPY --from=builder /app/dist ./dist`.
3. **Limpeza do `docker-compose.yml`**:
   - Remover `/app/.output` e `/app/.nitro` da lista de volumes.
4. **Criação de Teste Automatizado de Build de Produção**:
   - Criar `src/test/production-build.test.ts` validando a existência do pacote `dist/server/server.js`, sua exportação e a resiliência do servidor em produção.
5. **Quality Gates & Matriz de Rastreabilidade**:
   - Executar `bun run test` (100% de sucesso).
   - Executar `bun run lint` (0 erros).
   - Executar `bun run build` gerando `dist/client` e `dist/server/server.js`.
   - Sincronizar matriz de rastreabilidade via `python3 scripts/generate_traceability.py`.

---

## 2. Critérios de Aceite

- [x] **AC-059-01**: `vite.config.ts` sem vínculos ou dependências em tempo de build com `nitro/vite`.
- [x] **AC-059-02**: Execução de `bun run build` gera os pacotes oficiais em `dist/client` e `dist/server/server.js`.
- [x] **AC-059-03**: Servidor de preview carrega `dist/server/server.js` sem erro `ERR_MODULE_NOT_FOUND`.
- [x] **AC-059-04**: Requisições `GET /` respondem HTTP 200 com HTML pré-renderizado no SSR, sem status 500.
- [x] **AC-059-05**: `Dockerfile` copia `dist` no estágio de produção `runner`.
- [x] **AC-059-06**: `docker-compose.yml` sem resíduos de volumes `.output` e `.nitro`.
- [x] **AC-059-07**: 100% dos Quality Gates aprovados (testes, lint, build e matriz SDD).
