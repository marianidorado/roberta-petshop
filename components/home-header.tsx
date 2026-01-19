import Image from "next/image"

export function HomeHeader() {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
        <Image
          src="/logo-roberta.png"
          alt="Roberta Pet Shop"
          width={48}
          height={48}
        />
        <h1 className="text-xl font-bold text-amber-900">
          Roberta Pet Shop
        </h1>
      </div>
    </header>
  )
}