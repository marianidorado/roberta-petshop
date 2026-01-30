"use client"

interface Props {
  value: string
  onChange: (value: string) => void
}

export function HistoryFilters({ value, onChange }: Props) {
  return (
    <div className="flex justify-between items-center gap-4">
      <input
        type="text"
        placeholder="Buscar por mascota, propietario o servicio..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full max-w-md border rounded-lg px-4 py-2"
      />
    </div>
  )
}
