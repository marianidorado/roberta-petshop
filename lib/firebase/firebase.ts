// lib/firebase/firebase.ts

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

// 🔐 Configuración de tu proyecto Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyBo1sQYbNqgdhdKJ7EkmcHIJw44MOuIMUU",
  authDomain: "roberta-petshop.firebaseapp.com",
  projectId: "roberta-petshop",
  storageBucket: "roberta-petshop.firebasestorage.app",
  messagingSenderId: "425935304810",
  appId: "1:425935304810:web:97fa30e3edcddf9bcab213",
}

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig)

// 📦 Servicios Firebase
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)   