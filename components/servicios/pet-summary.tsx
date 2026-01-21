import Image from "next/image"
import type { Pet } from "@/types/pet"

interface Props {
  pet: Pet
  onRepeat?: (serviceId: string) => void
}

export function PetSummary({ pet, onRepeat }: Props) {
  const lastService = pet.lastService

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-4">

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={pet.photo || "/pet-placeholder.png"}
            alt={pet.name}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-semibold text-lg">{pet.name}</p>
          <p className="text-sm text-gray-600">
            {pet.species} • {pet.breed}
          </p>
        </div>
      </div>

      {onRepeat && lastService && (
        <div className="p-3 rounded-lg bg-amber-50">
          <p className="text-sm font-semibold">Último servicio</p>
          <p className="text-sm text-gray-700">
            {lastService.name} — {lastService.date}
          </p>

          <button
            onClick={() => onRepeat(lastService.id)}
            className="mt-2 text-sm text-amber-600 underline"
          >
            Repetir este servicio
          </button>
        </div>
      )}
    </div>
  )
}
