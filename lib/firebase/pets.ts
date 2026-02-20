import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import type { Pet } from "@/types/pet"
import { cleanObject } from "@/lib/utils/cleanObject"

const petsRef = collection(db, "pets")

export async function getPets(): Promise<Pet[]> {
  const snapshot = await getDocs(petsRef)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Pet, "id">),
  }))
}

export async function getPetsByOwner(ownerId: string): Promise<Pet[]> {
  const q = query(
    petsRef,
    where("ownerId", "==", ownerId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Pet, "id">),
  }))
}

import { deleteDoc, doc } from "firebase/firestore"

export async function deletePet(id: string) {
  await deleteDoc(doc(db, "pets", id))
}

export async function createPet(pet: Pet) {
  const { id, ...data } = pet

  const docRef = await addDoc(
    petsRef,
    cleanObject(data)
  )

  return docRef.id
}

export async function updatePet(pet: Pet) {
  const { id, ...data } = pet

  if (!id) {
    throw new Error("La mascota no tiene ID para actualizar")
  }

  await updateDoc(
    doc(db, "pets", id),
    cleanObject(data)
  )
}
