"use client"

interface Props {
  onSave: () => void
  disabled?: boolean
}

export function ServiceActions({ onSave, disabled }: Props) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onSave}
        disabled={disabled}
        className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
      >
        Guardar servicio
      </button>
    </div>
  )
}
