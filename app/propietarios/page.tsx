import { DashboardHeader } from "@/components/dashboard-header"

export default function OwnersPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-amber-900 mb-6">
          Propietarios
        </h1>

        <input
          placeholder="Buscar propietario por nombre o cédula"
          className="w-full max-w-md mb-4 px-4 py-3 border rounded-md"
        />

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">
            Tabla de propietarios (pendiente conexión a datos)
          </p>
        </div>
      </main>
    </div>
  )
}