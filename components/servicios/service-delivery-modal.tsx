"use client"
import { useRef, useState } from "react"
import type { ServiceRecord } from "@/types/service-record"

interface Props {
  record: ServiceRecord
  onClose: () => void
  onConfirm: (updated: ServiceRecord) => void
}

export function ServiceDeliveryModal({ record, onClose, onConfirm }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [drawing, setDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => setDrawing(false)

  const clearSignature = () => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx || !canvasRef.current) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const handleConfirm = () => {
    if (!canvasRef.current) return

    const signature = canvasRef.current.toDataURL("image/png")
    const exitTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    onConfirm({
      ...record,
      exitTime,
      ownerSignature: signature,
      completed: true,
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

        {/* Firma */}
        <div>
          <p className="text-sm font-medium mb-1">Firma del propietario</p>
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="border rounded bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <button
            onClick={clearSignature}
            className="text-sm text-red-600 mt-2"
          >
            Limpiar firma
          </button>
        </div>

        {/* Acciones */}
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
