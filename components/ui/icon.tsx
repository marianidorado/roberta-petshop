export function Icon({ path }: { path: string }) {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}