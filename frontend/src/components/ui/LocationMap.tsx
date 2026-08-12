import type { JSX } from 'react';
import { MAP_QUERY } from '../../lib/config';

export { MAP_QUERY };

/** Embed Google Maps tanpa API key. */
const EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY,
)}&z=12&hl=id&output=embed`;

/** Tautan "Buka di Google Maps" untuk petunjuk arah. */
export const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_QUERY,
)}`;

export function LocationMap({
  className = '',
  title = 'Peta lokasi VisitCiremai di kawasan Gunung Ciremai, Majalengka',
}: {
  className?: string;
  title?: string;
}): JSX.Element {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/20 bg-black/20 ${className}`}
    >
      <iframe
        src={EMBED_SRC}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
        allowFullScreen
      />
    </div>
  );
}
