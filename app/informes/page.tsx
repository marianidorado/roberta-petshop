"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/context/UserContext"
import { getServiceRecords } from "@/lib/firebase/service-record"
import { BusinessDashboard } from "@/components/reports/reports-dashboard"
import type { ServiceRecord } from "@/types/service-record"
import { DashboardHeader } from "@/components/dashboard-header"
import { getPets } from "@/lib/firebase/pets"
import type { Pet } from "@/types/pet"

export default function InformesPage() {

  const { user, role, loading } = useUser()

  const [records, setRecords] = useState<ServiceRecord[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {

    if (loading) return
    if (!user) return
    if (role !== "admin") return

    async function load() {

      const [services, petsDb] = await Promise.all([
        getServiceRecords(),
        getPets()
      ])

      setRecords(services)
      setPets(petsDb)
      setLoadingData(false)
    }

    load()

  }, [user, role, loading])

  if (loading) return <p>Cargando sesión...</p>
  if (!user) return <p>Debes iniciar sesión</p>
  if (!role) return <p>Cargando permisos...</p>
  if (role !== "admin") return <p>No tienes permisos para ver esta sección</p>
  if (loadingData) return <p>Cargando informes...</p>

  return (
    <>
      <DashboardHeader />

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-bold text-amber-900">
          Informes del Negocio
        </h1>

        <BusinessDashboard
          records={records}
          pets={pets}
        />

      </div>
    </>
  )
}