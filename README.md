# Portfolio — Full-stack Monorepo

Three separate applications with the requested structure: two frontends inside `frontend/` and the API in a separate top-level `backend/` folder.

```text
Apu-portfolio/
├── frontend/
│   ├── web/       # Public portfolio (React + Vite)
│   └── admin/     # Separate admin dashboard (React + Vite)
├── backend/       # Express API, MongoDB, Firebase verification, Cloudinary
├── package.json   # Root convenience scripts
└── README.md
```

The website and admin dashboard are independent interfaces. Both communicate with one Express API and MongoDB database.

## Stack
- Frontends: React + Vite
- API: Node.js + Express
- Database: MongoDB Atlas + Mongoose
- Authentication: Firebase Authentication; API verifies Firebase ID tokens and `admin: true` custom claims
- Media: Cloudinary signed uploads

## Requirements
Node.js 20.19+ (or 22.12+) and npm, MongoDB, Firebase project (Email/Password and Google providers enabled), Firebase service account, and Cloudinary account.

## Install
Run from repository root:
```bash
npm run install:all
```
Or install separately:
```bash
npm --prefix frontend/web install
npm --prefix frontend/admin install
npm --prefix backend install
```

## Environment files
Create these files:
```powershell
Copy-Item frontend/web/.env.example frontend/web/.env
Copy-Item frontend/admin/.env.example frontend/admin/.env
Copy-Item backend/.env.example backend/.env
```

### `frontend/web/.env`
Set Firebase Web App values and `VITE_API_URL=http://localhost:5000`.

### `frontend/admin/.env`
Set the same Firebase Web App values, plus `VITE_API_URL=http://localhost:5000` and `VITE_PUBLIC_SITE_URL=http://localhost:5173`.

### `backend/.env`
Configure server-only values:
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
Paste Firebase service-account JSON as a single line. Never expose backend secrets in frontend env files or commit them.

## Run locally (three terminals)
From repository root:

**Terminal 1 — Backend**
```bash
npm run dev:api
```
**Terminal 2 — Website**
```bash
npm run dev:web
```
**Terminal 3 — Admin**
```bash
npm run dev:admin
```

URLs: Website `http://localhost:5173`, Admin `http://localhost:5174`, API health `http://localhost:5000/api/health`.

## Grant administrator access
1. Sign up/sign in once through Admin using Firebase Authentication.
2. Save a Firebase service-account key as `backend/serviceAccountKey.json` (never commit it).
3. Run from repository root:
```bash
npm run set-admin -- admin@example.com
```
4. Sign out and sign in again to refresh the ID token.

Every write endpoint verifies the Firebase token and server-side `admin: true` claim.

## API endpoints
| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API/database health |
| GET | `/api/portfolio` | Public | Read published content |
| PUT | `/api/portfolio` | Admin | Publish portfolio content |
| POST | `/api/media/signature` | Admin | Signed Cloudinary upload params |
| POST | `/api/contact` | Public, rate-limited | Save contact message |

## Deploy
- Website: Vercel Root Directory `frontend/web`; Build `npm run build`; Output `dist`.
- Admin: Vercel Root Directory `frontend/admin`; Build `npm run build`; Output `dist`.
- Backend: Render/Railway/Fly.io Root Directory `backend`; Build `npm install`; Start `npm start`.

Set `VITE_API_URL` on both frontend deployments to the deployed API URL. Set backend `CLIENT_ORIGINS` to the exact deployed frontend domains. Keep MongoDB, Firebase service-account and Cloudinary secrets only on the backend host.

## Build
```bash
npm run build:web
npm run build:admin
```
