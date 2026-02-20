"use client"

import type { Service } from "@/types/service"

interface Props {
  search: string
  setSearch: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  status: string
  setStatus: (v: string) => void
  service: string
  setService: (v: string) => void
  services: Service[]
  onClear: () => void
}

export function HistoryFilters({
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  service,
  setService,
  services,
  onClear,
}: Props) {

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm space-y-4">

      {/* búsqueda */}
      <input
        type="text"
        placeholder="Buscar mascota, propietario o servicio..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
      />

      <div className="grid md:grid-cols-5 gap-3">

        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        <select
          value={service}
          onChange={e => setService(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todos los servicios</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setStartDate(today)
            setEndDate(today)
          }}
          className="bg-amber-100 hover:bg-amber-200 rounded-lg font-medium"
        >
          Hoy
        </button>

        <button
          onClick={onClear}
          className="bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
        >
          Limpiar
        </button>

      </div>
    </div>
  )
}