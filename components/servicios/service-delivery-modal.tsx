"use client"

import { useState } from "react"
import type { ServiceRecord } from "@/types/service-record"
import SignaturePad from "@/components/ui/signature-pad"

type DeliveryUpdate = ServiceRecord & {
  exitObservation?: string
}

interface Props {
  record: ServiceRecord
  onClose: () => void
  onConfirm: (updated: DeliveryUpdate) => void
}

export function ServiceDeliveryModal({ record, onClose, onConfirm }: Props) {

  const [signature, setSignature] = useState<string | null>(null)
  const [exitObservation, setExitObservation] = useState("")

  const handleConfirm = async () => {
  if (!signature) {
    alert("Debe firmar antes de confirmar la entrega")
    return
  }

  const exitTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  onConfirm({
    ...record,
    exitTime,
    ownerSignature: signature, // 🔥 guardar base64 directamente
    status: "ENTREGADO",
    metadata: {
    ...record.metadata,
    exitObservation
  }
  })
}

  return (

    /* OVERLAY */
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
      onClick={onClose}
    >

      {/* MODAL */}
      <div
        className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-lg font-bold text-amber-900">
          Entrega de mascota
        </h2>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          Revise con el propietario que los servicios realizados son correctos antes de firmar la entrega.
        </div>

        <p className="text-sm text-slate-600">
          Propietario: <strong>{record.ownerName}</strong>
        </p>

        <p className="text-sm text-slate-600">
          Mascota: <strong>{record.petName}</strong>
        </p>

        <p className="text-sm text-slate-600">
          Servicio: <strong>{record.serviceName}</strong>
        </p>

        {/* ESPECIFICACIONES */}
        {record.specifications && (
          <div className="bg-amber-50 border rounded-lg p-3">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              Especificaciones del servicio
            </p>

            <ul className="space-y-1 text-sm">
              {Object.entries(record.specifications).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="capitalize text-slate-600">
                    {key.replace("_", " ")}
                  </span>

                  <span className="font-semibold text-slate-800">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <textarea
            value={exitObservation}
            onChange={(e) => setExitObservation(e.target.value)}
            placeholder="Observación al entregar la mascota"
            className="w-full border rounded p-2 text-sm"
            rows={3}
          />

        {/* FIRMA */}
        <div>
          <p className="text-sm font-medium mb-2">
            Firma del propietario
          </p>

          <SignaturePad onChange={setSignature} />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
          >
            Confirmar entrega
          </button>
        </div>

      </div>
    </div>
  )
}