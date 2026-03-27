// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_6yBM3hNJWkZLCtOmq3xr-k4fM7O9uH8",
  authDomain: "data-collection-app-fa95a.firebaseapp.com",
  projectId: "data-collection-app-fa95a",
  storageBucket: "data-collection-app-fa95a.firebasestorage.app",
  messagingSenderId: "641947104865",
  appId: "1:641947104865:web:ea6b97139bd9c747821c20",
  measurementId: "G-FJMZMZLX5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);