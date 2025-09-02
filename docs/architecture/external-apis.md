# External APIs

## Google OAuth 2.0 API
- **Purpose:** To authenticate users and get their consent to access their Google Calendar data.
- **Documentation:** [https://developers.google.com/identity/protocols/oauth2](https://developers.google.com/identity/protocols/oauth2)
- **Base URL(s):** `https://accounts.google.com/o/oauth2/v2/auth`, `https://oauth2.googleapis.com/token`
- **Authentication:** OAuth 2.0
- **Rate Limits:** Standard Google API rate limits apply.

**Key Endpoints Used:**
- `GET https://accounts.google.com/o/oauth2/v2/auth` - To redirect the user to the consent screen.
- `POST https://oauth2.googleapis.com/token` - To exchange an authorization code for an access token and refresh token.

**Integration Notes:** The backend will securely store the refresh token in Google Cloud Secret Manager.

## Google Calendar API
- **Purpose:** To fetch calendar events for the authenticated user.
- **Documentation:** [https://developers.google.com/calendar/api/v3/reference](https://developers.google.com/calendar/api/v3/reference)
- **Base URL(s):** `https://www.googleapis.com/calendar/v3`
- **Authentication:** OAuth 2.0 with an access token obtained via the Google OAuth 2.0 API.
- **Rate Limits:** Standard Google API rate limits apply.

**Key Endpoints Used:**
- `GET /calendars/primary/events` - To get events from the user's primary calendar.

**Integration Notes:** The backend will use the stored refresh token to get a fresh access token before making calls to this API.

## Google Gemini API
- **Purpose:** To provide the AI-powered chat functionality.
- **Documentation:** [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Base URL(s):** `https://generativelanguage.googleapis.com`
- **Authentication:** API Key
- **Rate Limits:** Free tier limits apply.

**Key Endpoints Used:**
- `POST /v1beta/models/gemini-pro:generateContent` - To generate a response from the LLM.

**Integration Notes:** The backend will construct a prompt that includes the user's message and their calendar data to provide context to the LLM.
