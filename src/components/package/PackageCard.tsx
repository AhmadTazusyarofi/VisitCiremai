import { ArrowRight, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Package } from '../../types/package'
import { formatRupiah } from '../../lib/format'
import { Button } from '../ui/Button'

export function PackageCard({ pkg }: { pkg: Package }) {
  const navigate = useNavigate()
  return (
    <article
      aria-labelledby={pkg.id}
      className="group flex flex-col bg-surface rounded-xl border border-line overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={pkg.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 id={pkg.id} className="font-bold text-ink leading-snug">{pkg.title}</h3>

        <p className="mt-2 line-clamp-3 text-sm text-ink-2">{pkg.description}</p>

        {/* Bottom row: price + duration on the left, Booking button on the right */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div>
            <p className="font-bold text-ink">
              {formatRupiah(pkg.price)}
              <span className="text-xs font-normal text-ink-2"> / {pkg.priceUnit}</span>
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-sm text-ink-2">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {pkg.duration}
            </span>
          </div>

          <Button
            className="shrink-0"
            aria-label={`Booking ${pkg.title}`}
            onClick={() => navigate(`/paket/${pkg.id}`)}
          >
            Booking
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
