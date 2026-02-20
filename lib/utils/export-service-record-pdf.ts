import jsPDF from "jspdf"
import QRCode from "qrcode"
import type { ServiceRecord } from "@/types/service-record"

import type { Service } from "@/types/service"

export async function exportServiceRecordPDF(
  record: ServiceRecord,
  services: Service[]
) {
  const doc = new jsPDF()
  const serviceInfo = services.find(
  s => s.id === record.serviceId
)

  const primary: [number, number, number] = [34, 197, 94]
  const dark: [number, number, number] = [40, 40, 40]
  const gray: [number, number, number] = [120, 120, 120]

  const safe = (v: unknown) =>
    v === undefined || v === null || v === "" ? "-" : String(v)

  // 🔹 Cargar logo
  try {
    const res = await fetch("/logo-roberta.png")
    const blob = await res.blob()
    const reader = new FileReader()

    await new Promise(resolve => {
      reader.onloadend = () => {
        doc.addImage(reader.result as string, "PNG", 14, 10, 24, 24)
        resolve(true)
      }
      reader.readAsDataURL(blob)
    })
  } catch {}

  // HEADER
  doc.setFont("helvetica", "bold")
  doc.setFontSize(20)
  doc.setTextColor(...dark)
  doc.text("Roberta Pet Shop", 105, 18, { align: "center" })

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.setTextColor(...gray)
  doc.text("Cuidado profesional para tu mascota", 105, 24, { align: "center" })

  doc.setDrawColor(...primary)
  doc.line(14, 32, 196, 32)

  let y = 42

  const section = (title: string) => {
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(14, y - 6, 182, 10, 2, 2, "F")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(...dark)
    doc.text(title, 18, y)

    y += 8
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
  }

  const line = (label: string, value?: unknown) => {
    doc.setTextColor(...gray)
    doc.text(label, 18, y)

    doc.setTextColor(...dark)
    doc.text(safe(value), 70, y)

    y += 6
  }

  // 🐾 Mascota
  section("Mascota y Propietario")
  line("Mascota:", record.petName)
  line("Propietario:", record.ownerName)

  y += 4

  // ⏱ Ingreso
  section("Ingreso")
  line("Fecha:", record.entryDate)
  line("Hora:", record.entryTime)
  line("Recibido por:", record.receivedBy)

  y += 4

  // 🛁 Servicio
  section("Servicio Realizado")
  line("Servicio:", record.serviceName)

  let col = 0
const startX = 22
const colWidth = 80

  serviceInfo?.includes.forEach((item, i) => {
  const x = startX + col * colWidth
  doc.text("• " + item, x, y)

  col++

  if (col === 2) {
    col = 0
    y += 6
  }
})

if (col !== 0) y += 6

  if (record.specifications) {
    Object.entries(record.specifications).forEach(([k, v]) => {
      line("• " + k, v)
    })
  }

  if (record.observations) {
    y += 4
    doc.setTextColor(...dark)
    doc.text("Observaciones:", 18, y)
    y += 6

    const lines = doc.splitTextToSize(record.observations, 160)
    doc.text(lines, 18, y)
    y += lines.length * 6
  }

  y += 4

  // 🚪 Egreso
  section("Salida")
  line("Hora salida:", record.exitTime || "Pendiente")

  // Badge estado
 const statusColor: [number, number, number] =
  record.status === "ENTREGADO"
    ? [34, 197, 94]
    : record.status === "LISTO"
    ? [59, 130, 246]
    : [234, 179, 8]

doc.setFillColor(...statusColor)

  doc.setFillColor(...statusColor)
  doc.roundedRect(14, y + 6, 60, 10, 3, 3, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.text(`Estado: ${record.status}`, 44, y + 13, { align: "center" })

  // 🔹 QR del servicio
  const qrData = `
    Servicio: ${safe(record.serviceName)}
    Mascota: ${safe(record.petName)}
    Fecha: ${safe(record.entryDate)}
    Estado: ${record.status}
`

  const qr = await QRCode.toDataURL(qrData)
  doc.addImage(qr, "PNG", 150, y - 10, 40, 40)

  y += 30

  // ✍️ Firmas
  doc.setTextColor(...dark)

  doc.line(70, y, 140, y)
   doc.text("Firma del propietario", 105, y + 6, { align: "center" })

  if (record.ownerSignature) {
    doc.addImage(record.ownerSignature, "PNG", 70, y - 20, 70, 20)
  }

  // Footer
  doc.setFontSize(9)
  doc.setTextColor(...gray)
  doc.text("Documento generado automáticamente", 105, 285, { align: "center" })
  doc.text("Roberta Pet Shop © 2026", 105, 290, { align: "center" })

  doc.save(`Servicio-${safe(record.petName)}.pdf`)
}