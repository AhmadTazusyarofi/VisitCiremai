import type { JSX } from 'react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';

export function CTASection(): JSX.Element {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold sm:text-3xl">
            Siap Menjelajahi Ciremai?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Temukan paket perjalanan yang sesuai dengan kebutuhanmu dan mulai
            petualanganmu bersama VisitCiremai.
          </p>
          <a
            href="/#paket"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Lihat Semua Paket
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </a>
        </div>
      </Container>
    </section>
  );
}
