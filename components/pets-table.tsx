"use client"

type ServiceStatus = "INGRESADO" | "EN_PROCESO" | "LISTO"

interface Row {
  id: string
  code: string
  pet: string
  owner: string
  service: string
  time: string
  status: ServiceStatus
} 

const mockData: Row[] = [
  {
    id: "1",
    code: "SRV-001",
    pet: "Luna",
    owner: "Ana Pérez",
    service: "Medicado",
    time: "9:30 AM",
    status: "INGRESADO",
  },
  {
    id: "2",
    code: "SRV-002",
    pet: "Max",
    owner: "Carlos Gómez",
    service: "Baño",
    time: "10:15 AM",
    status: "EN_PROCESO",
  },
  {
    id: "3",
    code: "SRV-003",
    pet: "Rocky",
    owner: "Laura Ruiz",
    service: "Peluquería",
    time: "11:00 AM",
    status: "LISTO",
  },
]

export function PetsTable({ search = "" }: { search?: string }) {
  const text = search.toLowerCase()
  const filteredData = mockData.filter(row =>
    row.code.toLowerCase().includes(text) ||
    row.pet.toLowerCase().includes(text) ||
    row.owner.toLowerCase().includes(text)
  )
  
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

              {/* ESTADO */}
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

              {/* ACCIONES */}
              <td className="px-4 py-3 text-center space-x-2">
                {row.status === "INGRESADO" && (
                  <button className="text-blue-600 hover:underline">
                    Iniciar
                  </button>
                )}

                {row.status === "EN_PROCESO" && (
                  <button className="text-green-600 hover:underline">
                    Marcar listo
                  </button>
                )}

                {row.status === "LISTO" && (
                  <button className="text-amber-600 hover:underline font-semibold">
                    Entregar
                  </button>
                )}
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-slate-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}
