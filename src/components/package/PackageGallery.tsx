import type { JSX } from "react";
import { useState } from "react";

export function PackageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}): JSX.Element {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <img
          src={current}
          alt={alt}
          className="max-h-140 w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-current={i === active}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                i === active
                  ? "border-primary"
                  : "border-line hover:border-primary/50"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
