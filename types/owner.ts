import type { PetSummary } from "./pet"

export interface Owner {
  id: string
  name: string
  lastName: string
  document: string
  birthDate: string 
  city: string
  address: string
  phone: string
  email: string
  notes?: string
  pets: PetSummary[]
}