// // firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAl73NmpZpzGSEJfgRgs2Jbf1KytUZpiTk",
    authDomain: "keswick-app.firebaseapp.com",
    projectId: "keswick-app",
    storageBucket: "keswick-app.firebasestorage.app",
    messagingSenderId: "698961334249",
    appId: "1:698961334249:web:1050584c18086ceb7c8578",
    measurementId: "G-8JRG4KDGNT"
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