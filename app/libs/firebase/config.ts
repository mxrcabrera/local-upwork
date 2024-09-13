import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, } from "firebase/firestore";

// Load .env variables
const firebaseConfig = {
    apiKey: "AIzaSyCiO0JxVkh3_riQ3oxBx0Bn0FXmo-4kLkU",
    authDomain: "local-upwork.firebaseapp.com",
    projectId: "local-upwork",
    storageBucket: "local-upwork.appspot.com",
    messagingSenderId: "1094778673672",
    appId: "1:1094778673672:web:a3426015efa6b1d7618fbd",
};

const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firebaseDB = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);



