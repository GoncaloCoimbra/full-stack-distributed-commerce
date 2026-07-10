# 🎮 How to Use the Demo for Portfolio Review

## Quick Access (For Portfolio Reviewers)

The demo is designed to work **friction-free** — like game demos. Anyone can test the app in seconds:

### 1️⃣ **Start the Application** (Clone & Run)

```bash
# Clone the repository
git clone https://github.com/GoncaloCoimbra/logistica-multi-tenant.git
cd logistica-multi-tenant

# Install dependencies
npm install

# Start backend (terminal 1)
npm run --workspace=backend-nest start:dev

# Start frontend (terminal 2)
npm run --workspace=frontend start

# Seed demo data (one-time, terminal 3)
npm run --workspace=backend-nest seed:demo
```

**Result:** Backend runs on `http://localhost:3000`, Frontend on `http://localhost:3001`

---

### 2️⃣ **One-Click Demo Access** (On Login Screen)

When you see the login page at `http://localhost:3001/login`:

1. **Look for the green button: "Try Demo"**
2. **Click it** - No password needed!
3. **Instant access** to pre-populated demo data

```
┌─────────────────────────────────┐
│  📧 Email          [login@...] │
│  🔒 Password       [••••••••]  │
│  [Sign In Button (Blue)]        │
│  [Try Demo Button (Green)] ✅   │
│  or Sign Up                     │
└─────────────────────────────────┘
```

---

### 3️⃣ **Demo Mode Badge** (Visual Indicator)

Once logged in with demo account:

- **Badge appears in top-right corner:**  
  `🎮 DEMO MODE - Read-only access` (Orange/animated)

- **This indicates:**
  - You're in trial mode
  - All data is sample/pre-populated
  - Designed for portfolio reviewers

---

## 🎯 What You'll See in Demo

The demo account has instant access to:

### **Dashboard (Home)**
- 📊 Real-time metrics with sample data
- 📈 Charts showing product movement trends
- 🚚 Active transports visualization
- 💾 Inventory overview with 12 sample products

### **Products** (📦)
- ✅ 12 realistic products ready to explore
  - Electronics (Control Panels, LED Lights, Cables)
  - Mechanical (Pumps, Motors, Gearboxes)
  - Chemical (Lubricants, Paint)
  - Plastics (Sheets, Polycarbonate)
  - Metals (Fasteners, Aluminum Profiles)

- **Status Examples:** RECEIVED → IN_ANALYSIS → APPROVED → DISPATCHED
- **Complete movement history** for each product
- **Real supplier associations** (10 different suppliers)

### **Suppliers** (🏢)
- ✅ 10 pre-created worldwide suppliers
- Complete contact information
- Product associations

### **Transports** (🚚)
- Pre-configured transport routes
- Vehicle assignments
- Real-time tracking simulation

### **Live Dashboard**
- Real-time status updates and metrics
- Multi-language UI support (Portuguese and English)

---

## 💡 Demo Account Credentials

**Email:** `demo@logistica.com`  
**Password:** `demo123`

When you click "Try Demo" button:
- Auto-login happens automatically (no typing needed)
- Same credentials if you want to login manually

---

## 🌍 Using the Demo for Portfolio Review

### **Best Practices for Reviewers:**

1. **Start the app** (frontend + backend)
2. **Open `http://localhost:3001`**
3. **Click "Try Demo"** for instant access
4. **Explore these key features:**
   - ✅ Dashboard with real-time metrics
   - ✅ Product management (create, edit, view history)
   - ✅ Supplier list with details
   - ✅ Multi-tenant isolation (only demo company data visible)
   - ✅ User management (admin view)
   - ✅ Portuguese UI localization
   - ✅ Responsive design (mobile-friendly)

### **Key Differentiators to Notice:**

- **Data Completeness:** 12 products with full movement history
- **Real Workflows:** Product → IN_ANALYSIS → APPROVED → DISPATCHED
- **Multi-Tenant Ready:** Only sees "Demo Company" data
- **Professional UI:** Dark theme, real-time charts, responsive
- **Portuguese Support:** All labels translated
- **Security:** Role-based access (OPERATOR role in demo)

---

## 🔍 What the Demo Doesn't Show

- **Create/Edit Products** (OPERATOR role is read-only for demo safety)
- **Delete Operations** (protected in demo mode)
- **User Registration** (demo account pre-created)

*This is intentional* - like game free trials, you see all features but core creation/deletion is limited.

---

## 🚀 Upgrading from Demo

To use full features (create/edit/delete products):

1. **Create your own account:**
   - Go to `/register` on login page
   - Create company and user
   - Full admin access to your company data

2. **Or login as test admin:**
   - Email: `admin@logistica.com`
   - Password: `admin123`
   - Full permissions for your test company

---

## 📱 Portfolio Presentation Checklist

When showcasing this demo to:

### **Portfolio Reviewers:** ✅
- [ ] "Click Try Demo button"
- [ ] Show dashboard with metrics
- [ ] Navigate through products, suppliers, transports
- [ ] Point out: "All data pre-populated, real workflows"
- [ ] Highlight: "Portuguese UI, responsive design"
- [ ] Show badge: "DEMO MODE indicates trial access"

### **Potential Clients:** ✅
- [ ] Start with dashboard overview
- [ ] Demonstrate product tracking workflow
- [ ] Show supplier management
- [ ] Highlight reporting/analytics
- [ ] Mention: Customizable, scalable, enterprise-ready

### **Technical Interviewers:** ✅
- [ ] Show architecture in README
- [ ] Mention: NestJS + React + Prisma + PostgreSQL
- [ ] Point out:  Multi-tenant architecture
- [ ] Discuss: JWT authentication
- [ ] Mention: GitHub Actions CI/CD pipeline

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Try Demo" button grayed out | Backend not running (check `localhost:3000`) |
| Login fails with error | Run seed script: `npm run --workspace=backend-nest seed:demo` |
| No products visible | Check seed completed, or verify companyId in DB |
| Demo badge not showing | Refresh page, check localStorage for `isDemo` flag |
| Password not working | Use "Try Demo" button instead (auto-login) |

---

## 🎬 Expected Experience

**Without demo:**
```
Interview → Clone → Install → Setup → Register → Login → See empty DB → 😞
       (10-15 minutes)
```

**With demo:**
```
Interview → Clone → Install → Login → Click "Try Demo" → Full app loaded → 🚀
       (3-5 minutes)
```

---

## 📊 Demo Data Summary

| Category | Count | Details |
|----------|-------|---------|
| **Products** | 12 | With movement history (2-3 movements each) |
| **Suppliers** | 10 | Complete contact info, NIF numbers |
| **Movements** | 24-36 | Status transitions (RECEIVED → DISPATCHED) |
| **Demo User** | 1 | `demo@logistica.com` (OPERATOR role) |
| **Company** | 1 | "Company Demo" - pre-created |

---

## 🔐 Security Notes

- Demo account has **OPERATOR role** (read-only for safety)
- All data is **sandboxed** to demo company
- No real data exposed
- Perfect for portfolio/interview scenarios

---

## 💬 Support

**Questions about running the demo?** Check the main [README.md](./README.md) for:
- Full architecture overview
- Technology stack details
- Deployment instructions
- Contributing guidelines

---

**Last Updated:** March 2025  
**Demo Feature Added:** Portfolio launch ready ✅
