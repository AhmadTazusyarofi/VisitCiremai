import type { JSX } from 'react';
import { Container } from '../layout/Container';
import { GlassSearchBar } from './GlassSearchBar';

export function HeroSection(): JSX.Element {
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100vh] items-center overflow-hidden"
    >
      {/* Background image — fixed to the viewport so it stays put while the
          content scrolls over it. Degrades to a normal (scrolling) background on
          mobile browsers that ignore background-attachment: fixed. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[30%] h-[130%] bg-[url('/img/hero.png')] bg-cover bg-center bg-fixed"
      />
      {/* Dark gradient overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/60"
      />

      <Container className="relative z-10 py-24 text-center text-white">
        {/* Social proof avatars */}
        <img
          src="/img/avatar-grup.png"
          alt="Komunitas petualang VisitCiremai"
          className="mx-auto mb-8 h-7 w-auto"
        />

        {/* The only H1 on the page */}
        <h1 className="mx-auto max-w-4xl font-bold leading-tight drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]">
          <span className="block text-2xl sm:text-3xl md:text-4xl">
            Jelajahi Keindahan
          </span>
          <span className="mt-1 block text-4xl sm:text-6xl md:text-7xl">
            Gunung Ciremai
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-2xl whitespace-normal text-base text-white/90 drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)] sm:text-lg lg:max-w-none lg:whitespace-nowrap">
          Paket wisata, akomodasi, transportasi, dan penyewaan alat outdoor dalam satu platform.
        </p>

        {/* Search bar */}
        <div className="mx-auto mt-10 w-full max-w-3xl">
          <GlassSearchBar />
        </div>
      </Container>
    </section>
  );
}
