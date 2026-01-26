"use client"

import Image from "next/image"
import type { Pet } from "@/types/pet"

interface Props {
  pet: Pet
  ownerName?: string
  onClose: () => void
  onEdit: () => void
}

function calculateAge(birthDate?: string) {
  if (!birthDate) return "—"
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function PetDetailsModal({
  pet,
  ownerName,
  onClose,
  onEdit,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-5">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Image
            src={pet.photo || "/pet-placeholder.png"}
            alt={pet.name}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <div className="flex-1">
            <h2 className="text-xl font-bold">{pet.name}</h2>

            <p className="text-sm text-gray-600">
              {pet.species} · {pet.breed}
            </p>

            <p className="text-xs text-gray-500">
              <strong>Dueño:</strong> {ownerName || "—"}
            </p>
          </div>
        </div>

        {/* Datos principales */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p><strong>Sexo:</strong> {pet.sex}</p>
          <p><strong>Tamaño:</strong> {pet.size}</p>
          <p><strong>Nacimiento:</strong> {pet.birthDate || "—"}</p>
          <p><strong>Edad:</strong> {calculateAge(pet.birthDate)}</p>
          <p>
            <strong>Vacunas:</strong>{" "}
            {pet.vaccinesUpToDate ? "Al día" : "Pendientes"}
          </p>
        </div>

        {/* Salud */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p><strong>Actitud:</strong> {pet.attitude || "—"}</p>
          <p><strong>Alergias:</strong> {pet.allergies || "—"}</p>
        </div>

        {/* Último servicio */}
        <div className="bg-amber-50 p-3 rounded space-y-1">
          <strong>Último servicio:</strong>

          <p className="text-sm">
            {pet.lastService
              ? `${pet.lastService.name} — ${pet.lastService.date}`
              : "Sin servicios registrados"}
          </p>

          <button
            onClick={() => alert("Abrir historial de servicios")}
            className="text-amber-700 text-sm font-medium hover:underline"
          >
            Ver historial de servicios
          </button>
        </div>

        {/* Notas */}
        <div className="text-sm">
          <strong>Notas:</strong>
          <p className="text-gray-600">{pet.notes || "—"}</p>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cerrar
          </button>

          <button
            onClick={onEdit}
            className="px-4 py-2 bg-amber-500 text-white rounded font-semibold"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  )
}
