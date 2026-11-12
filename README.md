# Portfolio — Public Website + Separate Admin + Backend API

A full-stack portfolio system with three independently runnable applications. The public website and admin panel have separate interfaces and deployments; both communicate with one Express API and MongoDB database.

## Architecture

| Application | Directory | Local URL | Purpose |
|---|---|---|---|
| Public portfolio | `/` | `http://localhost:5173` | Public-facing website |
| Admin panel | `/admin-panel` | `http://localhost:5174` | Private content management interface |
| Backend API | `/backend` | `http://localhost:5000` | REST API, auth verification, MongoDB, contact inbox and media signatures |

**Stack:** React + Vite, Node.js + Express, MongoDB Atlas + Mongoose, Firebase Authentication (admin identity and custom claims), Cloudinary (media storage).

## Features

- Separate public and admin interfaces with a shared backend.
- Admin email/password, Google sign-in and password reset through Firebase Authentication.
- Every admin API write verifies the Firebase ID token and `admin: true` custom claim on the server.
- MongoDB-backed portfolio content API; public site refreshes published content every 15 seconds.
- Admin JSON editor for profile, education, experience, projects, skills, publications, awards, workshops, leadership, references, coursework and interests.
- Server-signed Cloudinary image uploads; Cloudinary secrets remain on the backend.
- Contact form submissions stored in MongoDB with basic validation and rate limiting.
- Helmet security headers, CORS allowlist, JSON size limit and API rate limiting.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm.
- MongoDB Atlas database (or local MongoDB).
- Firebase project with Email/Password and Google Authentication providers enabled.
- Firebase service account JSON for the backend.
- Cloudinary account for image uploads.

## Install

Run from the repository root:

```bash
npm install
npm --prefix admin-panel install
npm --prefix backend install
```

Create environment files:

```powershell
Copy-Item .env.example .env
Copy-Item admin-panel/.env.example admin-panel/.env
Copy-Item backend/.env.example backend/.env
```

### Configure root `.env` (public website)

Set Firebase Web App values and:

```env
VITE_API_URL=http://localhost:5000
```

### Configure `admin-panel/.env`

Use the same Firebase Web App values, then set:

```env
VITE_API_URL=http://localhost:5000
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

### Configure `backend/.env` (server-only secrets)

Set:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGINS=http://localhost:5173,http://localhost:5174
MONGODB_URI=mongodb+srv://.../portfolio?retryWrites=true&w=majority
FIREBASE_SERVICE_ACCOUNT_JSON={...}
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Paste the complete Firebase service-account JSON into `FIREBASE_SERVICE_ACCOUNT_JSON` as a single line. Do not prefix backend secrets with `VITE_`, commit them, or expose them to either frontend.

## Run locally (three terminals)

**Terminal 1 — API**

```bash
npm run dev:api
```

**Terminal 2 — Public website**

```bash
npm run dev
```

**Terminal 3 — Admin panel**

```bash
npm run dev:admin
```

Check API health at `http://localhost:5000/api/health`.

## Grant administrator access

1. Create/sign in to the user once through the Admin Panel using Firebase Authentication.
2. Download a Firebase service account key and save it locally as `serviceAccountKey.json` in the repository root (never commit it).
3. Run:

```bash
npm run set-admin -- admin@example.com
```

4. Sign out and sign in again so Firebase issues a token containing the new custom claim.

The API rejects all write requests unless the verified token includes `admin: true`. Never rely only on frontend route protection.

## First publish

After the backend is connected and you have admin access, open the Admin Panel and choose **Publish default content** once. This seeds MongoDB with the bundled portfolio data. Subsequent edits publish through `PUT /api/portfolio`.

## API routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health and database status |
| GET | `/api/portfolio` | Public | Read published portfolio content |
| PUT | `/api/portfolio` | Admin claim | Publish full content document |
| POST | `/api/media/signature` | Admin claim | Generate signed Cloudinary upload parameters |
| POST | `/api/contact` | Public, rate-limited | Save a contact message |

## Deploy

Deploy the three applications separately:

- **Public website:** Vercel project Root Directory `/`; Build Command `npm run build`; Output Directory `dist`.
- **Admin panel:** Vercel project Root Directory `admin-panel`; Build Command `npm run build`; Output Directory `dist`.
- **Backend API:** Render, Railway, Fly.io or another Node host; Root Directory `backend`; Build Command `npm install`; Start Command `npm start`.

Set `VITE_API_URL` in both Vercel frontend projects to the deployed backend URL. Set `CLIENT_ORIGINS` on the backend to the exact public and admin origins (comma-separated). Add MongoDB, Firebase service account and Cloudinary secrets only to the backend host. Redeploy frontends after changing Vite environment variables.

## Build checks

```bash
npm run build
npm run build:admin
```

The admin panel and public site are intentionally separate interfaces. They share content only through the backend API and MongoDB.
