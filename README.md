# Rokeya Khatun Shorna — Portfolio Monorepo

A separate public portfolio, protected content-management dashboard, and backend API. The public site and admin dashboard are deployed separately on Vercel; the API can be deployed to Render, Railway, Fly.io or another Node host.

## Repository structure

```text
Rokeya-Khatun-Shorna-Portfolio/
├── frontend/
│   ├── web/       # Public portfolio (React + Vite)
│   └── admin/     # Private admin CMS (React + Vite)
├── backend/       # Express API + Firebase Admin + Cloudinary signing
├── package.json   # npm workspaces / monorepo scripts
└── README.md
```

## Portfolio content included

The starter content is based on the supplied Rokeya Shorna portfolio/CV data: profile and contact, M.Sc/B.Sc education, four professional roles, four projects, skills, two publications, awards, workshops, leadership/volunteering, references, coursework and interests. Existing portrait and project illustration assets are retained.

The home hero now uses a larger, clear portrait aligned on the right. The image URL is editable in Admin → Profile (`image`) and can be replaced using the Cloudinary uploader.

## Admin capabilities

- Firebase email/password sign-in, Google sign-in and password reset.
- Protected API access using Firebase ID tokens and the `admin: true` custom claim.
- Edit profile/contact, education, experience, projects, skills, publications, awards, workshops, leadership, references, coursework and interests.
- Upload images through server-signed Cloudinary uploads; paste the returned secure URL into the relevant content field.
- Visitor message inbox: read, mark as read/unread, and delete enquiries.
- Publish updates to Firestore; the public website refreshes published content automatically.
- JSON editor validates object/array structure before saving. Keep field names consistent with the existing schema.

## Technology

- Public web: React, Vite, React Router, Framer Motion, GSAP, Lenis, Three.js and Lucide.
- Admin: React, Vite, Firebase Authentication and Lucide.
- Data: Firebase Firestore (document `portfolioContent/main`).
- Server: Node.js, Express, Firebase Admin SDK, Helmet, CORS and rate limiting.
- Images: Cloudinary (signed uploads; API secret remains server-side).

## 1. Requirements

- Node.js 20+ and npm.
- A Firebase project with Authentication (Email/Password; Google optional) and Firestore enabled.
- A Firebase Admin service-account JSON.
- A Cloudinary account.

## 2. Install

From the repository root:

```bash
npm run install:all
```

## 3. Configure environment

Copy the examples:

```bash
cp frontend/web/.env.example frontend/web/.env
cp frontend/admin/.env.example frontend/admin/.env
cp backend/.env.example backend/.env
```

On Windows PowerShell use `Copy-Item` instead of `cp`.

Fill in the Firebase Web App values in both frontend `.env` files. Set:
- `VITE_API_URL` to `http://localhost:5000` for local development.
- `VITE_PUBLIC_SITE_URL` in admin to `http://localhost:5173`.
- `FIREBASE_SERVICE_ACCOUNT_JSON` in `backend/.env` to the complete one-line service-account JSON.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `backend/.env`.
- `CLIENT_ORIGINS` to the exact public website and admin origins.

Never put Firebase service-account JSON or the Cloudinary API secret in either frontend `.env`. Never commit `.env` or service-account files.

## 4. Create the first administrator

1. Create an account through the Admin login screen (or create the user in Firebase Authentication).
2. From the repository root run:

```bash
npm run set-admin -- admin@example.com
```

3. Sign out and sign in again so Firebase refreshes the ID token with the admin claim.

The command uses `backend/.env` and Firebase Admin SDK. Only users with `admin: true` can publish content or access the message inbox.

## 5. Run locally

Open three terminals from the repository root:

```bash
npm run dev:api
npm run dev:web
npm run dev:admin
```

- Public website: http://localhost:5173
- Admin dashboard: http://localhost:5174
- API health: http://localhost:5000/api/health

## 6. Firestore data model

- `portfolioContent/main` — published portfolio content object.
- `contactMessages/{messageId}` — public contact form submissions.
- `admins/{uid}` — administrator metadata written by the set-admin script.

The API uses Firebase Admin SDK, so browser Firestore rules can deny direct client access. The included `frontend/web/firestore.rules` denies all direct client reads/writes; deploy those rules if the web app is not using any direct Firestore features.

## 7. API routes

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API/Firebase configuration status |
| GET | `/api/portfolio` | Public | Read published portfolio content |
| PUT | `/api/portfolio` | Admin claim | Publish portfolio content |
| POST | `/api/media/signature` | Admin claim | Create signed Cloudinary upload parameters |
| POST | `/api/contact` | Public, rate-limited | Save contact enquiry to Firestore |
| GET | `/api/messages` | Admin claim | List recent contact messages |
| PATCH | `/api/messages/:id` | Admin claim | Mark message read/unread/archived |
| DELETE | `/api/messages/:id` | Admin claim | Delete a contact message |

## 8. Deployment

### Public website — Vercel
- Root Directory: `frontend/web`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment: `VITE_API_URL=https://YOUR-BACKEND-DOMAIN`

### Admin — Vercel
- Root Directory: `frontend/admin`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment: same Firebase Web App values, `VITE_API_URL=https://YOUR-BACKEND-DOMAIN`, and `VITE_PUBLIC_SITE_URL=https://YOUR-WEB-DOMAIN`

### Backend — Render / Railway / Fly.io
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add `FIREBASE_SERVICE_ACCOUNT_JSON`, Cloudinary secrets, `PORT`, `NODE_ENV=production`, and `CLIENT_ORIGINS` in the host's secret/environment settings.

After deploying, run the admin-claim script locally using the same Firebase service account and verify `/api/health`.

## 9. Build

```bash
npm run build
```

This builds both frontends. Backend startup requires the configured Firebase service-account JSON.

## Security notes

- The uploaded reference admin archive contained a populated `.env` and a valid Firebase service-account private key. Those files are intentionally not copied into this deliverable. If that archive was shared or stored anywhere outside your private machine, revoke/rotate that Firebase service-account key and replace it in your secure backend environment.
- Firebase client config is public app configuration; service-account JSON and Cloudinary API secret are private server credentials.
- Keep Firestore rules restrictive and grant admin claims only to trusted accounts.

## Latest visual update
The home hero has been revised to follow the requested split-screen editorial direction: large serif headline on the left, a much larger right-side portrait, restrained motion, and the existing emerald/mint colour system preserved in both dark and light themes. The portrait is no longer presented inside the narrow floating arch/card treatment.
