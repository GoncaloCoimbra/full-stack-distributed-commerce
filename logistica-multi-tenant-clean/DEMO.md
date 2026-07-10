# Demo de Portfolio

Guia rápido para demonstrar o fluxo de integração entre ChatOps e Logistics.

## Passos rápidos
1. Iniciar os serviços com Docker Compose.
2. Abrir o backend de logística em http://localhost:3000/api/docs.
3. Enviar um comando `/stock SKU-001` no ChatOps.
4. Confirmar que o backend recebe a consulta e publica o evento no Redis.

## 🎯 Features to Explore

### 1. **Dashboard**
- Real-time inventory statistics
- Product distribution by status
- Recent activity log
- Top suppliers ranking

**Try this:**
1. Go to Dashboard
2. See the 4 stat cards (Total, Active, Inactive, by Role)
3. Check the charts below

### 2. **Products Management**
- **View all products** with advanced filters
- **Create new product** with supplier info
- **Track movements** (status changes)
- **Search & filter** by code, description, location

**Try this:**
1. Click "Products" in sidebar
2. See the list of pre-populated products
3. Click a product to view details
4. View "Movements" tab to see history
5. Create a new product with "New Product" button

### 3. **Users Management**
- View company users with roles (Admin, Operator)
- Statistics: Active/Inactive users by role
- Create, edit, deactivate users

**Try this:**
1. Click "Users" in sidebar
2. See user stats at top
3. Check the users table
4. Click edit/delete actions

### 4. **Multi-Tenant Isolation**
- Each company has isolated data
- Super admin can manage multiple companies
- Users only see their company's data

**Try this:**
1. Look at company info (top right menu)
2. See your company name
3. Notice products belong to your company only

---

## 🧪 Testing the API (Swagger)

Visit: **http://localhost:3000/api/docs**

### Try these endpoints:

#### 1. Get Products
```bash
curl -X GET "http://localhost:3000/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 2. Create Product
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "internalCode": "PROD-TEST-001",
    "description": "Test Product",
    "quantity": 100,
    "unit": "UN",
    "currentLocation": "Warehouse A",
    "supplierId": "supplier-id-here"
  }'
```

#### 3. List Users
```bash
curl -X GET "http://localhost:3000/api/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📸 Demo Scenario (10 minutes)

Follow this script to impress anyone:

### **Scenario: New Logistics Company Onboarding**

**Step 1: Dashboard Overview (1 min)**
- "This is the real-time dashboard showing company metrics"
- Point to stats: "We have 2 active users, 5 products in inventory"
- "These charts update automatically as we manage inventory"

**Step 2: Products Workflow (4 min)**
```
Navigate: Products → Create Product
Fill in:
  - Code: PROD-DEMO-2026
  - Description: Demo Product from Supplier A
  - Quantity: 50 units
  - Supplier: [Select one]
  - Location: Warehouse Main
Click "Create" → See success message
Go back to Products list → Find your new product → Click it
Show: All product details, movements history (empty for new)
```

**Step 3: User Management (2 min)**
```
Navigate: Users
Show: "2 Active users - 1 Admin, 1 Operator"
(If allowed) Create new user:
  - Name: Demo User
  - Email: demo@company.com
  - Role: Operator
Watch it appear in the table instantly
```

**Step 4: API Documentation (2 min)**
```
Open: http://localhost:3000/api/docs
Show Swagger UI
Click "Try it out" on GET /api/products
Execute and show the JSON response
"This is how other systems integrate with us"
```

**Step 5: Show Code Structure (1 min)**
```
Open vs code, show:
- backend-nest/src/modules structure
- frontend/src components
"Enterprise-grade TypeScript everywhere"
```

---

## 📊 What to Highlight in Demo

### **Architecture**
- "Monorepo with npm workspaces - frontend and backend in one project"
- "Full TypeScript from DB to UI - 0 JavaScript"
- "NestJS for enterprise backend structure"

### **Security**
- "JWT authentication with refresh tokens"
- "Multi-tenant isolation - companies can't see each other's data"
- "Role-based access control (RBAC)"

### **Database**
- "PostgreSQL with Prisma ORM"
- "Full audit trail - every change is logged"
- "Automatic migrations"

### **DevOps**
- "Docker containerization"
- "GitHub Actions CI/CD"
- "Kubernetes ready"

---

## 🚀 Next: Deploy to Production

Once you're impressed, try deploying:

### Frontend to Vercel
```bash
cd frontend
npm run build
# Deploy via Vercel CLI or Web UI
```

### Backend to Railway/Render
```bash
# Push to GitHub
git push

# Connect repository to Railway.app
# It auto-deploys from main branch
```

Full deployment guide in [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 💡 Pro Tips

1. **Pre-seed data**
   ```bash
   cd backend-nest
   npm run seed
   # Populates realistic demo data
   ```

2. **Dark mode** - Already enabled (see top menu)

3. **Slow network simulation** - DevTools > Network > Throttle to "Slow 3G" to see loading states

4. **Create multiple accounts** - Test multi-tenant isolation by creating 2 users in different companies

5. **Mobile view** - Press F12, toggle device toolbar to see responsive design

---

## ❓ Troubleshooting

### Data not loading?
```bash
# Check database connection
# Verify .env DATABASE_URL is correct
# Run migrations:
cd backend-nest
npx prisma migrate deploy
```

### Port already in use?
```bash
# Change port in backend .env
PORT=3001

# Or kill process:
# Windows: taskkill /pid YOUR_PID /f
# Mac/Linux: kill -9 YOUR_PID
```

### Can't login?
```bash
# Create new user via signup
# Or query database directly:
cd backend-nest
npx prisma studio
# Create user in Users table
```

---

## 📞 Questions?

Check [PROJECT_COMPLETION_REPORT.md](./docs/PROJECT_COMPLETION_REPORT.md) for technical details.

Happy exploring! 🎉
