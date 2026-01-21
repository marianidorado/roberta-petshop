"use client"

import { useState } from "react"
import type { Client } from "@/types/client"

interface SearchClientProps {
  onSelect: (client: Client) => void
}

const clients: Client[] = [
  {
    id: "1",
    name: "Ana Gómez",
    document: "12345678",
    pets: [
      {
        id: "p1",
        name: "Luna",
        species: "Perro",
        breed: "Poodle",
        photo: "/pet-placeholder.png",
        lastService: {
          id: "bath",
          name: "Baño",
          date: "10/01/2026"
        }
      },
      { id: "p2", name: "Milo", species: "cat", breed: "Siames", photo: "/pet-placeholder.png", lastService: {
          id: "bath",
          name: "Baño",
          date: "10/01/2026"
        } },
    ],
  },
  {
    id: "2",
    name: "Carlos Pérez",
    document: "87654321",
    pets: [],
  },
]

export function SearchClient({ onSelect }: SearchClientProps) {
  const [query, setQuery] = useState("")

  const results = clients.filter((client) => {
    const search = query.toLowerCase()

    return (
      client.id.includes(search) ||
      client.name.toLowerCase().includes(search) ||
      client.document.includes(search) ||
      client.pets.some((pet) =>
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
        <p className="text-sm text-gray-500">
          No se encontró ningún cliente
        </p>
      )}

      <div className="space-y-2">
        {results.map((client) => (
          <button
            key={client.id}
            onClick={() => onSelect(client)}
            className="w-full text-left p-3 rounded-xl border hover:bg-amber-50"
          >
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-gray-600">
              {client.document} · {client.pets.length} mascotas
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
