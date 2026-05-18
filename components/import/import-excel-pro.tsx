"use client"

import { readExcel } from "@/lib/import/readExcel"
import { cleanClients } from "@/lib/import/cleanClients"
import { cleanPets } from "@/lib/import/cleanPets"
import { importToFirebase } from "@/lib/import/importToFirebase"

export default function ImportExcelPro() {

  async function handleFile(file: File) {

    const { clientes, mascotas } = await readExcel(file)

    const clientesLimpios = cleanClients(clientes)
    const mascotasLimpias = cleanPets(mascotas)

    await importToFirebase(clientesLimpios, mascotasLimpias)

    alert("Importación completada")
  }

  return (
    <input
      type="file"
      accept=".xlsx"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
      }}
    />
  )
}