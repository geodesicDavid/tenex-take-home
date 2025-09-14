# Tenex Take Home - Calendar AI Assistant

A full-stack web application that combines Google Calendar integration with AI-powered chat assistance using Google's Gemini API.

## Overview

This application provides a seamless experience where users can:
- Authenticate with Google OAuth 2.0
- View their Google Calendar events
- Chat with an AI assistant that has access to their calendar context
- Get intelligent responses about schedules, events, and time management

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI) 5
- **State Management:** React Context
- **Testing:** Jest & React Testing Library
- **Styling:** Emotion (MUI's default styling solution)

### Backend
- **Framework:** FastAPI with Python 3.11+
- **Authentication:** Google OAuth 2.0
- **AI Integration:** Google Gemini API
- **Testing:** Pytest
- **Linting:** Ruff

### Development Tools
- **Monorepo Management:** Turborepo
- **Package Manager:** npm
- **Type Sharing:** Shared TypeScript package

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **Python 3.11+** - [Download Python](https://www.python.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **npm** (comes with Node.js)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tenex-take-home
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install shared package dependencies
cd packages/shared
npm install
cd ../..

# Install frontend dependencies
cd apps/web
npm install
cd ../..

# Setup Python virtual environment and install backend dependencies
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 3. Environment Configuration

Create environment configuration files for both frontend and backend:

#### Frontend Environment (apps/web/.env)
```bash
# Create from example
cp apps/web/.env.example apps/web/.env

# Edit the .env file with your values
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APP_URL=http://localhost:3000
```

#### Backend Environment (apps/api/.env)
```bash
# Create from example
cp apps/api/.env.example apps/api/.env

# Edit the .env file with your values
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:3000
SECRET_KEY=a-very-secret-key-for-local-dev
# (SECRET_KEY is generated with openssl rand -hex 32)
```

### 4. Google Cloud Setup

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs:**
   - Google Calendar API
   - Google OAuth 2.0 API

3. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/api/auth/google/callback` (local development)
     - `https://your-production-domain.com/api/auth/google/callback` (production)

4. **Get Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

## Development Commands

### Starting Development Servers

```bash
# Start individual services
cd apps/web && npm run dev          # Frontend only (localhost:3000)
cd apps/api && npm run dev          # Backend only (localhost:8000)
cd packages/shared && npm run build # Build shared types
```

### Building

```bash

# Build individual components
cd apps/web && npm run build        # Build frontend
cd packages/shared && npm run build # Build shared types
```

### Testing

```bash

# Run specific test suites
cd apps/web && npm run test         # Frontend tests
cd apps/api && npm run test         # Backend tests
```

### Linting

```bash

# Lint specific components
cd apps/web && npm run lint          # Frontend linting
cd apps/api && npm run lint          # Backend linting
```

### Cleaning

```bash

# Clean specific components
cd apps/web && npm run clean        # Clean frontend
cd apps/api && npm run clean        # Clean backend
```

## Project Structure

```
tenex-take-home/
├── apps/
│   ├── api/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── main.py      # FastAPI app entry point
│   │   │   ├── api/         # API routes
│   │   │   └── core/        # Core logic
│   │   ├── tests/           # Backend tests
│   │   └── venv/            # Python virtual environment
│   └── web/                 # React frontend
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── services/    # API services
│       │   ├── contexts/    # React contexts
│       │   └── hooks/       # Custom hooks
│       └── public/          # Static assets
├── packages/
│   └── shared/              # Shared TypeScript types
│       ├── src/             # Source files
│       └── dist/            # Built output
├── docs/                    # Documentation
├── .bmad-core/              # Development framework
└── build configuration files
```

## Local Development URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (FastAPI auto-docs)

## Testing the Application

### Manual Testing Flow

1. **Start Development Servers:**
   ```bash
   cd apps/web && npm run dev
   cd apps/api && npm run dev
   ```

2. **Open Browser:** Navigate to http://localhost:3000

3. **Complete OAuth Flow:**
   - Click "Login with Google"
   - Authenticate with your Google account
   - Grant calendar permissions

4. **Test Calendar Integration:**
   - View your calendar events
   - Verify events are loading correctly

5. **Test AI Chat:**
   - Send a message about your schedule
   - Verify AI responses include calendar context

### Automated Testing

```bash
# Run tests with coverage
cd apps/web && npm run test -- --coverage
cd apps/api && npm run test -- --cov=app
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Find process using port 8000
lsof -ti:8000 | xargs kill -9
```

**2. Python Virtual Environment Issues**
```bash
# Recreate virtual environment
cd apps/api
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**3. npm Installation Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

**4. TypeScript Compilation Errors**
```bash
# Clean and rebuild shared types
cd packages/shared
npm run clean
npm run build
```

**5. Google OAuth Issues**
- Ensure redirect URIs match exactly in Google Cloud Console
- Verify OAuth consent screen is configured
- Check that Google Calendar API is enabled

**6. CORS Issues**
- Verify `FRONTEND_URL` in backend .env matches your frontend URL
- Ensure backend CORS settings include your frontend URL

### Debug Mode

Enable debug logging by setting:
```bash
# Backend
export DEBUG=true

# Frontend (add to .env)
VITE_DEBUG=true
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `VITE_APP_URL` | Frontend application URL | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your-secret-key` |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI | `http://localhost:8000/api/auth/google/callback` |
| `GEMINI_API_KEY` | Google Gemini API key | `your-gemini-key` |
| `SECRET_KEY` | Backend secret key | `a-very-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Enable debug logging | `false` |
| `VITE_DEBUG` | Enable frontend debug logging | `false` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review existing issues in the repository
- Create a new issue with detailed description

---

**Happy coding! 🚀**