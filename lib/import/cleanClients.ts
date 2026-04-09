import { ExcelClientRow, CleanClient } from "./types"

export function cleanClients(rows: ExcelClientRow[]): CleanClient[] {

  const map = new Map<string, CleanClient>()

  for (const row of rows) {

    const cedula = String(
      row["Identificación\nSin puntos sin comas"] ?? ""
    ).trim()

    if (!cedula) continue

    if (map.has(cedula)) continue

    map.set(cedula, {
      cedula,
      nombre: row.Nombre?.trim() ?? "",
      apellido: row.Apellido?.trim() ?? "",
      ciudad: row.Ciudad?.trim() ?? "",
      direccion: row.Direccion?.trim() ?? "",
      celular: String(row.Celular ?? "").trim(),
    })
  }

  return Array.from(map.values())
}