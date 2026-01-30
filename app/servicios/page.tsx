"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServicesTable } from "@/components/servicios/services-table"
import { ServiceFormModal } from "@/components/servicios/service-form-modal"
import type { Service } from "@/types/service"


const initialServices: Service[] = [
  {
    id: "1",
    name: "Servicio Medicado",
    description: "Problemas de piel",
    active: true,
    includes: [
      "Masaje relajante",
      "Shampoo medicado",
      "Corte y limado de uñas",
      "Limpieza de oídos",
      "Hidratación de huellas",
      "Secado",
      "Perfume",
      "Accesorios",
    ],
    sizeRules: [
      { minHeightCm: 0, maxHeightCm: 20 },
      { minHeightCm: 21, maxHeightCm: 40 },
      { minHeightCm: 41, maxHeightCm: 60 },
      { minHeightCm: 61, maxHeightCm: 70 },
      { minHeightCm: 71 },
    ],
  },
]

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [editing, setEditing] = useState<Service | null>(null)
  

  function save(service: Service) {
    setServices(prev =>
      prev.some(s => s.id === service.id)
        ? prev.map(s => (s.id === service.id ? service : s))
        : [...prev, { ...service, id: crypto.randomUUID() }]
    )
    setEditing(null)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">
            Servicios
          </h1>

          <button
            onClick={() =>
              setEditing({
                id: "",
                name: "",
                description: "",
                active: true,
                includes: [],
                sizeRules: [],
              })
            }
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold"
          >
            + Nuevo servicio
          </button>
        </div>

        <ServicesTable
          services={services}
          onEdit={setEditing}
          onDelete={id => {
            if (confirm("¿Eliminar este servicio?")) {
              setServices(prev => prev.filter(s => s.id !== id))
            }
          }}
        />
      </main>

      {editing && (
        <ServiceFormModal
          service={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  )
}
