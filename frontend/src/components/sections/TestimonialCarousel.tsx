import type { JSX } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Testimonial } from '../../context/TestimonialsContext';

const GAP_PX = 24; // matches gap-6
const AUTOPLAY_MS = 5000;

function Stars({ rating }: { rating: number }): JSX.Element {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={
            i < rating
              ? 'h-4 w-4 fill-[#F4B942] text-[#F4B942]'
              : 'h-4 w-4 text-white/30'
          }
        />
      ))}
    </div>
  );
}

function Card({ t }: { t: Testimonial }): JSX.Element {
  return (
    <article className="glass flex h-full flex-col rounded-xl p-6">
      <Stars rating={t.rating} />
      <blockquote className="mt-4 flex-1 leading-relaxed text-white/90">
        “{t.quote}”
      </blockquote>
      <div className="mt-5 border-t border-white/15 pt-4">
        <p className="font-bold text-white">{t.name}</p>
        <p className="text-sm text-white/70">{t.trip}</p>
      </div>
    </article>
  );
}

export function TestimonialCarousel({
  items,
}: {
  items: Testimonial[];
}): JSX.Element {
  const trackRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);

  const n = items.length;
  // Render three copies so we can loop seamlessly in both directions.
  const rendered = [...items, ...items, ...items];

  const [index, setIndex] = useState(n); // start at the middle copy
  const [step, setStep] = useState(0); // px to move per card (width + gap)
  const [animate, setAnimate] = useState(false);

  // Measure one card's width (+ gap). Runs on mount and resize.
  useLayoutEffect(() => {
    function measure() {
      const track = trackRef.current;
      const card = track?.querySelector<HTMLElement>('[data-slide]');
      if (card) {
        setAnimate(false); // reposition without a visible slide
        setStep(card.getBoundingClientRect().width + GAP_PX);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Re-enable the transition on the next frame after any no-animation snap.
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  // Auto-play (skips reduced-motion and pauses on hover/focus).
  useEffect(() => {
    if (n <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [n]);

  function go(dir: 1 | -1) {
    setAnimate(true);
    setIndex((i) => i + dir);
  }

  // When a slide finishes, jump invisibly back into the middle copy.
  function handleTransitionEnd() {
    if (index >= n * 2) {
      setAnimate(false);
      setIndex(index - n);
    } else if (index < n) {
      setAnimate(false);
      setIndex(index + n);
    }
  }

  if (n <= 1) {
    return (
      <ul className="grid gap-6">
        {items.map((t, i) => (
          <li key={`${t.name}-${i}`}>
            <Card t={t} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label="Testimoni pelanggan"
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
      <div className="overflow-hidden">
        <ul
          ref={trackRef}
          className="flex gap-6"
          style={{
            transform: `translate3d(${-index * step}px, 0, 0)`,
            transition: animate ? 'transform 0.45s ease' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {rendered.map((t, i) => (
            <li
              key={i}
              data-slide
              aria-hidden={i < n || i >= n * 2}
              className="shrink-0 basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc((100%-3rem)/3)]"
            >
              <Card t={t} />
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        aria-label="Testimoni sebelumnya"
        onClick={() => go(-1)}
        className="absolute -left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-line transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:-left-6"
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Testimoni berikutnya"
        onClick={() => go(1)}
        className="absolute -right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-line transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:-right-6"
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
