"use client"

import { useState, useEffect } from "react"
import { SearchClient } from "@/components/servicios/search-client"
import { PetSelector } from "@/components/servicios/pet-selector"
import { ServiceSelector } from "@/components/servicios/service-selector"
import { MedicalNotes } from "@/components/servicios/medical-notes"
import { PetSummaryCard } from "@/components/servicios/pet-summary"
import type { ServiceRecord } from "@/types/service-record"
import { useRouter } from "next/navigation"
import type { Owner } from "@/types/owner"
import type { PetSummary } from "@/types/pet-summary"

/* ===============================
   Servicios disponibles
================================ */
const AVAILABLE_SERVICES = [
  { id: "s1", name: "Diamante" },
  { id: "s2", name: "Medicados" },
  { id: "s3", name: "Reina" },
  { id: "s4", name: "Volumen" },
]

/* ===============================
   Especificaciones FIJAS
================================ */
type SpecDefinition = {
  label: string
  options?: string[]
  requiresInput?: boolean
}

const SPEC_DEFINITIONS: SpecDefinition[] = [
  { label: "Aseo básico" },
  { label: "Bikini", options: ["Alto", "Medio", "Con tijeras", "Con máquina"] },
  { label: "Patas redondas" },
  { label: "Pulpejos" },
  { label: "Escarpines" },
  { label: "Despejar ojos" },
  { label: "Cara", options: ["Cachorro", "Cara redonda completa", "Cara abajo", "Osito", "Dona"] },
  { label: "Orejas", options: ["Redonda", "Punta diamante", "Rapada", "Recta"] },
  { label: "Pelo muerto" },
  { label: "Peluquería con cuchilla", options: ["#4", "#5", "#7", "#10"] },
  { label: "Peluquería con guía", options: ["Azul celeste", "Lila", "Morado", "Amarillo", "Verde", "Rojo", "Beige"] },
  { label: "Peluquería con tijera" },
  { label: "Moños" },
  { label: "Despuntar", options: ["Cuerpo", "Cara", "Patas", "Orejas", "Cola"] },
  { label: "Cola", options: ["Palmera", "León"] },
  { label: "Cortes", options: ["Snauhzer", "Asiático", "Osito", "Cocker"] },
  { label: "Deslanado" },
  { label: "Otros", requiresInput: true },
]

/* ===============================
   PAGE
================================ */
export default function NuevoServicioPage() {
  const [owner, setOwner] = useState<Owner | null>(null)
  const [pet, setPet] = useState<PetSummary | null>(null)

  const [serviceId, setServiceId] = useState<string | null>(null)
  const [specifications, setSpecifications] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const [activeSpec, setActiveSpec] = useState<SpecDefinition | null>(null)
  const [specValue, setSpecValue] = useState("")
  const [repeatService, setRepeatService] = useState(false)
  const [receivedBy, setReceivedBy] = useState("")

  const router = useRouter()
  const validServiceSelected =
    serviceId !== null &&
    AVAILABLE_SERVICES.some(s => s.id === serviceId)

  const canSave =
    !!pet &&
    !!serviceId &&
    receivedBy.trim().length > 0

  /* ===============================
     Efecto para autocompletar último servicio
     solo si se presiona "Repetir servicio"
  ================================= */
  useEffect(() => {
    if (repeatService && pet?.lastService) {
      // Ejecutar después del render para evitar cascada
      const timeout = setTimeout(() => {
        setServiceId(pet.lastService!.serviceId)
        if (pet.lastService!.specifications) {
          const specsArr = Object.entries(pet.lastService!.specifications).map(
            ([key, value]) => `${key}: ${value}`
          )
          setSpecifications(specsArr)
        }
      }, 0)

      return () => clearTimeout(timeout)
    }
  }, [repeatService, pet])

  /* ===============================
     Guardar servicio
  ================================= */
  function handleSave() {
  if (!owner || !pet || !serviceId || !receivedBy.trim()) return

  const now = new Date()

  const record: ServiceRecord = {
    id: crypto.randomUUID(),

    petId: pet.id,
    petName: pet.name,

    ownerId: owner.id,
    ownerName: `${owner.name} ${owner.lastName}`,

    entryDate: now.toISOString().split("T")[0],
    entryTime: now.toTimeString().slice(0, 5),
    receivedBy,

    serviceId,
    serviceName:
      AVAILABLE_SERVICES.find(s => s.id === serviceId)?.name ?? "Servicio",

    specifications: specifications.reduce<Record<string, string>>(
      (acc, item) => {
        const [key, value] = item.split(":").map(v => v.trim())
        acc[key] = value ?? "Sí"
        return acc
      },
      {}
    ),

    observations: notes,
    completed: false,
  }

  // 1️⃣ Guardar en localStorage
  const existing = JSON.parse(
    localStorage.getItem("dailyServices") || "[]"
  )

  localStorage.setItem(
    "dailyServices",
    JSON.stringify([record, ...existing])
  )

  // 2️⃣ Guardar el último para abrir el modal
  localStorage.setItem("lastServiceRecord", JSON.stringify(record))

  // 3️⃣ Ir al Home
  router.push("/home")
}

  /* ===============================
     Eliminar especificación
  ================================= */
  const removeSpec = (spec: string) => {
    setSpecifications(prev => prev.filter(s => s !== spec))
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
            <PetSelector
              pets={owner.pets}
              selectedPet={pet}
              onSelect={(selectedPet) => {
                setPet(selectedPet)
                // Limpiar todo inmediatamente al elegir la mascota
                setServiceId(null)
                setSpecifications([])
                setNotes("")
                setActiveSpec(null)
                setSpecValue("")
                setRepeatService(false)
              }}
            />
          )}
        </div>
      )}

      {/* PASO 3 – Resumen mascota */}
      {pet && (
  <PetSummaryCard
    pet={pet}
    onRepeat={() => {
      if (pet.lastService) {
        setServiceId(pet.lastService.serviceId)

        // Autocompleta especificaciones SOLO aquí
        if (pet.lastService.specifications) {
          const specsArr = Object.entries(
            pet.lastService.specifications
          ).map(([key, value]) => `${key}: ${value}`)
          setSpecifications(specsArr)
        }

        setRepeatService(true)
      }
    }}
  />
)}

      {/* PASO 4 – Servicio */}
      {pet && (
        <ServiceSelector
          services={AVAILABLE_SERVICES}
          selected={serviceId}
          onChange={setServiceId}
        />
      )}

      {/* PASO 5 – Especificaciones */}
      {pet && (
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="font-semibold">Especificaciones</p>

          {/* Selector principal */}
          <select
            className="w-full border rounded-xl p-3"
            value={activeSpec?.label ?? ""}
            onChange={e => {
              const selected = SPEC_DEFINITIONS.find(s => s.label === e.target.value)
              setActiveSpec(selected ?? null)
              setSpecValue("")
            }}
          >
            <option value="">Selecciona una especificación</option>
            {SPEC_DEFINITIONS.map(spec => (
              <option key={spec.label} value={spec.label}>
                {spec.label}
              </option>
            ))}
          </select>

          {/* Sub-opciones */}
          {activeSpec?.options && (
            <select
              className="w-full border rounded-xl p-3"
              value={specValue}
              onChange={e => {
                const value = `${activeSpec.label}: ${e.target.value}`
                setSpecValue(e.target.value)

                setSpecifications(prev =>
                  prev.includes(value) ? prev : [...prev, value]
                )
              }}
            >
              <option value="">Selecciona opción</option>
              {activeSpec.options.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {/* Input libre */}
          {activeSpec?.requiresInput && (
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded-xl p-3"
                placeholder="Especificar…"
                value={specValue}
                onChange={e => setSpecValue(e.target.value)}
              />
              <button
                onClick={() => {
                  if (!specValue) return
                  setSpecifications(prev => [...prev, `${activeSpec.label}: ${specValue}`])
                  setSpecValue("")
                }}
                className="bg-amber-500 text-white px-4 rounded-xl"
              >
                Agregar
              </button>
            </div>
          )}

          {/* Sin sub-opciones */}
          {activeSpec && !activeSpec.options && !activeSpec.requiresInput && (
            <button
              onClick={() => {
                if (specifications.includes(activeSpec.label)) return
                setSpecifications(prev => [...prev, activeSpec.label])
              }}
              className="w-full bg-amber-100 text-amber-800 p-3 rounded-xl"
            >
              Agregar {activeSpec.label}
            </button>
          )}

          {/* Chips */}
          {specifications.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {specifications.map(spec => (
                <span
                  key={spec}
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-1"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpec(spec)}
                    className="text-red-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {pet && (
        <div className="bg-white rounded-xl p-4 shadow space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            ¿Quién recibe la mascota?
          </label>

          <input
            value={receivedBy}
            onChange={e => setReceivedBy(e.target.value)}
            placeholder="Nombre de la persona responsable"
            className="w-full border rounded-xl p-3"
          />

          <p className="text-xs text-gray-500">
            Esta persona queda responsable del servicio
          </p>
        </div>
      )}
      {/* PASO 6 – Observaciones */}
      {pet && (
        <MedicalNotes value={notes} onChange={setNotes} />
      )}

      {/* PASO 7 – Guardar */}
      {pet && (
        <div className="pt-4">
          <button
            disabled={!canSave}
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-semibold text-white
              ${
                !canSave
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
