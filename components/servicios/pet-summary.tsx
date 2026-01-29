"use client"

import Image from "next/image"
import type { PetSummary } from "@/types/pet-summary"

interface Props {
  pet: PetSummary
  onRepeat?: (serviceId: string) => void
}

export function PetSummaryCard({ pet, onRepeat }: Props) {
  const lastService = pet.lastService

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-4">
      {/* Info básica */}
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
          <p className="font-semibold text-lg text-gray-800">{pet.name}</p>
          {pet.breed && (
            <p className="text-sm text-gray-500">{pet.breed}</p>
          )}
        </div>
      </div>

      {/* Último servicio */}
      {onRepeat && lastService && (
        <div className="p-3 rounded-lg bg-amber-50 space-y-1">
          <p className="text-sm font-semibold text-amber-800">
            Último servicio
          </p>

          <p className="text-sm text-gray-700">
            {lastService.serviceName}
          </p>

          {/* Fecha como string, SIN new Date() */}
          <p className="text-xs text-gray-500">
            {lastService.entryDate}
          </p>

          <button
            type="button"
            onClick={() => onRepeat(lastService.serviceId)}
            className="mt-2 text-sm text-amber-600 underline"
          >
            Repetir este servicio
          </button>
        </div>
      )}
    </div>
  )
}
