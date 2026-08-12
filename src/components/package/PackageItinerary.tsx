import type { JSX } from 'react';
import type { ItineraryStep } from '../../types/package';

export function PackageItinerary({
  steps,
}: {
  steps: ItineraryStep[];
}): JSX.Element {
  return (
    <ol className="mt-4">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={`${step.time}-${i}`} className="flex gap-4">
            {/* Marker + connecting line */}
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className="mt-1 flex h-3 w-3 shrink-0 rounded-full bg-primary ring-4 ring-primary/15"
              />
              {!isLast && <span aria-hidden="true" className="w-px flex-1 bg-line" />}
            </div>

            <div className={isLast ? '' : 'pb-6'}>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {step.time}
              </span>
              <h3 className="mt-1.5 font-semibold text-ink">{step.title}</h3>
              {step.desc && <p className="mt-1 text-sm text-ink-2">{step.desc}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
