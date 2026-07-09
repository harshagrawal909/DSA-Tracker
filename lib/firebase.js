import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj_W_aXl96TJLiy_bT-bWn1KIGWJF2rDw",
  authDomain: "dsa-tracker-pro-43c0c.firebaseapp.com",
  projectId: "dsa-tracker-pro-43c0c",
  storageBucket: "dsa-tracker-pro-43c0c.firebasestorage.app",
  messagingSenderId: "60580413143",
  appId: "1:60580413143:web:9b8f1376cd86fac07eba92"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
