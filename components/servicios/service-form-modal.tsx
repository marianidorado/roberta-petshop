"use client"

import { useState } from "react"
import type { ServicePlan } from "@/types/service"

interface Props {
  service: ServicePlan
  onClose: () => void
  onSave: (service: ServicePlan) => void
}

export function ServiceFormModal({ service, onClose, onSave }: Props) {
  const [form, setForm] = useState<ServicePlan>({
    ...service,
    prices: service.prices ?? [],
    items: service.items ?? [],
  })

  const [item, setItem] = useState("")

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">

        {/* Título */}
        <h2 className="text-xl font-bold text-amber-900">
          {service.id ? "Editar servicio" : "Nuevo servicio"}
        </h2>

        {/* Nombre */}
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre del servicio"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
        />

        {/* Subtítulo */}
        <input
          value={form.subtitle || ""}
          onChange={e => setForm({ ...form, subtitle: e.target.value })}
          placeholder="Subtítulo (opcional)"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
        />

        {/* Precios por tamaño */}
        <div>
          <label className="font-medium text-sm text-gray-700">
            Precios por tamaño
          </label>

          <div className="space-y-3 mt-2">
            {(["Pequeño", "Mediano", "Grande"] as const).map(size => {
              const current = form.prices.find(p => p.size === size)

              return (
                <div key={size} className="flex items-center gap-3">
                  <span className="w-28 text-sm font-semibold text-amber-900">
                    {size}
                  </span>

                  <input
                    type="number"
                    placeholder="Precio"
                    value={current?.price ?? ""}
                    onChange={e => {
                      const price = Number(e.target.value)

                      setForm(prev => {
                        const others = prev.prices.filter(p => p.size !== size)

                        return {
                          ...prev,
                          prices: price
                            ? [...others, { size, price }]
                            : others,
                        }
                      })
                    }}
                    className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Servicios incluidos */}
        <div>
          <label className="font-medium text-sm text-gray-700">
            Servicios incluidos
          </label>

          <div className="flex gap-2 mt-2">
            <input
              value={item}
              onChange={e => setItem(e.target.value)}
              placeholder="Ej: Baño medicado"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              onClick={() => {
                if (!item.trim()) return
                setForm(prev => ({
                  ...prev,
                  items: [...prev.items, item],
                }))
                setItem("")
              }}
              className="bg-amber-500 text-white px-3 rounded font-semibold"
            >
              +
            </button>
          </div>

          {form.items.length > 0 && (
            <ul className="text-sm mt-3 list-disc pl-5 space-y-1">
              {form.items.map((i, idx) => (
                <li key={idx} className="flex justify-between">
                  {i}
                  <button
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        items: prev.items.filter((_, index) => index !== idx),
                      }))
                    }
                    className="text-red-500 ml-2"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activo */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })}
          />
          Servicio activo
        </label>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-amber-500 text-white rounded font-semibold"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
