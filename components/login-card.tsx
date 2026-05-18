"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { login } from "@/lib/firebase/auth"
import { FirebaseError } from "firebase/app"

export default function LoginCard() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    await login(email, password)
    router.push("/home")
  } catch (error) {
  if (error instanceof FirebaseError) {
    setError("Correo o contraseña incorrectos")
  } else {
    setError("Error inesperado")
  }
}

  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-orange-500 py-4 px-4 shadow-md">
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/logo-roberta.png"
            alt="Roberta Pet Shop"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
          <h1 className="text-xl md:text-2xl font-bold text-white">Roberta Pet Shop</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2">Sistema de Gestión de Mascotas</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                autoComplete="email"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                autoComplete="current-password"
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
          </form>
        </div>
      </main>
    </div>
  )
}
