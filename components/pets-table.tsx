"use client"

export type ServiceStatus = "INGRESADO" | "EN_PROCESO" | "LISTO"

export interface Row {
  id: string
  code: string
  pet: string
  owner: string
  service: string
  time: string
  status: ServiceStatus
}

interface Props {
  search?: string
  data: Row[]
  setData: (data: Row[]) => void
}

export function PetsTable({ search = "", data, setData }: Props) {
  // Filtrar los datos directamente en render
  const text = search.toLowerCase()
  const filteredData = data.filter(
    row =>
      row.code.toLowerCase().includes(text) ||
      row.pet.toLowerCase().includes(text) ||
      row.owner.toLowerCase().includes(text)
  )

  const handleStatusChange = (id: string) => {
    const updated = data.map(row => {
      if (row.id === id) {
        if (row.status === "INGRESADO") return { ...row, status: "EN_PROCESO" as ServiceStatus}
        if (row.status === "EN_PROCESO") return { ...row, status: "LISTO" as ServiceStatus}
      }
      return row
    })
    setData(updated)
  }

  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
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
          {filteredData.map(row => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">{row.code}</td>
              <td className="px-4 py-3">{row.pet}</td>
              <td className="px-4 py-3">{row.owner}</td>
              <td className="px-4 py-3">{row.service}</td>
              <td className="px-4 py-3">{row.time}</td>

              {/* Estado */}
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      row.status === "INGRESADO"
                        ? "bg-yellow-100 text-yellow-700"
                        : row.status === "EN_PROCESO"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {row.status.replace("_", " ")}
                </span>
              </td>

              {/* Acciones */}
              <td className="px-4 py-3 text-center space-x-2">
                {row.status === "INGRESADO" && (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleStatusChange(row.id)}
                  >
                    Iniciar
                  </button>
                )}

                {row.status === "EN_PROCESO" && (
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => handleStatusChange(row.id)}
                  >
                    Marcar listo
                  </button>
                )}

                {row.status === "LISTO" && (
                  <button
                    className="text-amber-600 hover:underline font-semibold"
                  >
                    Entregar
                  </button>
                )}
              </td>
            </tr>
          ))}

          {filteredData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-slate-500">
                No se encontraron resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
