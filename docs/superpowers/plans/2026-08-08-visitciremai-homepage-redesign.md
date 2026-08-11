# VisitCiremai Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fresh React homepage for VisitCiremai matching the Figma mockup — dark cinematic mountain hero, frosted "liquid glass" search bar, Kadwa serif type, and data-driven package cards.

**Architecture:** Vite + React 19 + TS single-page homepage. All package cards render from one typed data array. A reusable `LiquidGlass` component applies an SVG refraction filter via `backdrop-filter` (Chromium) with a frost-blur fallback (Firefox/Safari). Tailwind v4 with CSS design tokens.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, `@fontsource/kadwa`, Vitest + @testing-library/react (unit tests where logic exists).

## Global Constraints

- React 19 + TypeScript + Vite; Tailwind CSS v4
- Font: Kadwa only (weights 400/700), self-hosted via `@fontsource/kadwa`
- Primary green `#176B3A`; background `#F7F8F5`; surface `#FFFFFF`; text `#17251D`; border `#E4E9E5`
- Homepage only; no backend, no payment; static data in `src/data/packages.ts`
- Placeholder images now (paths centralized in data)
- Responsive from 320px, no horizontal overflow; respect `prefers-reduced-motion`
- Indonesian copy; semantic HTML; single H1
- All package UI is data-driven — no duplicated card markup

---

### Task 1: Scaffold project + Tailwind + Kadwa + tokens

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

**Interfaces:**
- Consumes: nothing (greenfield)
- Produces: working Vite dev/build; CSS tokens as variables `--color-primary` etc.; Kadwa applied to `body`; `App` component mounted.

- [ ] **Step 1: Scaffold Vite React-TS in current dir**

Run (from project root; folder has only images + docs):
```bash
npm create vite@latest . -- --template react-ts
npm install
```
If prompted about non-empty dir, keep existing files (images/docs/CLAUDE.md).

- [ ] **Step 2: Install deps**

```bash
npm install tailwindcss @tailwindcss/vite @fontsource/kadwa
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Wire Tailwind v4 in `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' },
})
```

- [ ] **Step 4: Write `src/index.css` with Tailwind + tokens + Kadwa**

```css
@import "tailwindcss";
@import "@fontsource/kadwa/400.css";
@import "@fontsource/kadwa/700.css";

@theme {
  --color-primary: #176B3A;
  --color-primary-dark: #0D3B24;
  --color-bg: #F7F8F5;
  --color-surface: #FFFFFF;
  --color-ink: #17251D;
  --color-ink-2: #66736B;
  --color-line: #E4E9E5;
  --font-sans: "Kadwa", Georgia, serif;
}

html { scroll-behavior: smooth; }
body { background: var(--color-bg); color: var(--color-ink); font-family: var(--font-sans); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 5: Minimal `src/App.tsx` placeholder**

```tsx
export default function App() {
  return <main className="min-h-screen grid place-items-center text-2xl">VisitCiremai</main>
}
```

- [ ] **Step 6: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Verify build + dev**

Run: `npm run build`
Expected: build succeeds, no TS errors.

- [ ] **Step 8: Commit** (only if the repo is under git; skip otherwise)

```bash
git add -A && git commit -m "chore: scaffold Vite React TS + Tailwind v4 + Kadwa tokens"
```

---

### Task 2: Package type + data + price formatter

**Files:**
- Create: `src/types/package.ts`, `src/data/packages.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type Package = { id: string; title: string; category: Category; location?: string; price: number; priceUnit: string; duration: string; image: string; description: string; includes?: string[] }`
  - `type Category = 'Pendakian Gunung Hutan' | 'Petualangan Lainnya' | 'Akomodasi' | 'Transportasi' | 'Sewa Alat'`
  - `packages: Package[]` (grouped-able by category)
  - `formatRupiah(n: number): string` → e.g. `formatRupiah(2200000) === 'Rp2.200.000'`

- [ ] **Step 1: Write failing test `src/lib/format.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { formatRupiah } from './format'

describe('formatRupiah', () => {
  it('formats millions with dot separators and Rp prefix', () => {
    expect(formatRupiah(2200000)).toBe('Rp2.200.000')
  })
  it('formats small values', () => {
    expect(formatRupiah(35000)).toBe('Rp35.000')
  })
})
```

- [ ] **Step 2: Run test, verify fail**

Run: `npx vitest run src/lib/format.test.ts`
Expected: FAIL (formatRupiah not defined)

- [ ] **Step 3: Implement `src/lib/format.ts`**

```ts
export function formatRupiah(n: number): string {
  return 'Rp' + new Intl.NumberFormat('id-ID').format(n)
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/format.test.ts`
Expected: PASS

- [ ] **Step 5: Create `src/types/package.ts`** (types from Interfaces block above)

- [ ] **Step 6: Create `src/data/packages.ts`**

Port all packages from the old site into a typed array. Include at minimum these (from `image.png` / CLAUDE.md), each with placeholder image path `/img/placeholder.jpg`, an Indonesian `description`, `priceUnit` (`'Orang'` / `'Unit'`), and `duration`:
- **Pendakian Gunung Hutan:** Privat Trip Pendakian Gunung Ciremai Via Apuy (2.200.000/Orang, "2 hari 1 malam", includes: Guide bersertifikat, Local Porter, Dokumentasi Perjalanan, Tiket Masuk, Simaksi, Booking Online, Cek Kesehatan, Tenda, Matras, Kompor, Cooking Set, Sleeping Bag, Flysheet, Makan 6x by request, Pick Up, Penginapan); Privat Trip Camp / Bushcraft (2.200.000/Orang, "Unlimited"); Trip Hiking Summit Ciremai Via Apuy - Min. 4 Orang (400.000/Orang, "2 hari 1 malam")
- **Petualangan Lainnya:** Mini Season Expedisi Hutan Gunung Ciremai (2.200.000/Orang); Kelas Navigasi Darat & Hutan (2.200.000/Orang, "Unlimited"); Rock Climbing Class (400.000/Orang, "2 hari 1 malam"); Sport Rock Climbing Tebing Kondar (250.000/Orang); Hiking & Berbagya Time Curug Muara Jaya (200.000/Orang); Canyoneering – Waterfall Rappelling Curug Muara Jaya (600.000/Orang)
- **Akomodasi:** Rumah Singgah Pendaki Warung Ciremai Via Apuy (35.000/Orang)
- **Transportasi:** Pick Up Pendaki (400.000/Unit); Transportasi Ke Kirakan Ciremai Via Apuy (1.300.000/Unit); Transportasi Jabodetabek – Ciremai Via Apuy (700.000/Unit); Pickup Antar Jemput Pendaki Ke Pos Pendakian (400.000/Unit)
- **Sewa Alat:** Tenda Dome 4–5 Orang (40.000/Unit)

Keep descriptions short (1–2 sentences), Indonesian, friendly tone.

- [ ] **Step 7: Add placeholder image** `public/img/placeholder.jpg` (any optimized mountain/trip stock; a solid-color or gradient jpg is acceptable for now).

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: PASS, no unused/type errors.

- [ ] **Step 9: Commit** (if git) — `feat: add package types, data, rupiah formatter`

---

### Task 3: UI primitives — Button + Badge

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Badge.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `Button` — `props: { variant?: 'primary' | 'ghost'; as?: 'button' | 'a'; href?: string } & HTMLAttributes`. Primary = green pill `#176B3A`, white text, rounded-full, hover `#0D3B24`, visible focus ring.
  - `Badge` — `props: { children }` small rounded category label.

- [ ] **Step 1: Implement `Button.tsx`** — green pill primary + ghost variant, `rounded-full`, `focus-visible:ring-2`, min touch height `h-11` on mobile.

- [ ] **Step 2: Implement `Badge.tsx`** — `inline-flex text-xs rounded-full px-2.5 py-1 bg-[--color-line] text-[--color-ink-2]`.

- [ ] **Step 3: Verify build** — `npm run build` PASS.

- [ ] **Step 4: Commit** (if git) — `feat: add Button and Badge primitives`

---

### Task 4: LiquidGlass component + SVG refraction filter

**Files:**
- Create: `src/components/ui/LiquidGlass.tsx`, `src/components/ui/GlassFilter.tsx`, `src/components/ui/LiquidGlass.test.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `GlassFilter` — renders a hidden `<svg>` with `<filter id="lg-glass">` (feTurbulence baseFrequency ~0.008 + feDisplacementMap scale ~40, mapping Refraction 80/Depth 83; slight per-channel offset for Dispersion 63). Mounted once near app root.
  - `LiquidGlass` — `props: { as?: keyof JSX.IntrinsicElements; className?; children }`. Wraps children in an element with class `glass` (frost blur + tint + border + shadow) and, where supported, `backdrop-filter: url(#lg-glass)`.

- [ ] **Step 1: Write failing test `LiquidGlass.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LiquidGlass } from './LiquidGlass'

describe('LiquidGlass', () => {
  it('renders children and applies glass class', () => {
    render(<LiquidGlass>hello</LiquidGlass>)
    const el = screen.getByText('hello')
    expect(el.className).toContain('glass')
  })
})
```

- [ ] **Step 2: Run test, verify fail** — `npx vitest run src/components/ui/LiquidGlass.test.tsx` → FAIL.

- [ ] **Step 3: Add glass CSS to `src/index.css`**

```css
.glass {
  background: color-mix(in srgb, white 14%, transparent);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  backdrop-filter: blur(14px) saturate(1.4);
  border: 1px solid color-mix(in srgb, white 45%, transparent);
  box-shadow: 0 8px 32px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.35);
}
/* Chromium: add SVG refraction on top of frost when url() filters are supported */
@supports (backdrop-filter: url(#lg-glass)) {
  .glass { backdrop-filter: blur(10px) saturate(1.4) url(#lg-glass); }
}
```

- [ ] **Step 4: Implement `GlassFilter.tsx`**

```tsx
export function GlassFilter() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
      <filter id="lg-glass" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
```

- [ ] **Step 5: Implement `LiquidGlass.tsx`**

```tsx
import type { ReactNode } from 'react'
export function LiquidGlass({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`glass ${className}`}>{children}</div>
}
```

- [ ] **Step 6: Run test, verify pass** — PASS.

- [ ] **Step 7: Verify build** — `npm run build` PASS.

- [ ] **Step 8: Commit** (if git) — `feat: add LiquidGlass + SVG refraction filter`

---

### Task 5: GlassSearchBar

**Files:**
- Create: `src/components/hero/GlassSearchBar.tsx`

**Interfaces:**
- Consumes: `LiquidGlass`, category list from `src/data/packages.ts`
- Produces: `GlassSearchBar` — controlled UI (local state only; no submit backend). Horizontal on desktop, stacked on mobile. Contains labeled text input ("Cari destinasi atau paket…"), category `<select>` ("Petualangan Lainnya" default), round search button with icon.

- [ ] **Step 1: Implement `GlassSearchBar.tsx`** — three glass elements (input wrapper, select wrapper, round button). Each field has an associated `<label className="sr-only">`. Button `aria-label="Cari paket"`. Layout: `flex flex-col gap-3 sm:flex-row sm:items-center`. Widths: input `flex-1`, select `sm:w-56`, button fixed `h-12 w-12 rounded-full`. `onSubmit` prevents default; no navigation yet.

- [ ] **Step 2: Verify build** — `npm run build` PASS.

- [ ] **Step 3: Commit** (if git) — `feat: add GlassSearchBar`

---

### Task 6: Navbar + HeroSection

**Files:**
- Create: `src/components/layout/Container.tsx`, `src/components/layout/Navbar.tsx`, `src/components/hero/HeroSection.tsx`
- Create asset: `public/img/hero.jpg` (placeholder dark mountain photo)

**Interfaces:**
- Consumes: `Button`, `GlassSearchBar`
- Produces:
  - `Container` — `max-w-6xl mx-auto px-4 sm:px-6` wrapper.
  - `Navbar` — logo "VISIT CIREMAI"; links Beranda/Tentang/Paket/Kontak; transparent over hero, solid (`bg-surface shadow`) after scrollY>40 via `useEffect` scroll listener; mobile hamburger toggling a menu panel; `<nav aria-label="Utama">`.
  - `HeroSection` — full-bleed `<section>` with background image + dark gradient overlay, trust badges row, H1 (`Jelajahi Keindahan` + block `Gunung Ciremai`), subheading, `GlassSearchBar`. Min-height ~`80vh`, content centered.

- [ ] **Step 1: Implement `Container.tsx`.**

- [ ] **Step 2: Implement `Navbar.tsx`** — scroll-state transition + accessible mobile menu (button `aria-expanded`, `aria-controls`).

- [ ] **Step 3: Implement `HeroSection.tsx`** — single `<h1>` (only H1 on page); overlay uses `bg-black/45`; text white; image `object-cover` with `alt=""` (decorative, since heading conveys meaning) or set as CSS background.

- [ ] **Step 4: Verify build** — `npm run build` PASS.

- [ ] **Step 5: Commit** (if git) — `feat: add Navbar and HeroSection`

---

### Task 7: PackageCard + PackageGrid + CategorySection

**Files:**
- Create: `src/components/package/PackageCard.tsx`, `src/components/package/PackageGrid.tsx`, `src/components/package/CategorySection.tsx`, `src/components/package/PackageCard.test.tsx`

**Interfaces:**
- Consumes: `Package` type, `formatRupiah`, `Button`, `Badge`
- Produces:
  - `PackageCard` — `props: { pkg: Package }`. Structure: image (fixed aspect `aspect-[4/3]`, `object-cover`, hover zoom), category badge, title (`<h3>`), 2-line clamped description, price (`formatRupiah(pkg.price)` + `/ pkg.priceUnit`), duration with clock icon, green "Booking" `Button`. Card `bg-surface rounded-xl border border-[--color-line]`, hover elevation.
  - `PackageGrid` — `props: { items: Package[] }` → `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
  - `CategorySection` — `props: { title: string; items: Package[] }` → `<section>` with `<h2>` + `PackageGrid`.

- [ ] **Step 1: Write failing test `PackageCard.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PackageCard } from './PackageCard'

const pkg = { id: 'x', title: 'Privat Trip', category: 'Pendakian Gunung Hutan',
  price: 2200000, priceUnit: 'Orang', duration: '2 hari 1 malam',
  image: '/img/placeholder.jpg', description: 'desc' } as const

describe('PackageCard', () => {
  it('shows title, formatted price and duration', () => {
    render(<PackageCard pkg={pkg} />)
    expect(screen.getByText('Privat Trip')).toBeInTheDocument()
    expect(screen.getByText(/Rp2\.200\.000/)).toBeInTheDocument()
    expect(screen.getByText(/2 hari 1 malam/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify fail** — FAIL.

- [ ] **Step 3: Implement `PackageCard.tsx`, `PackageGrid.tsx`, `CategorySection.tsx`.**

- [ ] **Step 4: Run test, verify pass** — PASS.

- [ ] **Step 5: Verify build** — `npm run build` PASS.

- [ ] **Step 6: Commit** (if git) — `feat: add PackageCard, PackageGrid, CategorySection`

---

### Task 8: Footer + App assembly

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: everything above; `packages` grouped by category
- Produces: full homepage. `App` renders `GlassFilter`, `Navbar`, `HeroSection`, intro block ("Paket dan Layanan Kami" `<h2>` + subtext), one `CategorySection` per category (filtering `packages` by category, in order: Pendakian Gunung Hutan, Petualangan Lainnya, Akomodasi, Transportasi, Sewa Alat), `Footer`.

- [ ] **Step 1: Implement `Footer.tsx`** — columns Tentang / Kontak (WhatsApp, Email, Instagram, Alamat) / Ikuti Kami; dark green bg; copyright line.

- [ ] **Step 2: Assemble `App.tsx`** — mount `GlassFilter` once; group data with a helper `packages.filter(p => p.category === c)`; render sections in fixed category order.

- [ ] **Step 3: Verify build** — `npm run build` PASS.

- [ ] **Step 4: Commit** (if git) — `feat: assemble homepage with footer`

---

### Task 9: Responsive, a11y, and final QA

**Files:**
- Modify: any component needing fixes surfaced during QA

**Interfaces:**
- Consumes: full app
- Produces: verified responsive + accessible homepage.

- [ ] **Step 1: Manual responsive check** — run `npm run dev`, view at 320px, 768px, 1280px. Confirm no horizontal overflow (`document.documentElement.scrollWidth <= clientWidth`), navbar hamburger works, glass search stacks on mobile, cards go 1→2→3 columns.

- [ ] **Step 2: A11y pass** — single H1; headings in order; every form field labeled; focus-visible rings present; buttons have text/aria-label; hero/card contrast sufficient; images have alt or `alt=""` if decorative.

- [ ] **Step 3: Reduced-motion check** — with OS reduced-motion on, confirm hover/scroll animations are suppressed.

- [ ] **Step 4: Run full test suite + build**

Run: `npx vitest run && npm run build`
Expected: all tests PASS, build succeeds, no console errors in dev.

- [ ] **Step 5: Commit** (if git) — `chore: responsive + a11y QA fixes`

---

## Self-Review Notes

- **Spec coverage:** Navbar (T6), Hero + glass search (T4/T5/T6), intro + all category sections (T7/T8), footer (T8), tokens/Kadwa (T1), data model (T2), responsive/a11y (T9), glass Figma-param mapping (T4). All spec sections covered.
- **Type consistency:** `Package`/`Category` defined in T2 and consumed unchanged in T7/T8; `formatRupiah` signature stable T2→T7; `LiquidGlass` API stable T4→T5.
- **Placeholders:** image assets are intentional placeholders per approved spec; all code steps contain real snippets or explicit component contracts.
- **Git note:** repo is not currently under git; commit steps are conditional. If the user wants version control, run `git init` before Task 1.
