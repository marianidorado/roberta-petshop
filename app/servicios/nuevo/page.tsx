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
import { createServiceRecord } from "@/lib/firebase/service-record"
import { getPetsByOwner } from "@/lib/firebase/pets"
import type { Pet } from "@/types/pet"
import { getServices } from "@/lib/firebase/services"
import type { Service } from "@/types/service"
import { useUser } from "@/context/UserContext"
import { getUserProfile } from "@/lib/firebase/users"
import { DashboardHeader } from "@/components/dashboard-header"
import type { UserProfile } from "@/lib/firebase/users"


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
  const { user } = useUser()
  const [owner, setOwner] = useState<Owner | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [pet, setPet] = useState<Pet | null>(null)
  

  const [serviceId, setServiceId] = useState<string | null>(null)
  const [specifications, setSpecifications] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const [activeSpec, setActiveSpec] = useState<SpecDefinition | null>(null)
  const [specValue, setSpecValue] = useState("")
  const [repeatService, setRepeatService] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [saving, setSaving] = useState(false)

  const router = useRouter()
useEffect(() => {
  async function loadUser() {
    if (!user?.uid) return

    const profile = await getUserProfile(user.uid)

    if (profile) {
      setUserProfile(profile)
    }
  }

  loadUser()
}, [user])

const receivedBy = userProfile?.name ?? "Recepción"

  const canSave =
  !!pet &&
  !!serviceId &&
  !!receivedBy
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
          const specsArr = Object.entries(
            pet.lastService!.specifications
          ).map(([key, value]) => {
            if (value === "Sí") return key
            return `${key}: ${value}`
          })

            setSpecifications(specsArr)
          }
      }, 0)

      return () => clearTimeout(timeout)
    }
  }, [repeatService, pet])
  
  useEffect(() => {
  async function loadServices() {
    const data = await getServices()
    setServices(data)
  }

  loadServices()
}, [])


  /* ===============================
     Guardar servicio
  ================================= */
async function handleSave() {
  if (saving) return

  if (!owner || !pet || !serviceId || !receivedBy.trim()) return

  setSaving(true)

  try {
    const now = new Date()
    const selectedService = services.find(s => s.id === serviceId)

    const record: Omit<ServiceRecord, "id"> = {
      petId: pet.id,
      petName: pet.name,

      ownerId: owner.id,
      ownerName: `${owner.name} ${owner.lastName}`,

      entryDate: new Date().toLocaleDateString("sv-SE"),
      entryTime: now.toTimeString().slice(0, 5),
      receivedBy,

      serviceId,
      serviceName: selectedService?.name ?? "Servicio",

      specifications: specifications.reduce<Record<string, string>>(
        (acc, item) => {
          if (item.includes(":")) {
            const [key, value] = item.split(":").map(v => v.trim())
            acc[key] = value || "Sí"
          } else {
            acc[item] = "Sí"
          }
          return acc
        },
        {}
      ),

      observations: notes,
      status: "EN_PROCESO",
    }

    await createServiceRecord(record)

    router.replace("/home")

  } catch (error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("ya fue registrado")) {
      alert("⚠️ Esta mascota ya tiene un servicio registrado hoy")
      return
    }

    console.error("Error guardando servicio:", error.message)
  } else {
    console.error("Error desconocido:", error)
  }

  alert("Ocurrió un error inesperado. Intenta nuevamente.")
}
}


  /* ===============================
     Eliminar especificación
  ================================= */
  const removeSpec = (spec: string) => {
    setSpecifications(prev => prev.filter(s => s !== spec))
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6 space-y-6">
      <DashboardHeader></DashboardHeader>

      {/* PASO 1 – Buscar cliente */}
      <SearchClient
        onSelect={async (selectedOwner) => {
          setOwner(selectedOwner)
          setPet(null)

          const petsDb = await getPetsByOwner(selectedOwner.id)
          setPets(petsDb)
        }}
      />

      {/* PASO 2 – Seleccionar mascota */}
      {owner && (
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <p className="text-sm text-gray-500">Cliente seleccionado</p>
          <p className="font-bold text-gray-800">
            {owner.name} {owner.lastName}
          </p>
            {pets.length > 0 && (
              <PetSelector
                pets={pets}
                selectedPet={pet}
                onSelect={(selectedPet) => {
                  setPet(selectedPet)
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
          ).map(([key, value]) => {
            if (value === "Sí") return key
            return `${key}: ${value}`
          })

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
          services={services}
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
            value={userProfile?.name ?? ""}
            disabled
            className="w-full border rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
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
            disabled={!canSave || saving}
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
