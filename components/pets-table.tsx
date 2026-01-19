export function PetsTable() {
  return (
    <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-slate-800">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Código</th>
            <th className="px-4 py-3 text-left font-semibold">Mascota</th>
            <th className="px-4 py-3 text-left font-semibold">Propietario</th>
            <th className="px-4 py-3 text-left font-semibold">Servicio</th>
            <th className="px-4 py-3 text-left font-semibold">Hora ingreso</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          <tr className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-900">M-001</td>
            <td className="px-4 py-3 text-slate-800">Luna</td>
            <td className="px-4 py-3 text-slate-800">Ana Pérez</td>
            <td className="px-4 py-3 text-slate-800">Peluquería</td>
            <td className="px-4 py-3 text-slate-800">9:30 AM</td>
          </tr>

          <tr className="hover:bg-slate-50">
            <td className="px-4 py-3 font-medium text-slate-900">M-002</td>
            <td className="px-4 py-3 text-slate-800">Max</td>
            <td className="px-4 py-3 text-slate-800">Carlos Gómez</td>
            <td className="px-4 py-3 text-slate-800">Baño</td>
            <td className="px-4 py-3 text-slate-800">10:15 AM</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
