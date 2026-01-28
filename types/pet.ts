
import type { PetSummary } from "./pet-summary"
export type {PetSummary} 
export type PetSpecies = "Perro" | "Gato" | "Otro"

export type PetSex = "Macho" | "Hembra"

export type PetSize =
  | "0-20cm"
  | "20-40cm"
  | "40-60cm"
  | "60-70cm"
  | "+70cm"

export type PetAttitude =
  | "Tranquilo"
  | "Nervioso"
  | "Juguetón"
  | "Agresivo"

export interface ServiceHistoryItem {
  id: string
  name: string
  date: string
}

export interface Pet {
  id: string

  /** Relación */
  ownerId: string
  ownerDocument?: string 

  /** Datos básicos */
  name: string
  species: PetSpecies
  breed: string
  sex: PetSex
  size: PetSize
  heightCm: number
  color?: string

  /** Edad */
  birthDate?: string
  age?: number // opcional, calculable

  /** Salud */
  allergies?: string
  vaccinesUpToDate: boolean
  attitude?: PetAttitude

  /** UI */
  photo?: string
  notes?: string

  /** Servicios */
  servicesHistory?: ServiceHistoryItem[]
  lastService?: ServiceHistoryItem
}
