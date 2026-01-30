"use client"
import { useEffect, useState } from "react"
import type { ServiceRecord } from "@/types/service-record"
import { HistoryTable } from "@/components/historial/history-table"
import { HistoryFilters } from "@/components/historial/history-filters"
import { HistoryDetailModal } from "@/components/historial/history-detail-modal"
import { DashboardHeader } from "@/components/dashboard-header"

export default function HistoryPage() {
  const [records] = useState<ServiceRecord[]>(() => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("serviceHistory")
  if (!stored) return []

  return JSON.parse(stored)
})
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<ServiceRecord | null>(null)

  

  const filteredRecords = records.filter(r =>
    r.petName.toLowerCase().includes(search.toLowerCase()) ||
    r.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    r.serviceName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-amber-900">
          Historial de servicios
        </h1>

        <HistoryFilters
          value={search}
          onChange={setSearch}
        />

        <HistoryTable
          data={filteredRecords}
          onSelect={record => setSelected(record)}
        />
      </main>

      {selected && (
        <HistoryDetailModal
          record={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
