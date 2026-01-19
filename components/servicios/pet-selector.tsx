"use client"

import type { Pet } from "@/types/pet"

interface Props {
  pets?: Pet[]
  onSelect: (pet: Pet) => void
}

export function PetSelector({ pets = [], onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-2">
      <p className="font-semibold">Selecciona la mascota</p>

      {pets.length === 0 && (
          <>
            <p className="text-sm text-gray-500">
              Este cliente no tiene mascotas registradas
            </p>

            <button
              className="mt-2 w-full rounded-xl border border-dashed p-3 text-sm text-amber-700 hover:bg-amber-50"
            >
              ➕ Agregar nueva mascota
            </button>
          </>
      )}

      {pets.map(pet => (
        <button
          key={pet.id}
          onClick={() => onSelect(pet)}
          className="w-full text-left p-2 border rounded hover:bg-amber-100"
        >
          {pet.name}
        </button>
      ))}
    </div>
  )
}