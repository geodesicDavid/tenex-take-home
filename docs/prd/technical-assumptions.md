# Technical Assumptions

## Repository Structure: Monorepo

The project will be organized as a monorepo (e.g., using Turborepo). This approach is chosen to streamline development by keeping the frontend and backend code in a single repository, which simplifies dependency management and cross-service type sharing.

## Service Architecture

The architecture will be a **Decoupled Frontend/Backend**. A React frontend client will be developed separately from a Python (FastAPI) backend service. This separation of concerns allows for independent development and deployment and clearly demonstrates skills in both frontend and backend development.

## Testing Requirements

For this project, a combination of **Unit and Integration testing** is required. Unit tests will ensure individual components function correctly, while integration tests will validate the communication between the frontend, backend, and external Google APIs. This demonstrates a commitment to quality without the overhead of full end-to-end testing for a demo project.

## Additional Technical Assumptions and Requests

*   **Frontend:** React with the Material-UI component library.
*   **Backend:** Python with the FastAPI framework.
*   **Database:** No database is required for the MVP. Calendar data will be fetched from the Google API on demand.
*   **AI/LLM:** The free tier of Google Gemini will be used for the chat agent's intelligence.
*   **Security:** OAuth refresh tokens must be stored securely on the server-side, using a dedicated service like Google Cloud Secret Manager.

---
