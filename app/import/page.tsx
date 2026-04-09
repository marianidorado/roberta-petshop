"use client"

import { useState } from "react"
import { readExcel } from "@/lib/import/readExcel"
import { cleanPets } from "@/lib/import/cleanPets"
import { importToFirebase } from "@/lib/import/importToFirebase"
import { CleanClient, CleanPet } from "@/lib/import/types"
import { cleanClients } from "@/lib/import/cleanClients"

export default function ImportPage() {

  const [clientes, setClientes] = useState<CleanClient[]>([])
  const [mascotas, setMascotas] = useState<CleanPet[]>([])
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  async function handleFile(file: File) {

    setFileName(file.name)

    const { clientes, mascotas } = await readExcel(file)

    
    console.log("Columnas clientes:", Object.keys(clientes[0] || {}))
    console.log("Columnas mascotas:", Object.keys(mascotas[0] || {}))

    const clientesLimpios = cleanClients(clientes)
    const mascotasLimpias = cleanPets(mascotas)


    setClientes(clientesLimpios)
    setMascotas(mascotasLimpias)
  }

  async function handleImport() {

    setLoading(true)

    await importToFirebase(clientes, mascotas)

    setLoading(false)

    alert("Importación completada")

    setClientes([])
    setMascotas([])
    setFileName(null)
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Importar Clientes y Mascotas
      </h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {fileName && (
        <div className="text-sm text-gray-400">
          Archivo: {fileName}
        </div>
      )}

      {(clientes.length > 0 || mascotas.length > 0) && (
        <div className="space-y-4">

          <div className="flex gap-6 text-sm">

            <div className="bg-gray-800 p-3 rounded">
              Clientes detectados: <b>{clientes.length}</b>
            </div>

            <div className="bg-gray-800 p-3 rounded">
              Mascotas detectadas: <b>{mascotas.length}</b>
            </div>

          </div>

          <button
            onClick={handleImport}
            disabled={loading}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            {loading ? "Importando..." : "Confirmar Importación"}
          </button>

          <div className="grid grid-cols-2 gap-6 mt-6">

            <div>
              <h2 className="font-semibold mb-2">
                Preview Clientes
              </h2>

              <div className="max-h-60 overflow-auto border rounded">

                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900">
                      <th className="p-2 text-left">Cédula</th>
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left">Apellido</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientes.slice(0, 10).map((c) => (
                      <tr key={c.cedula}>
                        <td className="p-2">{c.cedula}</td>
                        <td className="p-2">{c.nombre}</td>
                        <td className="p-2">{c.apellido}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            </div>

            <div>

              <h2 className="font-semibold mb-2">
                Preview Mascotas
              </h2>

              <div className="max-h-60 overflow-auto border rounded">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="bg-gray-900">
                      <th className="p-2 text-left">Nombre</th>
                      <th className="p-2 text-left">Especie</th>
                      <th className="p-2 text-left">Raza</th>
                      <th className="p-2 text-left">Cédula dueño</th>
                    </tr>
                  </thead>

                  <tbody>

                    {mascotas.slice(0, 10).map((m, i) => (
                      <tr key={i}>
                        <td className="p-2">{m.nombre}</td>
                        <td className="p-2">{m.especie}</td>
                        <td className="p-2">{m.raza}</td>
                        <td className="p-2">{m.cedulaCliente}</td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}