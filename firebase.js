// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAnalytics} from "firebase/analytics";
import {getFirebase} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFjuH3rEX6ZLs_yhATiRA-erEeITyDExs",
  authDomain: "ai-flashcard-cc461.firebaseapp.com",
  projectId: "ai-flashcard-cc461",
  storageBucket: "ai-flashcard-cc461.appspot.com",
  messagingSenderId: "275358273363",
  appId: "1:275358273363:web:932581f01ed8d0f8475ba6",
  measurementId: "G-XR89QZ0E8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirebase(app);
export default db;