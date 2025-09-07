# Project Brief: cal agent

### Executive Summary

The "cal agent" project is a technical demonstration designed to showcase modern development capabilities to potential employers. The core concept is a web-based tool that allows users to interact with their Google Calendar via a chat interface. By enabling users to analyze their time usage and receive AI-powered assistance for scheduling-related tasks, such as drafting emails to coordinate meetings, the project's primary purpose is to serve as a tangible example of integrating complex systems. The key value proposition for the target audience—potential employers—is the demonstrated expertise in building AI-powered applications, integrating with external APIs like Google Calendar, and orchestrating large language models (LLMs) to create an intelligent user experience.

### Problem Statement

For a developer on the job market, a resume and interview alone can be insufficient to effectively demonstrate practical, hands-on expertise with modern technologies. It is challenging to tangibly showcase the ability to architect and build a functional application that integrates multiple complex services, such as Google's APIs and a Large Language Model (LLM). Without a compelling, interactive project, a candidate's ability to deliver real-world results remains abstract. This tech demo directly addresses that problem by providing concrete, verifiable proof of the author's skills in full-stack development, AI integration, and API orchestration, thereby bridging the gap between stated qualifications and demonstrated capability.

### Proposed Solution

The proposed solution is a full-stack web application, the "cal agent," that serves as a live, interactive demonstration of technical skill. The application will feature a React-based web interface where a user can authenticate their Google account via OAuth 2.0.

The core architecture involves a backend service responsible for:
1.  Securely managing authentication tokens to maintain access to the user's Google Calendar.
2.  Ingesting calendar data via the Google Calendar API.
3.  Orchestrating a chat interface where user input is passed to a Large Language Model (LLM), which is grounded with the user's calendar data to provide intelligent responses.

This project succeeds as a demonstration by moving beyond theoretical skills listed on a resume. It provides a functional, end-to-end product that integrates a modern frontend, a secure backend with third-party API communication, and cutting-edge AI, showcasing a holistic and practical approach to software development.

### Target Users

#### Primary User Segment: Potential Employers

*   **Profile:** This group includes technical recruiters, hiring managers, and senior engineers or team leads involved in the hiring process.
*   **Current Behaviors & Workflows:** Their primary workflow involves reviewing a high volume of candidate profiles, scanning resumes for keywords and experience, browsing GitHub repositories, and conducting technical interviews to assess a candidate's true capabilities.
*   **Needs & Pain Points:** Their main pain point is the difficulty of accurately gauging a candidate's practical, real-world coding ability from a resume alone. They need a reliable way to quickly differentiate candidates and validate their skills in building and integrating modern, complex systems.
*   **Goals:** Their ultimate goal is to confidently identify and hire competent developers who can be productive quickly and contribute effectively to their teams. They are looking for signals of high-quality engineering and problem-solving skills.

### Goals & Success Metrics

#### Business Objectives
*   **Objective:** To secure a desirable software engineering position by effectively showcasing technical abilities. The primary business goal is to receive interview requests and job offers where this project is a positive contributing factor.

#### User Success Metrics
*   **User Success:** For the "user" (a potential employer), success is defined by their ability to quickly recognize and validate the candidate's skills.
    *   The project is mentioned positively by recruiters or hiring managers during the interview process.
    *   The project serves as a key talking point to facilitate a deep technical discussion.

#### Key Performance Indicators (KPIs)
*   **Project Completion:** The application is 100% functional, deployed to a public URL, and its source code is available in a clean, well-documented GitHub repository.
*   **Positive Feedback:** The project receives positive comments or is starred on platforms like GitHub or LinkedIn by individuals in the tech industry.

### MVP Scope

#### Core Features (Must Have)
*   **Google Authentication:** A user can securely authenticate their Google/GSuite account using the OAuth 2.0 protocol. The backend must securely store and manage refresh tokens.
*   **Calendar Data Ingestion:** The application will pull calendar event data from the user's Google Calendar via their API.
*   **Web Interface:** A clean, functional frontend built with React that displays the user's calendar data and includes a chat window.
*   **Chat Agent Orchestration:** The backend will take natural language input from the chat interface, combine it with the user's calendar data as context, and pass it to an LLM to generate relevant, helpful text-based responses.

#### Out of Scope for MVP
*   Directly creating, modifying, or deleting calendar events via the agent. The agent only reads calendar data and generates text.
*   Support for any calendar provider other than Google Calendar (e.g., Outlook, iCloud).
*   Multi-user accounts or collaborative features.
*   Advanced, long-term analytics of calendar data over time.
*   A native mobile application.

#### MVP Success Criteria
*   The project is considered a successful MVP when a user can complete the full workflow: 1) land on the web page, 2) authenticate their Google account, 3) see their calendar data displayed, and 4) use the chat to ask a question and receive an intelligent, context-aware response from the LLM. The entire application must be deployed and publicly accessible.

### Post-MVP Vision

#### Phase 2 Features
*   **Write Access:** Introduce the ability for the agent to directly create, modify, or decline calendar events on the user's behalf, with a clear confirmation step.
*   **Multi-Provider Support:** Expand beyond Google to support other major calendar platforms like Microsoft Outlook 365.
*   **Proactive Assistance:** Enable the agent to proactively send notifications or suggestions, such as identifying scheduling conflicts or recommending focus time blocks.

#### Long-term Vision
*   The long-term vision is to evolve the "cal agent" from a reactive calendar tool into a comprehensive, proactive productivity assistant. It would integrate not just calendars, but also task lists, email, and communication platforms (like Slack) to become a central hub for managing a user's time and priorities through a single, intelligent conversational interface.

#### Expansion Opportunities
*   **Team & Enterprise Version:** A version designed for teams that could analyze group schedules, suggest optimal meeting times for multiple people, and help balance workloads.
*   **Voice Interface:** Integration with voice platforms (e.g., Alexa, Google Assistant) to allow for hands-free interaction.
*   **Deeper Workflow Integration:** Connect with project management tools like Jira or Asana to automatically schedule work blocks for assigned tasks.

### Technical Considerations

#### Platform Requirements
*   **Target Platforms:** Modern desktop web browsers (e.g., Chrome, Firefox, Safari, Edge).
*   **Performance Requirements:** The UI should be fast and responsive. API interactions (calendar fetching, LLM responses) should feel quick, with appropriate loading states to manage user expectations.

#### Technology Preferences
*   **Frontend:** React, with the **Material-UI** component library.
*   **Backend:** Python with the FastAPI framework.
*   **Database:** For the MVP, no database is required. Calendar data will be fetched from the Google API on demand.
*   **AI/LLM:** The free tier of **Google Gemini 2.5 Flash**.

#### Architecture Considerations
*   **Service Architecture:** A simple decoupled architecture with a React frontend client and a separate backend service (FastAPI) to handle business logic, authentication, and API orchestration.
*   **Integration Requirements:** Must integrate with Google Calendar API (using OAuth 2.0) and the chosen LLM's API.
*   **Security:** Secure server-side storage and handling of OAuth refresh tokens is a critical security requirement. All client-server communication must be over HTTPS.

### Constraints & Assumptions

#### Constraints
*   **Budget:** This project will be developed with a minimal budget, relying on free tiers for hosting (e.g., Vercel, Heroku), and developer/free-tier access for API services (Google Cloud, OpenAI/Gemini).
*   **Timeline:** As a personal project, the timeline is flexible and dependent on the developer's personal availability.
*   **Resources:** The project will be executed by a single developer responsible for all roles: frontend, backend, UI/UX design, and deployment.

#### Key Assumptions
*   **User Account:** It is assumed that the user of the demo (the developer or an interviewer) will have a Google account with existing calendar data to test the application's functionality.
*   **API Availability:** We assume that the Google Calendar and chosen LLM APIs will be available, performant, and provide the necessary functionality and data access for the project to work.
*   **UI Simplicity:** It is assumed that a clean and professional user interface built with a component library like **Material-UI** is sufficient. The focus remains on demonstrating technical integration, with the UI framework providing a polished look without requiring extensive custom design work.
*   **Focus on Functionality:** The core value being demonstrated is the backend orchestration and successful integration of services, rather than a novel user experience.

### Risks & Open Questions

#### Key Risks
*   **Authentication Complexity:** OAuth 2.0, especially handling refresh tokens securely, can be complex to implement correctly. *(Decision: Mitigate by using a dedicated service like Google Cloud Secret Manager.)*
*   **API Limitations & Changes:** The Google Calendar API or the Gemini API could have rate limits, quirks, or breaking changes that could impact development or the functionality of the demo.
*   **LLM Performance/Quality:** The responses from the LLM might be inconsistent or not as "intelligent" as desired, which could undermine the "wow" factor of the demo.

#### Open Questions
*   What is the most effective and secure way to store and manage OAuth refresh tokens in a serverless or containerized environment? *(Decision: Use a dedicated secret manager like Google Cloud Secret Manager.)*
*   What is the best prompt engineering strategy to ensure **Google Gemini 2.5 Flash** can reliably and cost-effectively utilize the user's calendar data? *(Decision: Use a structured data format, like JSON, in the prompt.)*
*   How can the application gracefully handle potential rate limits on the free tier of the Gemini API? *(Decision: Implement an exponential backoff and retry strategy in the backend.)*

### Next Steps

#### Immediate Actions
1.  **Initialize Monorepo:** Set up the Git repository and initialize it as a monorepo using a tool like Turborepo. Create the initial application folders for `frontend` (React) and `backend` (FastAPI).
2.  **Implement Authentication Backend:** Begin by building the Google OAuth 2.0 flow within the FastAPI application. This is the first major technical hurdle.
3.  **Configure Secret Management:** Set up a Google Cloud project and enable the Secret Manager API. Write the backend logic to store and retrieve refresh tokens from it.
4.  **Build Initial Frontend:** Create the basic React application using Material-UI within the monorepo structure. Implement the "Login with Google" button.
5.  **Establish Shared Types:** Create a shared package within the monorepo to define common TypeScript types for API request/response objects, ensuring consistency between the frontend and backend.

#### PM Handoff
This Project Brief provides the full context for the "cal agent" project. The next step is to move into development, following the immediate actions listed above. This document can serve as the guiding star for the project to ensure it meets its goal as a successful technical demonstration.
