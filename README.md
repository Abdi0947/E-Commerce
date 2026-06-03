# NinaMart E-Commerce

React storefront with Express + MySQL API.

## Project structure

- `frontend/` — Vite + React storefront and admin UI
- `backend/` — Express.js API, JWT auth, MySQL

## Quick start

### 1. MySQL

Create the database (requires MySQL 8+ running locally):

```bash
cd backend
npm install
copy .env.example .env
# Edit .env with your MySQL password and a strong JWT_SECRET
npm run db:setup
npm run dev
```

API: `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Store: `http://localhost:5173` — API requests proxy to port 3001.

### cPanel / production

See **[DEPLOY-CPANEL.md](./DEPLOY-CPANEL.md)** for upload paths, `.env` settings, and fixing images/videos online.

- Uploads are stored in `backend/uploads/` on the server
- Browsers load them at `/api/files/...` (proxied with `/api` to Node)
- Build frontend with `frontend/.env.production` (`VITE_UPLOADS_PUBLIC_URL=/api/files`)

### Admin login


Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` before `npm run db:setup` to use custom credentials.

## What moved to the backend

| Before (localStorage) | After (API + MySQL) |
|----------------------|---------------------|
| `aero_products` | `GET/POST/PUT/DELETE /api/products` |
| Admin password in code | JWT + `admins` table |
| `aero_analytics` | `POST /api/analytics/*` + analytics tables |

Visitor session id stays in `sessionStorage` (anonymous tracking only).
