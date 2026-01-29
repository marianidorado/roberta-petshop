import type { ServiceRecord, ServiceRecordSummary } from "./service-record"
import type { PetSummary } from "./pet-summary"

export type { PetSummary }

export type PetSpecies = "Perro" | "Gato" | "Otro"
export type PetSex = "Macho" | "Hembra"

export type PetAttitude =
  | "Tranquilo"
  | "Nervioso"
  | "Juguetón"
  | "Agresivo"

export interface Pet {
  id: string

  /* ===============================
   * Relaciones
   * =============================== */
  ownerId: string
  ownerDocument?: string
  ownerName?: string

  /* ===============================
   * Datos básicos
   * =============================== */
  name: string
  species: PetSpecies
  breed: string
  sex: PetSex
  heightCm: number        // ÚNICA fuente de tamaño
  color?: string

  /* ===============================
   * Edad
   * =============================== */
  birthDate?: string
  age?: number

  /* ===============================
   * Salud
   * =============================== */
  allergies?: string
  vaccinesUpToDate: boolean
  attitude?: PetAttitude

  /* ===============================
   * UI / Observaciones
   * =============================== */
  photo?: string
  notes?: string

  /* ===============================
   * Servicios
   * =============================== */
  servicesHistory?: ServiceRecord[]
  lastService?: ServiceRecordSummary
}
