export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  photo?: string
  lastService?: {
    id: string
    name: string
    date: string
  }
}
export interface PetSummary {
  id: string
  name: string
}