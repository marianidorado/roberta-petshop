"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServicesTable } from "@/components/servicios/services-table"
import { ServiceFormModal } from "@/components/servicios/service-form-modal"
import type { ServicePlan } from "@/types/service"

const initialPlans: ServicePlan[] = [
  {
    id: "1",
    name: "Medicado",
    subtitle: "Problemas de piel",
    color: "#16a34a", // verde real
    active: true,
    items: [
      "Masaje relajante",
      "Shampoo medicado",
      "Corte y limado de uñas",
      "Limpieza de oídos y dental",
      "Hidratación de huellas",
      "Peluquería según pelaje",
      "Secado",
      "Perfume",
      "Corbatín y accesorios",
      "Snack",
      "Foto instagrameable",
    ],
        prices: [
    { size: "Pequeño", price: 53000 },
    { size: "Mediano", price: 69000 },
    { size: "Grande", price: 94000 },
    ],
  },
]

export default function ServiciosPage() {
  const [plans, setPlans] = useState<ServicePlan[]>(initialPlans)
  const [editing, setEditing] = useState<ServicePlan | null>(null)

  function save(plan: ServicePlan) {
    setPlans(prev =>
      prev.some(p => p.id === plan.id)
        ? prev.map(p => (p.id === plan.id ? plan : p))
        : [...prev, { ...plan, id: crypto.randomUUID() }]
    )
    setEditing(null)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* HEADER SIEMPRE ARRIBA */}
      <DashboardHeader />

      {/* CONTENIDO */}
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
                subtitle: "",
                color: "#f59e0b", // ámbar real
                items: [],
                prices: [],
                active: true,
              })
            }
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold"
          >
            + Nuevo servicio
          </button>
        </div>

        <ServicesTable
          services={plans}
            onEdit={setEditing}
            onDelete={id => {
                if (confirm("¿Eliminar este servicio?")) {
                    setPlans(prev => prev.filter(p => p.id !== id))
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
