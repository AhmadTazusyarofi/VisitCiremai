# VisitCiremai Homepage Redesign — Design Spec

**Date:** 2026-08-08
**Status:** Approved (design), pending spec review

## 1. Goal

Rebuild the VisitCiremai homepage as a fresh React app matching the Figma
mockup (`MacBook Pro 16_ - 1.png`): dark cinematic mountain hero with a
frosted "liquid glass" search bar, clean white body, Kadwa serif type, and
data-driven package cards with green "Booking" pills. Replaces the old
heavy-green layout (`image.png`).

Greenfield: project folder is empty except images + CLAUDE.md. No backend
or existing code to preserve.

## 2. Scope

**In scope:** Homepage only.
- Navbar (transparent-over-hero → solid on scroll, responsive hamburger)
- Hero (full-bleed image + overlay, trust badges, H1, subheading, glass search bar)
- "Paket dan Layanan Kami" intro
- Category sections: Pendakian Gunung Hutan, Petualangan Lainnya, Akomodasi,
  Transportasi, Sewa Alat — each a grid of package cards
- Footer (Tentang / Kontak / Ikuti Kami)

**Out of scope (future):** Package-detail / booking page. Components structured
so it can be added later without rework.

## 3. Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Font: **Kadwa** (serif, weights 400/700), self-hosted via `@fontsource/kadwa`
- No other runtime dependencies unless needed

## 4. Design Tokens

| Token | Value | Use |
|-------|-------|-----|
| Primary Green | `#176B3A` | Booking pills, links, accents |
| Dark Green | `#0D3B24` | hover/pressed |
| Background | `#F7F8F5` | page body |
| Surface | `#FFFFFF` | cards |
| Text Primary | `#17251D` | headings/body |
| Text Secondary | `#66736B` | metadata |
| Border | `#E4E9E5` | card/borders |
| Hero overlay | dark gradient over photo | hero readability |

All headings + UI text use Kadwa (mockup shows serif throughout).

## 5. Liquid Glass Search Bar (centerpiece)

Reusable `LiquidGlass` wrapper applied to: the "Cari destinasi atau paket…"
input, the "Petualangan Lainnya" dropdown, and the round search button.

Figma params → CSS/SVG mapping:
- **Frost 68** → `backdrop-filter: blur(~14px) saturate(1.4)`
- **Refraction 80 + Depth 83** → SVG `feTurbulence` (low freq) + `feDisplacementMap`
  (scale from refraction/depth) referenced via `backdrop-filter: url(#glass-filter)`
- **Dispersion 63** → subtle per-RGB-channel displacement offset (chromatic edge)
- **Splay 0** → tight highlight; add 1px light inner border + soft inner highlight
  + drop shadow for the glass-pane look

**Browser support:** Chromium renders full SVG refraction. Firefox/Safari don't
support `url()` in `backdrop-filter` → graceful fallback to frost blur + tint +
border, still reads as clean glass. Implemented via `@supports` / layered styles.

Respects `prefers-reduced-motion` (glass is static; no animated turbulence).

## 6. Component Architecture

```
src/
├── components/
│   ├── layout/    Navbar, Footer, Container
│   ├── hero/      HeroSection, GlassSearchBar
│   ├── package/   PackageCard, PackageGrid, CategorySection
│   └── ui/        LiquidGlass, Button, Badge
├── data/          packages.ts   (typed array — single source of card data)
├── types/         package.ts    (Package type)
├── App.tsx
├── main.tsx
└── index.css      (Tailwind + tokens + Kadwa + glass SVG defs)
```

### Data model (`types/package.ts`)
```ts
type Package = {
  id: string;
  title: string;
  category: string;      // section grouping
  location?: string;
  price: number;         // rupiah
  priceUnit: string;     // "Orang" | "Unit" | ...
  duration: string;      // "2 hari 1 malam" | "Unlimited"
  image: string;         // placeholder path for now
  description: string;
  includes?: string[];
};
```

`data/packages.ts` holds all packages (ported from old content). Cards + sections
render from this array — no duplicated markup. Real photos swapped in later by
editing image paths here.

## 7. Responsive & Accessibility

- Mobile-first, works from 320px, no horizontal overflow
- Desktop 3-col card grid → tablet 2-col → mobile 1-col
- Navbar collapses to hamburger; large touch targets
- Semantic HTML, proper heading hierarchy (single H1), labeled form fields,
  visible focus states, alt text, sufficient contrast
- `prefers-reduced-motion` respected for hover/transition motion

## 8. Non-Goals / Constraints

- No payment functionality
- No backend/API integration (static data; connectable later)
- Placeholder mountain/trip images now; real business photos later
- No excessive animation — subtle hover elevation, image zoom, navbar transition

## 9. Definition of Done

- [ ] `npm run build` succeeds, no console errors
- [ ] Hero + glass search bar match mockup; glass has Chromium refraction + safe fallback
- [ ] All category sections render from `packages.ts`
- [ ] Responsive 320px+, no horizontal overflow
- [ ] Kadwa loaded and applied
- [ ] Accessibility basics in place
