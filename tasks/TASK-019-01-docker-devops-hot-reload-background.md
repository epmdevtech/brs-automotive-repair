# TASK: Automação Docker DevOps com Hot Reload Instantâneo e Execução em Background

## Metadados

| Campo        | Valor                                                                       |
| ------------ | --------------------------------------------------------------------------- |
| ID           | TASK-019-01                                                                 |
| Status       | Done                                                                        |
| Responsável  | Senior DevOps & Frontend Engineer EPMDEVTECH                                |
| SPEC         | SPEC-019                                                                    |
| Critérios    | AC-019-01, AC-019-02, AC-019-03, AC-019-04, AC-019-05, AC-019-06, AC-019-07 |
| Dependências | SPEC-019                                                                    |

---

## Objetivo

Configurar a esteira de desenvolvimento em Docker para que execute em segundo plano (detached mode) permitindo fechar o terminal sem interromper o serviço, com sincronização automática e instantânea de código (Live Reload / HMR via Vite polling), mitigação de conflitos de porta 5210 e limpeza do aviso de `vite-tsconfig-paths`.

---

## Escopo

1. **Configuração do Vite (`vite.config.ts`)**:
   - Configurar `server.host: "0.0.0.0"`.
   - Habilitar `server.watch.usePolling` e intervalo de 100ms guiado por variáveis de ambiente.
   - Configurar `server.hmr.clientPort: 5210`.
   - Adotar nativo `resolve.tsconfigPaths: true` e remover o plugin `vite-tsconfig-paths`.
2. **Infraestrutura Docker (`Dockerfile` e `docker-compose.yml`)**:
   - Ajustar volumes, variáveis de ambiente de polling (`CHOKIDAR_USEPOLLING=true`, `VITE_USE_POLLING=true`, `CHOKIDAR_INTERVAL=100`).
   - Adicionar `init: true` no compose para gerenciamento correto de sinais de processos.
3. **Automação no Makefile (`Makefile`)**:
   - Alvos `up` e `docker-up` com verificação de porta, feedback visual elegante e execução detached `-d`.
   - Alvo `free-port` para encerrar processos órfãos na porta 5210.
   - Alvo `status` para inspecionar os containers e portas ativas.
   - Alvo `down` e `logs`.
4. **Validação & Quality Gates**:
   - Testar `make up` e subida do container.
   - Validar hot reload instantâneo ao editar arquivos.
   - Rodar Quality Gates (`bun run test`, `bun run lint`, `bun run build`).

---

## Critérios de Aceitação

- [x] **AC-019-01**: `make up` e `make docker-up` inicializam os containers em modo detached (`-d`) e liberam o terminal imediatamente.
- [x] **AC-019-02**: O container Docker detecta alterações nos arquivos de código (`src/`) instantaneamente via Vite HMR com polling ativo.
- [x] **AC-019-03**: `make down` para e limpa os containers de forma segura.
- [x] **AC-019-04**: O `Makefile` possui o alvo `free-port` para liberar a porta 5210 de processos órfãos.
- [x] **AC-019-05**: `vite.config.ts` migra para a resolução nativa de `tsconfigPaths` e configura `server.host: "0.0.0.0"` e HMR.
- [x] **AC-019-06**: A porta estrita 5210 e o domínio `http://brs.localhost` permanecem 100% respeitados.
- [x] **AC-019-07**: Todos os Quality Gates locais (`bun run test`, `bun run lint`, `bun run build`) continuam passando com 100% de sucesso.
