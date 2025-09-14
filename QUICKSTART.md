# Quick Start Guide

Get the Tenex full-stack monorepo running in minutes with Docker!

## Prerequisites

- Docker and Docker Compose installed
- Google OAuth credentials (optional, can be set up later)

## Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd tenex-take-home

# Run automated installation
./install.sh

# The script will:
# ✓ Validate Node.js and Python versions
# ✓ Install all dependencies
# ✓ Set up Python virtual environment
# ✓ Generate environment files
# ✓ Fix build scripts for cross-platform compatibility
# ✓ Run initial build
# ✓ (Optional) Set up Docker containers
```

## Option 2: Docker-Only Setup

```bash
# Clone and start with Docker
git clone <repository-url>
cd tenex-take-home

# Set up environment files
make env-setup

# Start development environment
make docker-up

# Access the application:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Option 3: Manual Setup

```bash
# Install using Makefile
make install

# Start development servers
make dev
```

## Next Steps

1. **Configure OAuth** (if using Google authentication):
   ```bash
   # Edit environment files
   nano apps/web/.env
   nano apps/api/.env
   ```

2. **Start Development**:
   ```bash
   # With hot reload
   make docker-dev
   
   # Or with traditional setup
   make dev
   ```

3. **Test the Application**:
   ```bash
   make test
   ```

## Available Commands

```bash
# Development
make dev          # Start all servers
make docker-dev   # Start with Docker hot reload
make docker-up    # Start Docker services

# Testing
make test         # Run all tests
make test-web     # Frontend tests
make test-api     # Backend tests

# Building
make build        # Build all packages
make docker-build # Build Docker images

# Utilities
make clean        # Clean build artifacts
make docker-down  # Stop Docker services
```

## Troubleshooting

If you encounter any issues:

1. **Port conflicts**: Stop existing services on ports 3000/8000
2. **Docker issues**: Run `make clean-docker` to reset Docker
3. **Environment issues**: Check `.env` files in `apps/web/` and `apps/api/`

For detailed setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).