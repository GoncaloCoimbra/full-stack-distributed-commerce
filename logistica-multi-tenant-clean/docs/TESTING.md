# Jest Testing Guide

This project uses Jest for unit and integration testing.

## Setup

### Backend Testing

```bash
cd backend-nest

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests matching pattern
npm run test -- user.service

# Run E2E tests
npm run test:e2e
```

### Frontend Testing

```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests matching pattern
npm run test -- TrackingMap
```

---

## Test Structure

### Backend Tests

Tests are located in `**/__tests__/*.spec.ts` directories:

```
backend-nest/
├── src/
│   ├── services/
│   │   └── __tests__/
│   │       └── user.service.spec.ts
│   ├── modules/
│   │   ├── transports/
│   │   │   └── __tests__/
│   │   │       └── transports.service.spec.ts
│   │   └── auth/
│   │       └── __tests__/
│   │           └── auth.service.spec.ts
```

### Frontend Tests

Tests are located in `**/__tests__/*.test.tsx` files:

```
frontend/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       └── TrackingMap.test.tsx
│   ├── pages/
│   │   └── __tests__/
│   │       └── TransportList.test.tsx
│   └── hooks/
│       └── __tests__/
│           └── useTransport.test.ts
```

---

## Writing Tests

### Unit Test Template (Backend)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com' };

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
    });
  });
});
```

### Component Test Template (Frontend)

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render component', () => {
    // Arrange & Act
    render(<MyComponent />);

    // Assert
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    // Arrange
    render(<MyComponent />);
    const button = screen.getByRole('button');

    // Act
    fireEvent.click(button);

    // Assert
    expect(screen.getByText(/updated text/i)).toBeInTheDocument();
  });
});
```

---

## Coverage Requirements

**Minimum Coverage Thresholds**:
- Lines: 70%
- Statements: 70%
- Functions: 70%
- Branches: 65%

### View Coverage Report

```bash
# Generate coverage report
npm run test:cov

# Report location
backend-nest/coverage/
frontend/coverage/
```

Open `coverage/lcov-report/index.html` in browser to view detailed report.

---

## Best Practices

### ✅ DO

- Test the behavior, not implementation details
- Use descriptive test names: "should return user when email is valid"
- Follow Arrange-Act-Assert pattern
- Mock external dependencies
- Keep tests isolated and independent
- Use beforeEach/afterEach for setup
- Test both happy path and error cases
- Use proper TypeScript types

### ❌ DON'T

- Test internal implementation details
- Use vague test names: "test user"
- Skip error case testing
- Create interdependent tests
- Use real API calls in unit tests
- Test third-party libraries
- Ignore test coverage below threshold
- Use `any` type in tests

---

## Common Patterns

### Mocking Services

```typescript
const mockUserService = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// In test module
const module: TestingModule = await Test.createTestingModule({
  providers: [
    {
      provide: UserService,
      useValue: mockUserService,
    },
  ],
}).compile();
```

### Testing Async Code

```typescript
it('should fetch users', async () => {
  // Arrange
  mockService.getUsers.mockResolvedValue([...]);

  // Act
  const result = await service.getUsers();

  // Assert
  expect(result).toBeDefined();
});

it('should handle errors', async () => {
  // Arrange
  mockService.getUsers.mockRejectedValue(new Error('API Error'));

  // Act & Assert
  await expect(service.getUsers()).rejects.toThrow('API Error');
});
```

### Testing React Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTransport } from './useTransport';

it('should fetch transport data', async () => {
  const { result } = renderHook(() => useTransport('123'));

  await act(async () => {
    // Wait for async operations
  });

  expect(result.current.transport).toBeDefined();
});
```

---

## Debugging Tests

### VSCode Debugging

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Current File",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["${file}", "--no-coverage"],
  "console": "integratedTerminal"
}
```

### Run Single Test File

```bash
npm run test -- user.service.spec.ts
```

### Run Single Test

```bash
npm run test -- user.service.spec.ts -t "should create user"
```

### Watch Mode

```bash
npm run test -- --watch
```

---

## Integration Tests

### Database Integration

```typescript
it('should save user to database', async () => {
  // This uses actual database (test instance)
  const user = await service.create({
    email: 'test@example.com',
    name: 'Test User',
  });

  expect(user.id).toBeDefined();
  expect(user.email).toBe('test@example.com');
});
```

### End-to-End Tests

Located in `backend-nest/test/`:

```bash
npm run test:e2e
```

---

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests
- Scheduled daily

See `.github/workflows/test.yml` for configuration.

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Created**: February 27, 2026  
**Version**: 1.0.0
