"use client"

import type { Owner } from "@/types/owner"
import { OwnerForm } from "./owner-form" 

interface OwnerEditModalProps {
  owner: Owner
  mode?: "create" | "edit"
  onClose: () => void
  onSave: (owner: Owner) => void
}

export function OwnerEditModal({
  owner,
  mode = "edit",
  onClose,
  onSave,
}: OwnerEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-amber-900">
          {mode === "create" ? "Nuevo propietario" : "Editar propietario"}
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
