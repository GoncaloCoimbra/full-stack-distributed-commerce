# 🚀 Deploy Online Demo (Railway.app)

## Quick Deploy in 3 Steps

Your app will be **live online** in minutes. No coding needed!

---

## **Step 1: Create Railway Account** (2 minutes)

1. Go to **https://railway.app**
2. Click **"Start Free"**
3. Sign up with GitHub (recommended - easiest)
4. Authorize Railway to access your GitHub

---

## **Step 2: Deploy This Repo** (3 minutes)

1. **Inside Railway dashboard**, click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Search and select: **`logistica-multi-tenant`**
4. Click **"Deploy now"**

That's it! Railway automatically:
- ✅ Clones your code
- ✅ Installs dependencies
- ✅ Builds the project
- ✅ Starts the app
- ✅ Assigns a public URL

---

## **Step 3: Configure Environment Variables** (2 minutes)

Once deployment starts, Railway shows you a dashboard:

1. Click on your **project**
2. Go to **"Variables"** tab
3. Add these variables:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/logistica
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=3000
```

⚠️ **IMPORTANT:** Railway provides a **free PostgreSQL** database!
- Just add another service: PostgreSQL
- It auto-generates the DATABASE_URL

---

## **Expected Result**

After deployment completes (3-5 minutes):

```
✅ Backend running: https://logistica-backend-prod.railway.app
✅ Frontend running: https://logistica-frontend-prod.railway.app
✅ Database: PostgreSQL running in Railway
✅ Demo account ready: demo@logistica.com / demo123
```

---

## **One-Click Live Demo Link**

Once deployed, you get a public URL like:

```
https://logistica-prod.railway.app
```

**This is your portfolio demo link!** Share it anywhere:
- Portfolio website
- LinkedIn: "Try my demo → [URL]"
- GitHub profile
- Interviews: "Open this link and click 'Try Demo'"

---

## **Troubleshooting Deployment**

| Issue | Solution |
|-------|----------|
| "Build failed" | Check that all code compiles locally first |
| "Database connection error" | Add PostgreSQL service in Railway + set DATABASE_URL |
| "PORT not found" | Railway auto-assigns port, use `process.env.PORT` |
| "Node modules missing" | Railway auto-runs `npm install` |

---

## **After Deployment**

Your portfolio can now say:

```
🎮 LIVE DEMO: https://logistica-prod.railway.app
   Click → Try demo instantly (accounts: demo@logistica.com / demo123)
```

No more "clone and install". Just **click and see it work!** 🚀

---

## **Next Steps**

1. ✅ Create Railway account (free)
2. ✅ Deploy from GitHub (auto-sync)
3. ✅ Get live URL
4. ✅ Share in portfolio
5. ✅ Done! Demo lives online forever

---

**Want help setting up?** Ask me after you create the Railway account!
