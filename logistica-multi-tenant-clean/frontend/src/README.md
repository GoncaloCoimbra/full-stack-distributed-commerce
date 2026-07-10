# Frontend Source Notes

Este diretório contém os componentes do frontend da demonstração de portfolio.

Complete inventory and logistics management system for multiple companies (multi-tenant), with state control, movement history, and metrics dashboard.

---

 📋 Main Features

  Company and User Management
- Registration of independent companies
- Multi-tenant with total data isolation
- Profiles: **Administrator** and **Operator**
- Secure JWT authentication

 Inventory Management
- Complete CRUD of products
- State machine with 11 different states
- Complete movement history
- Filters by state, supplier, and location
- Validation of state transitions

 Product States
1. **Received** → Product arrived at warehouse
2. **Under analysis** → Being verified
3. **Rejected** → Non-conforming
4. **Approved** → Validated for storage
5. **In storage** → Stored in warehouse
6. **In preparation** → Being packaged
7. **In shipping** → In transport
8. **Delivered** → Arrived at destination
9. **In return** → Returned to supplier
10. **Eliminated** → Discarded
11. **Cancelled** → Shipment cancelled

 Dashboard and Metrics
- Total products
- Products in storage
- Deliveries made
- Movements in the last 30 days
- Distribution charts by state
- Top 5 suppliers

 Supplier Management
- CRUD of suppliers (complete backend)
- Association products ↔ suppliers
- Product history by supplier

---

  How to Run the Project

 Prerequisites
- Docker Desktop installed
- Node.js 18+ (optional, for development)

 1. Clone the repository
```bash
git clone <repository-url>
cd LOGISTICA-MULTI-TENANT
```

 2. Configure environment variables

**Backend (.env in backend):**
```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/logistica"
JWT_SECRET="replace-with-a-secure-random-secret"
PORT=5000
```

**Frontend (.env in frontend):**
```env
VITE_API_URL=http://localhost:5000
```

 3. Run with Docker
```bash
# Start all services
docker-compose up --build

# Wait until you see:
# ✓ Backend running on port 5000
# ✓ Frontend running on port 5173
# ✓ PostgreSQL running on port 5432

 4. Access the application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000



 Test Credentials

 Administrator Account

Email: admin@empresa.com
Password: Admin123!

 Operator Account

Email: operator@empresa.com
Password: operator123!




  Basic Operational Flow

 1. Register Company and User
1. Access `/register`
2. Fill: Company Name, Name, Email, Password
3. Login with created credentials

 2. Add Product
1. Access **"Products"** in the menu
2. Click **"New Product"**
3. Fill all required fields
4. The product is created in **"Received"** state

 3. Change Product State
1. In the product list, click **"View Details"**
2. In the **"State Transition"** section, choose the next state
3. Fill required data (if applicable)
4. Click **"Change State"**
5. The history is automatically recorded

 4. View Dashboard
1. Access **"Dashboard"**
2. View real-time metrics
3. Analyze distribution charts


 Technical Architecture

 Backend
- **Node.js + Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **MVC Architecture**

 Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Recharts** (charts)
- **Lucide React** (icons)

 Infrastructure
- **Docker + Docker Compose**
- **Multi-stage builds**
- **Hot reload in development**


Project Structure

LOGISTICA-MULTI-TENANT/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

  Security

- Mandatory JWT authentication
- Automatic filtering by `company_id` in all queries
- Permission validation by profile (Admin/Operator)
- Input validation in all routes
- Total data isolation between companies

---

 Business Rules

 State Transitions
- **Only Administrators** can approve products
- **Operators** can receive, prepare, and ship
- Certain transitions require mandatory data (ex: rejection reason)
- All transitions generate history record

 Multi-Tenancy
- Each company has unique `company_id`
- All queries are automatically filtered
- Users only see their company's data



 Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```


  Useful Scripts

 Backend
```bash
npm run dev          # Development
npm run build        # Build for production
npm run migrate      # Run migrations
npm run seed         # Populate database
```

 Frontend
```bash
npm run dev          # Development
npm run build        # Build for production
npm run preview      # Preview the build



 Troubleshooting

 Error: "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

 Error: "Cannot connect to database"
```bash
# Check if PostgreSQL is running
docker ps

# Restart services
docker-compose down
docker-compose up --build
```

 Clean everything and restart
```bash
docker-compose down -v
docker-compose up --build
```

---

 Implementation Levels

  Basic Level (100%)
- Functional authentication
- Multi-tenant
- Product CRUD
- Base states
- Docker
  Intermediate Level (95%)
- State machine with rules
- Movement history
- User profiles
- Frontend consuming API
- Dashboard with metrics

  Advanced Level (Partial)
- Logs and audit (complete backend)
- Dashboard with charts
- Supplier management (backend)



 Author
Developed as a Full Stack skills assessment project.


License
This project is academic property.