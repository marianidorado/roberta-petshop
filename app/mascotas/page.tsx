import { DashboardHeader } from "@/components/dashboard-header"

export default function PetsPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-amber-900 mb-6">
          Mascotas
        </h1>

         <input
          placeholder="Buscar mascóta"
          className="w-full max-w-md mb-4 px-4 py-3 border rounded-md"
        />

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">
            Tabla de todas las mascotas registradas
          </p>
        </div>
      </main>
    </div>
  )
}