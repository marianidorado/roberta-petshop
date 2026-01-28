"use client"

import { useState } from "react"
import { SearchClient } from "@/components/servicios/search-client"
import { PetSelector } from "@/components/servicios/pet-selector"
import { ServiceSelector } from "@/components/servicios/service-selector"
import { MedicalNotes } from "@/components/servicios/medical-notes"
import { PetSummaryCard } from "@/components/servicios/pet-summary"

import type { Owner } from "@/types/owner"
import type { PetSummary } from "@/types/pet"

/* Servicios (combos) creados por el ADMIN */
const AVAILABLE_SERVICES = [
  { id: "s1", name: "Diamante" },
  { id: "s2", name: "Medicados" },
  { id: "s3", name: "Reina" },
  { id: "s4", name: "Volumen" },
]

/* Especificaciones posibles */
const AVAILABLE_SPECS = [
  "Patas redondeadas",
  "Cara osito",
  "Corte higiénico",
  "Cola león",
  "Bikini medio",
]

export default function NuevoServicioPage() {
  const [owner, setOwner] = useState<Owner | null>(null)
  const [pet, setPet] = useState<PetSummary | null>(null)

  const [serviceId, setServiceId] = useState<string | null>(null)
  const [specifications, setSpecifications] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const validServiceSelected =
  serviceId !== null &&
  AVAILABLE_SERVICES.some(s => s.id === serviceId)

  function toggleSpec(spec: string) {
    setSpecifications(prev =>
      prev.includes(spec)
        ? prev.filter(s => s !== spec)
        : [...prev, spec]
    )
  }

  function handleSave() {
    if (!owner || !pet || !serviceId) return

    const payload = {
      ownerId: owner.id,
      petId: pet.id,
      serviceId,
      specifications,
      notes,
      checkInAt: new Date().toISOString(),
      status: "IN_PROGRESS",
    }
    
    console.log("INGRESO REGISTRADO:", payload)
    alert("Mascota ingresada correctamente 🐾")
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6 space-y-6">

      {/* PASO 1 – Buscar cliente */}
      <SearchClient onSelect={setOwner} />

      {/* PASO 2 – Seleccionar mascota */}
      {owner && (
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="text-sm text-gray-500">Cliente seleccionado</p>
          <p className="font-bold text-gray-800">
            {owner.name} {owner.lastName}
          </p>

          {owner.pets.length === 0 ? (
            <p className="text-sm text-gray-600">
              Este cliente no tiene mascotas registradas
            </p>
          ) : (
            <PetSelector pets={owner.pets} onSelect={setPet} />
          )}
        </div>
      )}

      {/* PASO 3 – Resumen mascota */}
      {pet && (
        <PetSummaryCard
          pet={pet}
          onRepeat={(ServiceId) => setServiceId(ServiceId)}
        />
      )}

      {/* PASO 4 – Servicio (combo) */}
      
      {pet && validServiceSelected &&(
        <ServiceSelector
          services={AVAILABLE_SERVICES}
          selected={serviceId}
          onChange={setServiceId}
        />
      )}

      {/* PASO 5 – Especificaciones */}
      {serviceId && (
        <div className="bg-white rounded-xl p-4 shadow space-y-3">
          <p className="font-semibold">Especificaciones</p>

          {AVAILABLE_SPECS.map(spec => (
            <button
              key={spec}
              onClick={() => toggleSpec(spec)}
              className={`w-full text-left p-3 border rounded-xl transition
                ${
                  specifications.includes(spec)
                    ? "bg-amber-100 border-amber-400"
                    : "hover:bg-gray-50"
                }`}
            >
              {spec}
            </button>
          ))}
        </div>
      )}

      {/* PASO 6 – Observaciones */}
      {serviceId && (
        <MedicalNotes value={notes} onChange={setNotes} />
      )}

      {/* PASO 7 – Guardar ingreso */}
      {serviceId && (
        <div className="pt-4">
          <button
            disabled={!validServiceSelected}
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-semibold text-white
              ${
                !validServiceSelected
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
          >
            Guardar servicio
          </button>
        </div>
      )}
    </div>
  )
}