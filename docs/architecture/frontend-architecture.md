# Frontend Architecture

## Component Architecture

### Component Organization

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   └── Loading.tsx
│   ├── auth/
│   │   └── Login.tsx
│   ├── calendar/
│   │   └── CalendarView.tsx
│   └── chat/
│       └── ChatWindow.tsx
└── pages/
    ├── LoginPage.tsx
    └── MainPage.tsx
```

### Component Template

```typescript
import React from 'react';

interface MyComponentProps {
  // component props
}

const MyComponent: React.FC<MyComponentProps> = (props) => {
  // component logic
  return (
    <div>
      {/* component JSX */}
    </div>
  );
};

export default MyComponent;
```

## State Management Architecture

### State Structure

```typescript
interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  calendarEvents: CalendarEvent[];
  chatMessages: ChatMessage[];
}
```

### State Management Patterns

- **React Context:** A single, global context will be used to store the application state.
- **Reducer Hook:** A `useReducer` hook will be used to manage state transitions in a predictable way.

## Routing Architecture

### Route Organization

- `/login`: The login page, accessible to unauthenticated users.
- `/`: The main application page, accessible only to authenticated users.

### Protected Route Pattern

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from './AppContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppContext();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

## Frontend Services Layer

### API Client Setup

```typescript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // to send cookies
});

export default apiClient;
```

### Service Example

```typescript
import apiClient from "./apiClient";

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const response = await apiClient.get("/calendar/events");
  return response.data;
};
```
