"use client"

interface SaveServiceProps {
  disabled: boolean
  onSave: () => void
}

export function SaveServiceButton({ disabled, onSave }: SaveServiceProps) {
  return (
    <button
      disabled={disabled}
      onClick={onSave}
      className={`w-full py-3 rounded-xl font-semibold text-white
        ${disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-amber-500 hover:bg-amber-600"
        }`}
    >
      Guardar servicio
    </button>
  )
}
