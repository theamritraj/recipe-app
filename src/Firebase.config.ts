// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyC7M-7hNJYIQdPzouT2K7qTCs7pV5r_FR8",
  authDomain: "recipeapp-firebase-3fa35.firebaseapp.com",
  projectId: "recipeapp-firebase-3fa35",
  storageBucket: "recipeapp-firebase-3fa35.firebasestorage.app",
  messagingSenderId: "179296052061",
  appId: "1:179296052061:web:497bc279e852c17cd23eb4",
  measurementId: "G-29VE2WTEWE"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);





export {db, analytics};