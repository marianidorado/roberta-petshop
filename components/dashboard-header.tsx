"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Icon } from "@/components/ui/icon"
import { ICON_PATHS } from "@/components/ui/icon-paths"

export function DashboardHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/logo-roberta.png" alt="Roberta Pet Shop" width={42} height={42} />
          <span className="font-bold text-amber-900 text-lg">
            Roberta Pet Shop
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-amber-800">
          <Link href="/home" className="flex items-center gap-2">
            <Icon path={ICON_PATHS.home} /> Home
          </Link>
          <Link href="/propietarios" className="flex items-center gap-2">
            <Icon path={ICON_PATHS.users} /> Propietarios
          </Link>
          <Link href="/mascotas" className="flex items-center gap-2">
            <Icon path={ICON_PATHS.pets} /> Mascotas
          </Link>
          <Link href="/servicios" className="flex items-center gap-2">
            <Icon path={ICON_PATHS.servicios} /> Servicios
          </Link>
          <Link href="/historial" className="flex items-center gap-2">
            <Icon path={ICON_PATHS.history} /> Historial
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 text-red-600">
            <Link href="/login" className="flex items-center gap-2">
              <Icon path={ICON_PATHS.logout} /> Salir
           </Link>
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg"
          >
            <Icon path={open ? ICON_PATHS.close : ICON_PATHS.menu} />
          </button>
        </div>
      </div>

      {/* Mobile */}
      {open && (
        <nav className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/home" className="flex items-center gap-3">
            <Icon path={ICON_PATHS.home} /> Home
          </Link>
          <Link href="/propietarios" className="flex items-center gap-3">
            <Icon path={ICON_PATHS.users} /> Propietarios
          </Link>
          <Link href="/mascotas" className="flex items-center gap-3">
            <Icon path={ICON_PATHS.pets} /> Mascotas
          </Link>
          <Link href="/servicios" className="flex items-center gap-3">
            <Icon path={ICON_PATHS.servicios} /> Servicios
          </Link>
          <Link href="/historial" className="flex items-center gap-3">
            <Icon path={ICON_PATHS.history} /> Historial
          </Link>

          <hr />

          <button className="flex items-center gap-3 text-red-600">
            <Icon path={ICON_PATHS.logout} />
            Salir
          </button>
        </nav>
      )}
    </header>
  )
}