"use client"

import type { Client } from "@/types/client"

interface SearchClientProps {
  onSelect: (client: Client) => void
}

export function SearchClient({ onSelect }: SearchClientProps) {
  const clients: Client[] = [
  {
    id: "1",
    name: "Ana Gómez",
    document: "12345678",
    pets: [
      { id: "p1", name: "Luna", species: "dog" },
      { id: "p2", name: "Milo", species: "cat" },
    ],
  },
  {
    id: "2",
    name: "Carlos Pérez",
    document: "87654321",
    pets: [],
  },
]
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Buscar cliente
      </h2>

      <input
        placeholder="Buscar por nombre o cédula"
        className="w-full border rounded-xl px-4 py-2"
      />

      <div className="space-y-2">
        {clients.map((client) => (
          <button
            key={client.id}
            onClick={() => onSelect(client)}
            className="w-full text-left p-3 rounded-xl border hover:bg-orange-50"
          >
            <p className="font-semibold">{client.name}</p>
            <p className="text-sm text-gray-600">{client.document}</p>
          </button>
        ))}
      </div>
    </div>
  )
}