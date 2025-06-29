// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl2dEPn33H3MomLyYCpPoUi0SVdx8krCQ",
  authDomain: "pcosync.firebaseapp.com",
  projectId: "pcosync",
  storageBucket: "pcosync.firebasestorage.app",
  messagingSenderId: "872851757360",
  appId: "1:872851757360:web:6fc918963cb0bbaf1490f5",
  measurementId: "G-KRX6F1JEMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };