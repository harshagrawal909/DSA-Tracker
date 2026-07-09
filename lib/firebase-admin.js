import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

let adminApp = null;

if (getApps().length === 0) {
  try {
    const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccountRaw = fs.readFileSync(serviceAccountPath, "utf8");
      const serviceAccount = JSON.parse(serviceAccountRaw);
      
      adminApp = initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      console.warn("firebase-service-account.json not found in root folder.");
    }
  } catch (error) {
    console.error("Firebase admin initialization failed: ", error);
  }
} else {
  adminApp = getApps()[0];
}

const adminDb = adminApp ? getFirestore() : null;

export { adminDb, adminApp };
