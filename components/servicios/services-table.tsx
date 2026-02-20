"use client"

import type { Service } from "@/types/service"

interface Props {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: Props) {
  if (services.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        No hay servicios registrados
      </div>
    )
  }

  return (
    <>
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-amber-100 text-amber-900">
            <tr>
              <th className="text-left px-4 py-3">Servicio</th>
              <th className="text-left px-4 py-3">Incluye</th>
              <th className="text-left px-4 py-3">Tamaños</th>
              <th className="text-center px-4 py-3">Estado</th>
              <th className="text-center px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-t hover:bg-amber-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{service.name}</p>
                  {service.description && (
                    <p className="text-xs text-gray-500">
                      {service.description}
                    </p>
                  )}
                </td>

                <td className="px-4 py-3 text-xs">
                  {(service.includes ?? []).slice(0, 3).join(", ")}
                </td>

                <td className="px-4 py-3 text-xs">
                  {(service.sizeRules ?? []).map((r, idx) => (
                    <div key={idx}>
                      {r.minHeightCm} cm
                      {r.maxHeightCm ? ` – ${r.maxHeightCm} cm` : " o más"}
                    </div>
                  ))}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {service.active ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="px-4 py-3 text-center space-x-4">
                  <button
                    onClick={() => onEdit(service)}
                    className="text-amber-600 hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(service.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden space-y-4">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-amber-900">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-xs text-gray-500">
                  {service.description}
                </p>
              )}
            </div>

            <div className="text-xs text-gray-600">
              <strong>Incluye:</strong>{" "}
              {(service.includes ?? []).slice(0, 3).join(", ")}
            </div>

            <div className="text-xs text-gray-600">
              <strong>Tamaños:</strong>
              {(service.sizeRules ?? []).map((r, idx) => (
                <div key={idx}>
                  {r.minHeightCm} cm
                  {r.maxHeightCm ? ` – ${r.maxHeightCm}` : " o más"}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  service.active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {service.active ? "Activo" : "Inactivo"}
              </span>

              <div className="space-x-4 text-sm">
                <button
                  onClick={() => onEdit(service)}
                  className="text-amber-600"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(service.id)}
                  className="text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
