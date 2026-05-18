"use client"

import { useEffect, useState } from "react"
import type { Owner } from "@/types/owner"
import { searchOwners } from "@/lib/firebase/owners"

interface SearchClientProps {
  onSelect: (owner: Owner) => void
}

export function SearchClient({ onSelect }: SearchClientProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Owner[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchOwners() {
      const search = query.trim()

      if (search.length < 2) {
        setResults([])
        return
      }

      setLoading(true)

      try {
        const data = await searchOwners(search)
        setResults(data)
      } catch (error) {
        console.error("Error buscando clientes:", error)
      }

      setLoading(false)
    }

    const timeout = setTimeout(fetchOwners, 400)
    return () => clearTimeout(timeout)
  }, [query])

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

      {loading && (
        <p className="text-sm text-gray-500">Buscando...</p>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-sm text-gray-500">
          No se encontró ningún cliente
        </p>
      )}

      <div className="space-y-2">
        {results.map(owner => (
          <button
            key={owner.id}
            onClick={() => onSelect(owner)}
            className="w-full text-left p-3 rounded-xl border hover:bg-amber-50 transition"
          >
            <p className="font-semibold">
              {owner.name} {owner.lastName}
            </p>

            <p className="text-sm text-gray-600">
              {owner.document}
            </p>

            {owner.pets && owner.pets.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Mascotas: {owner.pets.map(p => p.name).join(", ")}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}