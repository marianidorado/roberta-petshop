"use client"

import { useState } from "react"
import type { Pet } from "@/types/pet"
import type { Owner } from "@/types/owner"
import Image from "next/image"
import { PET_BREEDS } from "@/constants/pet-breeds"
import type { PetAttitude} from "@/types/pet"

interface Props {
  pet: Pet
  mode?: "create" | "edit"
  owners: Owner[]
  onClose: () => void
  onSave: (pet: Pet) => void
}

export function PetFormModal({
  pet,
  mode = "edit",
  owners,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Pet>(pet)
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(pet.photo)

  function update<K extends keyof Pet>(key: K, value: Pet[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }
  function handlePhotoChange(file?: File) {
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    setPhotoPreview(reader.result as string)
    update("photo", reader.result as string)
  }
  reader.readAsDataURL(file)
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold text-amber-900">
          {mode === "create" ? "Nueva mascota" : "Editar mascota"}
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={photoPreview || "/pet-placeholder.png"}
              alt={form.name || "Mascota"}
              width={96}
              height={96}
              className="rounded-full object-cover"
            />

            <label className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs px-2 py-1 rounded cursor-pointer">
              Cambiar
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={e => handlePhotoChange(e.target.files?.[0])}
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium">Foto de la mascota</p>
            <p className="text-xs text-gray-500">
              JPG o PNG · se guarda localmente
            </p>
          </div>
        </div>
        {/* Nombre */}
        <input
          value={form.name}
          onChange={e => update("name", e.target.value)}
          placeholder="Nombre"
          className="w-full px-4 py-2 border rounded"
        />
        <div>
          <label className="text-sm font-medium">Propietario</label>

          <select
            value={form.ownerId}
            disabled={mode === "edit"} 
            onChange={e => update("ownerId", e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          >
            <option value="">Selecciona un propietario</option>

            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name} {owner.lastName} — {owner.document}
              </option>
            ))}
          </select>
        </div>

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
        <select
          value={form.breed}
          onChange={e => update("breed", e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Selecciona la raza</option>
          {PET_BREEDS.map(breed => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        {/* Sexo */}
        <select
          value={form.sex}
          onChange={e => update("sex", e.target.value as Pet["sex"])}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <input
            type="number"
            min={5}
            max={120}
            value={form.heightCm ?? ""}
            onChange={e =>
              update("heightCm", Number(e.target.value))
            }
            placeholder="Altura real en cm (ej: 38)"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            value={form.color || ""}
            onChange={e => update("color", e.target.value)}
            placeholder="Color"
            className="w-full px-4 py-2 border rounded"
          />
        {/* Fecha de nacimiento */}
        <input
          type="date"
          value={form.birthDate || ""}
          onChange={e => update("birthDate", e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        {/* Actitud */}
        <select
          value={form.attitude || ""}
          onChange={e => update("attitude", e.target.value as PetAttitude)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Selecciona actitud</option>
          <option value="Tranquilo">Tranquilo</option>
          <option value="Nervioso">Nervioso</option>
          <option value="Juguetón">Juguetón</option>
          <option value="Agresivo">Agresivo</option>
        </select>

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
            disabled={!form.ownerId}
            onClick={() =>
              onSave({
                ...form,
                servicesHistory: form.servicesHistory ?? [],
              })
            }
            className="px-4 py-2 bg-amber-500 text-white rounded font-semibold disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
