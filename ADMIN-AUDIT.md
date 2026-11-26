# Reference Admin ZIP — Audit Notes

The uploaded `admin.zip` was reviewed before adapting the CMS for Rokeya Shorna.

## Findings

1. **Credential exposure:** the archive contains a populated `.env` and a valid Firebase Admin service-account JSON containing a private key. These files are not copied into this project. Treat the uploaded service-account key as exposed and rotate/revoke it in Firebase Console, then use a fresh key only in the backend host's secret environment.
2. **Frontend secret boundary:** the reference admin archive includes `firebase-admin` as a browser-app dependency. Firebase Admin SDK must run only in the server/backend, never in a Vite browser bundle.
3. **Missing workspace dependencies:** the admin imports `@nayeem/ui`, `@nayeem/types`, `@nayeem/utils` and `@nayeem/firebase`, but the uploaded archive does not contain those workspace packages. It is not a self-contained monorepo and cannot be expected to build independently as uploaded.
4. **Missing backend:** the archive has an admin frontend and prebuilt output/dependency cache, but no complete backend source in the uploaded ZIP. It also contains `node_modules` and `dist` artifacts that should not be committed or redistributed as source.
5. **Architecture adaptation:** this Rokeya project uses a clean monorepo with `frontend/web`, `frontend/admin` and `backend`. Firebase Admin is isolated in the backend; Firebase Authentication is used for admin sign-in; Firestore stores portfolio content and contact messages; Cloudinary uploads use server-generated signatures.

## What was carried forward conceptually

- Protected admin login and Firebase custom-claim authorization.
- Dashboard-style content-management workflow.
- Profile, education, skills, experience, projects, research/publications and media management.
- Secure image uploads and a private contact-message inbox.
- Separate public website, admin app and backend deployment targets.

No private credentials from the uploaded reference archive are present in this deliverable.
