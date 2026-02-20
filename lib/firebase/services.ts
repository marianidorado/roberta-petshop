import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import type { Service } from "@/types/service"
import { cleanObject } from "../utils/cleanObject"

const servicesRef = collection(db, "services")

/* Obtener servicios */
export async function getServices(): Promise<Service[]> {
  const snapshot = await getDocs(servicesRef)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Service, "id">),
  }))
}

/* Crear servicio */
export async function createService(service: Omit<Service, "id">) {
  await addDoc(servicesRef, service)
}

/* Actualizar servicio */
export async function updateService(service: Service) {
  const ref = doc(db, "services", service.id)
  const { id, ...data } = service

  const cleanData = cleanObject(data)

  await updateDoc(ref, cleanData)
}

/* Eliminar servicio */
export async function deleteService(id: string) {
  await deleteDoc(doc(db, "services", id))
}
