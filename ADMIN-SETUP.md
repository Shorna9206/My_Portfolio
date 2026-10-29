# Portfolio Admin + Firebase setup

This repository now contains two separately deployable Vite apps:

- Public portfolio: repository root (`npm run dev`, default port 5173)
- Admin panel: `admin-panel/` (`npm install` then `npm run dev`, port 5174)

The admin panel edits the Firestore document `portfolioContent/main`. The public portfolio subscribes to that document and replaces the bundled fallback content when it exists. If Firebase environment variables are absent, the public site continues to use its bundled data.

## 1. Firebase project

1. Open Firebase Console and use/create the Firebase project for this portfolio.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create the administrator account in **Authentication → Users → Add user**.
4. Add a Firebase Web App and copy its config values.
5. Create Firestore Database.
6. Deploy `firestore.rules` from this repository (Firebase CLI: `firebase deploy --only firestore:rules`, after `firebase login` and `firebase use <project-id>`).

## 2. Environment variables

Copy root `.env.example` to `.env` and fill in the Firebase Web App values. Copy `admin-panel/.env.example` to `admin-panel/.env` and fill in the same values plus `VITE_PUBLIC_SITE_URL`. These are public Firebase client config values, not service-account secrets.

## 3. Grant the admin claim

Download a service-account private key from Firebase Console → Project settings → Service accounts. Save it locally as `serviceAccountKey.json` in the repository root. Never commit or upload this file. Then run:

```bash
npm install firebase-admin
node scripts/setAdmin.cjs admin@example.com
```

The email must already exist in Firebase Authentication. The script preserves any existing custom claims and adds `admin: true`. Sign out and sign back in after running it. Remove the service account JSON from your machine when you no longer need it.

## 4. Run locally

Terminal 1 (public website):

```bash
npm install
npm run dev
```

Terminal 2 (admin panel):

```bash
cd admin-panel
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5174`). Sign in with the account whose admin custom claim has been granted.

## 5. First publish

In the admin panel, choose **Publish default content** once to create `portfolioContent/main` from the existing portfolio source data. After that, edit a section's JSON and click **Save changes**. The public site updates from Firestore in real time. Keep the field names and data shapes consistent with `src/data/portfolio.js`.

## 6. Vercel deployment

Deploy the public site as one Vercel project with the repository root as Root Directory and build command `npm run build`. Deploy the admin panel as a second Vercel project using the same repository but set Root Directory to `admin-panel`, build command `npm run build`, output directory `dist`. Add the appropriate environment variables to each project.

For the admin Vercel project, set `VITE_PUBLIC_SITE_URL` to the public portfolio URL. After changing environment variables, redeploy.

## Notes

- Admin permissions are enforced twice: the panel checks the Firebase ID token claim and Firestore rules require `request.auth.token.admin == true` for writes. Hiding the panel alone is not security.
- `firestore.rules` denies client access to all other collections. If the Firebase project already has rules for other features, merge these rules rather than blindly replacing unrelated rules.
- The editor intentionally uses JSON for each section so all existing content fields can be edited without losing fields the UI does not yet expose. Invalid JSON is rejected before saving.
- Image fields currently accept image URLs (including Cloudinary URLs). Upload widgets/signing endpoints are not configured in this starter; use a secured upload endpoint before adding private Cloudinary credentials.
