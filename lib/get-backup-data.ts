import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase/firebase"

export async function getBackupData() {
  const collections = ["owners", "pets", "services", "serviceRecords"]

  const result: Record<string, unknown[]> = {}

  for (const name of collections) {
    const snapshot = await getDocs(collection(db, name))
    result[name] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  }

  return result
}