import { doc, getDoc, collection, setDoc, updateDoc, getDocs } from "firebase/firestore"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { getApps, initializeApp } from "firebase/app"
import { db, firebaseConfig } from "./firebase"

export interface AppUser {
  uid: string
  name: string
  email: string
  role: "admin" | "reception"
  active: boolean
}

// Obtener todos los usuarios
export async function getUsers(): Promise<AppUser[]> {

  const snapshot = await getDocs(collection(db, "users"))

  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  })) as AppUser[]

}

// Crear usuario (sin cerrar sesión del admin)
export async function createAppUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "reception"
) {

  const secondaryApp =
    getApps().find(app => app.name === "Secondary") ||
    initializeApp(firebaseConfig, "Secondary")

  const secondaryAuth = getAuth(secondaryApp)

  const cred = await createUserWithEmailAndPassword(
    secondaryAuth,
    email,
    password
  )

  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    name,
    email,
    role,
    active: true,
    createdAt: new Date().toISOString()
  })
}

// Cambiar rol
export async function updateUserRole(
  uid: string,
  role: "admin" | "reception"
) {

  await updateDoc(doc(db, "users", uid), { role })

}

// Activar / desactivar
export async function updateUserStatus(
  uid: string,
  active: boolean
) {

  await updateDoc(doc(db, "users", uid), { active })

}

export type UserProfile = {
  name: string
  email: string
  role: "admin" | "reception"
  active: boolean
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {

  const snap = await getDoc(doc(db, "users", uid))

  if (!snap.exists()) return null

  return snap.data() as UserProfile

}