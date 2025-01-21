// // firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5LtTXQvLjzYSik6sFWuqkoWpJDMv5Qwk",
  authDomain: "evffbcannualconference-5c6d0.firebaseapp.com",
  projectId: "evffbcannualconference-5c6d0",
  storageBucket: "evffbcannualconference-5c6d0.firebasestorage.app",
  messagingSenderId: "640156191968",
  appId: "1:640156191968:web:62544d573e4aecfbe99485",
  measurementId: "G-EPKSWPGYJ2"
};
let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { storage, firestore, auth };