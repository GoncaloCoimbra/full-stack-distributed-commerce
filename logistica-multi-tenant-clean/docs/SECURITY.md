# Security Policy

## Overview

This project implements security best practices to protect user data and system integrity. This document outlines our security measures and guidelines.

## Authentication & Authorization

### JWT Token Management
- ✅ **JWT Tokens**: 
  - Signed with HS256 algorithm
  - 15-minute expiration for access tokens
  - 7-day refresh token rotation
  - HttpOnly cookies for token storage (when possible)

### Role-Based Access Control (RBAC)
- ✅ **Implemented Roles**:
  - `SUPER_ADMIN`: Full system access
  - `ADMIN`: Company-level administration
  - `OPERATOR`: Transport operations
  - `USER`: Limited data access
  - `GUEST`: Read-only access

- ✅ **Protected Routes**:
  - All `/api/*` endpoints require authentication
  - Role validation on sensitive operations
  - Company-scoped data filtering

### Password Security
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Minimum 8 characters, mixed case + numbers required
- ✅ Password change audit logging
- ✅ Cannot reuse last 5 passwords

## Data Protection

### Input Validation
- ✅ **Prisma Schema Validation**:
  - Type-safe ORM prevents SQL injection
  - Field constraints (maxLength, pattern, etc.)
  - Custom validators for business logic

- ✅ **Sanitization**:
  - XSS protection via DOMPurify on frontend
  - HTML/script tag stripping on backend
  - Regex pattern validation on all inputs

### Database Security
- ✅ **Encryption at Rest**:
  - Sensitive fields hashed (passwords, tokens)
  - Personal data fields can be encrypted (GDPR compliance ready)

- ✅ **Query Protection**:
  - Parameterized queries via Prisma
  - No raw SQL concatenation
  - Audit logging on sensitive queries

### CORS Configuration
- ✅ Configured for development: `http://localhost:3001`, `http://localhost:3002`
- ✅ Configurable per environment via `.env`
- ✅ Preflight requests validated

## Rate Limiting & DDoS Protection

- ⚠️ **Current Status**: Community recommended
  - **Recommendation**: Implement `@nestjs/throttler` for production
  ```bash
  npm install @nestjs/throttler
  ```

- **Suggested Limits**:
  - Login attempts: 5 per minute
  - API calls: 100 per minute per IP
  - File uploads: 10 per minute

## Audit Logging

- ✅ **Audit Trail**: All create/update/delete operations logged
  - User ID, timestamp, IP address, action, changes
  - Stored in `audit_logs` table
  - Queryable per user/entity/timerange
  - Lifecycle: 90-day retention (configurable)

## File Upload Security

- ✅ **Avatar Upload** (`/api/auth/avatar`):
  - Whitelist: `.jpg`, `.jpeg`, `.png`, `.webp`
  - Max size: 5MB
  - Stored in `/uploads/avatars/`
  - Filename randomized to prevent path traversal

- ⚠️ **Hardening Tips**:
  - Scan uploads with antivirus (ClamAV)
  - Serve from subdomain to prevent script execution
  - Implement virus scanning middleware

## Environment Variables

### Required Security Variables
```env
# Authentication
JWT_SECRET=your-strong-secret-key-here (min 32 chars)
JWT_REFRESH_SECRET=refresh-secret-key (min 32 chars)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# CORS
CORS_ORIGIN=http://localhost:3001

# Environment
NODE_ENV=production
```

### Never Commit
- `.env` file (in `.gitignore`)
- Secret keys
- Database credentials
- API keys

## Vulnerability Management

### Known Vulnerabilities
- Monitor with: `npm audit`
- Update dependencies: `npm update`
- Run: `npm audit fix` for auto-patches

### Reporting Security Issues
⚠️ **DO NOT create public GitHub issues for security vulnerabilities**

Instead:
1. Email: security@your-company.com
2. Include: Description, affected component, reproduction steps
3. Timeline: We aim to patch within 7 days

## GDPR & Data Privacy

- ✅ **User Consent**: 
  - Terms of Service acceptance on registration
  - Cookie consent banner (if applicable)

- ✅ **Data Rights**:
  - User can request data export
  - User can request account deletion (cascading delete)
  - Personal data masked in logs after 90 days

- ✅ **Data Retention**:
  - Active users: Data kept indefinitely
  - Deleted users: Purged after 30 days
  - Audit logs: Retained for 90 days

## Security Checklist for Deployment

- [ ] Change `JWT_SECRET` to strong random value (min 32 chars)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS only (redirect HTTP → HTTPS)
- [ ] Configure CORS properly (whitelist your domain)
- [ ] Enable database backups (daily minimum)
- [ ] Set up database connection encryption
- [ ] Configure file upload antivirus scanning
- [ ] Enable rate limiting middleware
- [ ] Set up security headers (Helmet):
  ```typescript
  app.use(helmet()); // Already configured in main.ts
  ```
- [ ] Run `npm audit` and check for vulnerabilities
- [ ] Review audit logs regularly
- [ ] Enable server-side session management

## Security Headers

✅ **Helmet Middleware Enabled** (in `main.ts`):
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

## Testing Security

Run security audit:
```bash
npm audit              # Check for vulnerabilities
npm audit fix          # Auto-fix vulnerabilities
npm run lint           # Code quality checks
npm run test           # Unit tests (includes security validations)
```

## Compliance Standards

- ✅ OWASP Top 10 practices implemented
- ✅ GDPR-ready (data export, deletion, consent)
- ✅ LGPD-compatible (Brazilian data law)
- 🟡 SOC2 compliance: Partial (audit logs in place)

## Support & Questions

For security questions:
- **Email**: security@your-company.com
- **Response Time**: 24 hours

---

**Last Updated**: February 27, 2026  
**Version**: 1.0.0
