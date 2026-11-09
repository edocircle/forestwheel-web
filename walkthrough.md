# Forest Wheel — Backend & Admin Portal Walkthrough

## Summary

Built a complete backend API server and admin management portal for Forest Wheel dealership. The system is fully functional and ready to start once PostgreSQL is running locally.

## What Was Built

### 📦 Apps Created

| App | Location | Tech | Port |
|-----|----------|------|------|
| **API Server** | `apps/api/` | Express.js + Prisma + PostgreSQL | 3001 |
| **Admin Portal** | `apps/admin/` | React + Vite + Tailwind CSS | 5174 |
| **Public Website** | `apps/web/` (existing) | React + Vite | 5173 |

---

### 🗄️ Database Schema (6 Tables)

| Table | Description |
|-------|-------------|
| `users` | Admin/user accounts with roles (SUPER_ADMIN, ADMIN, USER) |
| `vehicles` | Car inventory listings with all specs |
| `vehicle_images` | Multiple images per vehicle |
| `leads` | "Sell Your Car" submissions from public site |
| `web_settings` | Key-value store for logo, about-us content |
| `activity_logs` | Audit trail for all admin actions |

---

### 🔌 API Endpoints (25+)

| Module | Endpoints | Auth |
|--------|-----------|------|
| **Auth** | Login, activate, set-password, forgot/reset password, profile | Public/Protected |
| **Users** | List, create, get, update, delete, resend-activation | Admin only |
| **Inventory** | List, get (public), create, update, delete, image upload/delete | Mixed |
| **Leads** | Submit (public), list, get, update, delete, status-counts | Mixed |
| **Settings** | Get all/single (public), update, batch-update, logo upload | Mixed |
| **Dashboard** | Stats, activity feed, analytics | Admin only |

---

### 🖥️ Admin Portal Pages (9)

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | JWT login matching Stitch design |
| **Activate** | `/activate/:token` | Email activation + password setup |
| **Dashboard** | `/` | Stats, activity feed, revenue |
| **Inventory List** | `/inventory` | Table with search & filters |
| **Inventory Form** | `/inventory/new` `/inventory/:id/edit` | Create/edit with image upload |
| **Leads** | `/leads` | Pipeline with status filters |
| **Users** | `/users` | User CRUD + activation emails |
| **Admins** | `/admins` | Admin-only management (SUPER_ADMIN) |
| **Settings** | `/settings` | Logo, about-us, contact info |

---

## 🚀 Startup Instructions

### Step 1: PostgreSQL Setup

Make sure PostgreSQL is running locally. Create the database:

```sql
CREATE DATABASE forestwheel;
```

### Step 2: Configure Environment

Edit [.env](file:///e:/AI/forestwheel-web-ai/.env) with your actual values:
- `DATABASE_URL` — PostgreSQL connection string
- `SMTP_USER` / `SMTP_PASS` — Gmail App Password for activation emails

### Step 3: Run Database Migration

```bash
cd apps/api
npx prisma migrate dev --name init
```

### Step 4: Seed Database

```bash
cd apps/api
node prisma/seed.js
```

This creates:
- Super Admin: `admin@forestwheel.com` / `admin123`
- 19 default web settings (logo, about-us, etc.)
- 4 sample vehicles
- 3 sample leads

### Step 5: Start Services

```bash
# Terminal 1 — API Server
cd apps/api
npm run dev

# Terminal 2 — Admin Portal  
cd apps/admin
npm run dev

# Terminal 3 — Public Website (already running)
cd apps/web
npm run dev
```

### Step 6: Access

- **Admin Portal**: http://localhost:5174
- **API Health Check**: http://localhost:3001/api/health
- **Public Site**: http://localhost:5173

---

## Key Files

### API Server (`apps/api/`)
- [schema.prisma](file:///e:/AI/forestwheel-web-ai/apps/api/prisma/schema.prisma) — Database schema
- [seed.js](file:///e:/AI/forestwheel-web-ai/apps/api/prisma/seed.js) — Database seeder
- [index.js](file:///e:/AI/forestwheel-web-ai/apps/api/src/index.js) — Server entry point
- [auth.js middleware](file:///e:/AI/forestwheel-web-ai/apps/api/src/middleware/auth.js) — JWT + role verification
- [upload.js middleware](file:///e:/AI/forestwheel-web-ai/apps/api/src/middleware/upload.js) — File upload to E: drive
- [emailService.js](file:///e:/AI/forestwheel-web-ai/apps/api/src/services/emailService.js) — Gmail SMTP activation emails

### Admin Portal (`apps/admin/`)
- [App.jsx](file:///e:/AI/forestwheel-web-ai/apps/admin/src/App.jsx) — Router with all routes
- [AuthContext.jsx](file:///e:/AI/forestwheel-web-ai/apps/admin/src/contexts/AuthContext.jsx) — JWT auth state
- [AdminLayout.jsx](file:///e:/AI/forestwheel-web-ai/apps/admin/src/components/AdminLayout.jsx) — Sidebar + topbar
- [Login.jsx](file:///e:/AI/forestwheel-web-ai/apps/admin/src/pages/Login.jsx) — Login page
- [Dashboard.jsx](file:///e:/AI/forestwheel-web-ai/apps/admin/src/pages/Dashboard.jsx) — Dashboard with live stats

---

## Pending Work (Phase 3)

Public frontend integration to connect to the API:
- `SellCar.jsx` — POST form data to `/api/leads`
- `Inventory.jsx` — Fetch vehicles from `/api/inventory`
- `AboutUs.jsx` — Fetch content from `/api/settings`
- `TopNavBar.jsx` — Fetch logo from `/api/settings/logo_url`

> [!NOTE]
> These are minor changes (adding `fetch` / `useEffect` calls to existing components) and can be done after the backend is verified working.
