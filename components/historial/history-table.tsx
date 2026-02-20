"use client"

import type { ServiceRecord } from "@/types/service-record"
import type { Service } from "@/types/service"

interface Props {
  data: ServiceRecord[]
  services: Service[]
  loading?: boolean
  onSelect: (record: ServiceRecord) => void
}

export function HistoryTable({ data, services, loading, onSelect }: Props) {

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-6 text-center text-slate-500">
        Cargando historial...
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border p-6 text-center text-slate-500">
        No hay servicios en el historial
      </div>
    )
  }
 
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <div className="w-full overflow-x-auto">
      <table className="min-w-[700px] w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Mascota</th>
            <th className="px-4 py-3 text-left">Propietario</th>
            <th className="px-4 py-3 text-left">Servicio</th>
            <th className="px-4 py-3 text-left">Salida</th>
            <th className="px-4 py-3 text-center">Acción</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map(record => {
              const serviceInfo = services.find(
                s => s.id === record.serviceId
              )

            return (
              <tr key={record.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">{record.entryDate}</td>
                <td className="px-4 py-3">{record.petName}</td>
                <td className="px-4 py-3">{record.ownerName}</td>

                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">
                        {record.serviceName}
                      </p>
                  </td>

                <td className="px-4 py-3">
                  {record.exitTime || "-"}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                        console.log("click", record)
                        onSelect(record)
                      }}
                    className="text-amber-600 font-semibold hover:underline"
                  >
                    Ver ficha
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}