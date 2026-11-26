import 'dotenv/config';
import admin from 'firebase-admin';

let firebaseAdmin = null;
let firestore = null;
try {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing');
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  firebaseAdmin = admin;
  firestore = admin.firestore();
} catch (error) {
  console.error(`[Firebase Admin] ${error.message}`);
}
export { firebaseAdmin, firestore };
