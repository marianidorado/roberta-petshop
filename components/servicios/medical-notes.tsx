"use client"

interface MedicalNotesProps {
  value: string
  onChange: (value: string) => void
}

export function MedicalNotes({ value, onChange }: MedicalNotesProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-2">
      <p className="font-semibold">Observaciones / Condiciones</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: alergias, enfermedades, comportamiento, cuidados especiales..."
        className="w-full min-h-[100px] border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  )
}
