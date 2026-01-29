"use client"
import { DashboardHeader } from "@/components/dashboard-header"
import { SearchBar } from "@/components/search-bar"
import { PetsTable, Row } from "@/components/pets-table"
import { Icon } from "@/components/ui/icon"
import { iconPaths } from "@/components/ui/icon-paths"
import { use, useState } from "react"
import Link from "next/link"

// Mock de TODOS los propietarios y mascotas
const allOwners = [
  { id: "o1", name: "Ana Pérez" },
  { id: "o2", name: "Carlos Gómez" },
  { id: "o3", name: "Laura Ruiz" },
  { id: "o4", name: "María López" },
]

const allPets = [
  { id: "p1", name: "Luna" },
  { id: "p2", name: "Max" },
  { id: "p3", name: "Rocky" },
  { id: "p4", name: "Bella" },
  { id: "p5", name: "Simba" },
]

// Servicios del día (para la tabla)
const initialDailyServices: Row[] = [
  {
    id: "1",
    code: "SRV-001",
    pet: "Luna",
    owner: "Ana Pérez",
    service: "Medicado",
    time: "9:30 AM",
    status: "INGRESADO",
  },
  {
    id: "2",
    code: "SRV-002",
    pet: "Max",
    owner: "Carlos Gómez",
    service: "Baño",
    time: "10:15 AM",
    status: "EN_PROCESO",
  },
  {
    id: "3",
    code: "SRV-003",
    pet: "Rocky",
    owner: "Laura Ruiz",
    service: "Peluquería",
    time: "11:00 AM",
    status: "LISTO",
  },
]


export default function HomePage() {
  const [search, setSearch] = useState("")
  const [dailyServices, setDailyServices] = useState<Row[]>(initialDailyServices)

  // Totales generales para los DashboardCards
  const totalOwners = allOwners.length
  const totalPets = allPets.length
  const pendingServices = dailyServices.filter(p => p.status !== "LISTO").length

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Welcome */}
        <section>
          <h1 className="text-2xl font-bold text-amber-900">
            Bienvenida a Roberta Pet Shop
          </h1>
          <p className="text-amber-700">
            Panel de gestión de propietarios, mascotas y servicios
          </p>
        </section>

        {/* Summary cards */}
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
        {/* Search */}
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

        {/* Pets table */}
        <section>
          <h2 className="text-lg font-semibold text-amber-900 mb-4">
            Mascotas del día
          </h2>
          <PetsTable search={search} data={dailyServices} setData={setDailyServices}/>
        </section>
      </main>
    </div>
  )
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