import type { JSX } from "react";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "./Container";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
} from "../../lib/config";
import { Modal } from "../ui/Modal";
import { TestimonialForm } from "../sections/TestimonialForm";

const layanan = [
  { label: "Pendakian", href: "/#paket" },
  { label: "Akomodasi", href: "/#akomodasi" },
  { label: "Transportasi", href: "/#transportasi" },
  { label: "Sewa Alat", href: "/#sewa-alat" },
  { label: "Tentang Kami", href: "/tentang" },
];

const socials = [
  { label: "Instagram", href: "#", icon: "/img/instagram.png" },
  { label: "Facebook", href: "#", icon: "/img/communication.png" },
  { label: "YouTube", href: "#", icon: "/img/youtube.png" },
];

const linkClass =
  "inline-flex min-h-9 items-center text-sm text-white/80 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded";

const contactLinkClass =
  "flex items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded";

export function Footer(): JSX.Element {
  const [testiOpen, setTestiOpen] = useState(false);

  return (
    <footer id="kontak" className="relative overflow-hidden text-white/90">
      {/* No solid background — the same fixed hero image shows through */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/img/hero.png')] bg-cover bg-center bg-fixed"
      />
      {/* Dark scrim so the white text stays readable over the photo */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

      <Container className="relative z-10 py-14 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)] sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h2 className="text-4xl font-bold leading-[0.85] text-white sm:text-7xl">
              <span className="block">Visit</span>
              <span className="block">Ciremai.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/80">
              VisitCiremai.com, partner wisata Gunung Ciremai yang menyediakan
              paket tour, penginapan, transportasi, dan rental alat outdoor
              untuk pengalaman liburan yang tak terlupakan.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="inline-flex rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <img src={s.icon} alt="" className="h-9 w-9" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Layanan
            </h3>
            <ul className="flex flex-col gap-1">
              {layanan.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Kontak
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <span>{CONTACT_ADDRESS}</span>
              </li>
              <li>
                <a href={CONTACT_PHONE_HREF} className={contactLinkClass}>
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span>{CONTACT_PHONE}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={contactLinkClass}>
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setTestiOpen(true)}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  Bagikan Pengalamanmu
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6">
          <p className="text-center text-xs text-white/70">
            © {new Date().getFullYear()} VisitCiremai
          </p>
        </div>
      </Container>

      <Modal
        open={testiOpen}
        onClose={() => setTestiOpen(false)}
        title="Bagikan Testimoni"
      >
        <TestimonialForm onClose={() => setTestiOpen(false)} />
      </Modal>
    </footer>
  );
}
