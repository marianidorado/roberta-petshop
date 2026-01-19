import type { Pet } from "./pet"

export interface Client {
  id: string
  name: string
  document: string
  pets: Pet[]
}