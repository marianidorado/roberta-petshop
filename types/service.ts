export interface ServiceSizeRule {
  minHeightCm: number
  maxHeightCm?: number
  price?: number
}

export interface ServiceSpecificationOption {
  id: string
  label: string
}

export interface ServiceSpecificationGroup {
  id: string
  name: string
  options: ServiceSpecificationOption[]
  required?: boolean
}

export interface Service {
  id: string
  name: string
  description?: string
  includes: string[] 
  sizeRules: ServiceSizeRule[]
  specifications?: ServiceSpecificationGroup[]
  active: boolean
}