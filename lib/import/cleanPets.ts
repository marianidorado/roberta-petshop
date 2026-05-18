import { ExcelPetRow, CleanPet } from "./types"

export function cleanPets(rows: ExcelPetRow[]): CleanPet[] {
  const map = new Map<string, CleanPet>()

  for (const row of rows) {
    const cedulaCliente = String(row["Cedula Cliente"] ?? "").trim()
    const nombre = String(row["Nombre Mascota"] ?? "").trim()
    const especie = String(row["Especie (Gato, perro etc)"] ?? "").trim()
    const raza = String(row.Raza ?? "").trim()
    const sexo = String(row["Sexo\nMacho/Hembra"] ?? "").trim()

    if (!cedulaCliente || !nombre) continue

    const key = `${cedulaCliente}-${nombre.toLowerCase()}`
    if (map.has(key)) continue

    map.set(key, { nombre, especie, raza, sexo, cedulaCliente })
  }

  return Array.from(map.values())
}