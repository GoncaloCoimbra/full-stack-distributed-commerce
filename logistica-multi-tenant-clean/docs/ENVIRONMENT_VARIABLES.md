# Variáveis de Ambiente

This document describes all environment variables needed for different environments (development, staging, production).

## Backend (backend-nest)

### Obrigatórias

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `NODE_ENV` | string | Ambiente (development, test, production) | `development` |
| `DATABASE_URL` | string | Connection string PostgreSQL | `postgresql://user:pass@localhost:5432/logistica_dev` |
| `JWT_SECRET` | string | Secret key for signing JWT | `your-very-long-secret-minimum-32-chars` |
| `CORS_ORIGIN` | string | Frontend URL (for CORS) | `http://localhost:3001` or `https://your-domain.com` |

### Opcionais mas Recomendadas

| Variável | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `PORT` | number | 3000 | Server port |
| `LOG_LEVEL` | string | info | Logging level (debug, info, warn, error) |
| `SENTRY_DSN` | string | - | Sentry URL for error tracking |
| `REDIS_URL` | string | - | URL Redis para cache/sessionss (optional) |
| `MAX_FILE_SIZE` | string | 10mb | Tamanho máximo de uploads |
| `JWT_EXPIRY` | string | 24h | JWT token expiration time |

### Exemplo de `.env` (Desenvolvimento)

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/logistica_dev
JWT_SECRET=dev-secret-key-min-32-characters-long
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
LOG_LEVEL=debug
JWT_EXPIRY=24h
```

### Example `.env` (Production)

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://pg_prod_user:SECURE_PASSWORD@prod-db-host:5432/logistica_prod
JWT_SECRET=$(openssl rand -base64 32)  # Gerar uma chave segura
CORS_ORIGIN=https://seu-dominio.com
LOG_LEVEL=warn
SENTRY_DSN=https://key@sentry.io/project-id
JWT_EXPIRY=16h
```

## Frontend

### Obrigatórias

| Variável | Tipo | Descrição | Exemplo |
|----------|------|-----------|---------|
| `REACT_APP_API_URL` | string | URL base da API backend | `http://localhost:3000/api` |

### Opcionais

| Variável | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `REACT_APP_ENV` | string | development | Ambiente (development, staging, production) |
| `REACT_APP_LOG_LEVEL` | string | info | Nível de console logging |
| `REACT_APP_SENTRY_DSN` | string | - | Sentry for frontend errors |

### Exemplo de `.env.local` (Desenvolvimento)

```bash
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
REACT_APP_LOG_LEVEL=debug
```

### Example `.env.production` (Production)

```bash
REACT_APP_API_URL=https://api.seu-dominio.com/api
REACT_APP_ENV=production
REACT_APP_LOG_LEVEL=error
REACT_APP_SENTRY_DSN=https://key@sentry.io/frontend-id
```

## Docker Compose

Variáveis predefinidas em [docker-compose.yml](./docker-compose.yml):

```yaml
services:
  postgres:
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: logistica_dev
      
  backend-nest:
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/logistica_dev
      NODE_ENV: development
      JWT_SECRET: dev-secret
      CORS_ORIGIN: http://localhost:3001,http://localhost:5173
```

## Kubernetes / Helm

No `k8s/configmap.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: backend-config
data:
  NODE_ENV: "production"
  LOG_LEVEL: "warn"
  CORS_ORIGIN: "https://seu-dominio.com"
```

No `k8s/secrets.yaml` (ou usar Vault):

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
type: Opaque
stringData:
  DATABASE_URL: postgresql://...
  JWT_SECRET: base64-encoded-secret
```

## Variable Verification

### Backend

```bash
# Verificar que DATABASE_URL está definida
grep -q "DATABASE_URL" .env && echo "✓ DATABASE_URL ok" || echo "✗ DATABASE_URL missing"

# Verificar JWT_SECRET
grep -q "JWT_SECRET" .env && echo "✓ JWT_SECRET ok" || echo "✗ JWT_SECRET missing"
```

### Frontend

```bash
# Verificar REACT_APP_API_URL
grep -q "REACT_APP_API_URL" .env.local && echo "✓ API_URL ok" || echo "✗ API_URL missing"
```

## Segurança

### Regras Importantes

1. **Nunca commitar `.env`**: adicionar ao `.gitignore`
2. **Secrets em Vault/K8s**: nunca hardcoded
3. **JWT_SECRET**: mínimo 32 caracteres, usar `openssl rand -base64 32` para gerar
4. **DATABASE_URL**: use strong passwords in production
5. **SENTRY_DSN**: keep private, use CI/CD secrets

### Secure Secret Generation

```bash
# JWT_SECRET
openssl rand -base64 32

# Database password
openssl rand -base64 16

# AWS/GCP credentials
# → Use Vault or native Secret Manager of the platform
```

## CI/CD (GitHub Actions)

As secrets devem ser configuradas em **Settings > Secrets and variables > Actions**:

```
DATABASE_URL_PROD
JWT_SECRET_PROD
SENTRY_DSN
DOCKER_REGISTRY_TOKEN
```

Uso no workflow:

```yaml
- name: Deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL_PROD }}
    JWT_SECRET: ${{ secrets.JWT_SECRET_PROD }}
  run: ./deploy.sh
```

## Configuration Checklist

Local:
- [ ] `.env` copiado de `.env.example`
- [ ] `DATABASE_URL` apontando para BD local/remota
- [ ] `JWT_SECRET` preenchido (mínimo 32 chars)
- [ ] `CORS_ORIGIN` configurado para frontend
- [ ] `.env` adicionado a `.gitignore`

Production:
- [ ] Todas as variáveis definidas via Vault/Secrets Manager
- [ ] `NODE_ENV=production`
- [ ] `LOG_LEVEL=warn` ou superior
- [ ] `SENTRY_DSN` configured for error tracking
- [ ] Database usa managed service (RDS, Cloud SQL, etc.)
- [ ] JWT_SECRET is rotated regularly (policy)

---

**Last update:** February 2026
