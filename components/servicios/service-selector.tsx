"use client"

interface Service {
  id: string
  name: string
}

interface Props {
  services: Service[]
  selected: string[]
  onChange: (services: string[]) => void
}

export function ServiceSelector({ services, selected, onChange }: Props) {
  function toggle(serviceId: string) {
    if (selected.includes(serviceId)) {
      onChange(selected.filter(id => id !== serviceId))
    } else {
      onChange([...selected, serviceId])
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-3">
      <p className="font-semibold">Servicios a realizar</p>

      {services.map(service => (
        <button
          key={service.id}
          onClick={() => toggle(service.id)}
          className={`w-full text-left p-3 border rounded-xl transition
            ${selected.includes(service.id)
              ? "bg-amber-100 border-amber-400"
              : "hover:bg-gray-50"
            }`}
        >
          {service.name}
        </button>
      ))}
    </div>
  )
}
