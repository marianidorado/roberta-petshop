export type PetSize = "Pequeño" | "Mediano" | "Grande"

export interface ServicePrice {
  size: PetSize
  price: number
}
export interface ServicePlan {
  id: string
  name: string
  subtitle?: string
  color: string
  items: string[]
  prices: {
    size: string
    price: number
  }[]
  active: boolean
}
