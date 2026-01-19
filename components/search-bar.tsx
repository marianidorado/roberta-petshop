export function SearchBar() {
  return (
    <div className="w-full max-w-xl">
      <label className="block mb-1 text-sm font-semibold text-slate-700">
        Buscar
      </label>
      <input
        type="text"
        placeholder="Buscar por mascota, propietario o código"
        className="
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          px-4
          py-3
          text-slate-900
          placeholder-slate-400
          shadow-sm
          focus:border-amber-500
          focus:ring-2
          focus:ring-amber-200
        "
      />
    </div>
  )
}