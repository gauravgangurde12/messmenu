// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBj4xf1e1z9Qx99PulbfnS0JbXLNe7DiAc",
    authDomain: "foodmenu-8c02b.firebaseapp.com",
    projectId: "foodmenu-8c02b",
    storageBucket: "foodmenu-8c02b.firebasestorage.app",
    messagingSenderId: "1079545654229",
    appId: "1:1079545654229:web:66b609c5300861ef47ab5c",
    measurementId: "G-VMECE85HXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
