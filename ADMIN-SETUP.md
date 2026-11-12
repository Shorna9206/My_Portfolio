# Admin, Backend and Database Setup

The project contains three separate apps: the public React website (`frontend/web/`), the private React admin interface (`frontend/admin/`), and the Express backend (`backend/`). The two frontends communicate with the backend; MongoDB stores the published portfolio and contact messages.

## 1. Firebase Authentication

1. Open Firebase Console and create/select the project.
2. Enable Authentication → Sign-in method → **Email/Password** and **Google**.
3. Configure authorized domains for the deployed Admin Panel.
4. Create the administrator account in Authentication → Users.
5. Create a Firebase Web App and copy its config values into both frontend `.env` files.
6. Download a Firebase service-account JSON for the backend only.

Firebase is used for administrator identity. MongoDB is the application database; Firestore is not required for the new API workflow.

## 2. MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user.
2. Allow the backend host IP (or configure the appropriate network access policy).
3. Copy the connection string and set `MONGODB_URI` in `backend/.env`.

## 3. Environment files

Copy `.env.example`, `frontend/admin/.env.example`, and `backend/.env.example` to their corresponding `.env` files.

- `frontend/web/.env`: Firebase Web App values and `VITE_API_URL=http://localhost:5000`.
- `frontend/admin/.env`: same Firebase Web App values, `VITE_API_URL=http://localhost:5000`, and `VITE_PUBLIC_SITE_URL`.
- `backend/.env`: `MONGODB_URI`, `FIREBASE_SERVICE_ACCOUNT_JSON`, Cloudinary credentials, `PORT`, `NODE_ENV`, and `CLIENT_ORIGINS`.

The Firebase service account JSON must be a single-line JSON value. Keep all backend secrets out of frontend variables and Git.

## 4. Grant admin permission

The administrator account must already exist in Firebase Authentication. Save the service-account key locally as `serviceAccountKey.json` in the repository root, then run:

```bash
npm --prefix backend install
npm run set-admin -- admin@example.com
```

The script preserves existing claims and adds `admin: true`. Sign out and sign back in so Firebase issues a fresh token. Remove the local service-account file when finished; never commit it.

## 5. Run all three applications

Install dependencies:

```bash
npm run install:all
```

Run each command in its own terminal:

```bash
npm run dev:api
npm run dev:web
npm run dev:admin
```

API health check: `http://localhost:5000/api/health`.

## 6. First publish

Open the Admin Panel, sign in with the authorized account, and click **Publish default content** once. This creates the main portfolio record in MongoDB. Edit a content section and click **Save changes** to publish. The public site fetches the latest published content from the backend every 15 seconds.

## 7. Cloudinary uploads

Create a Cloudinary account and configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `backend/.env`. The backend signs upload requests after verifying the admin Firebase token. The browser receives only the signed upload parameters; the Cloudinary API secret stays server-side.

## 8. Deployment

Deploy the public app and admin app as separate Vercel projects. Deploy `backend/` as a Node service on Render, Railway, Fly.io or a similar host.

- Public Vercel project: Root Directory `frontend/web`, Build `npm run build`, Output `dist`.
- Admin Vercel project: Root Directory `frontend/admin`, Build `npm run build`, Output `dist`.
- Backend service: Root Directory `backend`, Install `npm install`, Start `npm start`.

Set `VITE_API_URL` in both Vercel projects to the deployed backend URL. On the backend, set `CLIENT_ORIGINS` to the exact deployed public and admin URLs, comma-separated. Set MongoDB, Firebase service-account and Cloudinary secrets only on the backend service. Redeploy after environment changes.

## Security notes

- Frontend route checks are for user experience only. The Express API verifies the Firebase ID token and requires the `admin: true` custom claim on every write/upload-signature request.
- Public visitors can read published portfolio content and submit contact messages. Contact requests are validated and rate-limited.
- Do not commit `.env`, service-account keys, MongoDB credentials, or Cloudinary secrets.
