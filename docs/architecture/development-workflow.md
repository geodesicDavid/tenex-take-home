# Development Workflow

## Local Development Setup

### Prerequisites

```bash
# Install Node.js and npm
# Install Python 3.11+ and pip
# Install Turborepo
npm install -g turbo
```

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd cal-agent

# Install dependencies
npm install
```

### Development Commands

```bash
# Start all services (frontend and backend)
turbo dev

# Start frontend only
turbo dev --filter=web

# Start backend only
turbo dev --filter=api

# Run tests
turbo test
```

## Environment Configuration

### Required Environment Variables

```bash
# Frontend (.env in apps/web)
VITE_API_BASE_URL=http://localhost:8000

# Backend (.env in apps/api)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
GEMINI_API_KEY=your-gemini-api-key
SECRET_KEY=a-very-secret-key
```
