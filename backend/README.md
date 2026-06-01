# NinaMart API

Express.js + MySQL + JWT backend for the NinaMart storefront.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy environment file and set MySQL password + JWT secret:

```bash
copy .env.example .env
```

3. Create database and tables:

```bash
npm run db:setup
```

4. Start the API:

```bash
npm run dev
```

API runs at `http://localhost:3001`.

## Default admin

- Email: `admin@ninamart.com`
- Password: `aero2025`

Change these in `.env` before running `db:setup`.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/auth/me` | JWT | Verify token |
| GET | `/api/products` | — | List products |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | JWT | Create product |
| PUT | `/api/products/:id` | JWT | Update product |
| DELETE | `/api/products/:id` | JWT | Delete product |
| POST | `/api/products/seed/reset` | JWT | Reset catalogue |
| POST | `/api/analytics/visit` | — | Record site visit |
| POST | `/api/analytics/product-view` | — | Record product view |
| GET | `/api/analytics/summary` | JWT | Analytics dashboard |
| GET | `/api/analytics/product-views` | JWT | Per-product views |
| DELETE | `/api/analytics` | JWT | Reset analytics |
| POST | `/api/uploads/image` | JWT | Upload product image → `frontend/public/uploads` |
