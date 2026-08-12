import type { JSX } from 'react';
import { Container } from '../layout/Container';
import { TestimonialCarousel } from './TestimonialCarousel';
import type { Testimonial } from '../../context/TestimonialsContext';
import { useTestimonials } from '../../context/TestimonialsContext';

// NOTE: data testimoni di bawah adalah CONTOH/placeholder yang tampil sebagai
// pelengkap. Testimoni asli datang dari API (tabel `testimonials`) dan hanya
// muncul setelah disetujui admin — lihat TestimonialsContext.
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Pengalaman pendakian yang sangat menyenangkan. Guide-nya ramah dan sangat membantu sepanjang perjalanan.',
    name: 'Rizky Ananda',
    trip: 'Privat Trip Pendakian Ciremai',
    rating: 5,
  },
  {
    quote:
      'Semua kebutuhan sudah disiapkan, jadi kami tinggal menikmati. Booking-nya juga gampang banget.',
    name: 'Siti Nurhaliza',
    trip: 'Open Trip Ciremai Via Apuy',
    rating: 5,
  },
  {
    quote:
      'Tim lokal yang profesional dan ramah. Camp-nya nyaman dan makanannya enak. Pasti balik lagi!',
    name: 'Dimas Prayoga',
    trip: 'Camp & Bushcraft',
    rating: 5,
  },
];

export function Testimonials(): JSX.Element {
  const { userTestimonials } = useTestimonials();
  const all = [...userTestimonials, ...MOCK_TESTIMONIALS];

  return (
    <section
      id="testimoni"
      className="relative overflow-hidden py-12 text-white sm:py-16"
    >
      {/* No solid background — the same fixed hero image shows through */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/img/hero.png')] bg-cover bg-center bg-fixed"
      />
      {/* Dark scrim so the text stays readable over the photo */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

      <Container className="relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Kata Mereka</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
            Cerita dari para petualang yang sudah menjelajah Ciremai bersama kami.
          </p>
        </div>

        <div className="mt-10">
          <TestimonialCarousel items={all} />
        </div>
      </Container>
    </section>
  );
}
