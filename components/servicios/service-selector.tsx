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
      <p className="font-semibold">Servicio a realizar</p>

      <div className="flex flex-wrap gap-3">
        {services.map(service => {
          const isSelected = selected === service.id

          return (
            <button
              key={service.id}
              onClick={() => onChange(service.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border transition
                ${
                  isSelected
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white hover:bg-amber-50 border-gray-300"
                }
              `}
            >
              {service.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
