"use client"

import { Owner } from "@/types/owner"

interface OwnerDetailsModalProps {
  owner: Owner
  onClose: () => void
  onEdit: () => void
}

export function OwnerDetailsModal({
  owner,
  onClose,
  onEdit,
}: OwnerDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold">
          {owner.name} {owner.lastName}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Cédula:</strong> {owner.document}</p>
          <p><strong>Fecha nacimiento:</strong> {owner.birthDate}</p>
          <p><strong>Ciudad:</strong> {owner.city}</p>
          <p><strong>Celular:</strong> {owner.phone}</p>
          <p className="col-span-2">
            <strong>Dirección:</strong> {owner.address}
          </p>
          <p className="col-span-2">
            <strong>Correo:</strong> {owner.email}
          </p>
        </div>

        {owner.notes && (
          <div className="bg-amber-50 p-3 rounded text-sm">
            <strong>Observaciones:</strong>
            <p>{owner.notes}</p>
          </div>
        )}

        <div>
          <p className="font-semibold text-sm mb-1">Mascotas</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {owner.pets.map((pet: any) => (
              <li key={pet.id}>{pet.name}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cerrar
          </button>

          <button
            onClick={onEdit}
            className="px-4 py-2 rounded bg-amber-500 text-white"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}
