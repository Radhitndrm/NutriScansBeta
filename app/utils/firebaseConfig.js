import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAUuznEc-XehMmskiOZ8jnYK5G_q_H06Y",
  authDomain: "nutriscan-c8d59.firebaseapp.com",
  projectId: "nutriscan-c8d59",
  storageBucket: "nutriscan-c8d59.firebasestorage.app",
  messagingSenderId: "314115531351",
  appId: "1:314115531351:web:8421b24f1f22b587693912",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
