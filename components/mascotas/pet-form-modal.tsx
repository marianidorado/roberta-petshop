"use client"

import { useState, useEffect } from "react"
import type { Pet } from "@/types/pet"
import type { Owner } from "@/types/owner"
import Image from "next/image"
import { PET_BREEDS } from "@/constants/pet-breeds"
import type { PetAttitude } from "@/types/pet"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase/firebase"
import imageCompression from "browser-image-compression"

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
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  /* ===============================
     CERRAR CON ESC
  ============================== */

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)

    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  function update<K extends keyof Pet>(key: K, value: Pet[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  /* ===============================
     COMPRESIÓN DE IMAGEN
  ============================== */

  async function handlePhotoChange(file?: File) {

    if (!file) return

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      }

      const compressedFile = await imageCompression(file, options)

      if (photoPreview) URL.revokeObjectURL(photoPreview)

      setPhotoFile(compressedFile)

      const previewUrl = URL.createObjectURL(compressedFile)

      setPhotoPreview(previewUrl)

    } catch (error) {
      console.error("Error al comprimir imagen:", error)
    }
  }

  /* ===============================
     GUARDAR
  ============================== */

 async function handleSave() {

  if (saving) return

  if (!form.ownerId || !form.name) return

  setSaving(true)

  try {

    let photoUrl = form.photo || ""

    if (photoFile) {

      const fileRef = ref(
        storage,
        `pets/${Date.now()}_${photoFile.name.replace(/\s/g, "_")}`
      )

      await uploadBytes(fileRef, photoFile)

      photoUrl = await getDownloadURL(fileRef)
    }

    await onSave({
      ...form,
      photo: photoUrl,
    })

  } catch (error) {
    console.error("Error guardando mascota:", error)
  } finally {
    setSaving(false)
  }
}

  return (

    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}

        <div className="border-b pb-3">

          <h2 className="text-xl font-bold text-amber-900">

            {mode === "create"
              ? "Registrar nueva mascota"
              : "Editando mascota"}

          </h2>

          {mode === "edit" && (
            <p className="text-sm text-gray-500">
              Está modificando la información de la mascota
            </p>
          )}

        </div>

        {/* FOTO */}

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

            <p className="text-sm font-medium">
              Foto de la mascota
            </p>

            <p className="text-xs text-gray-500">
              JPG o PNG
            </p>

          </div>

        </div>

        {/* NOMBRE */}

        <div>
          <label className="text-sm font-medium">
            Nombre de la mascota
          </label>

          <input
            value={form.name}
            onChange={e => update("name", e.target.value)}
            placeholder="Ej: Luna"
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>

        {/* PROPIETARIO */}

        <div>

          <label className="text-sm font-medium">
            Propietario
          </label>

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

        {/* ESPECIE */}

        <div>

          <label className="text-sm font-medium">
            Especie
          </label>

          <select
            value={form.species}
            onChange={e =>
              update("species", e.target.value as Pet["species"])
            }
            className="w-full px-4 py-2 border rounded mt-1"
          >

            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>

          </select>

        </div>

        {/* RAZA */}

        <div>

          <label className="text-sm font-medium">
            Raza
          </label>

          <select
            value={form.breed}
            onChange={e => update("breed", e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
          >

            <option value="">Selecciona la raza</option>

            {PET_BREEDS.map(breed => (

              <option key={breed} value={breed}>
                {breed}
              </option>

            ))}

          </select>

        </div>

        {/* SEXO */}

        <div>

          <label className="text-sm font-medium">
            Sexo
          </label>

          <select
            value={form.sex}
            onChange={e => update("sex", e.target.value as Pet["sex"])}
            className="w-full px-4 py-2 border rounded mt-1"
          >

            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>

          </select>

        </div>

        {/* ALTURA */}

        <div>
           <label className="text-sm font-medium">
              Estatura aproximada
            </label>

            <select
              value={form.heightRange || ""}
              onChange={e =>
                update("heightRange", e.target.value as Pet["heightRange"])
              }
              className="w-full px-4 py-2 border rounded mt-1"
            >

              <option value="">Selecciona estatura</option>
              <option value="0-20">0 - 20 cm</option>
              <option value="20-40">20 - 40 cm</option>
              <option value="40-60">40 - 60 cm</option>
              <option value="60-70">60 - 70 cm</option>
              <option value="70+">Mayor a 70 cm</option>

            </select>


        </div>

        {/* COLOR */}

        <div>

          <label className="text-sm font-medium">
            Color
          </label>

          <input
            value={form.color || ""}
            onChange={e => update("color", e.target.value)}
            placeholder="Ej: Blanco con negro"
            className="w-full px-4 py-2 border rounded mt-1"
          />

        </div>

        {/* NACIMIENTO */}

        <div>

          <label className="text-sm font-medium">
            Fecha de nacimiento
          </label>

          <input
            type="date"
            value={form.birthDate || ""}
            onChange={e => update("birthDate", e.target.value)}
            className="w-full px-4 py-2 border rounded mt-1"
          />

        </div>

        {/* ACTITUD */}

        <div>

          <label className="text-sm font-medium">
            Comportamiento
          </label>

          <select
            value={form.attitude || ""}
            onChange={e => update("attitude", e.target.value as PetAttitude)}
            className="w-full px-4 py-2 border rounded mt-1"
          >

            <option value="">Selecciona actitud</option>
            <option value="Tranquilo">Tranquilo</option>
            <option value="Nervioso">Nervioso</option>
            <option value="Juguetón">Juguetón</option>
            <option value="Agresivo">Agresivo</option>

          </select>

        </div>

        {/* ALERGIAS */}

        <div>

          <label className="text-sm font-medium">
            Alergias
          </label>

          <input
            value={form.allergies || ""}
            onChange={e => update("allergies", e.target.value)}
            placeholder="Ej: Champú fuerte"
            className="w-full px-4 py-2 border rounded mt-1"
          />

        </div>

        {/* VACUNAS */}

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

        {/* NOTAS */}

        <div>

          <label className="text-sm font-medium">
            Notas adicionales
          </label>

          <textarea
            value={form.notes || ""}
            onChange={e => update("notes", e.target.value)}
            placeholder="Observaciones importantes"
            className="w-full px-4 py-2 border rounded mt-1"
          />

        </div>

        {/* BOTONES */}

        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            disabled={!form.ownerId || !form.name || saving}
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 text-white rounded font-semibold disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar mascota"}
          </button>

        </div>

      </div>
    </div>
  )
}