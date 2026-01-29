"use client"

import Image from "next/image"
import type { PetSummary } from "@/types/pet-summary"

interface Props {
  pets: PetSummary[]
  selectedPet: PetSummary | null
  onSelect: (pet: PetSummary) => void
}

export function PetSelector({ pets, selectedPet, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pets.map(pet => {
        const isSelected = selectedPet?.id === pet.id

        return (
          <button
            key={pet.id}
            type="button"
            onClick={() => onSelect(pet)}
            className={`flex flex-col gap-2 p-3 rounded-xl border transition
              ${isSelected ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:bg-gray-50"}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={pet.photo || "/pet-placeholder.png"}
                  alt={pet.name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{pet.name}</p>
                <p className="text-xs text-gray-500">{pet.breed ?? "Sin raza"} • {pet.species}</p>
                {pet.lastService && (
                  <p className="text-xs text-gray-400">
                    Último servicio: {pet.lastService.serviceName} ({pet.lastService.entryDate})
                  </p>
                )}
              </div>
            </div>
            {isSelected && (
              <span className="text-xs font-semibold text-amber-600 mt-1">
                Seleccionada
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
