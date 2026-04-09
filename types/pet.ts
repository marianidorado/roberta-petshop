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
  heightCm: any
  id: string

  /* ===============================
   * Relaciones
   * =============================== */
  ownerId: string

  /* ===============================
   * Datos básicos
   * =============================== */
  name: string
  species: PetSpecies
  breed?: string
  sex: PetSex
  heightRange?: "0-20" | "20-40" | "40-60" | "60-70" | "70+"
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
  lastService?: ServiceRecordSummary
}
