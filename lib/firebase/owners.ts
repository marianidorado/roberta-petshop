import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase/firebase"
import type { Owner } from "@/types/owner"
import { cleanObject } from "@/lib/utils/cleanObject"

const ownersRef = collection(db, "owners")

/* ===============================
 * Obtener todos los owners
 * =============================== */
export async function getOwners(): Promise<Owner[]> {
  const snapshot = await getDocs(ownersRef)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    pets: [],
    ...(doc.data() as Omit<Owner, "id" | "pets">),
     // UI
  }))
}

/* ===============================
 * Obtener owner por id
 * =============================== */
export async function getOwnerById(id: string): Promise<Owner | null> {
  const ref = doc(db, "owners", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  return {
    id: snap.id,
    ...(snap.data() as Omit<Owner, "id" | "pets">),
    pets: [],
  }
}

/* ===============================
 * Crear owner
 * =============================== */
export async function createOwner(
  owner: Omit<Owner, "id" | "pets">
): Promise<string> {
  const docRef = await addDoc(ownersRef, cleanObject(owner))
  return docRef.id
}

/* ===============================
 * Actualizar owner
 * =============================== */
export async function updateOwner(owner: Owner) {
  const { id, pets, ...data } = owner
  const ref = doc(db, "owners", id)

  await updateDoc(ref, cleanObject(data))
}

/* ===============================
 * Eliminar owner
 * =============================== */
export async function deleteOwner(id: string) {
  await deleteDoc(doc(db, "owners", id))
}
