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
      <SearchClient onSelect={setClient} />

      {client && (
        <>
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500">Cliente seleccionado</p>
            <p className="font-bold">{client.name}</p>
          </div>

          <PetSelector
            pets={client.pets}
            onSelect={setPet}
          />
        </>
      )}

      {pet && (
        <div className="bg-white rounded-xl p-4 shadow">
          Mascota: {pet.name}
        </div>
      )}
    </div>
  )
}
  