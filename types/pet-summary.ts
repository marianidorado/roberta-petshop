import type { ServiceRecordSummary } from "./service-record"

export interface PetSummary {
  id: string
  name: string
  photo?: string

  species?: string
  breed?: string
  ownerName?: string

  lastService?: ServiceRecordSummary
}