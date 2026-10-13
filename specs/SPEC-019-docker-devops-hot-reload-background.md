# SPEC-019: Automação Docker DevOps com Hot Reload Instantâneo e Execução em Background

## Metadados

| Campo       | Valor                                                                       |
| ----------- | --------------------------------------------------------------------------- |
| ID          | SPEC-019                                                                    |
| Título      | Automação Docker DevOps com Hot Reload Instantâneo e Execução em Background |
| Status      | Approved                                                                    |
| Autor       | Senior DevOps & Frontend Engineer EPMDEVTECH                                |
| Data        | 2026-10-12                                                                  |
| Dependência | SPEC-002, SPEC-017, SPEC-018                                                |

---

## 1. Contexto e Justificativa

Durante o ciclo de desenvolvimento da **BRS Reparações Automotivas**, identificou-se um atrito operacional:

1. **Conflito de Porta (`Port 5210 is already in use`)**: O comando `make dev` ou `bun run dev` falha com `Error: Port 5210 is already in use` quando outro processo (seja local ou container anterior) já ocupa a porta estrita 5210 sem gerenciamento proativo do ciclo de vida.
2. **Terminal Preso**: O desenvolvedor deseja poder fechar o terminal sem interromper o ambiente de execução da aplicação.
3. **Live Reload / HMR Instantâneo no Docker**: Ao alterar qualquer arquivo de código no host (`src/`, etc.), as modificações devem ser refletidas automaticamente e de forma instantânea dentro do container Docker sem recriação ou reinício do container.
4. **Alerta de Depreciação Vite**: O plugin `vite-tsconfig-paths` emite aviso de que o Vite v8 já suporta nativamente a resolução via `resolve.tsconfigPaths: true`.

---

## 2. Requisitos Funcionais e Técnicos

### RF-01: Execução em Segundo Plano (Background / Detached Mode)

- O ambiente Docker deve subir via `docker compose up -d` com comando simplificado no `Makefile` (`make up`, `make docker-up`).
- O terminal deve ser liberado imediatamente para o desenvolvedor fechar ou utilizar para outras atividades.
- O comando `make status` deve exibir a saúde do container, porta vinculada e URLs (`http://localhost:5210` e `http://brs.localhost`).

### RF-02: Hot Reload Instantâneo no Docker (Vite HMR)

- O `vite.config.ts` deve configurar explicitamente:
  - `server.host: "0.0.0.0"` para escutar conexões externas vindas do Docker bridge.
  - `server.port: 5210` e `server.strictPort: true` respeitando a regra canônica de portas da EPMDEVTECH.
  - `server.watch.usePolling`: ativado via variáveis de ambiente (`VITE_USE_POLLING` ou `CHOKIDAR_USEPOLLING`) com intervalo de 100ms para detecção instantânea de alterações no bind mount Linux.
  - `server.hmr.clientPort: 5210`: para que o WebSocket do navegador se conecte diretamente na porta mapeada no host.
- O `docker-compose.yml` deve manter o bind mount `.:/app` e isolar `node_modules`, `.output` e `.nitro` para evitar poluição cruzada entre container e host.

### RF-03: Prevenção e Resolução de Conflitos de Porta 5210

- O `Makefile` deve implementar o alvo `free-port` (ou `kill-port`) para liberar processos órfãos que ocupem a porta 5210.
- Os alvos `make dev` e `make up` devem validar a disponibilidade da porta ou tratar a colisão de maneira explicativa e segura.

### RF-04: Otimização do Vite Config (Nativo `tsconfigPaths`)

- Substituir o plugin de terceiros `vite-tsconfig-paths` pela propriedade nativa do Vite v8 `resolve: { tsconfigPaths: true }`, eliminando warnings de inicialização e melhorando a velocidade de bundling.

---

## 3. Critérios de Aceitação (AC)

- [ ] **AC-019-01**: `make up` e `make docker-up` inicializam os containers em modo detached (`-d`) e liberam o terminal imediatamente.
- [ ] **AC-019-02**: O container Docker detecta alterações nos arquivos de código (`src/`) instantaneamente via Vite HMR com polling ativo.
- [ ] **AC-019-03**: `make down` para e limpa os containers de forma segura.
- [ ] **AC-019-04**: O `Makefile` possui o alvo `free-port` para liberar a porta 5210 de processos órfãos.
- [ ] **AC-019-05**: `vite.config.ts` migra para a resolução nativa de `tsconfigPaths` e configura `server.host: "0.0.0.0"` e HMR.
- [ ] **AC-019-06**: A porta estrita 5210 e o domínio `http://brs.localhost` permanecem 100% respeitados.
- [ ] **AC-019-07**: Todos os Quality Gates locais (`bun run test`, `bun run lint`, `bun run build`) continuam passando com 100% de sucesso.
