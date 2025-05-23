// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3dsvP21ZI3rcFn-9VDO8bBIy1SQNZjN8",
  authDomain: "project-cost-tracker-b9be8.firebaseapp.com",
  projectId: "project-cost-tracker-b9be8",
  storageBucket: "project-cost-tracker-b9be8.appspot.com",
  messagingSenderId: "342987056621",
  appId: "1:342987056621:web:a3e46439117d0acfd5f3e4"
  // measurementId is optional and not needed here
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
