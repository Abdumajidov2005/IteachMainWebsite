import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmzj4DAZ52Hdyw7z1TNOkqEZpF88qmniQ",
  authDomain: "iteach-42252.firebaseapp.com",
  projectId: "iteach-42252",
  storageBucket: "iteach-42252.firebasestorage.app",
  messagingSenderId: "895152361515",
  appId: "1:895152361515:web:87062f781daceba1141a6e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);