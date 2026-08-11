# CLAUDE.md --- VisitCiremai Website Redesign

## 1. Project Context

This project is a redesign of the **VisitCiremai** website, a tourism
platform focused on Mount Ciremai and surrounding tourism services.

The current website presents: - Tourism packages around Gunung
Ciremai. - Hiking and outdoor activities. - Accommodation. -
Transportation. - Equipment rental. - Package detail pages. - A
booking/request form for customers.

The redesign must improve the visual quality, hierarchy, usability,
responsiveness, and conversion flow while preserving the core business
information and functionality.

Two current UI references are provided in the project context:

1.  **Homepage**
    -   Header/navigation.
    -   Hero section promoting Gunung Ciremai.
    -   Package search/filter.
    -   Package/service categories.
    -   Tourism package cards.
    -   Accommodation section.
    -   Transportation section.
    -   Equipment rental section.
    -   Footer.
2.  **Package Detail / Booking Page**
    -   Navigation.
    -   Package title.
    -   Large package image.
    -   Package description.
    -   Included services/facilities.
    -   Price and duration.
    -   Booking form.
    -   Customer information fields.
    -   Booking CTA.
    -   Footer.

------------------------------------------------------------------------

## 2. Main Redesign Goal

Create a modern, professional, trustworthy, and visually appealing
tourism website for VisitCiremai.

The website should feel like a **modern Indonesian outdoor tourism /
travel booking platform**, not like a generic corporate website.

The redesign should communicate:

-   Nature
-   Adventure
-   Local tourism
-   Professional tour services
-   Safety
-   Trust
-   Easy booking
-   Premium but accessible travel experience

### Primary objective

Make visitors quickly understand:

1.  What VisitCiremai offers.
2.  Which destinations/packages are available.
3.  How much the packages cost.
4.  What is included.
5.  How to make a booking.
6.  How to contact the provider.

------------------------------------------------------------------------

# 3. Design Direction

## Visual Style

Use a modern outdoor/travel aesthetic.

Recommended characteristics:

-   Clean
-   Spacious
-   Nature-inspired
-   Modern
-   Friendly
-   Professional
-   Premium but not luxurious
-   Strong photography
-   Clear typography
-   Rounded cards/components
-   Subtle shadows
-   Soft borders
-   Strong CTA buttons

Avoid:

-   Excessive gradients.
-   Excessive animations.
-   Overly saturated green.
-   Crowded layouts.
-   Tiny typography.
-   Too many decorative elements.
-   Excessive rounded elements that make the UI look childish.
-   Generic dashboard-like styling.
-   Unnecessary glassmorphism.

------------------------------------------------------------------------

# 4. Brand Direction

The existing VisitCiremai identity uses green as the dominant visual
direction.

Use green as the primary brand color, but create a more sophisticated
palette.

Suggested palette:

``` text
Primary Green:       #176B3A
Dark Green:          #0D3B24
Secondary Green:     #2E8B57
Accent Green:        #16A085
Light Green:         #EAF5EE

Background:          #F7F8F5
Surface:             #FFFFFF

Text Primary:        #17251D
Text Secondary:      #66736B
Text Muted:          #8A948E

Border:              #E4E9E5

Accent Warm:
Sand / Cream:        #F4EBDD
Orange / Gold CTA:   #F4B942
```

These values are a starting point. If the existing project already has
an established brand color, preserve brand consistency rather than
blindly replacing it.

------------------------------------------------------------------------

# 5. Typography

Use a modern sans-serif font.

Preferred options:

-   Kadwa

Recommended hierarchy:

``` text
Hero Heading:
Large, bold, high contrast

Section Heading:
Bold / semibold

Card Title:
Semibold

Body:
Regular

Metadata:
Small / medium
```

Typography must remain highly readable on desktop and mobile.

Do not use excessively small text just to fit large amounts of package
information.

------------------------------------------------------------------------

# 6. Homepage Redesign

## 6.1 Navbar

The navbar should be simple and professional.

Suggested structure:

``` text
[VisitCiremai Logo]

Beranda
Paket
Destinasi
Tentang Kami
Kontak

[Pesan Sekarang]
```

Requirements:

-   Responsive.
-   Sticky on scroll if appropriate.
-   Transparent/overlay style can be used over the hero section.
-   When scrolling, transition to a solid background.
-   Mobile menu must be accessible.
-   CTA should be visually prominent.

Do not overcrowd the navbar.

------------------------------------------------------------------------

# 7. Hero Section

The hero should immediately communicate the destination.

Suggested content:

``` text
Jelajahi Keindahan
Gunung Ciremai

Temukan pengalaman wisata alam, pendakian,
dan petualangan terbaik di kawasan Ciremai.

[ Jelajahi Paket ]
[ Lihat Destinasi ]
```

Use a strong full-width nature image.

Recommended:

-   Large mountain photograph.
-   Dark subtle overlay for readability.
-   Strong heading.
-   Short supporting text.
-   Primary CTA.
-   Secondary CTA.

Optional supporting information:

``` text
✓ Guide Profesional
✓ Paket Terpercaya
✓ Pengalaman Berkesan
```

The hero should not contain too much text.

------------------------------------------------------------------------

# 8. Search / Package Finder

The current homepage has a green search box.

Redesign it into a modern booking/search component.

Possible fields:

``` text
Cari destinasi / paket
Kategori
Durasi
Harga
[ Cari Paket ]
```

On desktop, use a horizontal search bar.

On mobile, stack fields vertically.

The search component should be visually distinct without becoming
oversized.

------------------------------------------------------------------------

# 9. Package Listing

Create a reusable package card component.

Recommended card structure:

``` text
┌──────────────────────────┐
│                          │
│        Image             │
│                          │
├──────────────────────────┤
│ Category / Badge         │
│ Package Name             │
│ Short description        │
│                          │
│ ★ Rating     Duration    │
│                          │
│ Rp xxx.xxx / orang       │
│                          │
│ [ Lihat Detail ]         │
└──────────────────────────┘
```

Package cards must have:

-   Consistent image ratio.
-   Clear title.
-   Short description.
-   Price.
-   Duration.
-   Category.
-   CTA.
-   Hover interaction.

Do not display excessive description text inside cards.

Use a "Lihat Detail" or "Pesan Sekarang" CTA depending on the user flow.

------------------------------------------------------------------------

# 10. Homepage Sections

Recommended order:

``` text
Navbar
↓
Hero
↓
Package Search
↓
Featured Packages
↓
Popular Destinations
↓
Why VisitCiremai?
↓
Experience / Activities
↓
Testimonials
↓
CTA Banner
↓
Footer
```

The existing category sections such as:

-   Pendakian Gunung Hutan
-   Petualangan Lainnya
-   Akomodasi
-   Transportasi
-   Sewa Alat

can remain as business categories, but they should be reorganized into a
more coherent information architecture.

Avoid presenting every category as a long list of cards without
hierarchy.

------------------------------------------------------------------------

# 11. Category / Service Sections

Possible category structure:

## Pendakian

Examples:

-   Private Trip Pendakian
-   Open Trip
-   Hiking Guide
-   Camping Package

## Adventure

Examples:

-   Waterfall Trip
-   Sport Hiking
-   Rock Climbing
-   Waterfall Rappelling

## Accommodation

Examples:

-   Guest House
-   Homestay
-   Camping Area

## Transportation

Examples:

-   Pickup
-   Jeep
-   Local Transportation

## Equipment Rental

Examples:

-   Tent
-   Sleeping Bag
-   Hiking Equipment

Each category should have:

-   Section heading.
-   Short supporting description.
-   3--4 featured items.
-   "Lihat Semua" link where appropriate.

------------------------------------------------------------------------

# 12. Why VisitCiremai?

Add a trust-building section.

Possible items:

``` text
Guide Berpengalaman
Guide lokal yang memahami medan Ciremai.

Paket Lengkap
Kebutuhan perjalanan dapat dipersiapkan dalam satu tempat.

Booking Mudah
Proses pemesanan sederhana dan cepat.

Layanan Lokal
Mendukung pelaku wisata dan masyarakat lokal.
```

Use simple icons.

------------------------------------------------------------------------

# 13. Testimonials

Add customer testimonials to improve trust.

Example structure:

``` text
"Pengalaman pendakian yang sangat menyenangkan.
Guide-nya ramah dan sangat membantu."

Nama Customer
Trip / Paket
★★★★★
```

Use 3 testimonials on desktop and carousel/slider on mobile if
necessary.

Do not fabricate real customer claims if the project has no testimonial
data.

If testimonial data does not exist, build the component with
mock/placeholder data clearly separated from production data.

------------------------------------------------------------------------

# 14. CTA Section

Near the bottom of the homepage, add a strong conversion section.

Example:

``` text
Siap Menjelajahi Ciremai?

Temukan paket perjalanan yang sesuai dengan
kebutuhanmu dan mulai petualanganmu bersama VisitCiremai.

[ Lihat Semua Paket ]
```

Use a beautiful nature background image or clean green section.

------------------------------------------------------------------------

# 15. Footer

Footer should contain:

``` text
VisitCiremai

Tentang VisitCiremai
Platform wisata dan perjalanan
untuk menjelajahi keindahan Ciremai.

Navigasi
- Beranda
- Paket
- Destinasi
- Tentang Kami
- Kontak

Layanan
- Pendakian
- Akomodasi
- Transportasi
- Sewa Alat

Kontak
- WhatsApp
- Email
- Instagram
- Alamat

© VisitCiremai
```

Keep the footer clean and compact.

------------------------------------------------------------------------

# 16. Package Detail Page

The current package detail page contains:

-   Package title.
-   Large image.
-   Description.
-   Include list.
-   Price.
-   Duration.
-   Booking form.

The redesign should make the package information easier to scan.

Recommended layout:

``` text
Breadcrumb
↓
Package Title
Category / Rating / Location
↓
Large Image Gallery
↓
┌───────────────────────┬───────────────────┐
│ Package Information   │ Booking Card      │
│                       │                   │
│ Description           │ Price             │
│ Included              │ Duration          │
│ Itinerary             │ People            │
│ Requirements          │ Date              │
│                       │ Customer info     │
│                       │ [Pesan Sekarang]  │
└───────────────────────┴───────────────────┘
```

On mobile, the booking card should appear after the essential package
information or become a sticky bottom CTA.

------------------------------------------------------------------------

# 17. Package Detail Content

The detail page should clearly separate:

## Overview

Short explanation of the package.

## What's Included

Use a clean checklist:

``` text
✓ Guide bersertifikat
✓ Local porter
✓ Dokumentasi perjalanan
✓ Tiket masuk
✓ Simaksi
✓ Booking online
✓ Cek kesehatan
✓ Tenda
✓ Matras
✓ Kompor
✓ Cooking set
```

Do not use plain text with repeated "+" symbols.

------------------------------------------------------------------------

# 18. Itinerary

If itinerary data exists, present it as a timeline.

Example:

``` text
06:00
Meeting Point

07:00
Registrasi dan persiapan

08:00
Mulai pendakian

12:00
Istirahat

15:00
Tiba di camp

...
```

Use a timeline component rather than a large paragraph.

------------------------------------------------------------------------

# 19. Pricing

Price must be highly visible.

Example:

``` text
Mulai dari

Rp2.200.000
/person

2 Hari 1 Malam
```

If the package price depends on group size, clearly explain the pricing
rule.

Avoid ambiguous pricing.

------------------------------------------------------------------------

# 20. Booking Form

The booking form should be simple and trustworthy.

Fields:

``` text
Nama Lengkap *
No. HP / WhatsApp *
Jumlah Orang *
Tanggal Perjalanan *
Catatan Tambahan
```

Optional:

``` text
Email
Meeting Point
Special Request
```

CTA:

``` text
Pesan Sekarang
```

Validation must be clear.

Error messages should be displayed close to the relevant field.

------------------------------------------------------------------------

# 21. Booking UX

The booking flow should make it clear that submitting the form is a
booking/request process.

After submission:

``` text
Booking berhasil dikirim!

Terima kasih. Tim VisitCiremai akan
menghubungi Anda untuk konfirmasi.

[ Hubungi WhatsApp ]
```

If the current backend uses a different process, preserve that process.

Do not invent payment functionality unless it already exists or is
explicitly requested.

------------------------------------------------------------------------

# 22. Responsive Design

The website must be fully responsive.

## Desktop

Use:

-   Max-width content container.
-   3-column package grid where appropriate.
-   Two-column package detail layout.
-   Large hero image.
-   Comfortable whitespace.

## Tablet

Use:

-   2-column card grid.
-   Flexible content widths.
-   Simplified navigation.

## Mobile

Use:

-   Single-column cards.
-   Hamburger menu.
-   Large touch targets.
-   Sticky booking CTA when appropriate.
-   Horizontally scrollable category chips if useful.
-   Images optimized for mobile.
-   No horizontal overflow.

Minimum supported layout width:

``` text
320px
```

------------------------------------------------------------------------

# 23. Accessibility

The redesign must follow basic accessibility principles.

Requirements:

-   Semantic HTML.
-   Proper heading hierarchy.
-   Labels for form fields.
-   Keyboard navigation.
-   Visible focus states.
-   Sufficient color contrast.
-   Meaningful alt text for images.
-   Buttons must have clear labels.
-   Do not communicate information using color alone.

------------------------------------------------------------------------

# 24. Animation

Use subtle motion only.

Recommended:

-   Fade-in sections.
-   Card hover elevation.
-   Image zoom on hover.
-   Navbar transition.
-   Smooth scrolling.
-   Button hover feedback.

Avoid:

-   Excessive parallax.
-   Large bouncing animations.
-   Long entrance animations.
-   Animations that block interaction.

Animations should respect `prefers-reduced-motion`.

------------------------------------------------------------------------

# 25. Image Guidelines

Photography is one of the most important parts of the VisitCiremai
experience.

Prioritize:

-   Gunung Ciremai.
-   Hiking.
-   Camp activities.
-   Waterfalls.
-   Local guides.
-   Outdoor activities.
-   Local transportation.
-   Accommodation.

Images should:

-   Have consistent aspect ratios.
-   Use `object-fit: cover`.
-   Be optimized.
-   Have appropriate alt text.
-   Avoid distortion.

Do not replace existing real business images with generic stock images
unless explicitly requested.

------------------------------------------------------------------------

# 26. Component Architecture

Create reusable components instead of duplicating markup.

Suggested components:

``` text
components/
├── layout/
│   ├── Navbar
│   ├── Footer
│   └── Container
│
├── hero/
│   └── HeroSection
│
├── package/
│   ├── PackageCard
│   ├── PackageGrid
│   ├── PackageSearch
│   ├── PackageHeader
│   ├── PackageGallery
│   ├── PackageOverview
│   ├── PackageIncludes
│   ├── PackageItinerary
│   └── BookingCard
│
├── sections/
│   ├── FeaturedPackages
│   ├── PopularDestinations
│   ├── WhyVisitCiremai
│   ├── Testimonials
│   └── CTASection
│
└── ui/
    ├── Button
    ├── Badge
    ├── Input
    ├── Select
    ├── Textarea
    ├── Modal
    └── Toast
```

Adapt this structure to the existing framework rather than restructuring
the entire project unnecessarily.

------------------------------------------------------------------------

# 27. Data Model Expectations

Package information should ideally be data-driven.

Example:

``` js
{
  id: "private-trip-pendakian-ciremai-via-apuy",
  title: "Privat Trip Pendakian Gunung Ciremai Via Apuy",
  category: "Pendakian",
  location: "Via Apuy",
  price: 2200000,
  duration: "2 Hari 1 Malam",
  image: "...",
  description: "...",
  includes: [
    "Guide bersertifikat",
    "Local porter",
    "Dokumentasi perjalanan"
  ]
}
```

Do not hardcode the same package card markup repeatedly.

------------------------------------------------------------------------

# 28. Technical Rules for the AI Agent

Before modifying the code:

1.  Inspect the existing project structure.
2.  Identify the framework and build system.
3.  Identify existing routing.
4.  Identify existing API/data sources.
5.  Identify existing components.
6.  Identify existing CSS/Tailwind configuration.
7.  Identify existing assets.
8.  Identify how booking currently works.

Do not replace the existing architecture without a clear reason.

### Important

The redesign is primarily a **UI/UX improvement**.

Do not break:

-   Existing API calls.
-   Existing database integration.
-   Existing authentication.
-   Existing booking logic.
-   Existing form submission.
-   Existing routing.
-   Existing business rules.

If functionality already exists, preserve it while improving its
presentation.

------------------------------------------------------------------------

# 29. Existing Business Information

From the current package detail UI, an example package is:

**Privat Trip Pendakian Gunung Ciremai Via Apuy**

Example information:

``` text
Price:
Rp2.200.000

Duration:
2 Hari 1 Malam

Includes:
- Guide (Sertifikasi)
- Local Porter
- Dokumentasi Perjalanan
- Tiket Masuk
- Simaksi
- Booking Online
- Cek Kesehatan
- ROP / Rencana Operasional Perjalanan
- Gear Set Camp Personal & Kelompok
- Tenda
- Matras
- Kompor
- Cooking Set
- Lampu tenda
- Sleeping Bag
- Kursi + Meja
- Flysheet
- Makan 6x By Request
- Kopi Khas Majalengka
- Camplian
- Pick Up
- Penginapan
```

Additional notes shown in the existing page indicate that:

``` text
- Itinerary can be shared according to operational requirements.
- The team is open to questions.
- Price can change depending on customer requests.
```

These business rules should not be changed without explicit instruction.

------------------------------------------------------------------------

# 30. Content Tone

Use Indonesian language.

Tone:

-   Friendly
-   Professional
-   Informative
-   Adventurous
-   Local
-   Trustworthy

Avoid overly formal corporate language.

Example:

Good:

> Temukan pengalaman mendaki Ciremai bersama guide lokal berpengalaman.

Avoid:

> Kami menyediakan layanan jasa perjalanan wisata dengan kualitas
> terbaik.

The content should feel human and relevant to outdoor travelers.

------------------------------------------------------------------------

# 31. UX Priorities

Prioritize the following in order:

### 1. Clarity

Users must immediately understand what is being offered.

### 2. Discoverability

Users should easily find packages and destinations.

### 3. Trust

Use:

-   Real images.
-   Reviews.
-   Guide information.
-   Clear pricing.
-   Clear inclusions.
-   Contact information.

### 4. Conversion

Make booking CTAs obvious.

### 5. Mobile usability

A significant portion of tourism traffic is expected to come from mobile
devices.

------------------------------------------------------------------------

# 32. SEO

Use proper semantic structure.

Homepage:

``` text
H1:
Jelajahi Keindahan Gunung Ciremai

H2:
Paket Wisata
Destinasi Populer
Mengapa VisitCiremai?
```

Package detail:

``` text
H1:
Privat Trip Pendakian Gunung Ciremai Via Apuy

H2:
Tentang Paket
Yang Termasuk
Itinerary
Harga
Cara Pemesanan
```

Use descriptive page titles and metadata.

If the project already has SEO infrastructure, preserve it.

------------------------------------------------------------------------

# 33. Performance

Do not sacrifice performance for visual effects.

Prioritize:

-   Image optimization.
-   Lazy loading.
-   Code splitting where appropriate.
-   Avoid unnecessary dependencies.
-   Avoid oversized JavaScript bundles.
-   Avoid loading multiple font families unnecessarily.

------------------------------------------------------------------------

# 34. Definition of Done

The redesign is considered complete when:

-   [ ] Homepage has a modern visual hierarchy.
-   [ ] Navbar is responsive.
-   [ ] Hero section clearly communicates VisitCiremai.
-   [ ] Package cards are reusable and consistent.
-   [ ] Package search/filter is usable.
-   [ ] Package categories are organized clearly.
-   [ ] Package detail page is easy to scan.
-   [ ] Booking form is visually clear.
-   [ ] Booking CTA is prominent.
-   [ ] Mobile layout works from 320px upward.
-   [ ] No horizontal overflow.
-   [ ] Existing business functionality still works.
-   [ ] Existing package data is preserved.
-   [ ] Images are responsive and optimized.
-   [ ] Accessibility basics are implemented.
-   [ ] Loading/error states are handled.
-   [ ] Hover/focus states are implemented.
-   [ ] No unnecessary console errors.
-   [ ] Production build succeeds.

------------------------------------------------------------------------

# 35. AI Agent Working Rules

When implementing this redesign:

### DO

-   Inspect before changing.
-   Reuse existing components when possible.
-   Create reusable components for repeated UI.
-   Preserve existing business logic.
-   Keep responsive behavior in mind.
-   Use real existing assets whenever available.
-   Maintain consistent spacing and typography.
-   Test desktop and mobile layouts.
-   Check the browser console for errors.
-   Run the project's existing lint/build/test commands after major
    changes.

### DON'T

-   Do not rewrite the entire application unnecessarily.
-   Do not remove working backend functionality.
-   Do not invent new business rules.
-   Do not invent payment functionality.
-   Do not replace real package data with random data.
-   Do not use excessive animations.
-   Do not create inconsistent card designs.
-   Do not make the UI desktop-only.
-   Do not introduce a new library when existing dependencies already
    solve the problem.
-   Do not modify environment variables or production configuration
    unless necessary.

------------------------------------------------------------------------

# 36. Implementation Strategy

Work in this order:

``` text
1. Inspect existing codebase
        ↓
2. Understand current routes and data
        ↓
3. Identify reusable components
        ↓
4. Establish design tokens
        ↓
5. Redesign global layout/navbar
        ↓
6. Redesign homepage
        ↓
7. Redesign package cards
        ↓
8. Redesign package detail page
        ↓
9. Redesign booking form
        ↓
10. Responsive/mobile refinement
        ↓
11. Accessibility refinement
        ↓
12. Performance refinement
        ↓
13. Run build/lint/tests
        ↓
14. Final visual QA
```

Do not attempt to change every part of the application simultaneously.

------------------------------------------------------------------------

# 37. Final Design Principle

The final VisitCiremai website should feel like:

> **A trustworthy modern local tourism platform that makes discovering
> and booking Ciremai adventures feel easy, exciting, and
> professional.**

The interface should emphasize **beautiful nature photography, clear
package information, strong calls-to-action, and a frictionless booking
experience**.

When making design decisions, prefer:

``` text
Clarity > Decoration
Usability > Trends
Consistency > Novelty
Real Content > Placeholder Content
Performance > Heavy Effects
Conversion > Visual Complexity
```
