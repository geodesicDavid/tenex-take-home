# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**

- **Platform:** Vercel
- **Build Command:** `npm run build`
- **Output Directory:** `apps/web/dist`
- **CDN/Edge:** Vercel's global CDN.

**Backend Deployment:**

- **Platform:** Vercel
- **Build Command:** N/A (Vercel automatically handles Python serverless functions)
- **Deployment Method:** Serverless Functions

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yaml
name: CI

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install Vercel CLI
        run: npm install -g vercel
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Environments

| Environment | Frontend URL                           | Backend URL                                | Purpose                |
| :---------- | :------------------------------------- | :----------------------------------------- | :--------------------- |
| Development | http://localhost:5173                  | http://localhost:8000                      | Local development      |
| Staging     | `https://cal-agent-staging.vercel.app` | `https://cal-agent-staging.vercel.app/api` | Pre-production testing |
| Production  | `https://cal-agent.vercel.app`         | `https://cal-agent.vercel.app/api`         | Live environment       |
