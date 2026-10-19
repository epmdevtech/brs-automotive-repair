# ==============================================================================
# Master Chapeação e Pinturas — Makefile de Automação (Universal SDD)
# ==============================================================================

# Detecção automática do gerenciador de pacotes
PKG_MANAGER := $(shell command -v bun 2>/dev/null || echo npm)
PORT := 5210

.DEFAULT_GOAL := help

# Cores para saída do terminal
CYAN  := \033[36m
GREEN := \033[32m
YELLOW:= \033[33m
RED   := \033[31m
BOLD  := \033[1m
RESET := \033[0m

# ==============================================================================
# Ajuda
# ==============================================================================
.PHONY: help
help: ## Exibe a lista de comandos disponíveis
	@echo "$(CYAN)==================================================================$(RESET)"
	@echo "$(BOLD)$(GREEN)Master Chapeação e Pinturas — Automação DevOps & SDD$(RESET)"
	@echo "$(CYAN)==================================================================$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2}'

# ==============================================================================
# Gerenciamento de Portas e Processos
# ==============================================================================
.PHONY: free-port check-port
free-port: ## Libera a porta 5210 encerrando processos locais órfãos
	@echo "$(YELLOW)Verificando processos ouvindo na porta $(PORT)...$(RESET)"
	@if lsof -iTCP:$(PORT) -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(RED)Encerrando processos na porta $(PORT)...$(RESET)"; \
		fuser -k $(PORT)/tcp >/dev/null 2>&1 || kill -9 $$(lsof -t -iTCP:$(PORT) -sTCP:LISTEN) >/dev/null 2>&1 || true; \
		echo "$(GREEN)✓ Porta $(PORT) liberada com sucesso!$(RESET)"; \
	else \
		echo "$(GREEN)✓ Porta $(PORT) já está livre.$(RESET)"; \
	fi

# ==============================================================================
# Desenvolvimento Local (Host)
# ==============================================================================
.PHONY: install dev build preview format
install: ## Instala as dependências do projeto
	$(PKG_MANAGER) install

dev: ## Inicia o servidor local de desenvolvimento no host (porta 5210)
	@if docker ps --format '{{.Names}}' | grep -q "brs-reparacoes"; then \
		echo "$(YELLOW)[AVISO] O container Docker 'brs-reparacoes' já está rodando na porta $(PORT)!$(RESET)"; \
		echo "Acesse: $(CYAN)http://localhost:$(PORT)$(RESET) ou $(CYAN)http://brs.localhost$(RESET)"; \
		echo "Para alternar para o dev server local no host, pare o Docker com: $(BOLD)make down$(RESET)"; \
		exit 1; \
	fi
	@if lsof -iTCP:$(PORT) -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "$(YELLOW)[AVISO] A porta $(PORT) já está em uso por outro processo.$(RESET)"; \
		echo "Executando liberação da porta..."; \
		$(MAKE) free-port; \
	fi
	$(PKG_MANAGER) run dev

build: ## Executa o build de produção (TanStack Start SSR)
	$(PKG_MANAGER) run build

preview: ## Visualiza o build de produção localmente
	$(PKG_MANAGER) run preview

format: ## Formata todo o código com Prettier
	$(PKG_MANAGER) run format

# ==============================================================================
# Quality Gates & Testes
# ==============================================================================
.PHONY: lint test test-watch check-traceability check
lint: ## Executa o linter ESLint
	$(PKG_MANAGER) run lint

test: ## Executa os testes automatizados com Vitest
	$(PKG_MANAGER) run test

test-watch: ## Executa os testes em modo contínuo (watch)
	$(PKG_MANAGER) run test:watch

check-traceability: ## Gera e verifica a matriz de rastreabilidade (SDD)
	python3 scripts/generate_traceability.py

check: lint test build check-traceability ## Executa todos os Quality Gates locais
	@echo "$(GREEN)✓ Todos os Quality Gates foram aprovados com sucesso!$(RESET)"

# ==============================================================================
# Containerização (Docker & Docker Compose) — Background & Live Reload
# ==============================================================================
.PHONY: up down restart docker-up docker-down docker-dev docker-build docker-logs docker-clean logs status

up: docker-up ## Atalho: Inicializa os containers em segundo plano com Live Reload

docker-up: ## Inicializa em segundo plano (-d) com Live Reload instantâneo e libera o terminal
	@if lsof -iTCP:$(PORT) -sTCP:LISTEN -t >/dev/null 2>&1 && ! docker ps --format '{{.Names}}' | grep -q "brs-reparacoes"; then \
		echo "$(YELLOW)A porta $(PORT) está ocupada por um processo local fora do Docker.$(RESET)"; \
		$(MAKE) free-port; \
	fi
	@echo "$(CYAN)Iniciando container Docker da Master Chapeação em segundo plano com Live Reload...$(RESET)"
	docker compose up -d --build
	@echo ""
	@echo "$(BOLD)$(GREEN)==================================================================$(RESET)"
	@echo "$(BOLD)$(GREEN)✓ Master Chapeação e Pinturas em execução em segundo plano!$(RESET)"
	@echo "$(BOLD)$(GREEN)==================================================================$(RESET)"
	@echo "  • Local:       $(CYAN)http://localhost:$(PORT)$(RESET)"
	@echo "  • Proxy Caddy: $(CYAN)http://brs.localhost$(RESET)"
	@echo "  • Live Reload: $(GREEN)ATIVO$(RESET) (alterações no código refletem instantaneamente)"
	@echo "  • Terminal:    $(GREEN)LIBERADO$(RESET) (você pode fechar este terminal livremente)"
	@echo ""
	@echo "Comandos úteis:"
	@echo "  • Para ver logs em tempo real: $(BOLD)make logs$(RESET)"
	@echo "  • Para verificar o status:     $(BOLD)make status$(RESET)"
	@echo "  • Para parar a aplicação:      $(BOLD)make down$(RESET)"
	@echo ""

down: docker-down ## Atalho: Para e remove os containers em execução

docker-down: ## Para e remove os containers Docker em execução
	@echo "$(YELLOW)Parando containers da Master Chapeação...$(RESET)"
	docker compose down
	@echo "$(GREEN)✓ Containers parados com sucesso.$(RESET)"

docker-clean: ## Para containers e remove volumes de dependências (reset completo)
	@echo "$(YELLOW)Limpando containers e volumes Docker...$(RESET)"
	docker compose down -v
	@echo "$(GREEN)✓ Limpeza concluída.$(RESET)"

restart: ## Reinicia os containers Docker em segundo plano
	@$(MAKE) docker-down
	@$(MAKE) docker-up

docker-dev: ## Inicializa os containers em primeiro plano (anexado com logs)
	docker compose up --build

docker-build: ## Constrói ou reconstrói as imagens Docker da aplicação
	docker compose build

logs: docker-logs ## Atalho: Exibe os logs em tempo real do container web

docker-logs: ## Exibe os logs em tempo real do container web
	docker compose logs -f web

status: ## Exibe o status do container e verificação de saúde
	@echo "$(CYAN)Status dos containers Docker:$(RESET)"
	@docker compose ps
	@echo ""
	@if docker ps --format '{{.Names}}' | grep -q "brs-reparacoes"; then \
		echo "$(GREEN)✓ Container 'brs-reparacoes' está ATIVO em background na porta $(PORT).$(RESET)"; \
		echo "  Acesse: $(CYAN)http://localhost:$(PORT)$(RESET) ou $(CYAN)http://brs.localhost$(RESET)"; \
	else \
		echo "$(YELLOW)• Container não está ativo no momento. Use 'make up' para iniciar.$(RESET)"; \
	fi
