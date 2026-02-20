"use client"

import SignatureCanvas from "react-signature-canvas"
import { useRef } from "react"

interface Props {
  onChange: (dataUrl: string | null) => void
}

export default function SignaturePad({ onChange }: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null)

  const clear = () => {
    if (!sigRef.current) return
    sigRef.current.clear()
    onChange(null)
  }

  const handleEnd = () => {
    if (!sigRef.current) return

    if (sigRef.current.isEmpty()) {
      onChange(null)
      return
    }

    const dataUrl = sigRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png")

    onChange(dataUrl)
  }

  return (
    <div className="space-y-2">
      <div className="border rounded-lg bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          onEnd={handleEnd}
          canvasProps={{
            className: "w-full h-40 rounded-lg",
          }}
        />
      </div>

      <button
        type="button"
        onClick={clear}
        className="text-sm text-red-600"
      >
        Limpiar firma
      </button>
    </div>
  )
}