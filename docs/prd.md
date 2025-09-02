# cal agent Product Requirements Document (PRD)

## Goals and Background Context

### Goals

*   Secure a desirable software engineering position by effectively showcasing technical abilities.
*   Receive interview requests and job offers where this project is a positive contributing factor.
*   Serve as a key talking point to facilitate deep technical discussions during interviews.
*   Demonstrate expertise in building AI-powered applications, integrating with external APIs (like Google Calendar), and orchestrating large language models (LLMs).

### Background Context

A resume and interview alone are often insufficient to effectively demonstrate practical, hands-on expertise with modern technologies. This project, the "cal agent," addresses this by serving as a tangible, interactive demonstration of the author's ability to architect and build a functional, full-stack application that integrates complex services. It is a web-based tool that allows a user to interact with their Google Calendar via a chat interface, providing concrete, verifiable proof of skills in AI integration and API orchestration, bridging the gap between a resume and real-world capability.

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-09-02 | 1.0 | Initial PRD draft | John (PM) |

---

## Requirements

### Functional

1.  **FR1:** A user can securely authenticate their Google/GSuite account using the OAuth 2.0 protocol.
2.  **FR2:** The backend must securely store and manage refresh tokens for continued access to the Google Calendar API.
3.  **FR3:** The application will pull and display calendar event data from the user's Google Calendar.
4.  **FR4:** The application will provide a clean, functional web interface built with React that includes a calendar view and a chat window.
5.  **FR5:** The backend will take natural language input from the chat interface, use the user's calendar data to provide context, and pass it to a Large Language Model (LLM) to generate relevant, helpful text-based responses.
6.  **FR6:** For the MVP, the agent will only have read-only access to calendar data; it will not create, modify, or delete calendar events.
7.  **FR7:** The MVP will exclusively support Google Calendar and will not integrate with other providers like Outlook or iCloud.
8.  **FR8:** The application is designed for single-user demonstration purposes and will not support multi-user accounts or collaborative features.

### Non-Functional

1.  **NFR1:** The project must be developed with a minimal budget, relying on free tiers for hosting (e.g., Vercel, Heroku) and API services (Google Cloud, Google Gemini).
2.  **NFR2:** The user interface must be fast and responsive, with interaction responses feeling instantaneous (<100ms).
3.  **NFR3:** All API interactions (calendar fetching, LLM responses) must feel quick, with clear loading states to manage user expectations.
4.  **NFR4:** All client-server communication must be secured over HTTPS.
5.  **NFR5:** The final application must be 100% functional and deployed to a publicly accessible URL.
6.  **NFR6:** The complete source code must be available in a clean, well-documented GitHub repository.
7.  **NFR7:** The application must meet web accessibility standards, targeting WCAG 2.1 AA compliance.
8.  **NFR8:** The application's layout must be responsive, adapting seamlessly to mobile, tablet, and desktop screen sizes.

---

## User Interface Design Goals

### Overall UX Vision

The UI should be clean, professional, and visually appealing, leveraging a well-established design system (Material-UI) to signal a high standard of quality. The design's primary focus is to spotlight the core technical demonstration: the chat interaction with the user's calendar data. To that end, the application must clearly communicate its state at all times—especially during loading, authentication, and API interactions—to manage user expectations and demonstrate robustness.

### Key Interaction Paradigms

The core interaction is a single-page application experience after login. The main screen features a two-column layout on desktop (calendar on the left, chat on the right) that stacks vertically on smaller screens. The chat interface is the primary method of user interaction.

### Core Screens and Views

*   **Login Screen:** A simple page with a single "Login with Google" call to action.
*   **Main Application Screen:** The main interface containing two primary components:
    *   **Calendar View:** A read-only display of the user's calendar.
    *   **Chat Interface:** The chat history and text input for interacting with the agent.

### Accessibility: WCAG AA

The application will adhere to **WCAG 2.1 Level AA** standards to ensure it is accessible to users with disabilities, demonstrating a commitment to high-quality, inclusive development.

### Branding

A simple and clean aesthetic will be maintained, consistent with Material-UI's design principles. The focus is on a professional, polished look rather than custom branding.

### Target Device and Platforms: Web Responsive

The application will be a responsive web app, ensuring a seamless experience across modern desktop web browsers (Chrome, Firefox, Safari, Edge) and mobile/tablet devices.

---

## Technical Assumptions

### Repository Structure: Monorepo

The project will be organized as a monorepo (e.g., using Turborepo). This approach is chosen to streamline development by keeping the frontend and backend code in a single repository, which simplifies dependency management and cross-service type sharing.

### Service Architecture

The architecture will be a **Decoupled Frontend/Backend**. A React frontend client will be developed separately from a Python (FastAPI) backend service. This separation of concerns allows for independent development and deployment and clearly demonstrates skills in both frontend and backend development.

### Testing Requirements

For this project, a combination of **Unit and Integration testing** is required. Unit tests will ensure individual components function correctly, while integration tests will validate the communication between the frontend, backend, and external Google APIs. This demonstrates a commitment to quality without the overhead of full end-to-end testing for a demo project.

### Additional Technical Assumptions and Requests

*   **Frontend:** React with the Material-UI component library.
*   **Backend:** Python with the FastAPI framework.
*   **Database:** No database is required for the MVP. Calendar data will be fetched from the Google API on demand.
*   **AI/LLM:** The free tier of Google Gemini will be used for the chat agent's intelligence.
*   **Security:** OAuth refresh tokens must be stored securely on the server-side, using a dedicated service like Google Cloud Secret Manager.

---

## Epic List

1.  **Epic 1: Foundation & Core Authentication:** Establish the project's monorepo structure, set up the initial frontend and backend services, and implement the complete Google OAuth 2.0 authentication flow.
2.  **Epic 2: Calendar Integration & Chat Interface:** Develop the functionality to fetch calendar data from the Google Calendar API and build the core frontend components for displaying the calendar and interacting with the chat.
3.  **Epic 3: AI Agent Implementation & Deployment:** Integrate the backend with the Google Gemini LLM to provide intelligent, context-aware responses in the chat and deploy the full application to a publicly accessible URL.

---

## Epic 1: Foundation & Core Authentication

**Goal:** The objective of this epic is to establish the foundational structure of the project and implement the critical user authentication flow. This includes setting up the monorepo, creating the initial frontend and backend applications, and successfully integrating Google OAuth 2.0. By the end of this epic, a user will be able to log in with their Google account, and the backend will have securely stored the necessary tokens for future API calls.

---

### Story 1.1: Project Initialization & Monorepo Setup

*   **As a** developer,
*   **I want** to initialize the project within a monorepo structure,
*   **so that** I can efficiently manage the frontend and backend codebases in a single repository.

#### Acceptance Criteria

1.  A Git repository is created and configured.
2.  A monorepo management tool (e.g., Turborepo) is set up at the root of the project.
3.  Initial application folders for `frontend` (React/Vite) and `backend` (FastAPI) are created within the monorepo.
4.  A shared package is created within the monorepo to hold common TypeScript types that will be used by both the frontend and backend.

### Story 1.2: Backend Google OAuth 2.0 Flow

*   **As a** developer,
*   **I want** to implement the server-side Google OAuth 2.0 authentication flow,
*   **so that** the application can securely obtain permission to access a user's Google Calendar.

#### Acceptance Criteria

1.  The backend provides an endpoint that initiates the OAuth flow by redirecting the user to the Google OAuth 2.0 consent screen.
2.  The backend correctly handles the callback from Google, exchanging the received authorization code for an access token and a refresh token.
3.  The refresh token is securely stored in a designated secret manager (e.g., Google Cloud Secret Manager).
4.  Upon successful authentication, a secure session (e.g., using an HTTP-only cookie) is created for the user to maintain their logged-in state.

### Story 1.3: Frontend Login Interface

*   **As a** user,
*   **I want** to see a clean login page with a "Login with Google" button,
*   **so that** I can easily and securely initiate the authentication process.

#### Acceptance Criteria

1.  A login page is created in the React application that serves as the entry point for unauthenticated users.
2.  The page displays a prominent "Login with Google" button, styled using the Material-UI component library.
3.  Clicking the button directs the user to the backend's OAuth initiation endpoint.
4.  After a successful login and redirection from the backend, the user is navigated to a simple, placeholder "main application" page.

---

## Epic 2: Calendar Integration & Chat Interface

**Goal:** The objective of this epic is to build the core user-facing features of the application. This involves fetching the user's calendar data from the Google Calendar API and creating the main application interface where this data is displayed alongside a functional chat window. By the end of this epic, a logged-in user will see their calendar and be able to send messages through the chat interface, which will be received by the backend.

---

### Story 2.1: Backend Calendar API Endpoint

*   **As a** developer,
*   **I want** to create a secure backend endpoint that retrieves calendar events using the Google Calendar API,
*   **so that** the frontend has a data source to display the user's calendar.

#### Acceptance Criteria

1.  A new, protected backend endpoint (e.g., `/api/calendar/events`) is created that requires an active user session.
2.  The endpoint retrieves the user's stored refresh token from the secret manager to obtain a fresh access token for the Google API.
3.  The endpoint successfully calls the Google Calendar API to fetch events for a relevant time period (e.g., the upcoming 7 days).
4.  The fetched events are returned to the client in a structured, easy-to-use JSON format.

### Story 2.2: Frontend Main Application Layout

*   **As a** user,
*   **I want** to see a well-structured main application screen with both a calendar view and a chat interface,
*   **so that** I can easily understand and interact with the application's core features.

#### Acceptance Criteria

1.  The placeholder main application page is replaced with a two-column layout using Material-UI's grid system.
2.  The left column is clearly designated for the calendar view.
3.  The right column is clearly designated for the chat interface.
4.  The layout is fully responsive, stacking the two columns vertically on smaller (mobile/tablet) screens.

### Story 2.3: Frontend Calendar Display

*   **As a** user,
*   **I want** to see my upcoming calendar events displayed clearly on the screen,
*   **so that** I have context for my conversations with the agent.

#### Acceptance Criteria

1.  Upon loading the main application screen, the frontend calls the `/api/calendar/events` endpoint.
2.  A loading indicator (e.g., a `CircularProgress` component) is displayed in the calendar view area while the data is being fetched.
3.  The fetched calendar events are rendered in the left column in a clear, readable format (e.g., a list of events with times and titles).
4.  An appropriate error message is displayed in the calendar view area if the data fails to load.

### Story 2.4: Frontend Chat Interface & Backend Hook

*   **As a** user,
*   **I want** a functional chat interface where I can type and send a message,
*   **so that** I can begin to interact with the cal agent.

#### Acceptance Criteria

1.  The chat interface in the right column contains a message history area, a `TextField` for input, and a "Send" `Button`.
2.  The user can type a message into the input field.
3.  Pressing the "Enter" key or clicking the "Send" button sends the message content to a new backend endpoint (e.g., `/api/chat`).
4.  The user's sent message immediately appears in the message history area.
5.  For this story, the backend `/api/chat` endpoint is created and can simply acknowledge receipt of the message with a hard-coded placeholder response (e.g., "I hear you.").

---

## Epic 3: AI Agent Implementation & Deployment

**Goal:** The objective of this epic is to fully activate the "cal agent" by integrating the AI and making the application publicly available. This involves connecting the backend chat endpoint to the Google Gemini LLM, providing it with the user's calendar data as context, and streaming the response back to the user. Finally, the entire full-stack application will be deployed to a public URL, completing the MVP.

---

### Story 3.1: Backend LLM Integration

*   **As a** developer,
*   **I want** to integrate the backend chat service with the Google Gemini LLM,
*   **so that** the agent can generate intelligent, context-aware responses based on the user's calendar.

#### Acceptance Criteria

1.  The `/api/chat` endpoint is updated to make a call to the Google Gemini API.
2.  The user's incoming message and their fetched calendar data are combined into a structured, effective prompt for the LLM.
3.  The backend successfully receives the response from the LLM.
4.  The backend is configured to stream the LLM's response back to the frontend client in real-time.

### Story 3.2: Frontend Chat Response Handling

*   **As a** user,
*   **I want** to see the agent's response appear in the chat window in real-time,
*   **so that** I can have a natural and engaging conversation with the cal agent.

#### Acceptance Criteria

1.  The frontend is updated to handle the streamed response from the `/api/chat` endpoint.
2.  A loading indicator is displayed in the chat history immediately after a message is sent, indicating the agent is "thinking."
3.  The agent's response appears in the chat history as it is being generated, creating a "typing" effect.
4.  The final, complete response from the agent is clearly and correctly displayed in the chat history.

### Story 3.3: Application Deployment

*   **As a** developer,
*   **I want** to deploy the entire full-stack application to a public URL,
*   **so that** potential employers can easily access and evaluate the live demo.

#### Acceptance Criteria

1.  The frontend application is successfully deployed to a public hosting service (e.g., Vercel, Netlify).
2.  The backend application is successfully deployed to a public hosting service (e.g., Heroku, Google Cloud Run).
3.  The deployed frontend is correctly configured to communicate with the deployed backend (CORS, API URLs).
4.  All necessary environment variables and secrets (including Google OAuth credentials and Secret Manager access) are securely configured in the production environments.
5.  The complete, end-to-end user workflow (Login -> View Calendar -> Chat -> Get AI Response) is fully functional on the public URL.

---

## Checklist Results Report

### Executive Summary

*   **Overall PRD Completeness:** 95%
*   **MVP Scope Appropriateness:** Just Right
*   **Readiness for Architecture Phase:** Ready
*   **Most Critical Gaps or Concerns:** The PRD is very strong. The only minor gap is the lack of explicit definition around data handling (retention, privacy), which is low-risk for an MVP of this nature but should be noted.

### Category Analysis Table

| Category | Status | Critical Issues |
| :--- | :--- | :--- |
| 1. Problem Definition & Context | PASS | None |
| 2. MVP Scope Definition | PASS | None |
| 3. User Experience Requirements | PASS | None |
| 4. Functional Requirements | PASS | None |
| 5. Non-Functional Requirements | PASS | None |
| 6. Epic & Story Structure | PASS | None |
| 7. Technical Guidance | PASS | None |
| 8. Cross-Functional Requirements | PARTIAL | Data retention and privacy policies are not explicitly defined. |
| 9. Clarity & Communication | PASS | None |

### Top Issues by Priority

*   **LOW:** **Data Policy Definition:** The PRD does not explicitly state the data retention policy (e.g., "user data is ephemeral and not stored long-term") or a formal privacy policy. For a demo project, this is not a blocker, but in a production scenario, it would be a high-priority item.

### MVP Scope Assessment

The MVP scope is well-defined and appropriate. It focuses on the core value proposition—demonstrating technical skill through a functional AI agent—while correctly deferring non-essential features like write access, multi-provider support, and advanced analytics. The breakdown into three epics is logical and provides a clear, achievable path to completion.

### Technical Readiness

The PRD provides clear technical constraints and guidance. The technology stack is defined, the architecture is straightforward, and key risks (like OAuth security) have been identified with mitigation strategies. The document gives a clear mandate to the Architect.

### Recommendations

No major revisions are required. I recommend adding a small section under "Non-Functional Requirements" to explicitly state:

*   "**NFR9: Data Privacy & Retention:** All user calendar data is handled ephemerally for the duration of the session and is not stored or logged long-term. The application will not use user data for any purpose other than providing the core chat functionality."

This small addition would move the "Cross-Functional Requirements" category to a PASS.

### Final Decision

**READY FOR ARCHITECT:** The PRD and epics are comprehensive, properly structured, and ready for the architectural design phase.

---

## Next Steps

This PRD is now considered complete and ready for the next phase of the project.

### UX Expert Prompt

"Sally, please review the `docs/prd.md` and create a `front-end-spec.md` that translates the product vision into a detailed specification for the user interface, covering user flows, wireframes, and a component-based design system approach using Material-UI."

### Architect Prompt

"Winston, please review the `docs/prd.md` and create a `fullstack-architecture.md` document. Your architecture should detail the frontend and backend service design, data flows, API contracts, and the plan for secure integration with Google's OAuth and Gemini APIs, based on the requirements and technical assumptions outlined in the PRD."
