import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBm8YuNWDLRXfcpvp-AK1r35wU8qcS9f3c",
  authDomain: "tweetx-assignment-299c9.firebaseapp.com",
  projectId: "tweetx-assignment-299c9",
  storageBucket: "tweetx-assignment-299c9.appspot.com",
  messagingSenderId: "1072035147511",
  appId: "1:1072035147511:web:463273a76ce56a6a716df2",
  measurementId: "G-FLXFETB3X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);