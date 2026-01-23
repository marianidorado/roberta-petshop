export interface Pet {
  id: string
  name: string
  species: "Perro" | "Gato" | "Otro"
  breed: string
  sex: "Macho" | "Hembra"
  birthDate: string
  age?: number
  size: "Pequeño" | "Mediano" | "Grande"
  photo?: string
  allergies?: string
  temperament?: string
  vaccinated: boolean
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