# Deploy NinaMart on cPanel

## Why images/videos broke online

On cPanel the **React build** (`dist/`) is in `public_html`, but **uploads must live on the server disk** next to the Node API—not inside `frontend/public` on your PC.

Use:

| Setting | Value |
|--------|--------|
| Files on disk | `backend/uploads/` (or `UPLOADS_DIR` in `.env`) |
| Browser URL | `/api/files/your-file.jpg` |
| API proxy | `/api` → Node app |

The storefront rewrites old `/uploads/...` paths to `/api/files/...` automatically.

---

## 1. Build the frontend (on your PC)

```bash
cd frontend
copy .env.production.example .env.production
# Edit .env.production if your API path differs
npm install
npm run build
```

Upload **everything inside** `frontend/dist/` to `public_html/` (include `.htaccess`).

---

## 2. Deploy the backend (Node.js app in cPanel)

1. Upload the `backend/` folder to e.g. `~/ninamart-api/`
2. In cPanel → **Setup Node.js App**:
   - Application root: `ninamart-api`
   - Application URL: often `/api` or a subdomain
   - Application startup file: `index.js`
3. Run **npm install** in the app terminal
4. Create `backend/.env` from `.env.example` (see below)
5. Run `npm run db:setup` once (if DB is empty)
6. **Restart** the Node app

### Required `backend/.env` on the server

```env
PORT=3001
NODE_ENV=production

DB_HOST=localhost
DB_USER=cpanel_mysql_user
DB_PASSWORD=...
DB_NAME=...

JWT_SECRET=long-random-secret
FRONTEND_URL=https://your-domain.com

# Folder on server where uploads are stored (create it, chmod 755)
UPLOADS_DIR=/home/YOUR_USER/ninamart-api/uploads

# Must match frontend VITE_UPLOADS_PUBLIC_URL
UPLOADS_PUBLIC_URL=/api/files
```

Create the uploads folder:

```bash
mkdir -p ~/ninamart-api/uploads
chmod 755 ~/ninamart-api/uploads
```

---

## 3. Copy existing images to the server

Copy all files from your PC:

- `frontend/public/uploads/*` → server `~/ninamart-api/uploads/`

Also copy any files that were uploaded while testing locally.

After upload, a product image URL in the browser should look like:

`https://your-domain.com/api/files/1780321273021-hero.png`

Open that URL directly in the browser. If it loads, the storefront will work.

---

## 4. Proxy `/api` to Node (important)

Your Node app must answer:

- `GET /api/health`
- `GET /api/products`
- `GET /api/files/SOME_FILE.jpg` ← images & videos

In cPanel Node setup, the app URL is usually mounted under `/api`. If images still 404, ask your host to proxy **`/api/*`** to the Node port, not only `/api/products`.

---

## 5. Optional: serve uploads from `public_html/uploads`

If you prefer Apache to serve files (no Node for static files):

1. Put files in `public_html/uploads/`
2. Set in `backend/.env`:
   ```env
   UPLOADS_DIR=/home/YOUR_USER/public_html/uploads
   UPLOADS_PUBLIC_URL=/uploads
   ```
3. Set in `frontend/.env.production`:
   ```env
   VITE_UPLOADS_PUBLIC_URL=/uploads
   ```
4. Rebuild frontend and restart Node

---

## 6. After deploy checklist

- [ ] `https://your-domain.com/api/health` returns `{"status":"ok"}`
- [ ] `https://your-domain.com/api/files/ANY_IMAGE.jpg` opens the image
- [ ] Admin upload → save product → image shows on product page
- [ ] Hero banners exist in `uploads` folder on server

---

## Re-upload products after fixing paths

Old DB rows may still say `/uploads/...`. The site rewrites them to `/api/files/...` as long as the **file exists** in `UPLOADS_DIR`. If a file is missing, re-upload it in Admin.
