# Epic 1: Foundation & Core Authentication

**Goal:** The objective of this epic is to establish the foundational structure of the project and implement the critical user authentication flow. This includes setting up the monorepo, creating the initial frontend and backend applications, and successfully integrating Google OAuth 2.0. By the end of this epic, a user will be able to log in with their Google account, and the backend will have securely stored the necessary tokens for future API calls.

---

## Story 1.1: Project Initialization & Monorepo Setup

*   **As a** developer,
*   **I want** to initialize the project within a monorepo structure,
*   **so that** I can efficiently manage the frontend and backend codebases in a single repository.

### Acceptance Criteria

1.  A Git repository is created and configured.
2.  A monorepo management tool (e.g., Turborepo) is set up at the root of the project.
3.  Initial application folders for `frontend` (React/Vite) and `backend` (FastAPI) are created within the monorepo.
4.  A shared package is created within the monorepo to hold common TypeScript types that will be used by both the frontend and backend.

## Story 1.2: Backend Google OAuth 2.0 Flow

*   **As a** developer,
*   **I want** to implement the server-side Google OAuth 2.0 authentication flow,
*   **so that** the application can securely obtain permission to access a user's Google Calendar.

### Acceptance Criteria

1.  The backend provides an endpoint that initiates the OAuth flow by redirecting the user to the Google OAuth 2.0 consent screen.
2.  The backend correctly handles the callback from Google, exchanging the received authorization code for an access token and a refresh token.
3.  The refresh token is securely stored in a designated secret manager (e.g., Google Cloud Secret Manager).
4.  Upon successful authentication, a secure session (e.g., using an HTTP-only cookie) is created for the user to maintain their logged-in state.

## Story 1.3: Frontend Login Interface

*   **As a** user,
*   **I want** to see a clean login page with a "Login with Google" button,
*   **so that** I can easily and securely initiate the authentication process.

### Acceptance Criteria

1.  A login page is created in the React application that serves as the entry point for unauthenticated users.
2.  The page displays a prominent "Login with Google" button, styled using the Material-UI component library.
3.  Clicking the button directs the user to the backend's OAuth initiation endpoint.
4.  After a successful login and redirection from the backend, the user is navigated to a simple, placeholder "main application" page.

---
