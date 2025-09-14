# Docker Development Setup

This guide covers the Docker-based development setup for the Tenex full-stack monorepo.

## Quick Start

### Option 1: Automated Installation (Recommended)

```bash
# Clone and setup with one command
git clone <repository-url>
cd tenex-take-home
./install.sh
```

### Option 2: Manual Setup

```bash
# Install dependencies manually
make install

# Start Docker development environment
make docker-up
```

## Docker Architecture

### Services

1. **Frontend (React/Vite)**
   - Port: 3000
   - Hot reload enabled
   - Environment variables configured

2. **Backend (FastAPI)**
   - Port: 8000
   - Auto-reload enabled
   - API documentation at `/docs`

3. **Shared Package (TypeScript)**
   - Compiled automatically
   - Watch mode for development

### Development Modes

#### Production Mode (Stable)
```bash
make docker-up
```
- Optimized builds
- No hot reload
- Suitable for testing production behavior

#### Development Mode (Hot Reload)
```bash
make docker-dev
```
- Full hot reload support
- Live code changes
- Optimized for development workflow

## Environment Configuration

### Required Environment Variables

Create these files from the provided templates:

#### Frontend (`apps/web/.env`)
```bash
# Copy from template
cp apps/web/.env.example apps/web/.env

# Required variables:
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

#### Backend (`apps/api/.env`)
```bash
# Copy from template
cp apps/api/.env.example apps/api/.env

# Required variables:
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
GEMINI_API_KEY=your-google-gemini-api-key
SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable APIs:
   - Google Calendar API
   - Google Gemini API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:8000/api/auth/google/callback` (development)
     - `https://your-domain.com/api/auth/google/callback` (production)
5. Copy Client ID and Client Secret to environment files

### Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `apps/api/.env` as `GEMINI_API_KEY`

## Development Workflow

### Day-to-Day Development

```bash
# Start development environment
make docker-dev

# View logs
make docker-logs

# Stop environment
make docker-down

# Rebuild after dependency changes
make docker-build
```

### Making Changes

1. **Frontend Changes**: Edit files in `apps/web/src/` - automatically reloads
2. **Backend Changes**: Edit files in `apps/api/app/` - automatically reloads
3. **Shared Package**: Edit files in `packages/shared/src/` - automatically rebuilds

### Testing

```bash
# Run all tests
make test

# Run specific tests
make test-web    # Frontend tests
make test-api    # Backend tests
```

### Code Quality

```bash
# Lint all code
make lint

# Format code
make format

# Clean build artifacts
make clean
```

## Production Deployment

### Building Production Images

```bash
# Build production images
make docker-build

# Tag images for production
docker tag tenex-take-home_web:latest your-registry/web:latest
docker tag tenex-take-home_api:latest your-registry/api:latest

# Push to registry
docker push your-registry/web:latest
docker push your-registry/api:latest
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  web:
    image: your-registry/web:latest
    ports:
      - "80:3000"
    environment:
      - VITE_API_BASE_URL=https://your-domain.com
      - VITE_APP_URL=https://your-domain.com
    depends_on:
      - api

  api:
    image: your-registry/api:latest
    ports:
      - "443:8000"
    environment:
      - PYTHONPATH=/app
      - FRONTEND_URL=https://your-domain.com
      - GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
    volumes:
      - ./apps/api/.env:/app/.env:ro
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   lsof -i :8000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Docker Build Failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild from scratch
   make clean-docker
   make docker-build
   ```

3. **Environment Variables Not Loading**
   - Check that `.env` files exist in correct locations
   - Verify file permissions
   - Restart Docker containers

4. **Python Virtual Environment Issues**
   ```bash
   # Recreate virtual environment
   cd apps/api
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Debug Commands

```bash
# Check container status
docker-compose ps

# View specific service logs
docker-compose logs web
docker-compose logs api

# Access container shell
docker-compose exec web sh
docker-compose exec api sh

# Check resource usage
docker stats
```

## Performance Optimization

### Development Performance

1. **Volume Mounting**: Using bind mounts for hot reload
2. **Dependency Caching**: Layered Docker builds for faster rebuilds
3. **Parallel Building**: Services build in parallel where possible

### Production Performance

1. **Multi-stage Builds**: Minimal production images
2. **Health Checks**: Automatic health monitoring
3. **Resource Limits**: Configure memory/CPU limits as needed

## Security Considerations

### Development Environment

- Environment variables are mounted read-only
- Non-root users for container processes
- Health checks for service monitoring

### Production Environment

- Use secrets management for sensitive data
- Implement proper CORS configuration
- Use HTTPS and valid SSL certificates
- Regular security updates for base images

## Contributing

When making changes to the Docker setup:

1. Test both development and production modes
2. Update documentation as needed
3. Follow the existing naming conventions
4. Include health checks for new services
5. Test environment variable handling