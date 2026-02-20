"use client"
import { useState } from "react"
import type { ServiceRecord } from "@/types/service-record"
import SignaturePad from "@/components/ui/signature-pad"

interface Props {
  record: ServiceRecord
  onClose: () => void
  onConfirm: (updated: ServiceRecord) => void
}

export function ServiceDeliveryModal({ record, onClose, onConfirm }: Props) {
  const [signature, setSignature] = useState<string | null>(null)

  const handleConfirm = () => {
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
      ownerSignature: signature,
      status: "ENTREGADO",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-900">
          Entrega de mascota
        </h2>

        <p className="text-sm text-slate-600">
          Propietario: <strong>{record.ownerName}</strong>
        </p>
        <p className="text-sm text-slate-600">
          Mascota: <strong>{record.petName}</strong>
        </p>
        <div>
          <p className="text-sm font-medium mb-2">
            Firma del propietario
          </p>

          <SignaturePad onChange={setSignature} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white font-semibold"
          >
            Confirmar entrega
          </button>
        </div>
      </div>
    </div>
  )
}