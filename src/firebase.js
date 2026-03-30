import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// ADDED: Import Auth tools
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyDa2g-PwIjaAy5xBDKORmtSZO4M8Opu7J4",
  authDomain: "nexus-ai-c6f90.firebaseapp.com",
  projectId: "nexus-ai-c6f90",
  storageBucket: "nexus-ai-c6f90.firebasestorage.app",
  messagingSenderId: "562946800104",
  appId: "1:562946800104:web:c09fa23aa3711257208c5d",
  measurementId: "G-299PZPWVXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ADDED: Initialize and export Auth for your Login.jsx page to use
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();