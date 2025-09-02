# Testing Strategy

## Testing Pyramid
```text
      / \
     /   \
    / E2E \
   /_______
  /         \
 /Integration\
/_____________
/   Unit      \
/_____________
```

## Test Organization

### Frontend Tests
```
apps/web/src/
├── components/
│   └── __tests__/
│       └── MyComponent.test.tsx
└── services/
    └── __tests__/
        └── myService.test.ts
```

### Backend Tests
```
apps/api/
└── tests/
    ├── test_main.py
    └── test_api/
        └── test_my_endpoint.py
```

### E2E Tests
End-to-end tests are not in scope for the MVP of this project.

## Test Examples

### Frontend Component Test
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

test('renders my component', () => {
  render(<MyComponent />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

### Backend API Test
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}
```

### E2E Test
End-to-end tests are not in scope for the MVP of this project.
