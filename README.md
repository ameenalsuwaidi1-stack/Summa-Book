# SummaBook (Vite + React + PHP API)

This project now works as a full-stack app for cPanel deployments:
- Frontend: Vite/React app (deploy `dist/` to `public_html`).
- Backend: `api/index.php` REST API for login/register/books.
- Database: MySQL schema in `schema.sql`.

## Local development

### 1) Install dependencies
```bash
npm install
```

### 2) Run frontend
```bash
npm run dev
```

The frontend uses `/api/index.php` by default. To point to another API URL:

```bash
VITE_API_BASE=https://your-domain.com/api/index.php
```

## Build for production

```bash
npm run build
```

Upload the generated `dist/` files to `public_html/` (or your chosen document root).

## cPanel deployment guide

### 1) Upload frontend files
- Build locally with `npm run build`.
- Upload `dist/*` into `public_html/`.

### 2) Upload API
- Upload the `api/` folder so your API is available at:
  - `https://your-domain.com/api/index.php`

### 3) Configure database
- Create a MySQL database + user in cPanel.
- Import `schema.sql` using phpMyAdmin.

### 4) Set PHP env values (or edit defaults in `api/index.php`)
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`

If your host does not support environment variables in Apache/PHP, set those values directly at the top of `api/index.php`.

### 5) API routes used by frontend
- `POST /api/index.php/login`
- `POST /api/index.php/register`
- `GET /api/index.php/books`
- `POST /api/index.php/books`
- `PUT /api/index.php/books/{id}`
- `DELETE /api/index.php/books/{id}`
- `POST /api/index.php/progress`

## Default admin user from schema

- Email: `admin@summa.com`
- Password: `admin123`

> Change the admin password after first login in production.
