# Tenex Full-Stack Monorepo Makefile
# Cross-platform development commands

.PHONY: help install dev build test clean lint format docker-up docker-down docker-logs docker-build docker-dev

# Default target
help:
	@echo "Tenex Full-Stack Monorepo Development Commands"
	@echo "=============================================="
	@echo ""
	@echo "Setup Commands:"
	@echo "  install     - Install dependencies and set up environment"
	@echo "  env-setup   - Generate environment files from templates"
	@echo ""
	@echo "Development Commands:"
	@echo "  dev         - Start all development servers"
	@echo "  dev-web     - Start frontend development server only"
	@echo "  dev-api     - Start backend development server only"
	@echo "  dev-shared  - Start shared package compiler only"
	@echo ""
	@echo "Build Commands:"
	@echo "  build       - Build all packages"
	@echo "  build-web   - Build frontend only"
	@echo "  build-api   - Build backend only"
	@echo "  build-shared - Build shared package only"
	@echo ""
	@echo "Testing Commands:"
	@echo "  test        - Run all tests"
	@echo "  test-web    - Run frontend tests"
	@echo "  test-api    - Run backend tests"
	@echo ""
	@echo "Quality Commands:"
	@echo "  lint        - Run linting on all packages"
	@echo "  lint-web    - Lint frontend only"
	@echo "  lint-api    - Lint backend only"
	@echo "  format      - Format code using Prettier"
	@echo ""
	@echo "Docker Commands:"
	@echo "  docker-up   - Start Docker development environment"
	@echo "  docker-down - Stop Docker development environment"
	@echo "  docker-logs - View Docker logs"
	@echo "  docker-build - Build Docker images"
	@echo "  docker-dev  - Start Docker development with hot reload"
	@echo ""
	@echo "Cleanup Commands:"
	@echo "  clean       - Clean all build artifacts"
	@echo "  clean-docker - Clean Docker resources"

# Setup commands
install:
	@echo "🚀 Starting installation..."
	@./install.sh

env-setup:
	@echo "📝 Setting up environment files..."
	@if [ ! -f apps/web/.env ]; then cp apps/web/.env.example apps/web/.env && echo "✅ Created apps/web/.env"; else echo "ℹ️  apps/web/.env already exists"; fi
	@if [ ! -f apps/api/.env ]; then cp apps/api/.env.example apps/api/.env && echo "✅ Created apps/api/.env"; else echo "ℹ️  apps/api/.env already exists"; fi
	@echo "⚠️  Please edit environment files with your actual credentials"

# Development commands
dev:
	@echo "🚀 Starting all development servers..."
	@./dev-direct.sh

dev-web:
	@echo "🌐 Starting frontend development server..."
	@cd apps/web && npm run dev

dev-api:
	@echo "🔧 Starting backend development server..."
	@cd apps/api && if [ -d "venv" ]; then source venv/bin/activate && PYTHONPATH=. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000; else echo "❌ Python virtual environment not found. Run 'make install' first."; fi

dev-shared:
	@echo "📦 Starting shared package compiler..."
	@cd packages/shared && npm run dev

# Build commands
build:
	@echo "🔨 Building all packages..."
	@if [ -f build-fixed.sh ]; then ./build-fixed.sh; else npm run build; fi

build-web:
	@echo "🌐 Building frontend..."
	@cd apps/web && npm run build

build-api:
	@echo "🔧 Building backend..."
	@cd apps/api && npm run build

build-shared:
	@echo "📦 Building shared package..."
	@cd packages/shared && npm run build

# Testing commands
test:
	@echo "🧪 Running all tests..."
	@./test-direct.sh

test-web:
	@echo "🧪 Running frontend tests..."
	@cd apps/web && npm test

test-api:
	@echo "🧪 Running backend tests..."
	@cd apps/api && if [ -d "venv" ]; then source venv/bin/activate && PYTHONPATH=. pytest; else echo "❌ Python virtual environment not found. Run 'make install' first."; fi

# Quality commands
lint:
	@echo "🔍 Running linting on all packages..."
	@npm run lint

lint-web:
	@echo "🔍 Linting frontend..."
	@cd apps/web && npm run lint

lint-api:
	@echo "🔍 Linting backend..."
	@cd apps/api && if [ -d "venv" ]; then source venv/bin/activate && python -m ruff check app/; else echo "❌ Python virtual environment not found. Run 'make install' first."; fi

format:
	@echo "✨ Formatting code..."
	@npm run format

# Docker commands
docker-up:
	@echo "🐳 Starting Docker development environment..."
	@docker-compose up --build -d
	@echo "✅ Services started:"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend: http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"

docker-down:
	@echo "🛑 Stopping Docker development environment..."
	@docker-compose down

docker-logs:
	@echo "📋 Viewing Docker logs..."
	@docker-compose logs -f

docker-build:
	@echo "🔨 Building Docker images..."
	@docker-compose build

docker-dev:
	@echo "🚀 Starting Docker development with hot reload..."
	@docker-compose -f docker-compose.dev.yml up --build

# Cleanup commands
clean:
	@echo "🧹 Cleaning all build artifacts..."
	@npm run clean

clean-docker:
	@echo "🧹 Cleaning Docker resources..."
	@docker-compose down -v --remove-orphans
	@docker system prune -f

# Quick start command (install + dev)
start: install
	@echo "🚀 Quick start complete! Starting development servers..."
	@make dev