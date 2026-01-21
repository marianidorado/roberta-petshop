"use client"

import type { ReactNode } from "react"

type Pet = {
  id: string
  name: string
}

type Owner = {
  name: string
  lastName: string
  document: string
  birthDate: string
  city: string
  address: string
  phone: string
  email: string
  notes?: string
  pets: Pet[]
}

type Props = {
  owner: Owner
  onClose: () => void
}

export function OwnerDetailsModal({ owner, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-900">
            Detalle del propietario
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Datos */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Nombre" value={`${owner.name} ${owner.lastName}`} />
          <Info label="Cédula" value={owner.document} />
          <Info label="Fecha de nacimiento" value={owner.birthDate} />
          <Info label="Ciudad" value={owner.city} />
          <Info label="Dirección" value={owner.address} />
          <Info label="Celular" value={owner.phone} />
          <Info label="Correo" value={owner.email} />
        </div>

        {/* Observaciones */}
        <div>
          <p className="text-sm font-semibold text-gray-600">
            Observaciones
          </p>
          <p className="text-sm text-gray-800">
            {owner.notes || "Sin observaciones"}
          </p>
        </div>

        {/* Mascotas */}
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Mascotas
          </p>

          {owner.pets.length === 0 ? (
            <p className="text-sm text-gray-500">
              No tiene mascotas registradas
            </p>
          ) : (
            <ul className="list-disc list-inside text-sm">
              {owner.pets.map(pet => (
                <li key={pet.id}>{pet.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  )
}
