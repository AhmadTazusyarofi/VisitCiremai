import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center text-xs font-bold rounded-full px-2.5 py-1 bg-primary/10 text-primary">
      {children}
    </span>
  )
}
