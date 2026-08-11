import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Package } from "../../types/package";
import { PackageCard } from "./PackageCard";

const GAP_PX = 24; // must match the track's gap-6 (1.5rem)
const AUTOPLAY_MS = 4500;

export function PackageCarousel({
  items,
  label,
}: {
  items: Package[];
  label: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);

  function step(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-slide]");
    const amount = card
      ? card.getBoundingClientRect().width + GAP_PX
      : track.clientWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Loop around at the ends.
    if (dir === 1 && track.scrollLeft >= maxScroll - 4) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && track.scrollLeft <= 4) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      track.scrollBy({ left: dir * amount, behavior: "smooth" });
    }
  }

  // Auto-play — only when there is something to scroll and motion is allowed.
  useEffect(() => {
    if (items.length <= 3) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [items.length]);

  const showControls = items.length > 3;

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
    >
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {items.map((pkg) => (
          <li
            key={pkg.id}
            data-slide
            className="snap-start shrink-0 basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc((100%-3rem)/3)]"
          >
            <PackageCard pkg={pkg} />
          </li>
        ))}
      </ul>

      {showControls && (
        <>
          <button
            type="button"
            aria-label="Paket sebelumnya"
            onClick={() => step(-1)}
            className="absolute -left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-line transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:-left-6"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Paket berikutnya"
            onClick={() => step(1)}
            className="absolute -right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-line transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:-right-6"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
