"use client"

import { Owner } from "@/types/owner"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface OwnerFormProps {
  owner: Owner
  onSave: (owner: Owner) => void
  onCancel: () => void
}

export function OwnerForm({
  owner,
  onSave,
  onCancel,
}: OwnerFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<Owner>(owner)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setForm(owner)
    setErrors({})
  }, [owner])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validate() {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = "Nombre requerido"
    if (!form.lastName.trim()) newErrors.lastName = "Apellido requerido"
    if (!form.document.trim()) newErrors.document = "Documento requerido"
    if (!form.phone.trim()) newErrors.phone = "Celular requerido"

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Correo inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave(form)
  }

  return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        className="input"
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Apellido"
        className="input"
      />
      <input
        name="document"
        value={form.document}
        onChange={handleChange}
        placeholder="Cédula"
        className="input"
      />
      <input
        type="date"
        name="birthDate"
        value={form.birthDate}
        onChange={handleChange}
        className="input"
      />
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="Ciudad"
        className="input"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Celular"
        className="input"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Correo"
        className="input col-span-2"
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Dirección"
        className="input col-span-2"
      />
      <textarea
        name="notes"
        value={form.notes || ""}
        onChange={handleChange}
        placeholder="Observaciones"
        className="input col-span-2"
      />
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <button onClick={onCancel} className="px-4 py-2 border rounded">
        Cancelar
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-amber-500 text-white rounded"
      >
        Guardar
      </button>
    </div>
  </div>
)
}
