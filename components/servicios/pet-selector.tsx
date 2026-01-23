"use client"
import type { PetSummary } from "@/types/pet"

interface Props {
  pets: PetSummary[]
  onSelect: (pet: PetSummary) => void
}

export function PetSelector({ pets, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {pets.map(pet => (
        <button
          key={pet.id}
          onClick={() => onSelect(pet)}
          className="w-full text-left p-3 border rounded-xl hover:bg-amber-50"
        >
          <p className="font-semibold">{pet.name}</p>
          {pet.lastService && (
            <p className="text-xs text-gray-500">
              Último servicio: {pet.lastService.name}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}