export interface PetSummary {
  id: string
  name: string
  species?: string
  breed?: string
  ownerName?: string
  lastService?: {
    id: string
    name: string
    date: string
  }
}
