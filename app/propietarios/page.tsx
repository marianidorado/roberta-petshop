"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import type { Owner } from "@/types/owner"
import type { Pet } from "@/types/pet"

import {
  getOwners,
  createOwner,
  updateOwner,
  deleteOwner,
} from "@/lib/firebase/owners"

import { getPets, createPet } from "@/lib/firebase/pets"

import { OwnerDetailsModal } from "@/components/owners/owner-details-modal"
import { OwnerEditModal } from "@/components/owners/owner-edit-modal"
import { PetFormModal } from "@/components/mascotas/pet-form-modal"

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [creatingPet, setCreatingPet] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  /* ===============================
   * Cargar data optimizada
   * =============================== */
  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const [ownersData, petsData] = await Promise.all([
        getOwners(),
        getPets(),
      ])

      // Agrupar mascotas por ownerId
      const petsByOwner: Record<string, Pet[]> = {}

      petsData.forEach(pet => {
        if (!petsByOwner[pet.ownerId]) {
          petsByOwner[pet.ownerId] = []
        }
        petsByOwner[pet.ownerId].push(pet)
      })

      const ownersWithPets = ownersData.map(owner => ({
        ...owner,
        pets: petsByOwner[owner.id] ?? [],
      }))

      setOwners(ownersWithPets)
      setPets(petsData)
      setLoading(false)
    }

    loadData()
  }, [])

  /* ===============================
   * Guardar propietario
   * =============================== */
  async function saveOwner(owner: Owner) {
    const { pets, id, ...data } = owner

    if (id) {
      await updateOwner(owner)
    } else {
      await createOwner(data)
    }

    location.reload() // simple y consistente
  }

  /* ===============================
   * Guardar mascota
   * =============================== */
  async function savePet(pet: Pet) {
    await createPet(pet)
    location.reload()
  }

  /* ===============================
   * Filtro optimizado
   * =============================== */
  const filteredOwners = useMemo(() => {
    const term = search.toLowerCase()

    return owners.filter(o =>
      o.name.toLowerCase().includes(term) ||
      o.lastName.toLowerCase().includes(term) ||
      o.document.includes(term)
    )
  }, [owners, search])

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-amber-900">
            Propietarios
          </h1>

          <button
            onClick={() =>
              setEditingOwner({
                id: "",
                name: "",
                lastName: "",
                document: "",
                birthDate: "",
                city: "",
                address: "",
                phone: "",
                email: "",
                pets: [],
              })
            }
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold w-full sm:w-auto"
          >
            + Nuevo propietario
          </button>
        </div>

        {/* Buscador */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o documento"
          className="w-full sm:max-w-md px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-300"
        />

        {/* Tabla responsive */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-amber-100 text-amber-900">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Documento</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-center px-4 py-3">Mascotas</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Cargando propietarios...
                  </td>
                </tr>
              )}

              {!loading && filteredOwners.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No hay propietarios registrados
                  </td>
                </tr>
              )}

              {filteredOwners.map(owner => (
                <tr
                  key={owner.id}
                  className="border-t hover:bg-amber-50"
                >
                  <td className="px-4 py-3">
                    {owner.name} {owner.lastName}
                  </td>
                  <td className="px-4 py-3">{owner.document}</td>
                  <td className="px-4 py-3">{owner.phone}</td>
                  <td className="px-4 py-3 text-center">
                    {owner.pets.length}
                  </td>

                  <td className="px-4 py-3 text-center space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOwner(owner)}
                      className="text-amber-600 hover:underline"
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => setEditingOwner(owner)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    <button
                      onClick={async () => {
                        if (confirm("¿Eliminar este propietario?")) {
                          await deleteOwner(owner.id)
                          location.reload()
                        }
                      }}
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

      {selectedOwner && (
        <OwnerDetailsModal
          owner={selectedOwner}
          onClose={() => setSelectedOwner(null)}
          onEdit={() => {
            setEditingOwner(selectedOwner)
            setSelectedOwner(null)
          }}
          onAddPet={() => setCreatingPet(true)}
        />
      )}

      {editingOwner && (
        <OwnerEditModal
          owner={editingOwner}
          mode={editingOwner.id ? "edit" : "create"}
          onClose={() => setEditingOwner(null)}
          onSave={saveOwner}
        />
      )}

      {creatingPet && selectedOwner && (
        <PetFormModal
          mode="create"
          pet={{
            id: "",
            ownerId: selectedOwner.id,
            name: "",
            species: "Perro",
            sex: "Macho",
            heightCm: 0,
            vaccinesUpToDate: false,
          }}
          owners={[selectedOwner]}
          onClose={() => setCreatingPet(false)}
          onSave={savePet}
        />
      )}
    </div>
  )
}
