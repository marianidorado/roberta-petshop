import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { db } from "./firebase"
import { Pet } from "@/types/pet"

export async function getPetsByOwner(ownerId: string): Promise<Pet[]> {
  const q = query(
    collection(db, "pets"),
    where("ownerId", "==", ownerId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Pet, "id">),
  }))
}

