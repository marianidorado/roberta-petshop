"use client"

import { useState } from "react"
import { SearchClient } from "@/components/servicios/search-client"
import { PetSelector } from "@/components/servicios/pet-selector"
import type { Client } from "@/types/client"
import type { Pet } from "@/types/pet"

export default function NuevoServicioPage() {
  const [client, setClient] = useState<Client | null>(null)
  const [pet, setPet] = useState<Pet | null>(null)

  return (
    <div className="min-h-screen bg-amber-50 p-6 space-y-6">

      {/* PASO 1 */}
      <SearchClient onSelect={setClient} />

      {/* PASO 2 */}
      {client && (
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="text-sm text-gray-500">Cliente seleccionado</p>
          <p className="font-bold text-gray-800">{client.name}</p>

          {client.pets.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Este cliente no tiene mascotas registradas
              </p>
              <button className="px-4 py-2 rounded-xl bg-amber-500 text-white">
                Agregar mascota
              </button>
            </div>
          ) : (
            <PetSelector
              pets={client.pets}
              onSelect={setPet}
            />
          )}
        </div>
      )}

    </div>
  )
}
