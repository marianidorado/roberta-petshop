"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Icon } from "@/components/ui/icon"
import { ICON_PATHS } from "@/components/ui/icon-paths"
import { auth } from "@/lib/firebase/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"



console.log("UID:", auth.currentUser?.uid)

interface NavLinkProps {
  href: string
  label: string
  icon: string
  pathname: string
  onClick?: () => void
}

/* ✅ COMPONENTE FUERA DEL RENDER */
function NavLink({ href, label, icon, pathname, onClick }: NavLinkProps) {
  const active = pathname === href
 

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 transition hover:text-amber-600 ${
        active ? "text-amber-600 font-semibold" : "text-amber-800"
      }`}
    >
      <Icon path={icon} />
      {label}
    </Link>
  )
}

export function DashboardHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
    const router = useRouter()
     const { role } = useUser()
   const handleLogout = async () => {
    await signOut(auth)
    router.replace("/")   
  }
   

  return (
    <header className="w-full bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-roberta.png"
            alt="Roberta Pet Shop"
            width={42}
            height={42}
            priority
          />
          <span className="font-bold text-amber-900 text-lg">
            Roberta Pet Shop
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink href="/home" label="Home" icon={ICON_PATHS.home} pathname={pathname} />
          <NavLink href="/propietarios" label="Propietarios" icon={ICON_PATHS.users} pathname={pathname} />
          <NavLink href="/mascotas" label="Mascotas" icon={ICON_PATHS.pets} pathname={pathname} />
          <NavLink href="/servicios" label="Servicios" icon={ICON_PATHS.servicios} pathname={pathname} />
          <NavLink href="/historial" label="Historial" icon={ICON_PATHS.history} pathname={pathname} />
          <NavLink href="/informes" label="Informes" icon={ICON_PATHS.report} pathname={pathname} />
          {role === "admin" && (
            <NavLink
              href="/usuarios"
              label="Usuarios"
              icon={ICON_PATHS.users}
              pathname={pathname}
            />
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Icon path={ICON_PATHS.logout} />
            Salir
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Abrir menú"
          >
            <Icon path={open ? ICON_PATHS.close : ICON_PATHS.menu} />
          </button>
        </div>
      </div>

      {/* Mobile */}
      {open && (
        <nav className="md:hidden border-t bg-white px-4 py-4 space-y-4 font-medium">
          <NavLink href="/home" label="Home" icon={ICON_PATHS.home} pathname={pathname} onClick={() => setOpen(false)} />
          <NavLink href="/propietarios" label="Propietarios" icon={ICON_PATHS.users} pathname={pathname} onClick={() => setOpen(false)} />
          <NavLink href="/mascotas" label="Mascotas" icon={ICON_PATHS.pets} pathname={pathname} onClick={() => setOpen(false)} />
          <NavLink href="/servicios" label="Servicios" icon={ICON_PATHS.servicios} pathname={pathname} onClick={() => setOpen(false)} />
          <NavLink href="/historial" label="Historial" icon={ICON_PATHS.history} pathname={pathname} onClick={() => setOpen(false)} />
          <NavLink href="/informes" label="Informes" icon={ICON_PATHS.report} pathname={pathname} onClick={() => setOpen(false)} />
          {role === "admin" && (
              <NavLink
                href="/usuarios"
                label="Usuarios"
                icon={ICON_PATHS.users}
                pathname={pathname}
                onClick={() => setOpen(false)}
              />
            )}

          <hr />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600"
          >
            <Icon path={ICON_PATHS.logout} />
            Salir
          </button>
        </nav>
      )}
    </header>
  )
}