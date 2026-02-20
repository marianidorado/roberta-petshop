"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ServicesTable } from "@/components/servicios/services-table"
import { ServiceFormModal } from "@/components/servicios/service-form-modal"
import type { Service } from "@/types/service"

import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/firebase/services"

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    const data = await getServices()
    setServices(data)
    setLoading(false)
  }

  fetchData()
}, [])
 const loadServices = async () => {
  setLoading(true)
  const data = await getServices()
  setServices(data)
  setLoading(false)
}

  async function save(service: Service) {
    if (service.id) {
      await updateService(service)
      setServices(prev =>
        prev.map(s => (s.id === service.id ? service : s))
      )
    } else {
      const { id, ...data } = service
      await createService(data)
      await loadServices()
    }

    setEditing(null)
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return
    await deleteService(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-amber-900">
            Gestión de Servicios
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
                specifications: [],
              })
            }
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl font-semibold shadow transition"
          >
            + Nuevo servicio
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow">
            Cargando servicios...
          </div>
        ) : (
          <ServicesTable
            services={services}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        )}
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
