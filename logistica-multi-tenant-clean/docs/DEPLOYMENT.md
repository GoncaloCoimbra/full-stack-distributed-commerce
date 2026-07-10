# 🚀 Production Deployment Guide

Complete guide for deploying the Logistica Multi-Tenant application to production environments with security, monitoring, and scaling best practices.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Database Migration](#database-migration)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling & Performance](#scaling--performance)
9. [Backup & Recovery](#backup--recovery)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18+ LTS
- **npm** 9+
- **Docker** 20.10+ & **Docker Compose** 2.0+
- **kubectl** 1.26+ (for Kubernetes)
- **PostgreSQL** 15+ (managed or self-hosted)
- **Git** with SSH key configured
- **Domain name** with DNS management access

### Infrastructure Requirements
- **Kubernetes Cluster** (GKE, EKS, AKS, or self-managed)
- **Managed PostgreSQL** (AWS RDS, Google Cloud SQL, Azure Database, or self-hosted)
- **Container Registry** (Docker Hub, ECR, GCR, or Artifactory)
- **SSL/TLS Certificate** (Let's Encrypt, purchased, or self-signed for testing)
- **Monitoring Platform** (Prometheus, Datadog, New Relic, or CloudWatch)

---

## Environment Configuration

### 1. Create Secure Environment Files

**Development** (`backend-nest/.env.development`):
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logistica
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3001
```

**Staging** (`backend-nest/.env.staging`):
```env
NODE_ENV=staging
PORT=3000
LOG_LEVEL=info
DATABASE_URL=postgresql://logistica_user:STRONG_PASSWORD@staging-db.example.com:5432/logistica_staging
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://staging.yourdomain.com
SENTRY_DSN=https://your-sentry-key@sentry.io/xxx
```

**Production** (`backend-nest/.env.production`):
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
DATABASE_URL=postgresql://logistica_user:STRONG_PASSWORD@prod-db.example.com:5432/logistica_prod
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=https://yourdomain.com
SENTRY_DSN=https://your-sentry-key@sentry.io/xxx
NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
```

### 2. Generate Secure Secrets

```bash
# Generate production-grade secrets
openssl rand -base64 32  # JWT_SECRET
openssl rand -base64 32  # JWT_REFRESH_SECRET
openssl rand -base64 32  # ENCRYPTION_KEY (if needed)

# Store in secure location (do NOT commit to git)
# Options: HashiCorp Vault, AWS Secrets Manager, Kubernetes Secrets, etc
```

### 3. Validate Configuration

```bash
# Check all required variables
node -e "
const required = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN'];
required.forEach(v => console.log(v, process.env[v] ? '✓' : 'MISSING'));
"

# Test database connection
npx prisma db execute -- "SELECT 1"
```

---

## Docker Deployment

### Build & Push Images

```bash
# 1. Build backend image
docker build \
  --build-arg NODE_ENV=production \
  -t your-registry/logistica-api:1.0.0 \
  ./backend-nest

# 2. Build frontend image
docker build \
  -t your-registry/logistica-frontend:1.0.0 \
  ./frontend

# 3. Push to registry
docker push your-registry/logistica-api:1.0.0
docker push your-registry/logistica-frontend:1.0.0

# 4. Tag as latest
docker tag your-registry/logistica-api:1.0.0 your-registry/logistica-api:latest
docker push your-registry/logistica-api:latest
```

### Local Testing with Docker Compose

```bash
# Test production build locally
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Check logs
docker-compose logs -f backend-nest
docker-compose logs -f frontend

# Run migration
docker-compose exec backend-nest npx prisma migrate deploy

# Access services
# Frontend: http://localhost:80
# API: http://localhost:3000/api
# Docs: http://localhost:3000/api/docs
```

---

## Kubernetes Deployment

### 1. Prepare Kubernetes Secrets

```bash
# Create namespace
kubectl create namespace logistica

# Create database secret
kubectl create secret generic db-credentials -n logistica \
  --from-literal=database-url='postgresql://...' \
  --from-literal=db-password='STRONG_PASSWORD'

# Create app secrets
kubectl create secret generic app-secrets -n logistica \
  --from-literal=jwt-secret='secret-here' \
  --from-literal=jwt-refresh-secret='refresh-secret'

# Create registry secret (if using private registry)
kubectl create secret docker-registry regcred -n logistica \
  --docker-server=your-registry \
  --docker-username=your-user \
  --docker-password=your-password
```

### 2. Deploy Application

```bash
# Apply configurations in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml

# Verify deployments
kubectl rollout status deployment/backend-api -n logistica
kubectl get pods -n logistica
kubectl get svc -n logistica
```

### 3. Configure Ingress & HTTPS

```yaml
# k8s/ingress.yaml (simplified)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: logistica-ingress
  namespace: logistica
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
    - hosts:
        - yourdomain.com
        - api.yourdomain.com
      secretName: logistica-tls
  rules:
    - host: yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
    - host: api.yourdomain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: backend-api
                port:
                  number: 3000
```

---

## Database Migration

### Before Deployment

```bash
# Test migration locally
npx prisma migrate deploy --skip-generate

# Create backup of current database
pg_dump -h prod-db.example.com -U logistica_user logistica_prod \
  | gzip > backup-$(date +%Y%m%d_%H%M%S).sql.gz

# Verify migration safety
npx prisma migrate resolve --rolled-back 20240318000000_safe_migration
```

### Deployment

```bash
# Run migrations in pod
kubectl exec -it backend-api-xyz -n logistica -- \
  npx prisma migrate deploy

# Verify schema
kubectl exec -it backend-api-xyz -n logistica -- \
  npx prisma db execute -- "SELECT version();"
```

---

## Security Hardening

### Network Security

```yaml
# NetworkPolicy to restrict traffic
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-api-policy
  namespace: logistica
spec:
  podSelector:
    matchLabels:
      app: backend-api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432
```

### SSL/TLS Configuration

```bash
# Install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace

# Create ClusterIssuer for Let's Encrypt
kubectl apply -f - << EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@yourdomain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
EOF
```

### Rate Limiting

```bash
# Install nginx-ingress with rate limiting
helm install nginx-ingress nginx-stable/nginx-ingress \
  --set controller.config.limit-rps=10 \
  --set controller.config.limit-connections=20
```

---

## Monitoring & Logging

### Prometheus Metrics

```bash
# Install Prometheus Stack
helm install prometheus prometheus-community/kube-prometheus-stack -n logistica

# Expose metrics
kubectl port-forward -n logistica svc/prometheus 9090:9090

# Access Grafana dashboard
kubectl port-forward -n logistica svc/prometheus-grafana 3000:80
```

### Centralized Logging

```bash
# Install ELK Stack or use managed logging
helm install elasticsearch elastic/elasticsearch -n logistica
helm install logstash elastic/logstash -n logistica
helm install kibana elastic/kibana -n logistica

# View logs
kubectl logs -f deployment/backend-api -n logistica
kubectl logs -f deployment/frontend -n logistica
```

### Error Tracking (Sentry)

```bash
# Enable in application
export SENTRY_DSN=https://your-key@sentry.io/project-id

# Errors automatically captured:
# - Unhandled exceptions
# - HTTP 5xx errors
# - Database connection failures
```

---

## Scaling & Performance

### Horizontal Pod Autoscaling

```yaml
# Auto-scale based on CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-api-hpa
  namespace: logistica
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### Database Optimization

```sql
-- Create production indexes
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_state ON products(state);
CREATE INDEX idx_movements_created_at ON product_movements(created_at DESC);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_audit_logs_company_created ON audit_logs(company_id, created_at DESC);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE company_id = '...' AND state = 'STORED';

-- Enable readonly replicas (optional)
-- Configure with DATABASE_REPLICA_URL environment variable
```

### CDN Configuration

```bash
# Serve frontend assets from CDN
# Cache static files (1 year TTL)
# - *.js, *.css, *.woff2, images
# Cache HTML (1 hour TTL, no-cache headers)
# - index.html, *.html

# Cloudflare example:
# - Enable cache establed
# - Set browser cache TTL to 1 hour
# - Cache static assets with "Cache Everything"
```

---

## Backup & Recovery

### Automated Backups

```bash
# Create backup cronjob
kubectl apply -f - << EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
  namespace: logistica
spec:
  schedule: "0 2 * * *"  # 2 AM UTC daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: postgres:15
              command:
                - /bin/sh
                - -c
                - pg_dump postgresql://... | gzip > /backups/logistica_\$(date +%Y%m%d).sql.gz
          restartPolicy: OnFailure
EOF
```

### Recovery Procedure

```bash
# 1. List available backups
ls /backups/logistica_*.sql.gz

# 2. Restore from backup
gunzip < /backups/logistica_20240318.sql.gz | \
  psql postgresql://logistica_user:password@localhost/logistica_prod

# 3. Verify restoration
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;

# 4. Validate application
curl http://localhost:3000/api
```

---

## Troubleshooting

### Pod Startup Issues

```bash
# Check pod status
kubectl describe pod backend-api-xyz -n logistica

# View logs
kubectl logs backend-api-xyz -n logistica -c backend-api

# Check environment variables
kubectl exec backend-api-xyz -n logistica -- env | grep DATABASE_URL

# Common fixes:
# - Verify secrets exist: kubectl get secrets -n logistica
# - Check image exists in registry
# - Ensure database is reachable: kubectl run -it --rm debug --image=postgres:15 --restart=Never -- psql postgresql://...
```

### Performance Issues

```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n logistica

# Check database connections
SELECT COUNT(*) FROM pg_stat_activity;

# View slow queries (if logging enabled)
kubectl logs deployment/backend-api -n logistica | grep "duration"
```

### Certificate Issues

```bash
# Check certificate status
kubectl get certificate -n logistica
kubectl describe certificate logistica-tls -n logistica

# Manually trigger renewal
kubectl delete secret logistica-tls -n logistica

# Force renewal with Let's Encrypt
kubectl delete certificaterequest -n logistica -l cert-manager.io/certificate-name=logistica-tls
```

---

## Production Checklist

Before going live, verify:

- ✅ HTTPS enabled on all domains
- ✅ All secrets in Kubernetes (not committed to git)
- ✅ Database backups automated and tested
- ✅ Monitoring & alerting configured
- ✅ CORS restricted to your domain only
- ✅ Rate limiting enabled on auth endpoints
- ✅ Security headers configured (Helmet.js)
- ✅ Database indices created for performance
- ✅ Log retention policy set (GDPR compliance)
- ✅ Auto-scaling policies configured
- ✅ Disaster recovery tested
- ✅ Staff trained on runbook procedures

---

## Support & Documentation

- **Kubernetes Docs:** https://kubernetes.io/docs/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/15/
- **NestJS Production:** https://docs.nestjs.com/deployment
- **Helm Hub:** https://artifacthub.io/


npm run e2e
```

**Verify endpoints**:
- Backend: http://localhost:3000
- Frontend: http://localhost:3002
- Swagger API: http://localhost:3000/api/docs

---

## Docker Deployment

### Build Docker Images

```bash
# Build backend image
cd backend-nest
docker build -t logistica-backend:latest .

# Build frontend image  
cd ../frontend
docker build -t logistica-frontend:latest .

# Tag for registry (example: Docker Hub)
docker tag logistica-backend:latest yourusername/logistica-backend:latest
docker tag logistica-frontend:latest yourusername/logistica-frontend:latest
```

### Docker Compose (Local)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Push to Docker Registry

```bash
# Login to Docker Hub
docker login

# Push images
docker push yourusername/logistica-backend:latest
docker push yourusername/logistica-frontend:latest
```

---

## Cloud Platforms

### Heroku

#### Deploy Backend

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create logistica-backend --buildpack heroku/nodejs

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev --app logistica-backend

# 5. Set environment variables
heroku config:set NODE_ENV=production --app logistica-backend
heroku config:set JWT_SECRET=your-secret-key --app logistica-backend
heroku config:set CORS_ORIGIN=https://logistica-frontend.herokuapp.com --app logistica-backend

# 6. Deploy
git push heroku main

# 7. Run migrations
heroku run 'npm run migrate' --app logistica-backend

# 8. View logs
heroku logs --tail --app logistica-backend
```

#### Deploy Frontend

```bash
# 1. Create Heroku app
heroku create logistica-frontend --buildpack heroku/static

# 2. Add build script to package.json:
# "heroku-postbuild": "npm run build"

# 3. Configure backend URL
heroku config:set REACT_APP_API_URL=https://logistica-backend.herokuapp.com/api

# 4. Deploy
git push heroku main

# 5. View app
heroku open --app logistica-frontend
```

**Cost**: ~$20/month (Dyno + PostgreSQL)  
**Uptime**: 99.9%

---

### AWS (EC2 + RDS)

#### Prerequisites

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
```

#### Step-by-Step Deployment

```bash
# 1. Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier logistica-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourSecurePassword123 \
  --allocated-storage 20

# 2. Create EC2 instance
aws ec2 run-instances \
  --image-ids ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key-pair \
  --security-groups allow-http-https

# 3. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 4. On EC2 instance:
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/yourusername/logistica-multi-tenant.git
cd logistica-multi-tenant

# Install & build
npm install
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "backend" -- start
pm2 save

# 5. Setup frontend
cd frontend
npm run build
# Serve with Nginx or CloudFront

# 6. Setup RDS connection
# Add RDS endpoint to .env
# Run migrations
npm run migrate
```

#### Setup Nginx Reverse Proxy (on EC2)

```bash
sudo apt-get install nginx

# Edit /etc/nginx/sites-available/default
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx

# Install SSL certificate (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**Cost**: ~$30-50/month (EC2 t3.small + RDS t3.micro)  
**Uptime**: 99.95% SLA

---

### DigitalOcean

#### Deploy with App Platform (Easiest)

```bash
# 1. Install doctl CLI
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.94.0/doctl-1.94.0-linux-x64.tar.gz
tar xf ~/doctl-1.94.0-linux-x64.tar.gz
sudo mv ~/doctl /usr/local/bin

# 2. Authenticate
doctl auth init

# 3. Create app.yaml
```

```yaml
# app.yaml
name: logistica
region: nyc

services:
- name: backend
  github:
    repo: yourusername/logistica-multi-tenant
    branch: main
  build_command: npm install && npm run build
  run_command: npm run start
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${db.connection_string}
  http_port: 3000
  
- name: frontend
  github:
    repo: yourusername/logistica-multi-tenant
    branch: main
    source_dir: frontend
  build_command: npm install && npm run build
  run_command: npm start
  envs:
  - key: REACT_APP_API_URL
    value: https://logistica-backend.ondigitalocean.app/api
  http_port: 3000

databases:
- name: db
  engine: PG
  version: "12"
```

```bash
# 4. Deploy
doctl apps create --spec app.yaml

# 5. View logs
doctl apps logs logistica --follow
```

**Cost**: ~$25/month (with free $200 credit for first 60 days)  
**Uptime**: 99.9%

---

## Kubernetes Deployment

For production-grade infrastructure:

```bash
# 1. Make sure you're in k8s/ directory
cd k8s

# 2. Create namespace
kubectl apply -f namespace.yaml

# 3. Create secrets (edit with real values first)
kubectl apply -f secrets.yaml

# 4. Create config maps
kubectl apply -f configmap.yaml

# 5. Deploy database
kubectl apply -f postgres.yaml

# 6. Deploy backend
kubectl apply -f backend.yaml

# 7. Deploy frontend
kubectl apply -f frontend.yaml

# 8. Setup Ingress
kubectl apply -f ingress.yaml

# 9. Configure HPA (auto-scaling)
kubectl apply -f hpa.yaml

# 10. Verify deployment
kubectl get pods -n logistica
kubectl get services -n logistica
kubectl logs -f deployment/backend -n logistica
```

**Access application**:
- Visit your ingress endpoint
- Check with: `kubectl get ingress -n logistica`

---

## Environment Configuration

### Backend Environment Variables

```env
# Server
NODE_ENV=production
PORT=3000

# Database  
DATABASE_URL=postgresql://user:password@host:5432/logistica

# Authentication
JWT_SECRET=your-very-secure-secret-key-min-32-chars
JWT_REFRESH_SECRET=another-secure-refresh-key

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Uploads
UPLOAD_DIR=/uploads

# Email (optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENV=production
```

---

## Database Migrations

### Create New Migration

```bash
# Backend
cd backend-nest
npx prisma migrate dev --name description_of_change
```

### Run Migrations in Production

```bash
# Using Prisma
npm run migrate:prod

# Or manually
npx prisma migrate deploy
```

### Backup Database

```bash
# PostgreSQL backup
pg_dump postgresql://user:password@host:5432/logistica > backup.sql

# Restore
psql postgresql://user:password@host:5432/logistica < backup.sql
```

---

## Monitoring & Troubleshooting

### Health Check

```bash
# Check backend health
curl https://your-backend-domain.com/api

# Check frontend
curl https://your-frontend-domain.com

# Check database connection
psql postgresql://user:password@host:5432/logistica -c "SELECT 1;"
```

### Common Issues

#### "Connection refused"
```bash
# Check if port is open
lsof -i :3000

# Start service again
npm run start
```

#### "Database connection failed"
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Restart database service
sudo systemctl restart postgresql
```

#### "Out of memory"
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=2048 npm start

# Or use PM2
pm2 start npm --max-memory-restart 500M --name backend -- start
```

### Performance Monitoring

```bash
# Install New Relic monitoring (optional)
npm install newrelic

# Add to main.ts:
require('newrelic');

# Set license key
NEW_RELIC_LICENSE_KEY=your-key npm start
```

### Log Aggregation (ELK Stack)

```bash
# Install Elasticsearch + Kibana for production logging
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker pull docker.elastic.co/kibana/kibana:8.0.0

# Configure logging in main.ts (Winston for NestJS)
npm install winston
```

---

## Scaling Strategies

### Horizontal Scaling (Multiple Instances)

```bash
# Using load balancer (Nginx)
upstream backend {
  server backend1:3000;
  server backend2:3000;
  server backend3:3000;
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
```

### Vertical Scaling (Larger Instances)

- Increase instance type
- Add more CPU/RAM
- Use caching (Redis)

### Database Scaling

```bash
# Read replicas for scaling reads
# Write to primary, read from replica

# Connection pooling
npm install pg-pool
```

---

## Production Checklist

- [ ] All environment variables set correctly
- [ ] SSL/TLS certificate configured
- [ ] Database backups enabled (daily)
- [ ] Monitoring & alerts configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Audit logging enabled
- [ ] Database indexes optimized
- [ ] Frontend assets cached with CDN
- [ ] Error tracking (Sentry) enabled
- [ ] Load tests performed
- [ ] Security audit completed

---

## Rollback Strategy

```bash
# If deployment fails, rollback to previous version
git revert HEAD
git push heroku main

# Or with Docker
docker pull yourusername/logistica-backend:previous-tag
docker-compose restart
```

---

## Support

For deployment issues:
- Check logs: `npm run logs`
- Contact: devops@your-company.com
- Status page: https://status.your-domain.com

---

**Last Updated**: February 27, 2026  
**Version**: 1.0.0
