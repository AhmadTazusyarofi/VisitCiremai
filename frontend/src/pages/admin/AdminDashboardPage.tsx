import type { JSX } from 'react';
import { useCallback, useState } from 'react';
import { Seo } from '../../components/Seo';
import { AdminLayout, type AdminTab } from '../../components/admin/AdminLayout';
import { BookingsPanel } from '../../components/admin/BookingsPanel';
import { PackagesPanel } from '../../components/admin/PackagesPanel';
import { TestimonialsPanel } from '../../components/admin/TestimonialsPanel';

const TITLES: Record<AdminTab, string> = {
  booking: 'Pemesanan',
  testimoni: 'Testimoni',
  paket: 'Paket',
};

export function AdminDashboardPage(): JSX.Element {
  const [tab, setTab] = useState<AdminTab>('booking');
  const [bookingBadge, setBookingBadge] = useState(0);
  const [testiBadge, setTestiBadge] = useState(0);

  // Dibungkus useCallback agar efek pelapor lencana di panel tidak
  // terpicu ulang setiap render.
  const handleBookingCount = useCallback((n: number) => setBookingBadge(n), []);
  const handleTestiCount = useCallback((n: number) => setTestiBadge(n), []);

  return (
    <>
      <Seo title={`${TITLES[tab]} — Admin VisitCiremai`} noindex />
      <AdminLayout
        active={tab}
        onChange={setTab}
        badges={{ booking: bookingBadge, testimoni: testiBadge }}
      >
        {/* Panel yang tidak aktif dilepas agar tidak ikut memanggil API. */}
        {tab === 'booking' && <BookingsPanel onCountsChange={handleBookingCount} />}
        {tab === 'testimoni' && <TestimonialsPanel onCountsChange={handleTestiCount} />}
        {tab === 'paket' && <PackagesPanel />}
      </AdminLayout>
    </>
  );
}
