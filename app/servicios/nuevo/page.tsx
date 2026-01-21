"use client"
const AVAILABLE_SERVICES = [
  { id: "bath", name: "Baño" },
  { id: "haircut", name: "Corte de pelo" },
  { id: "nails", name: "Corte de uñas" },
  { id: "ears", name: "Limpieza de oídos" },
]

import { useState } from "react"
import { SearchClient } from "@/components/servicios/search-client"
import { PetSelector } from "@/components/servicios/pet-selector"
import type { Client } from "@/types/client"
import type { Pet } from "@/types/pet"
import { PetSummary } from "@/components/servicios/pet-summary"
import { ServiceSelector } from "@/components/servicios/service-selector"
import { MedicalNotes } from "@/components/servicios/medical-notes"
import { SaveServiceButton } from "@/components/servicios/save-service"
export default function NuevoServicioPage() {
  const [client, setClient] = useState<Client | null>(null)
  const [services, setServices] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [pet, setPet] = useState<Pet | null>(null)
  function handleSave() {
    if (!client || !pet) return

    const payload = {
      clientId: client.id,
      petId: pet.id,
      services,
      notes,
      date: new Date().toISOString(),
    }

    console.log("SERVICIO A GUARDAR:", payload)
    alert("Servicio guardado (simulado)")
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6 space-y-6">

      {/* PASO 1 */}
      <SearchClient onSelect={setClient} />

      {/* PASO 2 */}
      {client && (
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="text-sm text-gray-500">Cliente seleccionado</p>
          <p className="font-bold text-gray-800">{client.name}</p>

          {client.pets.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Este cliente no tiene mascotas registradas
              </p>
              <button className="px-4 py-2 rounded-xl bg-amber-500 text-white">
                Agregar mascota
              </button>
            </div>
          ) : (
            <PetSelector
              pets={client.pets}
              onSelect={setPet}
            />
          )}
        </div>
      )}
      {/* PASO 3 */}
      {pet && (
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="text-sm text-gray-500">Mascota seleccionada</p>

          <PetSummary
            pet={pet}
            onRepeat={(serviceId) =>
              setServices(prev =>
                prev.includes(serviceId) ? prev : [...prev, serviceId]
              )
            }
          />
        </div>
      )}
      {/* PASO 4 */}
      {pet && (
        <ServiceSelector
          services={AVAILABLE_SERVICES}
          selected={services}
          onChange={setServices}
        />
      )}
      {/* PASO 5 */}
      {pet && (
        <MedicalNotes
          value={notes}
          onChange={setNotes}
        />
      )}
      {/* PASO 6 */}
      {pet && (
        <SaveServiceButton
          disabled={services.length === 0}
          onSave={handleSave}
        />
      )}

    </div>
  )
}

