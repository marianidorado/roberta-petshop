"use client"

import type { ServicePlan } from "@/types/service"

interface Props {
  services: ServicePlan[]
  onEdit: (service: ServicePlan) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-amber-100 text-amber-900">
          <tr>
            <th className="text-left px-4 py-3">Servicio</th>
            <th className="text-left px-4 py-3">Incluye</th>
            <th className="text-center px-4 py-3">Estado</th>
            <th className="text-center px-4 py-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {services.map(service => (
            <tr
              key={service.id}
              className="border-t hover:bg-amber-50"
            >
              {/* Nombre */}
              <td className="px-4 py-3">
                <p className="font-medium">{service.name}</p>
                {service.subtitle && (
                  <p className="text-xs text-gray-500">
                    {service.subtitle}
                  </p>
                )}
              </td>

              {/* Items */}
              <td className="px-4 py-3 text-sm">
                {service.items.slice(0, 3).join(", ")}
                {service.items.length > 3 && "…"}
              </td>

              {/* Estado */}
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    service.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {service.active ? "Activo" : "Inactivo"}
                </span>
              </td>

              {/* Acciones */}
              <td className="px-4 py-3 text-center space-x-3">
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

          {services.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="text-center py-6 text-gray-500"
              >
                No hay servicios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
