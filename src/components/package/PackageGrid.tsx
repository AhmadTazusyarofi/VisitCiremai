import type { Package } from '../../types/package'
import { PackageCard } from './PackageCard'

export function PackageGrid({ items }: { items: Package[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  )
}
