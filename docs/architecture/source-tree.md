# Source Tree

## Project Overview

This is a monorepo project using Turbo for build orchestration and NPM workspaces for package management. The project consists of a Python FastAPI backend, a React frontend, and shared TypeScript types.

## Root Level Structure

```
tenex-take-home/
├── apps/              # Application workspaces
├── packages/          # Shared packages workspaces
├── docs/              # Documentation
├── .bmad-core/        # Development agent framework
├── .claude/           # Claude IDE configuration
├── .conductor/        # Build conductor configuration
├── .gemini/           # Gemini AI configuration
├── .qwen/             # Qwen AI configuration
├── .turbo/            # Turbo build cache
├── .git/              # Git repository
├── .ignore/           # Ignored documentation files
├── node_modules/      # Root dependencies
├── worktrees/         # Git worktrees
├── package.json       # Root workspace configuration
├── package-lock.json  # Root dependency lock file
├── turbo.json         # Turbo build configuration
└── build.sh           # Build script
```

## Applications (apps/)

### apps/api/ - FastAPI Backend
```
apps/api/
├── app/
│   ├── __init__.py
│   ├── main.py         # FastAPI application entry point
│   ├── api/            # API routes
│   │   └── __init__.py
│   └── core/           # Core application logic
│       └── __init__.py
├── tests/
│   └── test_main.py    # Backend tests
├── package.json       # Node.js dependencies for build tools
├── requirements.txt   # Python dependencies
└── pyproject.toml     # Python project configuration
```

### apps/web/ - React Frontend
```
apps/web/
├── src/
│   ├── App.tsx         # Main React application component
│   ├── main.tsx        # Application entry point
│   ├── services/       # API service layer
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React contexts
│   └── utils/          # Utility functions
├── public/             # Static assets
├── package.json        # Frontend dependencies
├── vite.config.ts      # Vite build configuration
└── tsconfig.json       # TypeScript configuration
```

## Shared Packages (packages/)

### packages/shared/ - Shared TypeScript Types
```
packages/shared/
├── src/
│   ├── types.ts        # Shared TypeScript types
│   ├── constants.ts    # Shared constants
│   └── utils.ts        # Shared utilities
├── dist/               # Compiled output
│   ├── index.d.ts      # Type definitions
│   └── types.d.ts      # Exported types
├── package.json        # Package configuration
└── tsconfig.json       # TypeScript configuration
```

## Documentation (docs/)

### docs/architecture/ - Architecture Documentation
```
docs/architecture/
├── architecture.md          # Main architecture document
├── architecture-v4.md       # Architecture v4 specification
├── coding-standards.md      # Coding standards and conventions
├── tech-stack.md           # Technology stack overview
├── source-tree.md          # This file - directory structure
└── source-tree-v4.md       # Source tree v4 specification
```

### docs/prd/ - Product Requirements
```
docs/prd/
├── prd.md                  # Main product requirements document
├── prd-v4.md               # PRD v4 specification
└── epic-*                 # Epic documentation files
```

### docs/stories/ - User Stories
```
docs/stories/
├── 1.1.project-initialization-monorepo-setup.story.md
├── 1.2.backend-google-oauth-flow.story.md
├── 1.3.frontend-login-interface.story.md
├── 2.1.backend-calendar-api-endpoint.story.md
├── 2.2.frontend-main-application-layout.story.md
├── 2.3.frontend-calendar-display.story.md
├── 2.4.frontend-chat-interface-backend-hook.story.md
├── 3.1.backend-llm-integration.story.md
├── 3.2.frontend-chat-response-handling.story.md
└── 3.3.application-deployment.story.md
```

## Development Framework (.bmad-core/)

```
.bmad-core/
├── agents/                # Agent definitions
├── agent-teams/           # Agent team configurations
├── checklists/            # Development checklists
├── data/                  # Shared data
├── tasks/                 # Executable tasks
├── templates/             # Document templates
├── utils/                 # Utility functions
├── workflows/             # Development workflows
├── core-config.yaml       # Core configuration
├── enhanced-ide-development-workflow.md
├── user-guide.md
└── working-in-the-brownfield.md
```

## Key Configuration Files

### Root Configuration
- **package.json** - NPM workspace configuration and scripts
- **turbo.json** - Turbo build system configuration
- **build.sh** - Main build script

### Application Configuration
- **apps/api/pyproject.toml** - Python project configuration
- **apps/api/requirements.txt** - Python dependencies
- **apps/web/vite.config.ts** - Frontend build configuration
- **apps/web/tsconfig.json** - Frontend TypeScript configuration

### Shared Package Configuration
- **packages/shared/tsconfig.json** - Shared package TypeScript configuration

## Build System

The project uses Turbo for build orchestration with the following tasks:
- **build** - Build all applications and packages
- **dev** - Start development servers
- **lint** - Run linting across all packages
- **test** - Run tests across all packages
- **clean** - Clean build artifacts

## Development Workflow

1. **Development**: Use `npm run dev` to start development servers
2. **Building**: Use `npm run build` to build all applications
3. **Testing**: Use `npm test` to run tests
4. **Linting**: Use `npm run lint` to run linting

## File Organization Principles

- **Monorepo Structure**: All code lives in a single repository
- **Workspace Separation**: Applications and shared packages are separate workspaces
- **Type Sharing**: Shared types are defined in `packages/shared`
- **Documentation**: Comprehensive documentation in `docs/` directory
- **Configuration**: Build and development configuration at appropriate levels