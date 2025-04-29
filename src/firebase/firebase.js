// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAH6ZnIKC9nj3OP9k61xVe1QT5cGT9Ya4I",
  authDomain: "web-buku-tamu.firebaseapp.com",
  projectId: "web-buku-tamu",
  storageBucket: "web-buku-tamu.appspot.com",
  messagingSenderId: "546707361715",
  appId: "1:546707361715:web:bbc954cf98b383a40185c6",
  measurementId: "G-8XPYHLGV9X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
