import crypto from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
  const serviceAccount = JSON.parse(raw);
  return initializeApp({ credential: cert(serviceAccount) });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret || !process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return res.status(503).json({ error: "Cloudinary or Firebase server environment variables are missing." });
  }

  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "A Firebase ID token is required." });

    const app = getAdminApp();
    const decoded = await getAuth(app).verifyIdToken(match[1], true);
    if (decoded.admin !== true) return res.status(403).json({ error: "Administrator access is required." });

    const timestamp = Math.floor(Date.now() / 1000);
    const params = { folder: "apu-portfolio", timestamp };
    const stringToSign = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join("&");
    const signature = crypto.createHash("sha1").update(stringToSign + apiSecret).digest("hex");

    return res.status(200).json({ cloudName, apiKey, timestamp, folder: params.folder, signature });
  } catch (error) {
    console.error("Cloudinary signing request failed:", error.message);
    return res.status(401).json({ error: "Could not verify administrator session. Sign in again and retry." });
  }
}
