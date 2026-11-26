# Admin Setup

1. Configure Firebase Web App variables in `frontend/admin/.env`.
2. Configure the Firebase Admin service-account JSON and Cloudinary secrets in `backend/.env`.
3. Start the backend and admin apps from the monorepo root.
4. Create the first Firebase Authentication user, then run:

```bash
npm run set-admin -- admin@example.com
```

5. Sign out and sign in again. The account must carry the Firebase custom claim `admin: true`.

Admin content is published to Firestore document `portfolioContent/main`. Visitor enquiries are stored in `contactMessages` and can be managed from the Messages area. Never expose the service-account private key or Cloudinary API secret in frontend environment variables.
