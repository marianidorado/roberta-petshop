"use client"

import { OwnerForm } from "./owner-form"

export function OwnerEditModal({ owner, onClose, onSave }: any) {
  if (!owner) return null
interface Props {
  owner: any
  mode: "create" | "edit"
  onClose: () => void
  onSave: (owner: any) => void
}
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {owner.id ? "Editar propietario" : "Nuevo propietario"}
        </h2>

        <OwnerForm
          owner={owner}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
