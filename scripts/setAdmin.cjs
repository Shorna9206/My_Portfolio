// Run: node scripts/setAdmin.cjs admin@example.com
// Keep serviceAccountKey.json local and never commit it.
const admin = require('firebase-admin');
const path = require('node:path');
const fs = require('node:fs');
const keyPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) { console.error('Missing serviceAccountKey.json in project root.'); process.exit(1); }
const email = process.argv[2];
if (!email) { console.error('Usage: node scripts/setAdmin.cjs <email>'); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
(async () => {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  console.log(`Admin claim enabled for ${email} (uid: ${user.uid}). Sign out and sign in again.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
