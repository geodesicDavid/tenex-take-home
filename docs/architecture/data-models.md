# Data Models

## User

**Purpose:** Represents the authenticated user.

**Key Attributes:**

- `id`: `string` - The user's unique Google ID.
- `email`: `string` - The user's email address.
- `name`: `string` - The user's full name.
- `picture`: `string` - URL to the user's profile picture.

**TypeScript Interface:**

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}
```

**Relationships:**

- A User has many CalendarEvents.

## CalendarEvent

**Purpose:** Represents a single event from the user's Google Calendar.

**Key Attributes:**

- `id`: `string` - The unique ID of the event.
- `summary`: `string` - The title of the event.
- `start`: `Date` - The start date and time of the event.
- `end`: `Date` - The end date and time of the event.
- `description`: `string | null` - The description of the event.

**TypeScript Interface:**

```typescript
interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  description: string | null;
}
```

**Relationships:**

- Belongs to a User.

## ChatMessage

**Purpose:** Represents a single message in the chat interface.

**Key Attributes:**

- `id`: `string` - A unique ID for the message.
- `text`: `string` - The content of the message.
- `sender`: `'user' | 'agent'` - Who sent the message.
- `timestamp`: `Date` - When the message was sent.

**TypeScript Interface:**

```typescript
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}
```

**Relationships:**

- None.
