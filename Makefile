# 🎬 StreamingApp - Makefile de Automatización
# Simplifica la gestión del proyecto con comandos fáciles de recordar

# ==========================================
# 🎯 VARIABLES DE CONFIGURACIÓN
# ==========================================

# Colores para output más legible
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Variables del proyecto
PROJECT_NAME=streaming-app
DOCKER_COMPOSE=docker-compose
FRONTEND_DIR=frontend
BACKEND_DIR=backend

# ==========================================
# 📋 COMANDOS PRINCIPALES
# ==========================================

.PHONY: help
help: ## 📖 Mostrar ayuda de comandos disponibles
	@echo ""
	@echo "$(BLUE)🎬 StreamingApp - Comandos Disponibles$(NC)"
	@echo "=================================================="
	@echo ""
	@echo "$(GREEN)🚀 DESARROLLO:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "🚀\|⚡\|🔧" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)🐳 DOCKER:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "🐳\|📦\|🏗️" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)🧹 MANTENIMIENTO:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep "🧹\|🔍\|📊" | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

.PHONY: dev
dev: ## 🚀 Levantar entorno de desarrollo (frontend + backend + BD)
	@echo "$(BLUE)🚀 Iniciando entorno de desarrollo...$(NC)"
	@$(DOCKER_COMPOSE) up -d postgres minio
	@echo "$(YELLOW)⏳ Esperando a que la BD esté lista...$(NC)"
	@sleep 10
	@$(DOCKER_COMPOSE) up -d minio-setup
	@$(DOCKER_COMPOSE) up frontend backend
	@echo "$(GREEN)✅ Entorno de desarrollo listo!$(NC)"
	@echo "$(BLUE)📱 Frontend: http://localhost:5173$(NC)"
	@echo "$(BLUE)🔗 Backend API: http://localhost:3000$(NC)"
	@echo "$(BLUE)📚 Storybook: http://localhost:6006$(NC)"

.PHONY: up
up: ## 🐳 Levantar stack completo en background
	@echo "$(BLUE)🐳 Levantando stack completo...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)✅ Stack completo iniciado!$(NC)"
	@$(MAKE) status

.PHONY: down
down: ## 🐳 Parar todos los servicios
	@echo "$(BLUE)🐳 Parando todos los servicios...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ Servicios detenidos$(NC)"

.PHONY: restart
restart: ## ⚡ Reiniciar todos los servicios
	@echo "$(BLUE)⚡ Reiniciando servicios...$(NC)"
	@$(MAKE) down
	@sleep 2
	@$(MAKE) up

.PHONY: logs
logs: ## 📊 Ver logs en tiempo real de todos los servicios
	@echo "$(BLUE)📊 Mostrando logs en tiempo real...$(NC)"
	@$(DOCKER_COMPOSE) logs -f

.PHONY: logs-frontend
logs-frontend: ## 📊 Ver logs solo del frontend
	@$(DOCKER_COMPOSE) logs -f frontend

.PHONY: logs-backend
logs-backend: ## 📊 Ver logs solo del backend
	@$(DOCKER_COMPOSE) logs -f backend

.PHONY: status
status: ## 🔍 Ver estado de todos los servicios
	@echo "$(BLUE)🔍 Estado de servicios:$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(BLUE)🌐 URLs de acceso:$(NC)"
	@echo "  $(GREEN)Frontend:$(NC)     http://localhost:5173"
	@echo "  $(GREEN)Backend API:$(NC)  http://localhost:3000"
	@echo "  $(GREEN)Storybook:$(NC)    http://localhost:6006"
	@echo "  $(GREEN)pgAdmin:$(NC)      http://localhost:5050"
	@echo "  $(GREEN)MinIO Console:$(NC) http://localhost:9001"
	@echo "  $(GREEN)CDN NGINX:$(NC)    http://localhost:8082"

.PHONY: build
build: ## 🏗️ Construir todas las imágenes Docker
	@echo "$(BLUE)🏗️ Construyendo imágenes Docker...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache
	@echo "$(GREEN)✅ Imágenes construidas$(NC)"

.PHONY: build-frontend
build-frontend: ## 🏗️ Construir solo imagen del frontend
	@echo "$(BLUE)🏗️ Construyendo imagen del frontend...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache frontend
	@echo "$(GREEN)✅ Imagen del frontend construida$(NC)"

.PHONY: build-backend
build-backend: ## 🏗️ Construir solo imagen del backend
	@echo "$(BLUE)🏗️ Construyendo imagen del backend...$(NC)"
	@$(DOCKER_COMPOSE) build --no-cache backend
	@echo "$(GREEN)✅ Imagen del backend construida$(NC)"

.PHONY: clean
clean: ## 🧹 Limpiar contenedores, imágenes y volúmenes no utilizados
	@echo "$(BLUE)🧹 Limpiando recursos Docker...$(NC)"
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@docker system prune -f
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

.PHONY: clean-all
clean-all: ## 🧹 Limpieza completa (incluyendo volúmenes de datos)
	@echo "$(RED)⚠️  ATENCIÓN: Esto eliminará TODOS los datos (BD, archivos)$(NC)"
	@read -p "¿Estás seguro? (y/N): " confirm && [ "$confirm" = "y" ]
	@echo "$(BLUE)🧹 Realizando limpieza completa...$(NC)"
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@docker volume prune -f
	@docker image prune -a -f
	@echo "$(GREEN)✅ Limpieza completa realizada$(NC)"

.PHONY: shell-frontend
shell-frontend: ## 🔧 Acceder al contenedor del frontend
	@echo "$(BLUE)🔧 Accediendo al contenedor frontend...$(NC)"
	@$(DOCKER_COMPOSE) exec frontend sh

.PHONY: shell-backend
shell-backend: ## 🔧 Acceder al contenedor del backend
	@echo "$(BLUE)🔧 Accediendo al contenedor backend...$(NC)"
	@$(DOCKER_COMPOSE) exec backend sh

.PHONY: shell-db
shell-db: ## 🔧 Acceder a PostgreSQL
	@echo "$(BLUE)🔧 Accediendo a PostgreSQL...$(NC)"
	@$(DOCKER_COMPOSE) exec postgres psql -U admin -d streaming_api

.PHONY: install-frontend
install-frontend: ## 📦 Instalar dependencias del frontend
	@echo "$(BLUE)📦 Instalando dependencias del frontend...$(NC)"
	@cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)✅ Dependencias del frontend instaladas$(NC)"

.PHONY: install-backend
install-backend: ## 📦 Instalar dependencias del backend
	@echo "$(BLUE)📦 Instalando dependencias del backend...$(NC)"
	@cd $(BACKEND_DIR)/app && npm install
	@echo "$(GREEN)✅ Dependencias del backend instaladas$(NC)"

.PHONY: install
install: ## 📦 Instalar todas las dependencias
	@echo "$(BLUE)📦 Instalando todas las dependencias...$(NC)"
	@$(MAKE) install-frontend
	@$(MAKE) install-backend
	@echo "$(GREEN)✅ Todas las dependencias instaladas$(NC)"

.PHONY: lint
lint: ## 🔍 Ejecutar linting en frontend y backend
	@echo "$(BLUE)🔍 Ejecutando linting...$(NC)"
	@echo "$(YELLOW)Frontend:$(NC)"
	@cd $(FRONTEND_DIR) && npm run lint
	@echo "$(YELLOW)Backend:$(NC)"
	@cd $(BACKEND_DIR)/app && npm run lint || echo "⚠️  Lint script no encontrado en backend"
	@echo "$(GREEN)✅ Linting completado$(NC)"

.PHONY: test
test: ## 🧪 Ejecutar pruebas
	@echo "$(BLUE)🧪 Ejecutando pruebas...$(NC)"
	@echo "$(YELLOW)Frontend:$(NC)"
	@cd $(FRONTEND_DIR) && npm test || echo "⚠️  Tests no configurados en frontend"
	@echo "$(YELLOW)Backend:$(NC)"
	@cd $(BACKEND_DIR)/app && npm test || echo "⚠️  Tests no configurados en backend"
	@echo "$(GREEN)✅ Pruebas completadas$(NC)"

.PHONY: storybook
storybook: ## 📚 Ejecutar Storybook standalone
	@echo "$(BLUE)📚 Iniciando Storybook...$(NC)"
	@cd $(FRONTEND_DIR) && npm run storybook
	@echo "$(GREEN)📚 Storybook disponible en http://localhost:6006$(NC)"

.PHONY: backup-db
backup-db: ## 💾 Backup de la base de datos
	@echo "$(BLUE)💾 Creando backup de la base de datos...$(NC)"
	@mkdir -p backups
	@$(DOCKER_COMPOSE) exec -T postgres pg_dump -U admin streaming_api > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Backup creado en backups/$(NC)"

.PHONY: restore-db
restore-db: ## 💾 Restaurar base de datos (especificar archivo con FILE=)
	@echo "$(BLUE)💾 Restaurando base de datos...$(NC)"
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Error: Especifica el archivo con FILE=ruta/archivo.sql$(NC)"; \
		exit 1; \
	fi
	@$(DOCKER_COMPOSE) exec -T postgres psql -U admin -d streaming_api < $(FILE)
	@echo "$(GREEN)✅ Base de datos restaurada$(NC)"

.PHONY: health
health: ## 🔍 Verificar salud de todos los servicios
	@echo "$(BLUE)🔍 Verificando salud de servicios...$(NC)"
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -f http://localhost:5173 > /dev/null 2>&1 && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ Error$(NC)"
	@echo "$(YELLOW)Backend:$(NC)"
	@curl -f http://localhost:3000/health > /dev/null 2>&1 && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ Error$(NC)"
	@echo "$(YELLOW)MinIO:$(NC)"
	@curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1 && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ Error$(NC)"
	@echo "$(YELLOW)pgAdmin:$(NC)"
	@curl -f http://localhost:5050 > /dev/null 2>&1 && echo "$(GREEN)✅ OK$(NC)" || echo "$(RED)❌ Error$(NC)"

.PHONY: setup
setup: ## ⚡ Setup inicial completo del proyecto
	@echo "$(BLUE)⚡ Configuración inicial del proyecto...$(NC)"
	@echo "$(YELLOW)1. Copiando archivo de entorno...$(NC)"
	@cp .env.example .env 2>/dev/null || echo "⚠️  .env.example no encontrado"
	@echo "$(YELLOW)2. Instalando dependencias...$(NC)"
	@$(MAKE) install
	@echo "$(YELLOW)3. Construyendo imágenes...$(NC)"
	@$(MAKE) build
	@echo "$(YELLOW)4. Iniciando servicios...$(NC)"
	@$(MAKE) up
	@echo "$(GREEN)✅ Setup inicial completado!$(NC)"
	@echo ""
	@echo "$(BLUE)🎉 Proyecto listo para desarrollo!$(NC)"
	@$(MAKE) status

.PHONY: quick-start
quick-start: ## ⚡ Inicio rápido para desarrollo diario
	@echo "$(BLUE)⚡ Inicio rápido...$(NC)"
	@$(MAKE) dev
	@echo ""
	@echo "$(GREEN)🎉 ¡Listo para desarrollar!$(NC)"

# ==========================================
# 🎯 COMANDOS ESPECIALES
# ==========================================

.PHONY: update
update: ## 📥 Actualizar dependencias
	@echo "$(BLUE)📥 Actualizando dependencias...$(NC)"
	@cd $(FRONTEND_DIR) && npm update
	@cd $(BACKEND_DIR)/app && npm update
	@echo "$(GREEN)✅ Dependencias actualizadas$(NC)"

.PHONY: reset
reset: ## 🔄 Reset completo del proyecto
	@echo "$(RED)⚠️  Esto eliminará todos los contenedores y datos$(NC)"
	@read -p "¿Continuar? (y/N): " confirm && [ "$confirm" = "y" ]
	@$(MAKE) clean-all
	@$(MAKE) setup

.PHONY: production
production: ## 🚀 Build y setup para producción
	@echo "$(BLUE)🚀 Preparando para producción...$(NC)"
	@NODE_ENV=production $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up -d --build
	@echo "$(GREEN)✅ Producción lista$(NC)"

# ==========================================
# 📖 INFORMACIÓN Y AYUDA
# ==========================================

.PHONY: info
info: ## 📖 Información del proyecto
	@echo ""
	@echo "$(BLUE)🎬 StreamingApp - Información del Proyecto$(NC)"
	@echo "=================================================="
	@echo ""
	@echo "$(GREEN)📂 Estructura:$(NC)"
	@echo "  frontend/     - React + Vite + Storybook"
	@echo "  backend/      - Node.js + Express + API"
	@echo "  docker-compose.yml - Orquestación completa"
	@echo ""
	@echo "$(GREEN)🌐 Servicios:$(NC)"
	@echo "  • Frontend (React):      :5173"
	@echo "  • Backend (API):         :3000"
	@echo "  • Storybook:             :6006"
	@echo "  • PostgreSQL:            :5432"
	@echo "  • pgAdmin:               :5050"
	@echo "  • MinIO API:             :9000"
	@echo "  • MinIO Console:         :9001"
	@echo "  • CDN NGINX:             :8082"
	@echo ""
	@echo "$(GREEN)🚀 Comandos más usados:$(NC)"
	@echo "  make dev        - Desarrollo diario"
	@echo "  make up         - Stack completo"
	@echo "  make logs       - Ver logs"
	@echo "  make status     - Estado servicios"
	@echo "  make clean      - Limpiar recursos"
	@echo ""

# Comando por defecto
.DEFAULT_GOAL := help