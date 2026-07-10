# Frontend - React + Vite + Tailwind

Modern interface for the multi-tenant logistics management platform.

## 🎨 Design System (NEW)

The frontend is undergoing a **complete visual redesign** to match Website and ChatOps modules with a unified design system.

### Current Status 🟢
- ✅ **Phase 1 Complete**: Design system & components (600+ lines CSS, 13 components)
- 🟡 **Phase 2 Ready**: Page refactoring (0/35 pages done, ~4-5 hours remaining)
- ⏳ **Phase 3 Pending**: Testing & optimization

### What's New ✨
- ✅ Unified design tokens (colors, typography, spacing)
- ✅ New component library (Button, Input, Card, Badge, Alert)
- ✅ Light/Dark mode support with automatic switching (toggle 🌙)
- ✅ Brand red color (#d90429) with semantic palette
- ✅ New layout (Header, Sidebar, Footer) integrated

### Getting Started 🚀

**If you're refactoring pages:**
1. Read [PHASE1_COMPLETE.md](./PHASE1_COMPLETE.md) (2-min overview)
2. Follow [START_HERE.md](./START_HERE.md) (quick action plan)
3. Reference [PAGE_MIGRATION_EXAMPLE.md](./PAGE_MIGRATION_EXAMPLE.md) (before/after example)

**Key Component Usage:**
```tsx
import { Button, Input, Card, Badge, Alert } from '@/components/common';

<Button variant="primary">Save</Button>
<Input label="Email" type="email" />
<Card header={<h2>Title</h2>}>Content</Card>
<Badge variant="success">Active</Badge>
```

### Documentation 📚
All redesign guides in `frontend/` root:
- [PHASE1_COMPLETE.md](./PHASE1_COMPLETE.md) — Session summary
- [START_HERE.md](./START_HERE.md) — Quick action plan (read this first!)
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) — Complete roadmap
- [PAGE_MIGRATION_EXAMPLE.md](./PAGE_MIGRATION_EXAMPLE.md) — Before/after examples
- [REFACTORING_CHECKLIST.md](./REFACTORING_CHECKLIST.md) — Component mapping
- [EXAMPLE_REFACTORED_PRODUCTLIST.md](./EXAMPLE_REFACTORED_PRODUCTLIST.md) — Full page example

### Quick Start

```bash
# In root, install dependencies
npm install

# Create .env.local or .env
cp .env.example .env.local

# Run in development
npm run --workspace=frontend dev

# Build for production
npm run --workspace=frontend build

# Tests with coverage
npm run --workspace=frontend test

# Tests with watch mode
npm run --workspace=frontend test:watch

# Lint
npm run --workspace=frontend lint

# Format
npm run --workspace=frontend format
```

## Structure

```
src/
├─ main.tsx / index.tsx   # Entry point
├─ App.tsx                # Root component
├─ api/
│  └─ client.ts          # Axios instance + interceptors
├─ components/            # Reusable components
│  ├─ common/
│  ├─ layout/
│  └─ ...
├─ pages/                 # Pages (routes)
│  ├─ Dashboard.tsx
│  ├─ Products/
│  ├─ Vehicles/
│  └─ ...
├─ hooks/                 # Custom hooks
│  └─ useAuth.ts
├─ contexts/              # Context API
├─ services/              # Data logic (non-API)
├─ types/                 # TypeScript types
├─ utils/                 # Utility functions
└─ styles/                # Global CSS

public/
├─ index.html
├─ favicon.ico
└─ manifest.json
```

## Environment Variables

```bash
# .env.local
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_ENV=development
```

## Tests

```bash
# Run tests with coverage
npm run --workspace=frontend test

# Watch mode (useful during development)
npm run --workspace=frontend test:watch
```

### Test Example with React Testing Library

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render button', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button', { name: /click/i });
    expect(button).toBeInTheDocument();
  });

  it('should call callback when clicked', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<MyComponent onClick={onClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onClick).toHaveBeenCalled();
  });
});
```

## API and Integration

All HTTP requests should go through `src/api/client.ts`:

```typescript
import { apiClient } from '@api/client';

// GET
const users = await apiClient.get('/users');

// POST
const newProduct = await apiClient.post('/products', {
  name: 'Product',
  price: 100
});

// Centralized error interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle auth errors, redirects, etc.
  }
);
```

## Design System and Tailwind

- Colors: defined in `tailwind.config.js`
- Components: reusable in `components/`
# Frontend Logistics

Frontend da demonstração de portfolio para o módulo de logística.

## Objetivo
- mostrar o fluxo de gestão de produtos e stock
- servir como camada visual para a integração com ChatOps

## Execução local
```bash
cd frontend
npm install
npm start
```
- Search by code, description or supplier
- Filter by state, location, and date
- Sorting and pagination

**Supplier and Vehicle Management**
- Complete CRUD
- Integration with products and transports

**Operations History**
- Complete audit
- Filters by action, entity and user
- Record of all changes

</details>

---

## ✨ Features

### Authentication and Security
- Multi-tenant system with total data isolation
- Three profiles: **Super Admin**, **Administrator** and **Operator**
- JWT authentication with refresh tokens
- SQL injection protection via Prisma ORM

### Inventory Management
- **Complete CRUD** of products
- State machine for lifecycle control
- Complete movement history
- Total traceability of each product
- Advanced filters (state, location, supplier, date)

### Analytics Dashboard
- Inventory summary by state
- Distribution charts (donut and bars)
- Movement statistics (last 30 days)
- Top 5 suppliers
- Real-time performance metrics

### 🚚 Transport Management
- Fleet vehicle registration
- Transport creation and tracking
- Integration with products and states
- Status: In Transit, Delivered, Cancelled

### 👥 Supplier Management
- Complete CRUD of suppliers
- Product linkage
- Supply history

### 📜 Audit and History
- Automatic recording of all operations
- Filters by: date, action, entity, user
- Complete tracking of changes
- Immutable logs with timestamps

### 🔔 Notification System
- Alerts for products stuck in analysis
- Real-time notifications
- Notification history

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Description |
|------------|---------|-------------|
| **Node.js** | 18+ | JavaScript Runtime |
| **TypeScript** | ^5.0 | Typed JavaScript Superset |
| **Express.js** | ^4.18 | Minimalist web framework |
| **Prisma** | ^5.0 | Modern ORM for Node.js |
| **PostgreSQL** | 15 | Relational database |
| **JWT** | - | Stateless authentication |
| **Zod** | ^3.22 | TypeScript schema validation |

### Frontend
| Technology | Version | Description |
|------------|---------|-------------|
| **React** | 18 | UI Library |
| **TypeScript** | ^5.0 | Static typing |
| **React Router** | v6 | SPA routing |
| **Tailwind CSS** | ^3.4 | Utility-first CSS framework |
| **Recharts** | ^2.5 | Charts for React |
| **Axios** | ^1.6 | HTTP client |
| **React Hot Toast** | - | Toast notifications |

### DevOps
- **Docker** & **Docker Compose**
- **PostgreSQL 15** (containerized)

---

## 🏗️ Architecture

### Multi-Tenant Pattern

```
┌─────────────────────────────────────────┐
│          Frontend (React SPA)           │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│       Backend (Express + TypeScript)    │
│  ┌────────────────────────────────┐     │
│  │  Auth Middleware (JWT)         │     │
│  └────────────┬───────────────────┘     │
│  ┌────────────▼───────────────────┐     │
│  │  Multi-Tenant Middleware       │     │
│  │  (companyId isolation)         │     │
│  └────────────┬───────────────────┘     │
│  ┌────────────▼───────────────────┐     │
│  │  Controllers & Services        │     │
│  └────────────┬───────────────────┘     │
└───────────────┼─────────────────────────┘
                │ Prisma ORM
┌───────────────▼─────────────────────────┐
│         PostgreSQL Database             │
│  ┌──────────────────────────────────┐   │
│  │ Company 1 Data (isolated)        │   │
│  ├──────────────────────────────────┤   │
│  │ Company 2 Data (isolated)        │   │
│  ├──────────────────────────────────┤   │
│  │ Company N Data (isolated)        │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### State Machine

```mermaid
stateDiagram-v2
    [*] --> Received
    Received --> UnderAnalysis
    UnderAnalysis --> Approved
    UnderAnalysis --> Rejected
    Rejected --> InReturn
    Approved --> InStorage
    InStorage --> InPreparation
    InStorage --> InExpedition
    InPreparation --> InExpedition
    InPreparation --> Cancelled
    InExpedition --> Delivered
    InReturn --> Received
    InReturn --> Eliminated
    Cancelled --> InStorage
    Delivered --> [*]
    Eliminated --> [*]
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Docker** and **Docker Compose** (optional, but recommended)
- **PostgreSQL 15** (if not using Docker)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-user/logistica-multi-tenant.git
cd logistica-multi-tenant
```

2. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### Configuration

1. **Environment Variables**

Create a `.env` file in the `backend/` folder:

```env
# Environment
NODE_ENV=development

# Server
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/logistica

# JWT
JWT_SECRET=your-super-secure-secret-key-minimum-32-random-characters
JWT_EXPIRES_IN=7d

# CORS (optional)
CORS_ORIGIN=http://localhost:3000
```

2. **Database with Docker (Recommended)**

```bash
# Start PostgreSQL
docker-compose up -d

# Run migrations
cd backend
npx prisma migrate dev
npx prisma generate
```

**Or without Docker:**

```bash
# Create database manually in PostgreSQL
createdb logistica

# Run migrations
cd backend
npx prisma migrate dev
npx prisma generate
```

3. **Database Seed (Optional)**

```bash
cd backend
npm run seed
```

This creates:
- 1 Super Admin
- 1 Example Company
- 1 Administrator
- 1 Operator
- Some test products

### Run the Application

**Development Mode:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

**Modo Produção:**

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the build/ folder with nginx or another server
```

### Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (execute `npx prisma studio`)

---

## 📁 Estrutura do Projeto

```
logistica-multi-tenant/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Schema da BD
│   │   ├── migrations/            # Migrações
│   │   └── seed.ts                # Dados iniciais
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # Prisma Configuration
│   │   │   └── env.ts             # Variáveis de ambiente
│   │   ├── controllers/           # Controladores de rotas
│   │   │   ├── auth.controller.ts
│   │   │   ├── products.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── suppliers.controller.ts
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── transports.controller.ts
│   │   │   ├── auditlog.controller.ts
│   │   │   └── notifications.controller.ts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── roleCheck.middleware.ts
│   │   │   └── superAdmin.middleware.ts
│   │   ├── routes/               # Definição de rotas
│   │   ├── services/             # Lógica de negócio
│   │   │   └── product-state.service.ts
│   │   ├── types/                # Tipos TypeScript
│   │   │   ├── express.d.ts
│   │   │   └── product-states.ts
│   │   ├── utils/                # Utilitários
│   │   └── server.ts             # Entry point
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── config.ts        # Axios client
│   │   ├── components/           # Componentes React
│   │   │   ├── CompanyModal.tsx
│   │   │   ├── EditGlobalUserModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── NotificationPanel.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── ProductHistoryModal.tsx
│   │   │   ├── StateTransition.tsx
│   │   │   └── UserFormModal.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # Authentication Context
│   │   ├── pages/                # Páginas/Rotas
│   │   │   ├── AuditLog.tsx
│   │   │   ├── CompanyManagement.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DashboardAdvanced.tsx
│   │   │   ├── GlobalUserManagement.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NewProduct.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   ├── SupplierList.tsx
│   │   │   ├── TransportList.tsx
│   │   │   └── VehicleList.tsx
│   │   ├── App.tsx               # Componente raiz
│   │   ├── index.tsx             # Entry point
│   │   └── index.css             # Estilos globais
│   ├── tailwind.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── docker/
│   └── postgres/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 📖 Usage

### 🎬 Basic Operation Flow

#### 1. Company Registration

1. Go to **http://localhost:3000/register**
2. Fill in:
   - Company name
   - Tax ID
   - Email, phone, address
   - Administrator user data
3. After registration, login with the created credentials

#### 2. Login

- **URL**: http://localhost:3000/login
- Test credentials (after seed):
  - **Admin**: `admin@example.pt` / `admin123`
  - **Operator**: `operator@example.pt` / `operator123`

#### 3. Add Product

1. Go to **Products** → **New Product**
2. Fill in required data:
   - Unique code
   - Description
   - Quantity and unit
   - Supplier
   - Location (optional)
   - Notes (optional)
3. Product is automatically created in **Received** state

#### 4. Manage States

1. In product list, click on a product
2. Click **Change State**
3. Select next allowed state (transitions validated automatically)
4. Add notes if necessary
5. Confirm transition

**Example Flow:**
```
Received → Under Analysis → Approved → In Storage → 
In Preparation → In Expedition → Delivered
```

#### 5. Check History

- Click on a product to see all movements
- Or go to **History** to see all system operations
- Filters by date, action, entity or user

#### 6. Dashboard

- Acede ao **Dashboard** para:
  - Ver resumo do inventário por estado
  - Analisar distribuição com gráficos
  - Monitorizar movimentações recentes
  - Identify products stopped for longer time

---

## 🔌 API Endpoints

### Authentication

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Company registration and admin |  |
| POST | `/api/auth/login` | Login |  |
| GET | `/api/auth/me` | Dados do utilizador |  |

### Products

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/products` | Lista products |  |
| GET | `/api/products/:id` | Detalhes de um product |  |
| POST | `/api/products` | Criar product |  |
| PUT | `/api/products/:id` | Atualizar product |  |
| DELETE | `/api/products/:id` | Eliminar product |  Admin |
| POST | `/api/products/:id/transition` | Alterar estado |  |
| GET | `/api/products/:id/history` | Histórico de movimentações |  |

### Dashboard

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/dashboard/stats` | Estatísticas gerais |  |
| GET | `/api/dashboard/by-status` | Distribuição por estado |  |

### Suppliers

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/suppliers` | List suppliers |  |
| POST | `/api/suppliers` | Create supplier |  |
| PUT | `/api/suppliers/:id` | Update supplier |  |
| DELETE | `/api/suppliers/:id` | Delete supplier |  Admin |

### Vehicles

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/vehicles` | List vehicles |  |
| POST | `/api/vehicles` | Create vehicle |  |
| PUT | `/api/vehicles/:id` | Update vehicle |  |
| DELETE | `/api/vehicles/:id` | Delete vehicle |  Admin |

### Transports

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/transports` | List transports |  |
| POST | `/api/transports` | Create transport |  |
| PUT | `/api/transports/:id` | Update transport |  |
| DELETE | `/api/transports/:id` | Delete transport |  Admin |

### Auditoria

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/auditlog` | Lista logs de auditoria |  |

### Notificações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/notifications` | Lista notificações |  |
| PUT | `/api/notifications/:id/read` | Marcar como lida |  |
| PUT | `/api/notifications/read-all` | Marcar todas como lidas |  |

---

## 🔄 Product States

### Available States

| State | Description | Next Allowed States |
|-------|-------------|-------------------|
| **Received** | Product just arrived at warehouse | Under Analysis |
| **Under Analysis** | Product being inspected | Approved, Rejected |
| **Approved** | Product approved for storage | In Storage |
| **Rejected** | Non-conforming product | In Return |
| **In Storage** | Product stored in warehouse | In Preparation, In Expedition |
| **In Preparation** | Product being prepared for shipment | In Expedition, Cancelled |
| **In Expedition** | Product in transport | Delivered |
| **Delivered** | Product delivered to client (final) | - |
| **In Return** | Product in return process | Received, Eliminated |
| **Cancelled** | Preparation cancelled | In Storage |
| **Eliminated** | Product discarded (final) | - |

### Transition Rules

- **Only valid transitions** are allowed (validated in backend)
- Some states require **mandatory notes**
- Transition history is **immutable** and always recorded
- Permissions are checked before each transition

---

## Permissions

### Super Admin

**Full system access:**
- Management of all companies
- Creation of new global users
- Access to aggregated dashboards
- System configurations

### Administrator (per company)

**Full access within their company:**
- Approve or reject products
- Change any state
- Manage company users
- Access all modules
- Delete products, suppliers, vehicles

### Operator (per company)

**Acesso restrito:**
- Gerir inventário e movimentações
- **Cannot** approve or reject products
- **Não pode** eliminar registos
- Acesso limitado a determinadas transições de estado

---

## 💻 Development Guide

### Before Programming

📖 **Read the requirements document 3 times:**

1. **First reading**: Understand the general scope
2. **Second reading**: Highlight mandatory fields, transitions, business rules
3. **Third reading**: Make notes about implementation

### Plan Before Coding

Draw on paper or visual tool:

1. **Database Structure**
   - Tables and fields
   - Relationships (FK)
   - Important indexes
   - ⚠️ Don't forget `companyId` in multi-tenant tables

2. **Fluxo de Estados**
   - Diagrama com todos os estados
   - Setas com transições permitidas
   - Quem pode fazer cada transição

3. **Estrutura de Pastas**
   - Controllers, services, routes
   - Componentes React
   - Logical organization

4. **Application Screens**
   - Rascunho de cada página
   - Posição de filtros, tabelas, formulários

### Executar Testes

```bash
cd backend
npm test
```

### Generate Prisma Migration

```bash
cd backend
npx prisma migrate dev --name nome_da_migracao
```

### Visualizar Base de Dados

```bash
cd backend
npx prisma studio
```

Acede a http://localhost:5555

### Boas Práticas

-  Sempre validar input com Zod
-  Sempre filtrar por `companyId` em queries multi-tenant
-  Registar operações importantes no audit log
-  Usar transações Prisma para operações complexas
-  Escrever testes para lógica crítica
-  Documentar endpoints na API
-  Usar variáveis de ambiente para secrets

---

## 🗺️ Roadmap

### Fase 1 - Concluído 
- [x] Sistema multi-tenant
- [x] JWT Authentication
- [x] Product CRUD
- [x] Máquina de estados
- [x] Dashboard básico
- [x] Operation history

### Fase 2 - Concluído 
- [x] Supplier management
- [x] Vehicle management
- [x] Transport management
- [x] Sistema de notificações
- [x] Dashboard avançado
- [x] Super Admin

### Fase 3 - Em Desenvolvimento 🚧
- [ ] Relatórios avançados em PDF
- [ ] Data export (Excel, CSV)
- [ ] Carrier API integration
- [ ] Sistema de alertas configurável
- [ ] Mobile app (React Native)

### Fase 4 - Planeado 📋
- [ ] Cross-company integration
- [ ] Transport marketplace
- [ ] BI e análise preditiva
- [ ] ERP integration
- [ ] API pública para terceiros

---

## 🤝 Contribute

Contributions are welcome! This project was developed for the **Commit PT** community on Discord.

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/MyFeature`)
3. Commit changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits small and focused

---

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

## 👥 Community

This project was developed for the [**Commit PT**] community
Join the community to:
- Get help with project questions
- Share improvements
- Collaborate with other developers
- Showcase your portfolio

---

## 📞 Support

If you found any issues or have suggestions:

1. Check existing [Issues](**will add when finished**)
2. Create a new issue if necessary
3. Contact the creator




**Developed by Gonçalo Coimbra**