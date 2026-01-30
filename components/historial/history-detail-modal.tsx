"use client"
import Image from "next/image"
import type { ServiceRecord } from "@/types/service-record"

interface Props {
  record: ServiceRecord
  onClose: () => void
}

export function HistoryDetailModal({ record, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white
          rounded-xl
          shadow-xl
          w-full
          max-w-2xl
          max-h-[90vh]
          flex
          flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b shrink-0">
          <h2 className="text-xl font-bold text-amber-900">
            Ficha del servicio
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            ✕
          </button>
        </div>
         <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
        {/* Mascota / Propietario */}
        <Section title="Mascota y propietario">
          <Item label="Mascota" value={record.petName} />
          <Item label="Propietario" value={record.ownerName} />
        </Section>

        {/* Ingreso */}
        <Section title="Ingreso">
          <Item label="Fecha" value={record.entryDate} />
          <Item label="Hora" value={record.entryTime} />
          <Item label="Recibido por" value={record.receivedBy} />
        </Section>

        {/* Servicio */}
        <Section title="Servicio realizado">
          <Item label="Servicio" value={record.serviceName} />

          {record.specifications && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-slate-600 mb-1">
                Especificaciones
              </p>
              <ul className="text-sm text-slate-700 list-disc pl-5">
                {Object.entries(record.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* Observaciones */}
        {record.observations && (
          <Section title="Observaciones">
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {record.observations}
            </p>
          </Section>
        )}

        {/* Egreso */}
        <Section title="Egreso">
          <Item
            label="Estado"
            value={record.completed ? "Servicio finalizado" : "En proceso"}
          />
          <Item
            label="Hora de salida"
            value={record.exitTime || "Pendiente"}
          />

          {record.ownerSignature && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-slate-600 mb-1">
                Firma del propietario
              </p>
              <Image
                src={record.ownerSignature}
                alt="Firma del propietario"
                width={300}
                height={120}
                className="border rounded-md object-contain"
              />
            </div>
          )}
        </Section>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

/* Helpers */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <h3 className="col-span-2 text-sm font-semibold text-amber-800 border-b pb-1">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
