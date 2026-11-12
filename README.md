# Rokeya Shorna — Portfolio + Admin Studio

A React/Vite portfolio with a separate Firebase-protected content management app. The bundled profile and CV content are retained as the local fallback; connect Firebase to enable live publishing.

## Apps

| App | Directory | Local port |
|---|---|---:|
| Public portfolio | repository root | 5173 |
| Admin studio | `admin-panel/` | 5174 |

## Features

- Responsive portfolio with project details, experience, research/publications, awards, skills, resume and contact pages.
- Framer Motion, GSAP/ScrollTrigger, Lenis and Three.js visual elements, with reduced-motion support.
- Dark/light theme and responsive navigation.
- Separate admin app with email/password and Google sign-in, password reset, Firebase admin-claim authorization, live Firestore editing and Cloudinary signed image uploads.
- Firestore rules allow public reads of the published `portfolioContent/main` document and restrict writes to users with the `admin: true` custom claim.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm.
- A Firebase project for Authentication and Firestore.
- Cloudinary account for admin image uploads.

## Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

In a second terminal:

```bash
cd admin-panel
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`. Fill both `.env` files with the same Firebase Web App configuration. The public site can run with bundled content when Firebase is not configured; the Admin app requires Firebase.

## Firebase, admin access and Cloudinary

Follow [ADMIN-SETUP.md](./ADMIN-SETUP.md) in order. It covers enabling Email/Password and Google providers, deploying `firestore.rules`, granting the custom admin claim, publishing initial content, and configuring the server-only Cloudinary and Firebase Admin secrets. Never commit `.env`, a Firebase service-account key, or Cloudinary secrets.

## Build

```bash
npm run build
npm --prefix admin-panel install
npm run build:admin
```

The public and admin apps are deployed as two separate Vercel projects. Set the repository root as the public project's Root Directory and `admin-panel` as the admin project's Root Directory. Configure each app's environment variables in its own Vercel project and redeploy after changes.

## Contact form

Set `VITE_CONTACT_ENDPOINT` in the public site's `.env` to a JSON POST endpoint accepting `{ name, email, subject, message }`. Without an endpoint, the form opens the visitor's email client using the profile email as a fallback.

## Notes

- Firestore publishing is real-time: the public app subscribes to `portfolioContent/main`.
- Admin JSON editing supports all bundled content sections. Preserve the existing data shapes/field names to keep the public components compatible.
- Image upload returns a Cloudinary secure URL; copy it into the relevant `image` field in the JSON editor and save.
- Local Vite does not run Vercel API functions. Use `vercel dev` or the deployed admin site to test the signed upload endpoint.
