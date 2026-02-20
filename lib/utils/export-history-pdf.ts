import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { ServiceRecord } from "@/types/service-record"

export function exportHistoryPDF(records: ServiceRecord[]) {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("Historial de Servicios", 14, 20)

  doc.setFontSize(10)
  doc.text(`Total registros: ${records.length}`, 14, 28)

  const rows = records.map(r => [
    r.entryDate,
    r.petName,
    r.ownerName,
    r.serviceName,
    r.exitTime || "Pendiente",
    r.status,
  ])

  autoTable(doc, {
    startY: 32,
    head: [["Fecha", "Mascota", "Propietario", "Servicio", "Salida", "Estado"]],
    body: rows,
  })

  doc.save("historial-servicios.pdf")
}