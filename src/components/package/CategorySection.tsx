import type { Package } from '../../types/package'
import { PackageCarousel } from './PackageCarousel'

export function CategorySection({
  title,
  items,
  id,
}: {
  title: string
  items: Package[]
  id?: string
}) {
  return (
    <section id={id}>
      <h2 className="mb-6 text-2xl font-bold text-ink">{title}</h2>
      <PackageCarousel items={items} label={title} />
    </section>
  )
}
