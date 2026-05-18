import { Suspense } from "react"
import HistoryPageClient from "./history-page-client"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando historial...</div>}>
      <HistoryPageClient />
    </Suspense>
  )
}