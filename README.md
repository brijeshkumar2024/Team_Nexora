# Team Nexora Platform

Ultra-luxury, investor-ready MERN platform for **TEAM NEXORA**.  
Tagline: **Engineering the Future. Executing Bold Ideas.**

## What is built

- Conversion-focused futuristic landing page
- Dynamic projects module (MongoDB-backed)
- Recruitment system with application intake and admin review
- Unified contact system with MongoDB storage + email notifications
- JWT-secured admin dashboard with role-based access
- Certificate structure for unpaid project contributions
- Enterprise-ready folder architecture for frontend and backend

## Tech Stack

- Frontend: React + Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth/Security: JWT, password hashing, RBAC, validation middleware
- API Style: REST with structured response format

## Folder Structure

```text
Nexoro_website/
├─ client/
│  ├─ src/
│  │  ├─ animations/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ services/
│  │  └─ styles/
│  ├─ .env.example
│  └─ package.json
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  └─ validators/
│  ├─ .env.example
│  └─ package.json
├─ package.json
└─ README.md
```

## Backend Modules

- `projects`: list/filter/detail/create/update/delete projects
- `applications`: recruitment submissions, review, assignment, CSV export
- `admin`: dashboard metrics
- `certificates`: templates + contribution records + approval workflow
- `auth`: secure login + current user endpoint
- `contact`: public contact intake + admin review workflow

## Security and Best Practices Included

- Environment-variable based config
- Helmet + CORS + rate limiting + Mongo sanitize
- Password hashing with `bcryptjs`
- JWT auth middleware
- Role-based route protection (`admin`, `lead`, `member`)
- Request validation with `express-validator`
- Centralized error handling
- Standardized API response contract

## Local Setup

1. Install dependencies:
```bash
npm --prefix server install
npm --prefix client install
```

2. Configure environment files:
```bash
copy server/.env.example server/.env
copy client/.env.example client/.env
```

3. Update `server/.env`:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (typically `http://localhost:5173`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CONTACT_RECEIVER_EMAIL`
- `RESEND_API_KEY` (recommended for Render)
- `RESEND_API_BASE_URL` (optional, default `https://api.resend.com`)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM_NAME`
- `MAIL_FROM_EMAIL`

4. Update `client/.env`:
- `VITE_API_BASE_URL=http://localhost:5000/api/v1`

5. Seed admin account:
```bash
npm --prefix server run seed:admin
```

6. Run backend and frontend in separate terminals:
```bash
npm --prefix server run dev
npm --prefix client run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account and a cluster.
2. Create a database user with strong password.
3. In Network Access, allow your deployment IPs (or `0.0.0.0/0` temporarily).
4. Get connection string from Atlas and set `MONGO_URI` in `server/.env`.
5. Ensure database name is appended (for example `/nexora`).

## Deploy Backend on Render

1. Push code to GitHub.
2. Create a new **Web Service** in Render using the repository.
3. Set root directory to `server`.
4. Build command:
```bash
npm install
```
5. Start command:
```bash
npm start
```
6. Add environment variables in Render:
- `NODE_ENV=production`
- `PORT=10000` (or Render default)
- `CLIENT_URL=https://<your-vercel-domain>`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CONTACT_RECEIVER_EMAIL`
- `RESEND_API_KEY` (recommended for Render)
- `RESEND_API_BASE_URL` (optional)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM_NAME`
- `MAIL_FROM_EMAIL`
Important:
- Do not wrap env values in quotes (for example use `smtp.gmail.com`, not `"smtp.gmail.com"`).
- If using Gmail App Password, paste it without spaces.
- Backend prefers Resend when fully configured, and automatically falls back to SMTP when Resend is missing or send/verification fails.

7. Deploy and test `GET /api/v1/health`.

## Deploy Frontend on Vercel

1. Create a new Vercel project from the same repository.
2. Set project root to `client`.
3. Framework preset: **Vite**.
4. Add environment variable:
- `VITE_API_BASE_URL=https://<your-render-domain>/api/v1`
5. Deploy.
6. Confirm backend CORS `CLIENT_URL` exactly matches your Vercel domain.

## API Routes (v1)

- `POST /auth/login`
- `GET /auth/me`
- `GET /projects`
- `GET /projects/:slug`
- `POST /projects` (admin/lead)
- `PATCH /projects/:id` (admin/lead)
- `DELETE /projects/:id` (admin)
- `POST /applications`
- `GET /applications` (admin/lead)
- `GET /applications/project/:id` (admin/lead)
- `PATCH /applications/:id` (admin/lead)
- `GET /applications/export/csv` (admin/lead)
- `POST /contact` (public, rate-limited)
- `GET /contact` (admin/lead)
- `PATCH /contact/:id` (admin/lead)
- `GET /admin/stats` (admin/lead)
- `GET /certificates/templates` (admin/lead)
- `POST /certificates/templates` (admin/lead)
- `GET /certificates/records` (admin/lead)
- `POST /certificates/records` (admin/lead)
- `PATCH /certificates/records/:id/approve` (admin/lead)

## Health Endpoint

- `GET /api/health`
- `GET /api/v1/health`

## Product Notes

- Certificate handling is intentionally **structure-only** for unpaid projects.
- No fake generation pipeline is included.
- UI is fully responsive and built with a custom luxury visual system (dark midnight + soft gold glow).
