import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { apiGet, apiPost } from '../lib/api';

export type Testimonial = {
  quote: string;
  name: string;
  trip: string;
  rating: number;
};

/** Bentuk testimoni yang dikirim API (punya id). */
type TestimonialDto = Testimonial & { id: number };

type TestimonialsCtx = {
  /** Testimoni pengunjung yang sudah disetujui admin. */
  userTestimonials: Testimonial[];
  /**
   * Mengirim testimoni baru. Testimoni masuk antrean moderasi, jadi belum
   * langsung tampil di situs.
   */
  addTestimonial: (t: Testimonial) => Promise<void>;
};

const TestimonialsContext = createContext<TestimonialsCtx | null>(null);

export function TestimonialsProvider({ children }: { children: ReactNode }) {
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    apiGet<TestimonialDto[]>('/testimonials', controller.signal)
      .then((rows) => {
        if (controller.signal.aborted) return;
        setUserTestimonials(
          rows.map(({ quote, name, trip, rating }) => ({ quote, name, trip, rating })),
        );
      })
      .catch(() => {
        // Testimoni bersifat pelengkap — bila gagal dimuat, situs tetap
        // menampilkan testimoni contoh tanpa pesan error yang mengganggu.
      });

    return () => controller.abort();
  }, []);

  const addTestimonial = useCallback(async (t: Testimonial) => {
    await apiPost('/testimonials', {
      name: t.name,
      trip: t.trip,
      rating: t.rating,
      quote: t.quote,
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
