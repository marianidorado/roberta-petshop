"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PetDetailsModal } from "@/components/mascotas/pet-details-modal"
import type { Pet } from "@/types/pet"
import { PetFormModal } from "@/components/mascotas/pet-form-modal"
import type { Owner } from "@/types/owner"

const MOCK_OWNERS: Owner[] = [
  {
    id: "1",
    name: "Ana",
    lastName: "Pérez",
    document: "12345678",
    birthDate: "1990-05-12",
    city: "Bogotá",
    address: "Cra 12 #45-67",
    phone: "3001234567",
    email: "ana@email.com",
    notes: "Cliente frecuente",
    pets: [],
  },
  {
    id: "2",
    name: "Carlos",
    lastName: "Gómez",
    document: "87654321",
    birthDate: "1985-02-20",
    city: "Medellín",
    address: "Calle 8 #10-11",
    phone: "3109876543",
    email: "carlos@email.com",
    notes: "",
    pets: [],
  },
]
const EMPTY_PET: Pet = {
  id: "",
  ownerId: "",
  name: "",
  species: "Perro",
  breed: "",
  sex: "Macho",
  size: "20-40cm",
  heightCm: 30,
  vaccinesUpToDate: false,
}

const MOCK_PETS: Pet[] = [
  {
    id: "p1",
    ownerId: "1",
    name: "Luna",
    species: "Perro",
    breed: "Labrador",
    sex: "Hembra",
    size: "20-40cm",
    heightCm: 42,
    birthDate: "2020-03-10",
    vaccinesUpToDate: true,
    lastService: {
      id: "s1",
      name: "Baño",
      date: "2025-01-10",
    },
  },
]

function calculateAge(birthDate?: string) {
  if (!birthDate) return "—"
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [creatingPet, setCreatingPet] = useState(false)
  const [search, setSearch] = useState("")
  const filteredPets = pets.filter(pet =>
  `${pet.name} ${pet.species} ${pet.ownerId}`
    .toLowerCase()
    .includes(search.toLowerCase())
)
const getOwnerName = (ownerId: string) => {
  const owner = MOCK_OWNERS.find(o => o.id === ownerId)
  return owner ? `${owner.name} ${owner.lastName}` : "—"
}

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">
            Mascotas
          </h1>

          <button
            onClick={() => setCreatingPet(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600"
          >
            + Nueva mascota
          </button>
        </div>
          <input
            placeholder="Buscar mascota por nombre, especie o dueño"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 border rounded-md"
          />
        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-100 text-amber-900">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Especie</th>
                <th className="text-center px-4 py-3">Edad</th>
                <th className="text-left px-4 py-3">Último servicio</th>
                <th className="text-left px-4 py-3">Dueño</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No se encontraron mascotas
                  </td>
                </tr>
              )}

              {filteredPets.map(pet => (
                <tr key={pet.id} className="border-t hover:bg-amber-50">
                  <td className="px-4 py-3 font-medium">{pet.name}</td>
                  <td className="px-4 py-3">{pet.species}</td>
                  <td className="px-4 py-3 text-center">
                    {calculateAge(pet.birthDate)}
                  </td>
                  <td className="px-4 py-3">
                    {pet.lastService
                      ? `${pet.lastService.name} (${pet.lastService.date})`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                        {getOwnerName(pet.ownerId)}
                    </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => setSelectedPet(pet)}
                      className="text-amber-600 hover:underline"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() =>
                        setPets(prev => prev.filter(p => p.id !== pet.id))
                      }
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          </table>
        </div>
      </main>
          {selectedPet && (
      <PetDetailsModal
        pet={selectedPet}
        ownerName={getOwnerName(selectedPet.ownerId)}
        onClose={() => setSelectedPet(null)}
        onEdit={() => {
          setEditingPet(selectedPet)
          setSelectedPet(null)
        }}
      />
      )}
    {creatingPet && (
      <PetFormModal
        pet={EMPTY_PET}
        mode="create"
        owners={MOCK_OWNERS}
        onClose={() => setCreatingPet(false)}
        onSave={(newPet) => {
          setPets(prev => [
            ...prev,
            { ...newPet, id: crypto.randomUUID() },
          ])
          setCreatingPet(false)
        }}
      />
    )}
    {editingPet && (
      <PetFormModal
        pet={editingPet}
        mode="edit"
        owners={MOCK_OWNERS}
        onClose={() => setEditingPet(null)}
        onSave={(updated) => {
          setPets(prev =>
            prev.map(p => p.id === updated.id ? updated : p)
          )
          setEditingPet(null)
        }}
      />
    )}
    </div>
  )
}
