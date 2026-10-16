# SPEC-059: Correção do Build e Servidor de Produção SSR TanStack Start (Resolução do Erro 500 em Produção)

## Metadados

| Campo       | Valor                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-059                                                                                        |
| Título      | Correção do Build e Servidor de Produção SSR TanStack Start (Resolução do Erro 500 em Produção) |
| Status      | Aprovado                                                                                        |
| Data        | 2026-10-15                                                                                      |
| Autor       | Staff DevOps & Fullstack Engineer                                                               |
| Módulo      | `build`, `vite.config.ts`, `Dockerfile`, `docker-compose.yml`                                   |
| Dependência | SPEC-002, SPEC-008, SPEC-014, SPEC-019                                                          |

---

## 1. Visão Geral e Diagnóstico da Causa Raiz

### Problema Observado em Produção

Ao acessar a raiz ou rotas da aplicação em ambiente de produção (executado via `bun run preview`, `make preview` ou container Docker `runner`), o servidor retorna imediatamente:

```text
(index):1 Failed to load resource: the server responded with a status of 500 ()
```

No terminal e no corpo da resposta HTML 500:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/.../dist/server/server.js' imported from .../node_modules/@tanstack/start-plugin-core/dist/esm/vite/preview-server-plugin/plugin.js
```

### Análise de Causa Raiz

1. **Conflito de Plugins no Bundler**: O arquivo `vite.config.ts` mantinha um resquício histórico da transição do Lovable:
   ```typescript
   ...(command === "build"
     ? [
         nitro({
           defaultPreset: "cloudflare-module",
         }),
       ]
     : []),
   ```
2. **Subversão do Ciclo de Build do TanStack Start**:
   - O `@tanstack/react-start` em conjunto com Vite 8 implementa o `builder.buildApp` nativo, compilando o cliente para `dist/client` e o entrypoint SSR para `dist/server/server.js`.
   - O plugin `nitro/vite` com `defaultPreset: "cloudflare-module"` sobrescrevia a fase de build do Vite, gerando artefatos proprietários em `.output/server/index.mjs` no formato Cloudflare Worker (`export default { fetch }`).
   - Por consequência, os diretórios canônicos `dist/server` e `dist/server/server.js` nunca eram criados pelo comando `bun run build`.
3. **Falha Catastrófica no Preview e Container Runner**:
   - O comando de preview do TanStack Start (`vite preview`), invocado por `make preview`, `bun run preview` e no estágio 4 do `Dockerfile`, busca estritamente o módulo `dist/server/server.js`.
   - Como o arquivo não existia, o servidor de preview lançava `ERR_MODULE_NOT_FOUND` e devolvia HTTP 500 em todas as requisições iniciais `(index):1`.
   - O `Dockerfile` no estágio `runner` copiava `/app/.output` em vez de `/app/dist`, perpetuando o erro dentro da imagem Docker de produção.

---

## 2. Princípios de Engenharia e Arquitetura de Correção

1. **Compilação Canônica TanStack Start SSR**:
   - Remover completamente o plugin `nitro/vite` de `vite.config.ts`, permitindo que o TanStack Start compile nativamente via Vite os pacotes cliente e SSR em `dist/client` e `dist/server/server.js`.
   - Manter a configuração estrita `tanstackStart({ server: { entry: "server" } })`, preservando o wrapper de resiliência e captura de erros SSR em `src/server.ts`.
2. **Alinhamento do Runtime de Produção no Dockerfile**:
   - Atualizar o estágio `runner` do `Dockerfile` para copiar `/app/dist` em vez de `/app/.output`.
   - Garantir que `vite preview` encontre tanto `dist/client` quanto `dist/server/server.js`.
3. **Limpeza de Artefatos Obsoletos no Docker Compose**:
   - Remover os volumes legados `.output` e `.nitro` do `docker-compose.yml`, evitando lixo residual.
4. **Respeito aos Quality Gates e Rastreabilidade**:
   - Validar 100% dos testes unitários e de integração no Vitest (`bun run test`).
   - Validar build limpo e ausência de warnings (`bun run build`).
   - Validar execução do preview e resposta HTTP 200 via teste automatizado.
   - Atualizar a matriz de rastreabilidade Universal SDD.

---

## 3. Requisitos Funcionais e Critérios de Aceite

- [ ] **AC-059-01**: `vite.config.ts` não deve conter importação ou plugin de `nitro/vite`.
- [ ] **AC-059-02**: A execução de `bun run build` deve gerar `dist/server/server.js` e `dist/client/`.
- [ ] **AC-059-03**: O comando `bun run preview` ou inicialização do preview de produção deve carregar `dist/server/server.js` sem lançar `ERR_MODULE_NOT_FOUND`.
- [ ] **AC-059-04**: Requisições HTTP para a raiz `GET /` em modo preview/produção devem responder com status HTTP 200 e HTML completo renderizado via SSR, sem status 500.
- [ ] **AC-059-05**: O estágio 4 (`runner`) do `Dockerfile` deve copiar `dist` em vez de `.output`.
- [ ] **AC-059-06**: `docker-compose.yml` não deve manter volumes para `.output` e `.nitro`.
- [ ] **AC-059-07**: Quality Gates 100% aprovados: Vitest, ESLint, Build e Matriz de Rastreabilidade SDD.
