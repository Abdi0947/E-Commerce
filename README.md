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

### Admin login


Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` before `npm run db:setup` to use custom credentials.

## What moved to the backend

| Before (localStorage) | After (API + MySQL) |
|----------------------|---------------------|
| `aero_products` | `GET/POST/PUT/DELETE /api/products` |
| Admin password in code | JWT + `admins` table |
| `aero_analytics` | `POST /api/analytics/*` + analytics tables |

Visitor session id stays in `sessionStorage` (anonymous tracking only).
