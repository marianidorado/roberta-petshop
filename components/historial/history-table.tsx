"use client"
import type { ServiceRecord } from "@/types/service-record"

interface Props {
  data: ServiceRecord[]
  onSelect: (record: ServiceRecord) => void
}

export function HistoryTable({ data, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="w-full text-sm">
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
          {data.map(record => (
            <tr key={record.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">{record.entryDate}</td>
              <td className="px-4 py-3">{record.petName}</td>
              <td className="px-4 py-3">{record.ownerName}</td>
              <td className="px-4 py-3">{record.serviceName}</td>
              <td className="px-4 py-3">{record.exitTime}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onSelect(record)}
                  className="text-amber-600 font-semibold"
                >
                  Ver ficha
                </button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-slate-500">
                No hay servicios en el historial
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
