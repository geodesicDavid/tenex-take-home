# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `packages/shared` and import them from there.
- **API Calls:** Never make direct HTTP calls from components. Use the service layer in `apps/web/src/services`.
- **Environment Variables:** Access environment variables only through a dedicated config object, never directly via `process.env` or `os.environ`.
- **Error Handling:** All API routes must use a centralized error handler to ensure consistent error responses.

## Naming Conventions

| Element         | Frontend             | Backend    | Example                    |
| :-------------- | :------------------- | :--------- | :------------------------- |
| Components      | PascalCase           | -          | `UserProfile.tsx`          |
| Hooks           | camelCase with 'use' | -          | `useAuth.ts`               |
| API Routes      | -                    | kebab-case | `/api/user-profile`        |
| Database Tables | -                    | snake_case | `user_profiles`            |
| Functions       | camelCase            | snake_case | `getUser()` / `get_user()` |
