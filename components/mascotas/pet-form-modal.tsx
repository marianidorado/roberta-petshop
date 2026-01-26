"use client"

import { useState } from "react"
import type { Pet } from "@/types/pet"

interface Props {
  pet: Pet
  mode?: "create" | "edit"
  onClose: () => void
  onSave: (pet: Pet) => void
}

export function PetFormModal({
  pet,
  mode = "edit",
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Pet>(pet)

  function update<K extends keyof Pet>(key: K, value: Pet[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold text-amber-900">
          {mode === "create" ? "Nueva mascota" : "Editar mascota"}
        </h2>

        {/* Nombre */}
        <input
          value={form.name}
          onChange={e => update("name", e.target.value)}
          placeholder="Nombre"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Especie */}
        <select
          value={form.species}
          onChange={e =>
            update("species", e.target.value as Pet["species"])
          }
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
          <option value="Otro">Otro</option>
        </select>

        {/* Raza */}
        <input
          value={form.breed}
          onChange={e => update("breed", e.target.value)}
          placeholder="Raza"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Sexo */}
        <select
          value={form.sex}
          onChange={e => update("sex", e.target.value as Pet["sex"])}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>

        {/* Tamaño */}
        <select
          value={form.size}
          onChange={e => update("size", e.target.value as Pet["size"])}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Pequeño">Pequeño</option>
          <option value="Mediano">Mediano</option>
          <option value="Grande">Grande</option>
        </select>

        {/* Fecha de nacimiento */}
        <input
          type="date"
          value={form.birthDate || ""}
          onChange={e => update("birthDate", e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        {/* Actitud */}
        <input
          value={form.attitude || ""}
          onChange={e => update("attitude", e.target.value)}
          placeholder="Actitud"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Alergias */}
        <input
          value={form.allergies || ""}
          onChange={e => update("allergies", e.target.value)}
          placeholder="Alergias"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Vacunas */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.vaccinesUpToDate}
            onChange={e =>
              update("vaccinesUpToDate", e.target.checked)
            }
          />
          Vacunas al día
        </label>

        {/* Notas */}
        <textarea
          value={form.notes || ""}
          onChange={e => update("notes", e.target.value)}
          placeholder="Notas"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-amber-500 text-white rounded font-semibold"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
