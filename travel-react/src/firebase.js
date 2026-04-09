import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Твоя конфігурація Firebase зі скріншота
const firebaseConfig = {
  apiKey: "AIzaSyB81a9PHp8dqgATNuGzSfFS8TTfroW8Z9w",
  authDomain: "travel-world-lab4.firebaseapp.com",
  projectId: "travel-world-lab4",
  storageBucket: "travel-world-lab4.firebasestorage.app",
  messagingSenderId: "193865215946",
  appId: "1:193865215946:web:e7d1e54c59488e015fe933",
  measurementId: "G-2XNYSCJ8L8"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо інструменти для автентифікації та бази даних
export const auth = getAuth(app);
export const db = getFirestore(app);