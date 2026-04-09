import "./globals.css"
import type { Metadata } from "next"
import { UserProvider } from "@/context/UserContext"

export const metadata: Metadata = {
  title: "Roberta Pet Shop",
  description: "Sistema de Gestión de Mascotas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
