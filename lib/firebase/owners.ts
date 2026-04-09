import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where
} from "firebase/firestore"

import { db } from "@/lib/firebase/firebase"
import type { Owner } from "@/types/owner"
import { cleanObject } from "@/lib/utils/cleanObject"
import { getPets } from "./pets"
import { Pet } from "@/types/pet"

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

  const q = query(
    ownersRef,
    where("document", "==", owner.document)
  )

  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    throw new Error("Ya existe un propietario con esta cédula")
  }

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

export async function searchOwners(searchText: string): Promise<Owner[]> {
  const ownersSnap = await getDocs(collection(db, "owners"))
  const pets: Pet[] = await getPets()

  const search = searchText.toLowerCase()

  const owners: Owner[] = ownersSnap.docs.map(doc => {
    const data = doc.data()

    const ownerPets = pets.filter(p => p.ownerId === doc.id)

    return {
      id: doc.id,
      name: data.name ?? "",
      lastName: data.lastName ?? "",
      document: data.document ?? "",
      birthDate: data.birthDate ?? "",
      city: data.city ?? "",
      address: data.address ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      notes: data.notes ?? "",
      pets: ownerPets
    }
  })

  return owners.filter(owner => {
    const ownerMatch =
      owner.name.toLowerCase().includes(search) ||
      owner.lastName.toLowerCase().includes(search) ||
      owner.document.includes(search)

    const petMatch = owner.pets.some(p =>
      p.name.toLowerCase().includes(search)
    )

    return ownerMatch || petMatch
  })
}
