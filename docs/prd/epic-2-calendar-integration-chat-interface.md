# Epic 2: Calendar Integration & Chat Interface

**Goal:** The objective of this epic is to build the core user-facing features of the application. This involves fetching the user's calendar data from the Google Calendar API and creating the main application interface where this data is displayed alongside a functional chat window. By the end of this epic, a logged-in user will see their calendar and be able to send messages through the chat interface, which will be received by the backend.

---

## Story 2.1: Backend Calendar API Endpoint

- **As a** developer,
- **I want** to create a secure backend endpoint that retrieves calendar events using the Google Calendar API,
- **so that** the frontend has a data source to display the user's calendar.

### Acceptance Criteria

1.  A new, protected backend endpoint (e.g., `/api/calendar/events`) is created that requires an active user session.
2.  The endpoint retrieves the user's stored refresh token from the secret manager to obtain a fresh access token for the Google API.
3.  The endpoint successfully calls the Google Calendar API to fetch events for a relevant time period (e.g., the upcoming 7 days).
4.  The fetched events are returned to the client in a structured, easy-to-use JSON format.

## Story 2.2: Frontend Main Application Layout

- **As a** user,
- **I want** to see a well-structured main application screen with both a calendar view and a chat interface,
- **so that** I can easily understand and interact with the application's core features.

### Acceptance Criteria

1.  The placeholder main application page is replaced with a two-column layout using Material-UI's grid system.
2.  The left column is clearly designated for the calendar view.
3.  The right column is clearly designated for the chat interface.
4.  The layout is fully responsive, stacking the two columns vertically on smaller (mobile/tablet) screens.

## Story 2.3: Frontend Calendar Display

- **As a** user,
- **I want** to see my upcoming calendar events displayed clearly on the screen,
- **so that** I have context for my conversations with the agent.

### Acceptance Criteria

1.  Upon loading the main application screen, the frontend calls the `/api/calendar/events` endpoint.
2.  A loading indicator (e.g., a `CircularProgress` component) is displayed in the calendar view area while the data is being fetched.
3.  The fetched calendar events are rendered in the left column in a clear, readable format (e.g., a list of events with times and titles).
4.  An appropriate error message is displayed in the calendar view area if the data fails to load.

## Story 2.4: Frontend Chat Interface & Backend Hook

- **As a** user,
- **I want** a functional chat interface where I can type and send a message,
- **so that** I can begin to interact with the cal agent.

### Acceptance Criteria

1.  The chat interface in the right column contains a message history area, a `TextField` for input, and a "Send" `Button`.
2.  The user can type a message into the input field.
3.  Pressing the "Enter" key or clicking the "Send" button sends the message content to a new backend endpoint (e.g., `/api/chat`).
4.  The user's sent message immediately appears in the message history area.
5.  For this story, the backend `/api/chat` endpoint is created and can simply acknowledge receipt of the message with a hard-coded placeholder response (e.g., "I hear you.").

---
