    import Image from "next/image"

export function Logo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <Image
        src="/logo-roberta.png"
        alt="Roberta Pet Shop"
        width={80}
        height={80}
        priority
      />
      <h1 className="text-2xl font-bold text-amber-900">
        Roberta Pet Shop
      </h1>
    </div>
  )
}