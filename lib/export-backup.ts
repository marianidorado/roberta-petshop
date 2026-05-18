import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

function truncate(value: unknown) {
  if (typeof value === "string" && value.length > 30000) {
    return value.substring(0, 30000) + "..."
  }
  return value
}

export function exportBackup(data: Record<string, unknown>[], fileName: string) {
  const safeData = data.map(row => {
    const cleanRow: Record<string, unknown> = {}

    Object.entries(row).forEach(([key, value]) => {
      cleanRow[key] = truncate(value)
    })

    return cleanRow
  })

  const worksheet = XLSX.utils.json_to_sheet(safeData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Backup")

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(blob, `${fileName}.xlsx`)
}