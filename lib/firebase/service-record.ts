import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore"

import { db } from "./firebase"
import type { ServiceRecord } from "@/types/service-record"

const serviceRecordsRef = collection(db, "serviceRecords")

function getTodayLocalDate(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/* Crear servicio */
export async function createServiceRecord(
  record: Omit<ServiceRecord, "id">
): Promise<string> {

  record.entryDate = record.entryDate || getTodayLocalDate()
  // 🔍 VALIDAR SI YA EXISTE
  const q = query(
    serviceRecordsRef,
    where("petId", "==", record.petId),
    where("entryDate", "==", record.entryDate)
  )

  const snapshot = await getDocs(q)

// ✅ Validar solo servicios NO cancelados
const existing = snapshot.docs.find(doc => {
  const data = doc.data() as { status?: string }
  return data.status !== "CANCELADO"
})

if (existing) {
  throw new Error("DUPLICATE_SERVICE")
}

  // ✅ CREAR SI NO EXISTE
  const docRef = await addDoc(serviceRecordsRef, record)

  await updateDoc(doc(db, "pets", record.petId), {
    lastService: {
      id: docRef.id,
      serviceId: record.serviceId,
      serviceName: record.serviceName,
      entryDate: record.entryDate,
      specifications: record.specifications,
    },
    lastServiceId: docRef.id,
    lastServiceDate: record.entryDate,
  })

  return docRef.id
}

/* Obtener servicios del día */
export async function getTodayServiceRecords(): Promise<ServiceRecord[]> {
  const todayString = getTodayLocalDate()

  const q = query(
    serviceRecordsRef,
    where("entryDate", "==", todayString)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ServiceRecord, "id">),
  }))
}

/* Marcar como listo */
export async function markServiceReady(id: string) {
  await updateDoc(doc(db, "serviceRecords", id), {
    status: "LISTO",
  })
}

/* Entregar servicio */
export async function deliverService(
  id: string,
  exitTime: string,
  ownerSignature?: string,
  exitObservation?: string
) {
  await updateDoc(doc(db, "serviceRecords", id), {
    status: "ENTREGADO",
    exitTime,
    ownerSignature: ownerSignature ?? null,
    "metadata.exitObservation": exitObservation ?? ""
  })
}
/* Cancelar servicio */
export async function cancelService(
  id: string,
  reason: string
) {
  await updateDoc(doc(db, "serviceRecords", id), {
    status: "CANCELADO",

    metadata: {
      cancelReason: reason
    }
  })
}
/* Obtener todos los servicios */
export async function getServiceRecords(): Promise<ServiceRecord[]> {
  const snapshot = await getDocs(serviceRecordsRef)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ServiceRecord, "id">),
  }))
}

/* Obtener servicios por mascota */
export async function getServiceRecordsByPet(
  petId: string
): Promise<ServiceRecord[]> {
  const q = query(
    serviceRecordsRef,
    where("petId", "==", petId)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<ServiceRecord, "id">),
  }))
}
