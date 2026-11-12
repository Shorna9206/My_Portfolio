import admin from 'firebase-admin';

let firebaseAdmin;
try {
  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing');
    const serviceAccount = JSON.parse(raw);
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  firebaseAdmin = admin;
} catch (error) {
  console.error(`[Firebase Admin] ${error.message}`);
  firebaseAdmin = null;
}
export { firebaseAdmin };
