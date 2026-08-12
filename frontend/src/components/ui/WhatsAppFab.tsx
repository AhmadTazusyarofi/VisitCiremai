import type { JSX } from 'react';
import { waLink } from '../../lib/whatsapp';

export function WhatsAppFab(): JSX.Element {
  const href = waLink(
    'Halo VisitCiremai! Saya ingin bertanya tentang paket wisata Ciremai.',
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Hubungi kami di WhatsApp"
      className="fixed bottom-5 right-5 z-40 block h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <img src="/img/whatsapp.png" alt="" className="h-full w-full rounded-full" />
    </a>
  );
}
