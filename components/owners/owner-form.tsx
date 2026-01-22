"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface OwnerFormProps {
  owner: any
  onSave: (owner: any) => void
  onCancel: () => void
}

export function OwnerForm({
  owner,
  onSave,
  onCancel,
}: OwnerFormProps) {
  const router = useRouter()
  const [form, setForm] = useState(owner)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-4">
        <h2 className="text-xl font-bold">Editar propietario</h2>

        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="input" />
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Apellido" className="input" />
          <input name="document" value={form.document} onChange={handleChange} placeholder="Cédula" className="input" />
          <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} className="input" />
          <input name="city" value={form.city} onChange={handleChange} placeholder="Ciudad" className="input" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Celular" className="input" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Correo" className="input col-span-2" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" className="input col-span-2" />
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Observaciones" className="input col-span-2" />
        </div>
        {owner.id && (
          <button
            className="text-sm text-amber-600 underline"
            onClick={() =>
              router.push(`/mascotas/nueva?ownerId=${owner.id}`)
            }
          >
            + Agregar mascota
          </button>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-amber-500 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
