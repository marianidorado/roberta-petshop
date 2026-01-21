"use client"

interface Props {
  notes: string
  onChange: (value: string) => void
}

export function ServiceObservations({ notes, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-2">
      <p className="font-semibold">Observaciones</p>

      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: Alergia, dolor en la pata, piel sensible…"
        className="w-full border rounded-xl p-2"
        rows={4}
      />
    </div>
  )
}
