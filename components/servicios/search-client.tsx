"use client"

import { useState } from "react"
import type { Owner } from "@/types/owner"
import type { PetSummary } from "@/types/pet-summary"

interface SearchClientProps {
  onSelect: (owner: Owner) => void
}

const owners: Owner[] = [
  {
    id: "1",
    name: "Ana",
    lastName: "Gómez",
    document: "12345678",
    birthDate: "1990-01-01",
    city: "Bogotá",
    address: "Calle 1",
    phone: "3000000000",
    email: "ana@email.com",
    pets: [
      {
        id: "p1",
        name: "Luna",
        species: "Perro",
        breed: "Golden",
        lastService: {
          id: "s2",
          serviceId: "s2",
          serviceName: "Medicados",
          entryDate: "2026-01-10",
          specifications: { Bikini: "Medio", Cara: "Osito" },
          observations: "Última nota",
        },
        ownerId: "",
        sex: "Macho",
        heightCm: 0,
        vaccinesUpToDate: false
      },
      {
        id: "p2",
        name: "Milo",
        species: "Gato",
        breed: "Siames",
        lastService: {
          id: "s1",
          serviceId: "s1",
          serviceName: "Diamante",
          entryDate: "2026-01-05",
          specifications: { Bikini: "Alto", Cara: "Cachorro" },
          observations: "Otro comentario",
        },
        ownerId: "",
        sex: "Macho",
        heightCm: 0,
        vaccinesUpToDate: false
      },
    ],
  },
  {
    id: "2",
    name: "Carlos",
    lastName: "Pérez",
    document: "87654321",
    birthDate: "1985-01-01",
    city: "Medellín",
    address: "Calle 2",
    phone: "3100000000",
    email: "carlos@email.com",
    pets: [],
  },
]

export function SearchClient({ onSelect }: SearchClientProps) {
  const [query, setQuery] = useState("")

  const results = owners.filter((owner) => {
    const search = query.toLowerCase()
    return (
      owner.id.includes(search) ||
      owner.name.toLowerCase().includes(search) ||
      owner.document.includes(search) ||
      owner.pets.some((pet: PetSummary) =>
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
        placeholder="ID, nombre, documento o mascota"
        className="w-full border rounded-xl px-4 py-2"
      />

      {query && results.length === 0 && (
        <p className="text-sm text-gray-500">No se encontró ningún cliente</p>
      )}

      <div className="space-y-2">
        {results.map((owner) => (
          <button
            key={owner.id}
            onClick={() => onSelect(owner)}
            className="w-full text-left p-3 rounded-xl border hover:bg-amber-50"
          >
            <p className="font-semibold">{owner.name} {owner.lastName}</p>
            <p className="text-sm text-gray-600">
              {owner.document} · {owner.pets.length} mascotas
            </p>

            {owner.pets.length > 0 && (
              <ul className="text-sm text-gray-500 mt-1 space-y-1">
                {owner.pets.map((pet) => (
                  <li key={pet.id}>
                    {pet.name}{" "}
                    {pet.lastService
                      ? `(Último servicio: ${pet.lastService.serviceName})`
                      : ""}
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
