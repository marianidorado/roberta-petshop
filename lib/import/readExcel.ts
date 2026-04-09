import * as XLSX from "xlsx"
import { ExcelClientRow, ExcelPetRow } from "./types"

export async function readExcel(file: File) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer)

  const clientesSheet = workbook.Sheets["Cliente"]
  const mascotasSheet = workbook.Sheets["Mascota"]

  // CLIENTES
  const clientesRaw: ExcelClientRow[] =
    XLSX.utils.sheet_to_json(clientesSheet, { defval: "" })

  // MASCOTAS
  // Ajusta el número según la fila donde realmente está tu encabezado (contando desde 0)
  const mascotasRaw: ExcelPetRow[] =
    XLSX.utils.sheet_to_json<ExcelPetRow>(mascotasSheet, {
    range: 1,   // saltar la fila 1 (el título)
    defval: ""
    })

  // Normalizar valores que puedan ser number
  const clientes = clientesRaw.map(c => ({
    ...c,
    "Identificación\nSin puntos sin comas": String(c["Identificación\nSin puntos sin comas"] ?? ""),
    Celular: String(c.Celular ?? "")
  }))

  const mascotas = mascotasRaw.map(m => ({
    ...m,
    "Cedula Cliente": String(m["Cedula Cliente"] ?? ""),
    "Nombre Mascota": String(m["Nombre Mascota"] ?? ""),
    "Especie (Gato, perro etc)": String(m["Especie (Gato, perro etc)"] ?? ""),
    Raza: String(m.Raza ?? ""),
    "Sexo\nMacho/Hembra": String(m["Sexo\nMacho/Hembra"] ?? "")
  }))

  return { clientes, mascotas }
}