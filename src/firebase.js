// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, remove, get, onValue } from 'firebase/database';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDZNIq4UQdUvvfORT-yt1j838zdfVTfgUg",
  authDomain: "spinner-cd9ee.firebaseapp.com",
  databaseURL: "https://spinner-cd9ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "spinner-cd9ee",
  storageBucket: "spinner-cd9ee.firebasestorage.app",
  messagingSenderId: "91962211985",
  appId: "1:91962211985:web:56a26edd06ef09f1efc930",
  measurementId: "G-S19PS1258R"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, remove, get, onValue };