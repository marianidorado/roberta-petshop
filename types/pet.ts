export interface Pet {
  id: string
  ownerId: string
  name: string
  species: "Perro" | "Gato" | "Otro"
  breed: string
  sex: "Macho" | "Hembra"
  size: "Pequeño" | "Mediano" | "Grande"
  birthDate?: string
  age?: number
  photo?: string
  attitude?: string
  allergies?: string
  notes?: string
  vaccinesUpToDate: boolean
  servicesHistory?: LastService[]
  lastService?: {
    id: string
    name: string
    date: string
  }
}
export interface LastService {
  id: string
  name: string
  date: string
}

export interface PetSummary {
  id: string
  name: string
  photo?: string
  lastService?: LastService
}