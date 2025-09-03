# API Specification

This is a REST API, and the specification is defined using the OpenAPI 3.0 standard.

```yaml
openapi: 3.0.0
info:
  title: cal agent API
  version: 1.0.0
  description: The API for the cal agent application.
servers:
  - url: /api
    description: The base path for the API.

paths:
  /auth/google:
    get:
      summary: Initiate Google OAuth flow
      responses:
        "302":
          description: Redirects to Google's OAuth consent screen.

  /auth/google/callback:
    get:
      summary: Handle Google OAuth callback
      responses:
        "302":
          description: Redirects to the frontend application after successful login.

  /auth/logout:
    post:
      summary: Log out the current user
      responses:
        "200":
          description: Successfully logged out.

  /users/me:
    get:
      summary: Get the current user
      responses:
        "200":
          description: The current user's information.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "401":
          description: Unauthorized.

  /calendar/events:
    get:
      summary: Get calendar events
      responses:
        "200":
          description: A list of calendar events.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/CalendarEvent"
        "401":
          description: Unauthorized.

  /chat:
    post:
      summary: Send a chat message
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
      responses:
        "200":
          description: The agent's response.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ChatMessage"
        "401":
          description: Unauthorized.

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        name:
          type: string
        picture:
          type: string

    CalendarEvent:
      type: object
      properties:
        id:
          type: string
        summary:
          type: string
        start:
          type: string
          format: date-time
        end:
          type: string
          format: date-time
        description:
          type: string

    ChatMessage:
      type: object
      properties:
        id:
          type: string
        text:
          type: string
        sender:
          type: string
          enum: [user, agent]
        timestamp:
          type: string
          format: date-time
```
