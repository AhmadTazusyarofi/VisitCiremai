import type { JSX } from 'react';
import { CalendarCheck, Package, ShieldCheck, Users } from 'lucide-react';
import { Container } from '../layout/Container';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Guide Berpengalaman',
    desc: 'Guide lokal bersertifikat yang memahami medan Ciremai.',
  },
  {
    icon: Package,
    title: 'Paket Lengkap',
    desc: 'Semua kebutuhan perjalanan disiapkan dalam satu tempat.',
  },
  {
    icon: CalendarCheck,
    title: 'Booking Mudah',
    desc: 'Proses pemesanan sederhana, cepat, dan transparan.',
  },
  {
    icon: Users,
    title: 'Layanan Lokal',
    desc: 'Mendukung pelaku wisata dan masyarakat sekitar Ciremai.',
  },
];

export function WhyVisitCiremai(): JSX.Element {
  return (
    <section id="mengapa" className="py-12 sm:py-16">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-ink">Mengapa VisitCiremai?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-2">
            Kami bantu petualanganmu di Ciremai terasa mudah, aman, dan berkesan.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="rounded-xl border border-line bg-surface p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon aria-hidden="true" className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-ink-2">{desc}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
