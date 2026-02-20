"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { PetDetailsModal } from "@/components/mascotas/pet-details-modal"
import { PetFormModal } from "@/components/mascotas/pet-form-modal"

import type { Pet } from "@/types/pet"
import type { Owner } from "@/types/owner"
import type { ServiceRecord, ServiceRecordSummary } from "@/types/service-record"

import { getPets, createPet, deletePet, updatePet } from "@/lib/firebase/pets"
import { getOwners } from "@/lib/firebase/owners"
import { getServiceRecords } from "@/lib/firebase/service-record"

/* =============================== */
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
  const [pets, setPets] = useState<Pet[]>([])
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [owners, setOwners] = useState<Owner[]>([])

  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [creatingPet, setCreatingPet] = useState(false)
  const [search, setSearch] = useState("")

  /* ===============================
     LOAD DATA
  ============================== */
  useEffect(() => {
    async function loadData() {
      const [petsFromDb, ownersFromDb, servicesFromDb] =
        await Promise.all([
          getPets(),
          getOwners(),
          getServiceRecords(),
        ])

      setPets(petsFromDb)
      setOwners(ownersFromDb)
      setServices(servicesFromDb)
    }

    loadData()
  }, [])

  /* ===============================
     LAST SERVICE MAP
  ============================== */
  const lastServiceMap = useMemo(() => {
    const map: Record<string, ServiceRecordSummary> = {}

    services.forEach(service => {
      const existing = map[service.petId]

      const currentDate = new Date(
        service.entryDate + "T" + service.entryTime
      )

      if (!existing) {
        map[service.petId] = {
          id: service.id,
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          entryDate: service.entryDate,
        }
      } else {
        const existingDate = new Date(existing.entryDate)

        if (currentDate > existingDate) {
          map[service.petId] = {
            id: service.id,
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            entryDate: service.entryDate,
          }
        }
      }
    })

    return map
  }, [services])

  /* ===============================
     MERGE PETS WITH LAST SERVICE
  ============================== */
  const petsWithService = useMemo(() => {
    return pets.map(pet => ({
      ...pet,
      lastService: lastServiceMap[pet.id],
    }))
  }, [pets, lastServiceMap])

  /* ===============================
     FILTER
  ============================== */
  const filteredPets = petsWithService.filter(pet =>
    `${pet.name} ${pet.species} ${pet.breed}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const getOwnerName = (ownerId: string) => {
    const owner = owners.find(o => o.id === ownerId)
    return owner ? `${owner.name} ${owner.lastName}` : "—"
  }

  /* ===============================
     UI
  ============================== */
  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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

        {/* SEARCH */}
        <input
          placeholder="Buscar mascota por nombre, especie o raza"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 border rounded-md"
        />

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
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
                   {pet.lastService
                        ? `${pet.lastService.serviceName} (${pet.lastService.entryDate})`
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
                      onClick={async () => {
                        await deletePet(pet.id)
                        setPets(prev => prev.filter(p => p.id !== pet.id))
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

      {/* MODALS */}

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
          owners={owners}
          onClose={() => setCreatingPet(false)}
          onSave={async newPet => {
            const id = await createPet(newPet)
            setPets(prev => [...prev, { ...newPet, id }])
            setCreatingPet(false)
          }}
        />
      )}

      {editingPet && (
        <PetFormModal
          pet={editingPet}
          mode="edit"
          owners={owners}
          onClose={() => setEditingPet(null)}
          onSave={async updated => {
            await updatePet(updated)
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
