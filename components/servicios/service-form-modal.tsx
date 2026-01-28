"use client"

import { useState } from "react"
import type { Service } from "@/types/service"

interface Props {
  service: Service
  onClose: () => void
  onSave: (service: Service) => void
}

export function ServiceFormModal({ service, onClose, onSave }: Props) {
  const [form, setForm] = useState<Service>({
    ...service,
    includes: service.includes ?? [],
    sizeRules: service.sizeRules ?? [],
  })

  const [includeItem, setIncludeItem] = useState("")
  const [minCm, setMinCm] = useState("")
  const [maxCm, setMaxCm] = useState("")

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">

        <h2 className="text-xl font-bold text-amber-900">
          {service.id ? "Editar servicio" : "Nuevo servicio"}
        </h2>

        {/* Nombre */}
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Nombre del servicio"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Descripción */}
        <input
          value={form.description || ""}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Descripción (opcional)"
          className="w-full px-4 py-2 border rounded"
        />

        {/* Servicios incluidos */}
        <div>
          <label className="text-sm font-medium">Servicios incluidos</label>

          <div className="flex gap-2 mt-2">
            <input
              value={includeItem}
              onChange={e => setIncludeItem(e.target.value)}
              placeholder="Ej: Baño medicado"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              onClick={() => {
                if (!includeItem.trim()) return
                setForm(prev => ({
                  ...prev,
                  includes: [...prev.includes, includeItem],
                }))
                setIncludeItem("")
              }}
              className="bg-amber-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>

          <ul className="mt-3 space-y-1 text-sm">
            {form.includes.map((i, idx) => (
              <li key={idx} className="flex justify-between">
                {i}
                <button
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      includes: prev.includes.filter((_, index) => index !== idx),
                    }))
                  }
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Rangos de tamaño */}
        <div>
          <label className="text-sm font-medium">Rangos de tamaño (cm)</label>

          <div className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder="Desde"
              value={minCm}
              onChange={e => setMinCm(e.target.value)}
              className="w-24 px-3 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Hasta"
              value={maxCm}
              onChange={e => setMaxCm(e.target.value)}
              className="w-24 px-3 py-2 border rounded"
            />

            <button
              onClick={() => {
                if (!minCm) return

                setForm(prev => ({
                  ...prev,
                  sizeRules: [
                    ...prev.sizeRules,
                    {
                      minHeightCm: Number(minCm),
                      maxHeightCm: maxCm ? Number(maxCm) : undefined,
                    },
                  ],
                }))

                setMinCm("")
                setMaxCm("")
              }}
              className="bg-amber-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>

          <ul className="mt-3 text-sm space-y-1">
            {form.sizeRules.map((r, idx) => (
              <li key={idx} className="flex justify-between">
                {r.minHeightCm} cm
                {r.maxHeightCm ? ` – ${r.maxHeightCm} cm` : " o más"}
                <button
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      sizeRules: prev.sizeRules.filter((_, i) => i !== idx),
                    }))
                  }
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
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
          <button onClick={onClose} className="px-4 py-2 border rounded">
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
