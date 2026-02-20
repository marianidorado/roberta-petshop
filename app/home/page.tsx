"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { SearchBar } from "@/components/search-bar"
import { PetsTable, Row } from "@/components/pets-table"
import { Icon } from "@/components/ui/icon"
import { iconPaths } from "@/components/ui/icon-paths"
import { ServiceRecordDetailModal } from "@/components/servicios/service-record-detail"
import { ServiceDeliveryModal } from "@/components/servicios/service-delivery-modal"

import { getOwners } from "@/lib/firebase/owners"
import { getPets } from "@/lib/firebase/pets"
import {
  getTodayServiceRecords,
  markServiceReady,
  deliverService,
} from "@/lib/firebase/service-record"

import type { Owner } from "@/types/owner"
import type { Pet } from "@/types/pet"
import type { ServiceRecord } from "@/types/service-record"
import type { ServiceStatus } from "@/components/pets-table"

export default function HomePage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([])
  const [search, setSearch] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null)
  const [delivering, setDelivering] = useState<ServiceRecord | null>(null)

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [ownersDb, petsDb, servicesDb] = await Promise.all([
          getOwners(),
          getPets(),
          getTodayServiceRecords(),
        ])

        setOwners(ownersDb)
        setPets(petsDb)
        setServiceRecords(servicesDb)
      } catch (error) {
        console.error("Error cargando Home:", error)
      }
    }

    loadHomeData()
  }, [])

  /* Transformar servicios en filas */
  const dailyServices: Row[] = useMemo(() => {
    return serviceRecords
      .filter(service => service.status !== "ENTREGADO")
      .map(service => mapServiceToRow(service))
  }, [serviceRecords])

  const filteredServices = useMemo(() => {
    return dailyServices.filter(row =>
      row.code.toLowerCase().includes(search.toLowerCase()) ||
      row.pet.toLowerCase().includes(search.toLowerCase()) ||
      row.owner.toLowerCase().includes(search.toLowerCase())
    )
  }, [dailyServices, search])

  const totalOwners = owners.length
  const totalPets = pets.length
  const pendingServices = dailyServices.length

  const handleMarkReady = async (id: string) => {
    await markServiceReady(id)

    setServiceRecords(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: "LISTO" } : r
      )
    )
  }

  const handleDeliver = (id: string) => {
    const record = serviceRecords.find(r => r.id === id)
    if (record) setDelivering(record)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section>
          <h1 className="text-2xl font-bold text-amber-900">
            Bienvenida a Roberta Pet Shop
          </h1>
          <p className="text-amber-700">
            Panel de gestión de propietarios, mascotas y servicios
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DashboardCard
            title="Propietarios"
            value={totalOwners.toString()}
            icon={iconPaths.propietarios}
          />
          <DashboardCard
            title="Mascotas"
            value={totalPets.toString()}
            icon={iconPaths.mascotas}
          />
          <DashboardCard
            title="Servicios pendientes"
            value={pendingServices.toString()}
            icon={iconPaths.servicios}
          />
        </section>

        <SearchBar value={search} onChange={setSearch} />

        <section className="flex justify-end">
          <Link
            href="/servicios/nuevo"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3 rounded-xl shadow transition"
          >
            <Icon path={iconPaths.agregar} />
            Nuevo servicio
          </Link>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-amber-900 mb-4">
            Mascotas del día
          </h2>

          <PetsTable
            rows={filteredServices}
            onMarkReady={handleMarkReady}
            onDeliver={handleDeliver}
          />
        </section>
      </main>

      {selectedRecord && (
        <ServiceRecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {delivering && (
        <ServiceDeliveryModal
          record={delivering}
          onClose={() => setDelivering(null)}
          onConfirm={async updated => {
            const now = new Date()
            const exitTime =
              String(now.getHours()).padStart(2, "0") +
              ":" +
              String(now.getMinutes()).padStart(2, "0")

            await deliverService(updated.id, exitTime, updated.ownerSignature)

            setServiceRecords(prev =>
              prev.filter(r => r.id !== updated.id)
            )

            setDelivering(null)
          }}
        />
      )}
    </div>
  )
}

function mapServiceToRow(service: ServiceRecord): Row {
  return {
    id: service.id,
    code: service.id.slice(0, 8).toUpperCase(),
    pet: service.petName,
    owner: service.ownerName,
    service: service.serviceName,
    receivedBy: service.receivedBy,
    time: service.entryTime,
    status: (service.status ?? "EN_PROCESO") as ServiceStatus,
    notes: service.observations,
  }
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
        <Icon path={icon} />
      </div>

      <div>
        <p className="text-sm text-slate-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  )
}
