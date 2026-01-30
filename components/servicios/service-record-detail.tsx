"use client"

import type { ServiceRecord } from "@/types/service-record"

interface Props {
  record: ServiceRecord
  onClose: () => void
}

export function ServiceRecordDetailModal({ record, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-amber-900">
              Ficha de servicio
            </h2>
            <p className="text-sm text-slate-500">
              {record.entryDate} · {record.entryTime}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">

          {/* Mascota y propietario */}
          <div className="grid grid-cols-2 gap-4">
            <Info label="Mascota" value={record.petName} />
            <Info label="Propietario" value={record.ownerName} />
          </div>

          {/* Servicio */}
          <div className="grid grid-cols-2 gap-4">
            <Info label="Servicio" value={record.serviceName} />
            <Info label="Recibido por" value={record.receivedBy} />
          </div>

          {/* Estado */}
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                ${
                  record.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {record.completed ? "Servicio finalizado" : "En proceso"}
            </span>
          </div>

          {/* Especificaciones */}
          {record.specifications && (
            <div>
              <p className="font-semibold text-slate-700 mb-2">
                Especificaciones del servicio
              </p>

              <ul className="space-y-1">
                {Object.entries(record.specifications).map(
                  ([key, value]) => (
                    <li
                      key={key}
                      className="flex justify-between bg-amber-50 px-3 py-2 rounded-lg"
                    >
                      <span className="capitalize text-slate-600">
                        {key.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {value}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Observaciones */}
          {record.observations && (
            <div>
              <p className="font-semibold text-slate-700 mb-1">
                Observaciones
              </p>
              <p className="bg-slate-50 border rounded-lg p-3 text-slate-700">
                {record.observations}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-xl"
          >
            Cerrar ficha
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===============================
   Componente reutilizable
================================ */
function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  )
}
