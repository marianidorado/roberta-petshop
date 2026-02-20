"use client"

export type ServiceStatus = "EN_PROCESO" | "LISTO" | "ENTREGADO"

export interface Row {
  id: string
  code: string
  pet: string
  owner: string
  service: string
  receivedBy: string
  time: string
  status: ServiceStatus
  notes?: string
}

interface PetsTableProps {
  rows: Row[]
  onMarkReady: (id: string) => void
  onDeliver: (id: string) => void
}

export function PetsTable({ rows, onMarkReady, onDeliver }: PetsTableProps) {

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-800">
          <tr>
            <th className="px-4 py-3 text-left">Código</th>
            <th className="px-4 py-3 text-left">Mascota</th>
            <th className="px-4 py-3 text-left">Propietario</th>
            <th className="px-4 py-3 text-left">Servicio</th>
            <th className="px-4 py-3 text-left">Ingreso</th>
            <th className="px-4 py-3 text-center">Estado</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {rows.map(row => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">{row.code}</td>
              <td className="px-4 py-3">{row.pet}</td>
              <td className="px-4 py-3">{row.owner}</td>
              <td className="px-4 py-3">{row.service}</td>
              <td className="px-4 py-3">{row.time}</td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      row.status === "EN_PROCESO"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {row.status?.replace("_", " ") ?? "EN PROCESO"}
                </span>
              </td>

              <td className="px-4 py-3 text-center space-x-2">
                {row.status === "EN_PROCESO" && (
                  <button
                    onClick={() => onMarkReady(row.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Marcar listo
                  </button>
                )}

                {row.status === "LISTO" && (
                  <button
                    onClick={() => onDeliver(row.id)}
                    className="text-green-600 hover:underline"
                  >
                    Entregar
                  </button>
                )}
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-slate-500">
                No hay servicios hoy
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
