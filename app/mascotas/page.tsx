"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PetDetailsModal } from "@/components/mascotas/pet-details-modal"
import { PetFormModal } from "@/components/mascotas/pet-form-modal"
import type { Pet } from "@/types/pet"
import type { Owner } from "@/types/owner"
import type { ServiceRecord } from "@/types/service-record"

/* ===============================
   MOCK OWNERS
================================ */
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
]

/* ===============================
   MOCK SERVICE
================================ */
const LAST_SERVICE: ServiceRecord = {
  id: "sr-1",
  petId: "p1",
  petName: "Luna",
  ownerId: "1",
  ownerName: "Ana Pérez",
  entryDate: "2025-01-10",
  entryTime: "09:30",
  receivedBy: "María",
  serviceId: "bath",
  serviceName: "Baño",
  completed: true,
}

/* ===============================
   MOCK PETS
================================ */
const MOCK_PETS: Pet[] = [
  {
    id: "p1",
    ownerId: "1",
    name: "Luna",
    species: "Perro",
    breed: "Labrador",
    sex: "Hembra",
    heightCm: 42,
    birthDate: "2020-03-10",
    vaccinesUpToDate: true,
    lastService: LAST_SERVICE,
    servicesHistory: [LAST_SERVICE],
  },
]

/* ===============================
   EMPTY PET
================================ */
const EMPTY_PET: Pet = {
  id: "",
  ownerId: "",
  name: "",
  species: "Perro",
  breed: "",
  sex: "Macho",
  heightCm: 30,
  vaccinesUpToDate: false,
}

/* ===============================
   HELPERS
================================ */
function calculateAge(birthDate?: string) {
  if (!birthDate) return "—"
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function formatServiceDate(service?: ServiceRecord) {
  if (!service) return "—"
  return `${service.serviceName} (${service.entryDate})`
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [creatingPet, setCreatingPet] = useState(false)
  const [search, setSearch] = useState("")

  const filteredPets = pets.filter(pet =>
    `${pet.name} ${pet.species} ${pet.breed}`
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">Mascotas</h1>

          <button
            onClick={() => setCreatingPet(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600"
          >
            + Nueva mascota
          </button>
        </div>

        <input
          placeholder="Buscar mascota por nombre, especie o raza"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 border rounded-md"
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-100 text-amber-900">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Especie</th>
                <th className="px-4 py-3 text-center">Edad</th>
                <th className="px-4 py-3 text-left">Último servicio</th>
                <th className="px-4 py-3 text-left">Dueño</th>
                <th className="px-4 py-3 text-center">Acciones</th>
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
                     {formatServiceDate(pet.servicesHistory?.[pet.servicesHistory.length - 1])}
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
          onSave={newPet => {
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
          onSave={updated => {
            setPets(prev =>
              prev.map(p => (p.id === updated.id ? updated : p))
            )
            setEditingPet(null)
          }}
        />
      )}
    </div>
  )
}
