export function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button className="bg-amber-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-amber-600">
        Registrar dueño
      </button>

      <button className="bg-white border-2 border-amber-500 text-amber-600 px-6 py-3 rounded-md font-semibold hover:bg-amber-50">
        Registrar mascota
      </button>
    </div>
  )
}