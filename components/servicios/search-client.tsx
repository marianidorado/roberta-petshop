"use client"

import { useEffect, useState } from "react"
import type { Owner } from "@/types/owner"
import type { Pet } from "@/types/pet"
import { getOwners } from "@/lib/firebase/owners"
import { getPets } from "@/lib/firebase/pets"

interface SearchClientProps {
  onSelect: (owner: Owner) => void
}
export function SearchClient({ onSelect }: SearchClientProps) {
  const [query, setQuery] = useState("")
  const [owners, setOwners] = useState<Owner[]>([])

  useEffect(() => {
    async function loadData() {
      const ownersDb = await getOwners()
      const petsDb = await getPets()

      // unir mascotas a cada owner
      const ownersWithPets = ownersDb.map(owner => ({
        ...owner,
        pets: petsDb.filter(pet => pet.ownerId === owner.id),
      }))

      setOwners(ownersWithPets)
    }

    loadData()
  }, [])

  const results = owners.filter(owner => {
    const search = query.toLowerCase()

    return (
      owner.name.toLowerCase().includes(search) ||
      owner.document.includes(search) ||
      owner.pets.some(pet =>
        pet.name.toLowerCase().includes(search)
      )
    )
  })

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Buscar cliente o mascota
      </h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nombre, documento o mascota"
        className="w-full border rounded-xl px-4 py-2"
      />

      {query && results.length === 0 && (
        <p className="text-sm text-gray-500">
          No se encontró ningún cliente
        </p>
      )}

      <div className="space-y-2">
        {results.map(owner => (
          <button
            key={owner.id}
            onClick={() => onSelect(owner)}
            className="w-full text-left p-3 rounded-xl border hover:bg-amber-50"
          >
            <p className="font-semibold">
              {owner.name} {owner.lastName}
            </p>

            <p className="text-sm text-gray-600">
              {owner.document} · {owner.pets.length} mascotas
            </p>

            {owner.pets.length > 0 && (
              <ul className="text-sm text-gray-500 mt-1 space-y-1">
                {owner.pets.map(pet => (
                  <li key={pet.id}>
                    {pet.name}
                  </li>
                ))}
              </ul>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
