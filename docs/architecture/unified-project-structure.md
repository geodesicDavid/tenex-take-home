# Unified Project Structure
```plaintext
cal-agent/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       └── ci.yaml
├── apps/                       # Application packages
│   ├── web/                    # React frontend application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── App.tsx
│   │   ├── public/
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── api/                    # FastAPI backend application
│       ├── app/
│       │   ├── main.py
│       │   ├── api/
│       │   └── core/
│       └── requirements.txt
├── packages/                   # Shared packages
│   └── shared/                 # Shared types/utilities
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── docs/
│   ├── prd.md
│   ├── front-end-spec.md
│   └── architecture.md
├── .env.example                # Environment template
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── README.md
```
