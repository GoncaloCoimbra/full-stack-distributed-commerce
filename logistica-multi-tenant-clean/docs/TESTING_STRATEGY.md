# Estratégia de Testes

This document describes the testing strategy for the entire platform, with coverage targets and patterns.

## Visão Geral

```
┌─────────────────────────────────────┐
│          Testes E2E (5%)             │  Cypress/Playwright - fluxos reais
├─────────────────────────────────────┤
│      Integration Tests (10%)      │  Multiple models, DB
├─────────────────────────────────────┤
│      Testes Unitários (85%)          │  Serviços, controllers, utils
└─────────────────────────────────────┘

Meta Global: 80% cobertura
```

## Backend (NestJS)

### Estrutura de Testes

```
backend-nest/
├─ src/
│  ├─ modules/
│  │  ├─ users/
│  │  │  ├─ users.service.ts
│  │  │  ├─ users.service.spec.ts       ← Unitário
│  │  │  ├─ users.controller.ts
│  │  │  └─ users.controller.spec.ts    ← Unitário
│  │  └─ ...
│  └─ common/
│     ├─ guards/jwt-auth.guard.ts
│     └─ guards/jwt-auth.guard.spec.ts
└─ test/
   ├─ auth.e2e-spec.ts                   ← E2E
   ├─ users.e2e-spec.ts
   └─ transports.e2e-spec.ts
```

### Jest Configuration

File: `jest.config.js` (already exists)

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',           // Não testar módulos
    '!**/node_modules/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>', '<rootDir>/../test'],
};
```

### Testes Unitários

#### Exemplo: Service

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '@database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        name: 'John Doe',
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto = {
        email: ' new@example.com',
        name: 'New User',
        password: 'hashed-password',
      };

      const mockNewUser = { id: 'user-456', ...createDto };

      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockNewUser);

      const result = await service.create(createDto);

      expect(result).toEqual(mockNewUser);
      expect(prisma.user.create).toHaveBeenCalled();
    });
  });
});
```

#### Exemplo: Controller

```typescript
// users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('GET /users/:id', () => {
    it('deve retornar usuário por ID', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith('123');
    });
  });
});
```

### Testes E2E

```typescript
// test/users.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import * as request from 'supertest';

describe('Users E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // Clean test data
    await prisma.user.deleteMany({});
    await app.close();
  });

  describe('POST /api/users', () => {
    it('should create a user', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('test@example.com');
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('deve retornar usuário por ID', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'existing@example.com',
          name: 'Existing User',
          password: 'hashed',
        },
      });

      return request(app.getHttpServer())
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(user.id);
        });
    });

    it('should return 404 if user does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
```

### Rodando Testes

```bash
# Todos os testes
npm run --workspace=backend-nest test

# Com coverage
npm run --workspace=backend-nest test:cov

# E2E apenas
npm run --workspace=backend-nest test:e2e

# Watch mode
npm run test:watch

# A specific file
npm test -- users.service
```

## Frontend (React)

### Estrutura

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Button.tsx
│  │  ├─ Button.test.tsx         ← Unitário
│  │  ├─ Form/
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ LoginForm.test.tsx
│  │  └─ ...
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  └─ Dashboard.test.tsx
│  ├─ hooks/
│  │  ├─ useAuth.ts
│  │  └─ useAuth.test.ts
│  └─ ...
└─ cypress/
   ├─ e2e/
   │  ├─ login.cy.ts              ← E2E
   │  ├─ products.cy.ts
   │  └─ transports.cy.ts
   └─ fixtures/
```

### Exemplo: Teste de Componente

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('<Button />', () => {
  it('deve renderizar', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click</Button>);
    const button = screen.getByRole('button');

    await user.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Exemplo: Teste de Hook

```typescript
// useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('deve iniciar com isAuthenticated=false', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve fazer login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('user@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });
});
```

### Rodando Testes React

```bash
# Testes
npm run --workspace=frontend test

# Watch mode
npm run --workspace=frontend test:watch

# Com coverage
npm run test -- --coverage
```

## Testes de Acessibilidade

### Integrado com Jest-Axe

```typescript
import { axe } from 'jest-axe';

describe('Accessibility', () => {
  it('deve ser acessível', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Testes E2E (Cypress)

### Configuração

```bash
npm install --save-dev cypress
npx cypress open
```

### Exemplo

```typescript
// cypress/e2e/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('deve fazer login com credenciais válidas', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-btn"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-text"]').should('contain', 'Welcome');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrong');
    cy.get('[data-testid="submit-btn"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

## Metas de Cobertura

| Camada | Target | Q1 | Q2 | Q3 |
|--------|--------|----|----|-----|
| Backend Unitários | 80% | 70 | 80 | 90 |
| Backend E2E | 50% | 30 | 50 | 70 |
| Frontend Componentes | 70% | 40 | 70 | 85 |
| Frontend E2E | 50% | 20 | 50 | 70 |
| **Global** | **80%** | **65** | **80** | **90** |

## CI Integration

Ver [.github/workflows/ci.yml](./.github/workflows/ci.yml):

```yaml
- name: Run all tests
  run: npm run test-all
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./backend-nest/coverage/lcov.info,./frontend/coverage/lcov.info
```

## Checklist

- [ ] Cada feature tem testes unitários
- [ ] Cada bug fix inclui teste de regressão
- [ ] Cobertura ≥ 80% em código  new
- [ ] E2E testa fluxos críticos (auth, CRUD)
- [ ] Mocks para dependências externas
- [ ] Testes rodam em CI antes de merge

---

**Last update:** February 2026
