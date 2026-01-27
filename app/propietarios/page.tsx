"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { OwnerDetailsModal } from "@/components/owners/owner-details-modal"
import { OwnerEditModal } from "@/components/owners/owner-edit-modal"
import { PetFormModal } from "@/components/mascotas/pet-form-modal"
import type { Owner } from "@/types/owner"

/* ===============================
   Helpers
================================ */
const createEmptyOwner = (): Owner => ({
  id: "",
  name: "",
  lastName: "",
  document: "",
  birthDate: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  notes: "",
  pets: [],
})

/* ===============================
   Mock inicial
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
    pets: [
      { id: "p1", name: "Luna" },
      { id: "p2", name: "Max" },
    ],
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
    pets: [{ id: "p3", name: "Rocky" }],
  },
]

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>(MOCK_OWNERS)
  const [search, setSearch] = useState("")

  const [creatingOwner, setCreatingOwner] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [creatingPetForOwner, setCreatingPetForOwner] =
    useState<Owner | null>(null)

  /* ===============================
     Eliminar propietario
  ================================ */
  function handleDelete(owner: Owner) {
    const msg =
      owner.pets.length > 0
        ? `Este propietario tiene ${owner.pets.length} mascota(s).\n\nAl eliminarlo, también se eliminarán sus mascotas.\n\n¿Deseas continuar?`
        : `¿Seguro que deseas eliminar a ${owner.name} ${owner.lastName}?`

    if (!confirm(msg)) return

    setOwners(prev => prev.filter(o => o.id !== owner.id))
  }

  /* ===============================
     Filtro buscador
  ================================ */
  const filteredOwners = owners.filter(o => {
    const term = search.toLowerCase()
    return (
      o.name.toLowerCase().includes(term) ||
      o.lastName.toLowerCase().includes(term) ||
      o.document.includes(term)
    )
  })

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">
            Propietarios
          </h1>

          <button
            onClick={() => setCreatingOwner(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600"
          >
            + Nuevo propietario
          </button>
        </div>

        {/* Buscador */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar propietario por nombre o cédula"
          className="w-full max-w-md px-4 py-3 border rounded-md focus:ring-2 focus:ring-amber-300"
        />

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-100 text-amber-900">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Cédula</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-center px-4 py-3">Mascotas</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredOwners.map(owner => (
                <tr key={owner.id} className="border-t hover:bg-amber-50">
                  <td className="px-4 py-3 font-medium">
                    {owner.name} {owner.lastName}
                  </td>
                  <td className="px-4 py-3">{owner.document}</td>
                  <td className="px-4 py-3">{owner.phone}</td>
                  <td className="px-4 py-3 text-center">
                    {owner.pets.length}
                  </td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => setSelectedOwner(owner)}
                      className="text-amber-600 hover:underline"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDelete(owner)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOwners.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">
              No se encontraron propietarios
            </div>
          )}
        </div>
      </main>

      {/* ================= Modales ================= */}

      {selectedOwner && (
        <OwnerDetailsModal
          owner={selectedOwner}
          onClose={() => setSelectedOwner(null)}
          onEdit={() => {
            setEditingOwner(selectedOwner)
            setSelectedOwner(null)
          }}
          onAddPet={() => {
            setCreatingPetForOwner(selectedOwner)
            setSelectedOwner(null)
          }}
        />
      )}

      {creatingOwner && (
          <OwnerEditModal
            mode="create"
            owner={createEmptyOwner()}
            onClose={() => setCreatingOwner(false)}
            onSave={(newOwner: Owner) => {
              const createdOwner: Owner = {
                ...newOwner,
                id: crypto.randomUUID(),
                pets: [],
              }

              // 1️⃣ Guardar en la tabla
              setOwners(prev => [...prev, createdOwner])

              // 2️⃣ Cerrar modal de propietario
              setCreatingOwner(false)

              // 3️⃣ 🔥 Abrir automáticamente agregar mascota
              setCreatingPetForOwner(createdOwner)
            }}
          />
      )}

      {editingOwner && (
        <OwnerEditModal
          owner={editingOwner}
          onClose={() => setEditingOwner(null)}
          onSave={(updated: Owner) => {
            setOwners(prev =>
              prev.map(o => (o.id === updated.id ? updated : o))
            )
            setEditingOwner(null)
          }}
        />
      )}

      {creatingPetForOwner && (
        <PetFormModal
          mode="create"
          pet={{
            id: "",
            name: "",
            species: "Perro",
            breed: "",
            sex: "Macho",
            size: "Mediano",
            ownerId: creatingPetForOwner.id,
            vaccinesUpToDate: false,
          }}
          owners={owners}
          onClose={() => setCreatingPetForOwner(null)}
          onSave={(newPet) => {
            const petSummary = {
              id: crypto.randomUUID(),
              name: newPet.name,
            }

            setOwners(prev =>
              prev.map(o =>
                o.id === creatingPetForOwner.id
                  ? { ...o, pets: [...o.pets, petSummary] }
                  : o
              )
            )

            setCreatingPetForOwner(null)
            setSelectedOwner(prev =>
              prev
                ? { ...prev, pets: [...prev.pets, petSummary] }
                : null
            )
          }}
        />
      )}
    </div>
  )
}
