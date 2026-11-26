// Grant the Firebase admin custom claim to an existing Authentication user.
// Run: npm run set-admin -- admin@example.com
require('dotenv').config();
const admin = require('firebase-admin');
const email = process.argv[2];
if (!email) { console.error('Usage: npm run set-admin -- admin@example.com'); process.exit(1); }
let serviceAccount;
try {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing from backend/.env');
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} catch (error) { console.error(error.message); process.exit(1); }
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
(async () => {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  await admin.firestore().collection('admins').doc(user.uid).set({ email, role: 'admin', updatedAt: new Date().toISOString() }, { merge: true });
  console.log(`Admin claim enabled for ${email}. Sign out and sign in again.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
