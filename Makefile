# ==============================================================================
# BRS Reparações Automotivas — Makefile de Automação (Universal SDD)
# ==============================================================================

# Detecção automática do gerenciador de pacotes
PKG_MANAGER := $(shell command -v bun 2>/dev/null || echo npm)

.DEFAULT_GOAL := help

# Cores para saída do terminal
CYAN  := \033[36m
GREEN := \033[32m
YELLOW:= \033[33m
RESET := \033[0m

# ==============================================================================
# Ajuda
# ==============================================================================
.PHONY: help
help: ## Exibe a lista de comandos disponíveis
	@echo "$(CYAN)==================================================================$(RESET)"
	@echo "$(GREEN)BRS Reparações Automotivas — Comandos de Automação$(RESET)"
	@echo "$(CYAN)==================================================================$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2}'

# ==============================================================================
# Desenvolvimento Local
# ==============================================================================
.PHONY: install dev build preview format
install: ## Instala as dependências do projeto
	$(PKG_MANAGER) install

dev: ## Inicia o servidor local de desenvolvimento (porta 5210)
	$(PKG_MANAGER) run dev

build: ## Executa o build de produção (Vite + Nitro SSR)
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
# Containerização (Docker & Docker Compose)
# ==============================================================================
.PHONY: up down docker-up docker-down docker-dev docker-build docker-logs

up: ## Atalho: Inicializa os containers em segundo plano (docker compose up -d)
	docker compose up -d

down: ## Atalho: Para e remove os containers em execução (docker compose down)
	docker compose down

docker-up: ## Inicializa os containers em segundo plano com Live Reload
	docker compose up -d

docker-down: ## Para e remove os containers em execução
	docker compose down

docker-dev: ## Inicializa os containers em primeiro plano com logs
	docker compose up

docker-build: ## Constrói as imagens Docker da aplicação
	docker compose build

docker-logs: ## Exibe os logs em tempo real do container web
	docker compose logs -f web
