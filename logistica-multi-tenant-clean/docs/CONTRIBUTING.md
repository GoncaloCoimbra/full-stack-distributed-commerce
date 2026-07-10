# Contributing to Logística Multi-Tenant

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project is committed to providing a welcoming and inspiring community for all. Read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/logistica-multi-tenant.git
cd logistica-multi-tenant

# Add upstream remote
git remote add upstream https://github.com/original-owner/logistica-multi-tenant.git
```

### 2. Setup Development Environment

```bash
# Install Node.js 18+
node --version  # Should be v18.0.0 or higher

# Install dependencies
npm install

# Setup backend
cd backend-nest
cp .env.example .env
npm run migrate
cd ..

# Setup frontend
cd frontend
npm install
cd ..

# Start development servers
npm run dev  # Starts both backend and frontend
```

Backend will run on `http://localhost:3000`  
Frontend will run on `http://localhost:3002`

### 3. Create Feature Branch

```bash
# Sync with upstream
git fetch upstream
git rebase upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming convention**:
- `feature/user-authentication` - new feature
- `fix/login-crash` - bug fix
- `docs/deployment-guide` - documentation
- `test/add-unit-tests` - tests
- `refactor/improve-performance` - code improvement

---

## Making Changes

### 1. Code Style

**Backend (NestJS/TypeScript)**:
```typescript
// Use async/await
async function getUserById(id: string) {
  return await this.prisma.user.findUnique({
    where: { id }
  });
}

// Use proper error handling
try {
  return await this.service.doSomething();
} catch (error) {
  this.logger.error(`Error doing something: ${error.message}`);
  throw new BadRequestException(error.message);
}

// Use type safety
interface UserDTO {
  name: string;
  email: string;
}

// Use decorators for validation
@Post('/users')
@UseGuards(AuthGuard)
async createUser(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

**Frontend (React/TypeScript)**:
```typescript
// Use functional components with hooks
interface UserCardProps {
  name: string;
  email: string;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Your logic
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Action'}
      </button>
    </div>
  );
};
```

### 2. Run Linting

```bash
# Lint all code
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### 3. Write Tests

```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Test coverage
npm run test:cov
```

**Test naming convention**:
```typescript
describe('UserService', () => {
  it('should create user with valid data', async () => {
    // Arrange
    const dto = { name: 'John', email: 'john@example.com' };

    // Act
    const result = await service.create(dto);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe('john@example.com');
  });

  it('should throw error when email already exists', async () => {
    // Arrange - create user first
    const dto = { name: 'John', email: 'john@example.com' };
    await service.create(dto);

    // Act & Assert
    await expect(service.create(dto)).rejects.toThrow(
      ConflictException
    );
  });
});
```

### 4. Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
^--^  ^----^
|     |
|     +---> summary in imperative mood
|
+---------> type: feat|fix|docs|style|refactor|test|chore
```

**Examples**:
```bash
git commit -m "feat: add JWT authentication"
git commit -m "fix: correct user deletion bug"
git commit -m "docs: add deployment guide"
git commit -m "test: add integration tests for auth"
git commit -m "refactor: extract UserService methods"
git commit -m "style: format code with prettier"
git commit -m "chore: update dependencies"
```

### 5. Push & Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub  
# - Title: Short description
# - Description: What, why, how
# - Link related issues: Fixes #123
```

**Pull Request Template**:
```markdown
## Description
Clear explanation of what you've done

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Explain how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Related issues linked

## Screenshots (if applicable)
Add any relevant screenshots

## Additional Context
Any other context about your PR
```

---

## Reviewing

### For Reviewers

- Check code logic and correctness
- Verify tests are comprehensive
- Ensure code follows style guide
- Check for security issues
- Provide constructive feedback

### For Contributors

- Respond to feedback promptly
- Request clarification if needed
- Make requested changes
- Re-request review after changes

---

## Project Structure

```
logistica-multi-tenant/
├── backend-nest/           # NestJS backend
│   ├── src/
│   │   ├── app.module.ts   # Main app module
│   │   ├── main.ts         # Entry point
│   │   └── modules/        # Feature modules
│   ├── test/               # E2E tests
│   └── prisma/             # Database schema
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   └── hooks/          # Custom hooks
│   └── public/             # Static assets
├── k8s/                    # Kubernetes configs
├── docs/                   # Documentation
└── README.md               # Main readme
```

---

## Common Tasks

### Add a New API Endpoint

**Backend** (`backend-nest/src/modules/example/example.controller.ts`):
```typescript
@Controller('example')
export class ExampleController {
  constructor(private service: ExampleService) {}

  @Get(':id')
  async getExample(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createExample(@Body() dto: CreateExampleDto) {
    return this.service.create(dto);
  }
}
```

**Frontend** (`frontend/src/api/api.ts`):
```typescript
export const getExample = (id: string) =>
  api.get(`/example/${id}`);

export const createExample = (data: CreateExampleDto) =>
  api.post('/example', data);
```

### Add a New Page

**Frontend** (`frontend/src/pages/ExamplePage.tsx`):
```typescript
import React, { useEffect, useState } from 'react';
import { getExample } from '../api/api';

export const ExamplePage: React.FC = () => {
  const [example, setExample] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExample = async () => {
      setLoading(true);
      try {
        const data = await getExample('123');
        setExample(data);
      } finally {
        setLoading(false);
      }
    };
    loadExample();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!example) return <div>Not found</div>;

  return (
    <div>
      <h1>{example.name}</h1>
      {/* Your UI */}
    </div>
  );
};
```

### Update Database Schema

**Prisma** (`backend-nest/prisma/schema.prisma`):
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  ADMIN
  USER
  GUEST
}
```

```bash
# Create migration
npm run migrate:dev --name add_user_model

# Deploy migration
npm run migrate:prod
```

---

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features (backward compatible)
- **PATCH** (1.1.1): Bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub Release with changelog

---

## Need Help?

- **Questions**: Create a [GitHub Discussion](https://github.com/your-repo/discussions)
- **Bug Reports**: Create an [Issue](https://github.com/your-repo/issues)
- **Security**: See [SECURITY.md](SECURITY.md)
- **Discord**: Join our community server (coming soon)

---

## License

By contributing to this project, you agree that your contributions will be licensed under its MIT License.

---

Thank you for contributing! 🚀

**Last Updated**: February 27, 2026  
**Version**: 1.0.0

## Backend Decision

- **Active Code**: `backend-nest` (NestJS).
- **Legacy Code**: `backend` (Express) – **do not modify** except for documented migration purposes.

## Project Structure

```
backend-nest/          # NestJS + Prisma + Swagger
├─ src/
│  ├─ common/         # Guards, interceptors, pipes, interfaces
│  ├─ modules/        # Features (auth, users, products, etc.)
│  ├─ database/       # Prisma e Configurations
│  └─ main.ts
├─ prisma/
├─ test/              # E2E tests
├─ jest.config.js     # Config for unit tests
└─ package.json

frontend/              # React + Vite
├─ src/
│  ├─ components/     # Componentes reutilizáveis
│  ├─ pages/          # Pages/routes
│  ├─ hooks/          # Custom hooks
│  ├─ services/       # API clients
│  ├─ types/          # TypeScript types
│  └─ App.tsx
└─ package.json
```

## Documentation

- Document critical DTOs, services and endpoints.
- Use Swagger annotations in backend (`@ApiOperation`, `@ApiParam`, etc.).
- Update `README.md` if your change affects installation/usage.

## Questions?

Open an issue or get in touch. We're here to help!
