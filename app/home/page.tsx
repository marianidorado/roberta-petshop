"use client"
import { DashboardHeader } from "@/components/dashboard-header"
import { SearchBar } from "@/components/search-bar"
import { PetsTable } from "@/components/pets-table"
import { Icon } from "@/components/ui/icon"
import { iconPaths } from "@/components/ui/icon-paths"
import { use, useState } from "react"

export default function HomePage() {
  const [search, setSearch] = useState("")

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
            value="128"
            icon={iconPaths.propietarios}
          />
          <DashboardCard
            title="Mascotas"
            value="243"
            icon={iconPaths.mascotas}
          />
          <DashboardCard
            title="Servicios pendientes"
            value="5"
            icon={iconPaths.servicios}
          />
        </section>
        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />
        <section className="flex justify-end">
          <a
            href="/servicios/nuevo"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3 rounded-xl shadow transition"
          >
            <Icon path={iconPaths.agregar} />
            Nuevo servicio
          </a>
        </section>

        {/* Pets table */}
        <section>
          <h2 className="text-lg font-semibold text-amber-900 mb-4">
            Mascotas del día
          </h2>
          <PetsTable search={search} />
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