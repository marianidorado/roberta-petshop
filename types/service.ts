export interface ServiceSizeRule {
  minHeightCm: number
  maxHeightCm?: number
  price?: number
}

export interface Service {
  id: string
  name: string
  description?: string
  includes: string[] 
  sizeRules: ServiceSizeRule[]
  active: boolean
}