# Epic 3: AI Agent Implementation & Deployment

**Goal:** The objective of this epic is to fully activate the "cal agent" by integrating the AI and making the application publicly available. This involves connecting the backend chat endpoint to the Google Gemini LLM, providing it with the user's calendar data as context, and streaming the response back to the user. Finally, the entire full-stack application will be deployed to a public URL, completing the MVP.

---

## Story 3.1: Backend LLM Integration

- **As a** developer,
- **I want** to integrate the backend chat service with the Google Gemini LLM,
- **so that** the agent can generate intelligent, context-aware responses based on the user's calendar.

### Acceptance Criteria

1.  The `/api/chat` endpoint is updated to make a call to the Google Gemini API.
2.  The user's incoming message and their fetched calendar data are combined into a structured, effective prompt for the LLM.
3.  The backend successfully receives the response from the LLM.
4.  The backend is configured to stream the LLM's response back to the frontend client in real-time.

## Story 3.2: Frontend Chat Response Handling

- **As a** user,
- **I want** to see the agent's response appear in the chat window in real-time,
- **so that** I can have a natural and engaging conversation with the cal agent.

### Acceptance Criteria

1.  The frontend is updated to handle the streamed response from the `/api/chat` endpoint.
2.  A loading indicator is displayed in the chat history immediately after a message is sent, indicating the agent is "thinking."
3.  The agent's response appears in the chat history as it is being generated, creating a "typing" effect.
4.  The final, complete response from the agent is clearly and correctly displayed in the chat history.

## Story 3.3a: Local Development Setup & Documentation

- **As a** developer comfortable with GitHub and command line,
- **I want** to easily set up and run the application locally from the GitHub repository,
- **so that** I can test, develop, and understand the codebase without needing production deployment.

### Acceptance Criteria

1.  A comprehensive README.md exists at the project root with clear setup instructions.
2.  Local development setup works with standard commands (npm install, turbo dev, etc.).
3.  All required environment variables are documented with examples.
4.  Both frontend and backend start successfully locally on standard ports.
5.  Complete end-to-end workflow (Login -> View Calendar -> Chat -> Get AI Response) works locally.

## Story 3.3b: Production Deployment & Public URL

- **As a** developer,
- **I want** to deploy the entire full-stack application to a public URL,
- **so that** potential employers can easily access and evaluate the live demo.

### Acceptance Criteria

1.  The frontend application is successfully deployed to a public hosting service (e.g., Vercel, Netlify).
2.  The backend application is successfully deployed to a public hosting service (e.g., Heroku, Google Cloud Run).
3.  The deployed frontend is correctly configured to communicate with the deployed backend (CORS, API URLs).
4.  All necessary environment variables and secrets (including Google OAuth credentials and Secret Manager access) are securely configured in the production environments.
5.  The complete, end-to-end user workflow (Login -> View Calendar -> Chat -> Get AI Response) is fully functional on the public URL.

---

### Epic Notes

**Story 3.3 Split Rationale:** The original Story 3.3 was split into two focused stories (3.3a and 3.3b) to provide equal weight to both local development setup and production deployment. This separation ensures comprehensive documentation and accessibility for other developers while maintaining the original public deployment goal.
