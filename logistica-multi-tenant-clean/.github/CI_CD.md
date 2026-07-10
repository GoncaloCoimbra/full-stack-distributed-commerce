name: CI/CD Documentation

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows Overview

### 1. test.yml - Run Tests
**Trigger**: Push to `main`/`develop`, Pull Requests  
**Purpose**: Run unit tests and E2E tests, check code coverage

**What it does**:
- Tests on Node.js 18.x and 20.x
- Spins up PostgreSQL test database
- Runs database migrations
- Runs backend unit tests with coverage
- Runs backend E2E tests
- Runs frontend unit tests with coverage
- Validates coverage thresholds (minimum 70%)
- Uploads coverage to Codecov

**Key environment variables**:
```
DATABASE_URL=postgresql://test_user:test_password@localhost:5432/logistica_test
NODE_ENV=test
CI=true
```

**Duration**: ~15-20 minutes

### 2. lint.yml - Lint & Format
**Trigger**: Push to `main`/`develop`, Pull Requests  
**Purpose**: Check code style, formatting, and TypeScript compilation

**What it does**:
- Runs ESLint on backend and frontend
- Checks Prettier formatting
- Validates TypeScript compilation
- Checks for security vulnerabilities (npm audit)
- Reports outdated dependencies

**Key checks**:
- ESLint rules enforcement
- Prettier code formatting
- TypeScript type safety (`tsc --noEmit`)
- Security vulnerabilities in dependencies
- Outdated packages

**Duration**: ~5-10 minutes

### 3. build.yml - Build Docker Images
**Trigger**: Push to `main`/`develop`, Pull Requests, Version tags (v*)  
**Purpose**: Build Docker images and verify production builds

**What it does**:
- Builds backend Docker image
- Builds frontend Docker image
- Pushes to GitHub Container Registry (ghcr.io)
- Verifies npm builds (`npm run build`)
- Creates release artifacts

**Docker Images**:
- Backend: `ghcr.io/your-org/logistica-backend:latest`
- Frontend: `ghcr.io/your-org/logistica-frontend:latest`

**Versioning**:
- Branch images: `develop`, `main`
- Semver tags: `v1.0.0`, `v1.1.2`
- Short SHA: `develop-abc1234`
- Latest: Points to default branch

**Duration**: ~10-15 minutes

### 4. deploy.yml - Deploy to Staging
**Trigger**: Push to `develop`, After successful tests  
**Purpose**: Deploy to staging environment and run smoke tests

**What it does**:
- Builds backend and frontend
- Configures AWS credentials
- Updates ECS service (staging)
- Runs smoke tests (health checks)
- Sends Slack notifications
- Validates environment variables
- Verifies database connectivity

**Deployment**: AWS ECS (configurable)
**Notifications**: Slack webhook
**Environment**: Staging (https://staging.example.com)

**Duration**: ~5-10 minutes

---

## Setup Instructions

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository settings:

**Regular Secrets** (Settings → Secrets → Actions):
```
JWT_SECRET              # JWT signing key for auth tokens
API_SECRET             # General API secret
SLACK_WEBHOOK_URL      # For Slack notifications
```

**AWS Secrets** (for ECS deployment):
```
AWS_ACCESS_KEY_ID      # AWS credentials
AWS_SECRET_ACCESS_KEY  # AWS credentials
STAGING_DATABASE_URL   # Staging database connection string
```

**To add a secret**:
1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `SECRET_NAME`, Value: `your-secret-value`
5. Click "Add secret"

### 2. Environment Variables

**Backend** (`backend-nest/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/logistica
JWT_SECRET=replace-with-a-secure-random-secret
API_SECRET=replace-with-a-secure-random-api-secret
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

### 3. Docker Hub / GitHub Container Registry

To push Docker images:

1. **GitHub Container Registry** (free, integrated):
   - Images automatically pushed from GitHub Actions
   - No additional setup needed
   - Access: Settings → Actions → General → Workflow permissions → Allow read/write

2. **Docker Hub** (optional):
   - Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
   - Modify `build.yml` to use `docker.io` registry

---

## Running Workflows Locally

Test workflows locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run a specific workflow
act -j test

# Run with secrets
act -s JWT_SECRET=your-secret -j test

# View available jobs
act --list
```

---

## Monitoring & Debugging

### View Workflow Runs

1. Go to Actions tab in GitHub
2. Select workflow from left sidebar
3. Click specific run to see logs
4. Expand jobs/steps to see detailed output

### Common Issues

**Tests failing**:
- Check database connection string
- Verify migrations ran (`prisma migrate deploy`)
- Check Node.js version compatibility
- Review test output for specific errors

**Build failing**:
- Verify Dockerfile exists in backend/frontend folders
- Check Docker build context
- Review Docker build logs in GitHub Actions

**Deploy failing**:
- Verify AWS credentials are correct
- Check ECS cluster/service exists
- Verify database connection string
- Check Slack webhook URL is valid

---

## Coverage Tracking

Coverage reports are uploaded to Codecov:

```
https://codecov.io/gh/your-org/logistica-multi-tenant
```

**Coverage Thresholds**:
- Minimum: 70% lines covered
- If below threshold, CI fails

**Review Coverage**:
1. Push code
2. GitHub Actions runs tests
3. Coverage uploaded to Codecov
4. Check badge in README

---

## Performance Benchmarks

Typical workflow durations:

| Workflow | Duration | Cost |
|----------|----------|------|
| test.yml | 15-20 min | ~5 credits |
| lint.yml | 5-10 min | ~2 credits |
| build.yml | 10-15 min | ~3 credits |
| deploy.yml | 5-10 min | ~2 credits |

**GitHub Actions Limits**:
- Free: 2,000 minutes/month
- Team: Unlimited
- Organization: Unlimited

---

## Badges

Add these to your README:

```markdown
![Tests](https://github.com/your-org/logistica-multi-tenant/workflows/Run%20Tests/badge.svg)
![Lint](https://github.com/your-org/logistica-multi-tenant/workflows/Lint%20%26%20Format/badge.svg)
![Build](https://github.com/your-org/logistica-multi-tenant/workflows/Build%20Docker%20Images/badge.svg)
![Coverage](https://codecov.io/gh/your-org/logistica-multi-tenant/branch/develop/graph/badge.svg)
```

---

## Best Practices

1. **Keep workflows fast**: Aim for < 15 minutes per workflow
2. **Cache dependencies**: Use actions/cache to speed up installs
3. **Parallel jobs**: Run lint and tests in parallel
4. **Secrets safety**: Never log secrets or credentials
5. **Branch protection**: Require passing CI before merging
6. **Regular updates**: Keep action versions updated
7. **Documentation**: Document all secrets and requirements

---

## Troubleshooting

### "Error: Secret not found"
- Add secret to GitHub repository settings
- Secret names are case-sensitive

### "Docker build failed"
- Verify Dockerfile is in correct directory
- Check Docker build context path
- Review Dockerfile for errors

### "Database connection timeout"
- Verify PostgreSQL service is running
- Check DATABASE_URL is correct
- Ensure test database exists

### "Coverage report not uploading"
- Verify Codecov token is set (if private repo)
- Check coverage files exist in correct location
- Review coverage file paths in workflow

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/guides)
- [Codecov - Code Coverage](https://codecov.io)
- [Docker Buildx](https://docs.docker.com/build/buildx/)

---

## Next Steps

1. Configure repository secrets
2. Push test commits to develop branch
3. Monitor first workflow run in Actions tab
4. Adjust timeouts/memory if needed
5. Add branch protection rules
6. Configure auto-deployment to production

---

**Created**: February 27, 2026  
**Version**: 1.0.0
