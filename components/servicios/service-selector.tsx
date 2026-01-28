"use client"

interface Service {
  id: string
  name: string
}

interface Props {
  services: Service[]
  selected: string | null
  onChange: (serviceId: string) => void
}

export function ServiceSelector({ services, selected, onChange }: Props) {

  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-3">
      <p className="font-semibold">Servicios a realizar</p>

      {services.map(service => (
        <button
          key={service.id}
          onClick={() => onChange(service.id)}
          className={`w-full text-left p-3 border rounded-xl transition
            ${
              selected === service.id
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
