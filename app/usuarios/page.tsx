"use client"

import { useUser } from "@/context/UserContext"
import { startTransition, useEffect, useState } from "react"
import {
  getUsers,
  createAppUser,
  updateUserRole,
  updateUserStatus,
  AppUser
} from "@/lib/firebase/users"
import { DashboardHeader } from "@/components/dashboard-header"

export default function UsuariosPage() {
  const { user, role, loading } = useUser()
  const [users, setUsers] = useState<AppUser[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

async function loadUsers() {
  const data = await getUsers()
  setUsers(data)
  setLoadingData(false)
}

useEffect(() => {
    if (loading || role !== "admin") return

    startTransition(async () => {
        const data = await getUsers()
        setUsers(data)
        setLoadingData(false)
    })
    }, [loading, role])

 

  if (loading) return <p>Cargando sesión...</p>
  if (role !== "admin") return <p>No autorizado</p>

  return (
     <div className="min-h-screen bg-amber-50">

    <DashboardHeader />

      <main className="max-w-6xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold text-amber-900">
        Gestión de Usuarios
      </h1>

      {/* Crear usuario */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold">Crear usuario</h2>

        <input
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          onClick={async () => {

            try {

              if (password.length < 6) {
                alert("La contraseña debe tener mínimo 6 caracteres")
                return
              }

              await createAppUser(name, email, password, "reception")

              setName("")
              setEmail("")
              setPassword("")

              loadUsers()

            } catch (error) {

              console.error(error)
              alert("No se pudo crear el usuario")

            }

          }}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          Crear recepcionista
        </button>
      </div>

      {/* Tabla usuarios */}
      <div className="bg-white p-4 rounded shadow">
        {loadingData ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.uid} className="border-b">
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.active ? "Sí" : "No"}</td>
                  <td className="space-x-2">
                    <button
                     onClick={async () => {
                        await updateUserRole(
                            u.uid,
                            u.role === "admin" ? "reception" : "admin"
                        )
                        loadUsers()
                        }}
                      className="text-blue-600"
                    >
                      Cambiar rol
                    </button>

                    <button
                     onClick={async () => {
                        await updateUserStatus(u.uid, !u.active)
                        loadUsers()
                        }}
                      className="text-red-600"
                    >
                      {u.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </main>
  </div>
)
}