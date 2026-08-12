import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Testimonial = {
  quote: string;
  name: string;
  trip: string;
  rating: number;
};

const STORAGE_KEY = 'visitciremai_testimonials';

function load(): Testimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Testimonial[]) : [];
  } catch {
    return [];
  }
}

type TestimonialsCtx = {
  userTestimonials: Testimonial[];
  addTestimonial: (t: Testimonial) => void;
};

const TestimonialsContext = createContext<TestimonialsCtx | null>(null);

export function TestimonialsProvider({ children }: { children: ReactNode }) {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>(() =>
    load(),
  );

  const addTestimonial = useCallback((t: Testimonial) => {
    setUserTestimonials((prev) => {
      const next = [t, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors (private mode, quota, etc.)
      }
      return next;
    });
  }, []);

  return (
    <TestimonialsContext.Provider value={{ userTestimonials, addTestimonial }}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials(): TestimonialsCtx {
  const ctx = useContext(TestimonialsContext);
  if (!ctx) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider');
  }
  return ctx;
}
