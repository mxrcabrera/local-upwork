import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Importa otros SDKs de Firebase que necesites, como Authentication, Storage, etc.

const firebaseConfig = {
  apiKey: "AIzaSyCiO0JxVkh3_riQ3oxBx0Bn0FXmo-4kLkU",
  authDomain: "local-upwork.firebaseapp.com",
  projectId: "local-upwork",
  storageBucket: "local-upwork.appspot.com",
  messagingSenderId: "1094778673672",
  appId: "1:1094778673672:web:a3426015efa6b1d7618fbd",
  measurementId: "G-CG4Y1WCQDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Inicializa otros servicios de Firebase que necesites

export { db };
