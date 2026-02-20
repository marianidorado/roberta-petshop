"use client"

import { useEffect, useState } from "react"
import type { ServiceRecord } from "@/types/service-record"
import { HistoryTable } from "@/components/historial/history-table"
import { HistoryFilters } from "@/components/historial/history-filters"
import { HistoryDetailModal } from "@/components/historial/history-detail-modal"
import { DashboardHeader } from "@/components/dashboard-header"
import { getDocs, collection, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase/firebase"
import { getServices } from "@/lib/firebase/services"
import type { Service } from "@/types/service"

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<ServiceRecord | null>(null)
  const [records, setRecords] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [status, setStatus] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [service, setService] = useState("")

  const filteredRecords = records.filter(r => {

  const matchesText =
    `${r.petName} ${r.ownerName} ${r.serviceName}`
      .toLowerCase()
      .includes(search.toLowerCase())

  const matchesStatus = status ? r.status === status : true
  const matchesService = service ? r.serviceId === service : true
  

  const matchesStart =
    startDate ? r.entryDate >= startDate : true

  const matchesEnd =
    endDate ? r.entryDate <= endDate : true
   

  return matchesText && matchesStatus && matchesStart && matchesEnd && matchesService
})

  useEffect(() => {
    
    async function loadHistory() {
      try {
        const q = query(
          collection(db, "serviceRecords"),
          where("status", "==", "ENTREGADO"),
          orderBy("entryDate", "desc")
        )
        const servicesData = await getServices()
        console.log("SERVICES:", servicesData)
        setServices(servicesData)

        const snapshot = await getDocs(q)

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ServiceRecord, "id">),
        }))

        console.log("Records", data)

        setRecords(data)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar el historial.")
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

   function clearFilters() {
  setSearch("")
  setStartDate("")
  setEndDate("")
  setStatus("")
  setService("")
}
console.log("services state:", services)
  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="text-2xl font-bold text-amber-900">
            Historial de servicios
          </h1>
        </div>
        <HistoryFilters
          search={search}
          setSearch={setSearch}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          status={status}
          setStatus={setStatus}
          service={service}
          setService={setService}
          services={services}
          onClear={clearFilters}
        />

        <HistoryTable
          data={filteredRecords}
          services={services}
          onSelect={(record) => setSelected(record)}
        />

        {loading && (
          <div className="text-center py-10 text-slate-500">
            Cargando historial...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        )}
      </main>

      {selected && (
        <HistoryDetailModal
          record={selected}
          services={services}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}