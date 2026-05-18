"use client"

import { useEffect, useState } from "react"
import type { Owner } from "@/types/owner"

interface Props {
  owner?: Owner | null
  onSave: (owner: Owner) => void
  onCancel: () => void
}

const emptyOwner: Owner = {
  id: "",
  name: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  document: "",
  birthDate: "",
  city: "",
  pets: []
}

export function OwnerForm({ owner, onSave, onCancel }: Props) {

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<Owner>(
  owner ? { ...owner } : emptyOwner
  )
  const [saving, setSaving] = useState(false)

  const handleChange = (field: keyof Owner, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {

  if (saving) return

  const newErrors: Record<string, string> = {}

  if (!form.name) newErrors.name = "Nombre requerido"
  if (!form.phone) newErrors.phone = "Teléfono requerido"

  if (Object.keys(newErrors).length) {
    setErrors(newErrors)
    return
  }

  setSaving(true)

  try {
    onSave(form)
  } catch (error) {
    console.error("Error guardando propietario:", error)
  } finally {
    setSaving(false)
  }
}

  return (
    <div className="space-y-5">

      {/* NOMBRE */}
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          label="Nombre"
          value={form.name}
          error={errors.name}
          onChange={v => handleChange("name", v)}
        />

        <Input
          label="Apellido"
          value={form.lastName}
          onChange={v => handleChange("lastName", v)}
        />
      </div>

      {/* DOCUMENTO */}
      <Input
        label="Documento"
        placeholder="Cédula o identificación"
        value={form.document}
        onChange={v => handleChange("document", v)}
      />

      {/* CONTACTO */}
      <div className="grid md:grid-cols-2 gap-3">
        <Input
          label="Teléfono"
          placeholder="Ej: 3123456789"
          value={form.phone}
          error={errors.phone}
          onChange={v => handleChange("phone", v)}
        />

        <Input
          label="Correo electrónico"
          placeholder="opcional"
          value={form.email}
          onChange={v => handleChange("email", v)}
        />
      </div>

      {/* DIRECCIÓN */}
      <Input
        label="Dirección"
        placeholder="Barrio, calle, referencia"
        value={form.address}
        onChange={v => handleChange("address", v)}
      />

      {/* FECHA NACIMIENTO */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Fecha de nacimiento
        </label>
        <input
          type="date"
          value={form.birthDate || ""}
          onChange={e => handleChange("birthDate", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Solo para registro interno y recordatorios
        </p>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar propietario"}
        </button>
      </div>
    </div>
  )
}

/* INPUT reutilizable */
function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 mt-1 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}