import type { Pet } from "@/types/pet"
import type { PetSummary } from "@/types/pet-summary"

export function mapPetToSummary(pet: Pet): PetSummary {
  return {
    id: pet.id,
    name: pet.name,
    photo: pet.photo,
    species: pet.species,
    breed: pet.breed,
    lastService: pet.lastService
      ? {
          id: pet.lastService.id,
          serviceId: pet.lastService.serviceId,
          serviceName: pet.lastService.serviceName,
          entryDate: pet.lastService.entryDate,
        }
      : undefined,
  }
}
