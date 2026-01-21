import { DashboardHeader } from "@/components/dashboard-header" 

const MOCK_OWNERS = [
  {
    id: "1",
    name: "Ana",
    lastName: "Pérez",
    document: "12345678",
    birthDate: "1990-05-12",
    city: "Bogotá",
    address: "Cra 12 #45-67",
    phone: "3001234567",
    email: "ana@email.com",
    notes: "Cliente frecuente",
    pets: [
      { id: "p1", name: "Luna" },
      { id: "p2", name: "Max" },
    ],
  },
  {
    id: "2",
    name: "Carlos",
    lastName: "Gómez",
    document: "87654321",
    birthDate: "1985-02-20",
    city: "Medellín",
    address: "Calle 8 #10-11",
    phone: "3109876543",
    email: "carlos@email.com",
    notes: "",
    pets: [{ id: "p3", name: "Rocky" }],
  },
]

export default function OwnersPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-amber-900">
            Propietarios
          </h1>

          <button className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600">
            + Nuevo propietario
          </button>
        </div>

        {/* Buscador */}
        <input
          placeholder="Buscar propietario por nombre o cédula"
          className="w-full max-w-md px-4 py-3 border rounded-md"
        />

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-amber-100 text-amber-900">
              <tr>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Cédula</th>
                <th className="text-left px-4 py-3">Teléfono</th>
                <th className="text-center px-4 py-3">Mascotas</th>
                <th className="text-center px-4 py-3">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {MOCK_OWNERS.map(owner => (
                <tr
                  key={owner.id}
                  className="border-t hover:bg-amber-50"
                >
                  {/* Nombre */}
                  <td className="px-4 py-3 font-medium">
                    {owner.name} {owner.lastName}
                  </td>

                  {/* Cédula */}
                  <td className="px-4 py-3">
                    {owner.document}
                  </td>

                  {/* Teléfono */}
                  <td className="px-4 py-3">
                    {owner.phone}
                  </td>

                  {/* Mascotas */}
                  <td className="px-4 py-3 text-center font-medium">
                    {owner.pets.length}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-center space-x-3">
                    <button className="text-blue-600 hover:underline">
                      Ver
                    </button>
                    <button className="text-amber-600 hover:underline">
                      Editar
                    </button>
                    <button className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
