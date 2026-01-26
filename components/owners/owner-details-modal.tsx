"use client"

import { Owner } from "@/types/owner"

interface OwnerDetailsModalProps {
  owner: Owner
  onClose: () => void
  onAddPet: () => void
  onEdit: () => void
}

export function OwnerDetailsModal({
  owner,
  onClose,
  onEdit,
  onAddPet,
}: OwnerDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold">
          {owner.name} {owner.lastName}
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Cédula:</strong> {owner.document}</p>
          <p>
            <strong>Fecha nacimiento:</strong>{" "}
            {owner.birthDate
                ? new Date(owner.birthDate).toLocaleDateString("es-CO")
                : "—"}
          </p>
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

        <div className="bg-amber-50 rounded-lg p-4">
  <div className="flex items-center justify-between mb-2">
      <p className="font-semibold text-sm text-amber-900">
        Mascotas
      </p>

      <button
        onClick={onAddPet}
        className="text-sm text-amber-600 font-semibold hover:underline"
      >
        + Agregar mascota
      </button>
  </div>

          {owner.pets.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {owner.pets.map(pet => (
                <li
                  key={pet.id}
                  className="bg-white px-3 py-2 rounded shadow-sm"
                >
                  🐾 {pet.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No tiene mascotas registradas
            </p>
          )}
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
