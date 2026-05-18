import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase/firebase"

export async function uploadSignature(dataUrl: string) {
  // convertir base64 a blob
  const blob = await (await fetch(dataUrl)).blob()

  const fileRef = ref(
    storage,
    `signatures/${Date.now()}.png`
  )

  await uploadBytes(fileRef, blob)

  return await getDownloadURL(fileRef)
}