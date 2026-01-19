import "./globals.css"
import type { Metadata } from "next"

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
        {children}
      </body>
    </html>
  )
}
