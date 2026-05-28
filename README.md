# Grayson's Services — Homepage

Premium hardscaping website built with **Next.js 14 App Router**, **Tailwind CSS**, and **TypeScript**.

---

## File Structure

```
graysons-services/
├── app/
│   ├── globals.css          # All animations, CSS vars, utility classes
│   ├── layout.tsx           # Root layout with metadata + Google Fonts
│   └── page.tsx             # Homepage — assembles all sections
│
├── components/
│   ├── Header.tsx           # Sticky nav with scroll glass effect + mobile overlay
│   ├── Hero.tsx             # Full-screen parallax hero with animated headline
│   ├── MarqueeStrip.tsx     # Scrolling services ticker (gold strip)
│   ├── About.tsx            # Story, values modules, credentials
│   ├── Gallery.tsx          # Filterable masonry project gallery
│   ├── Testimonials.tsx     # Featured quote + card testimonials grid
│   ├── Contact.tsx          # Split contact/form section
│   └── Footer.tsx           # Links, social, legal
│
└── tailwind.config.ts       # Extended theme: custom colors + fonts
```

---

## Setup

1. **Copy files** into your Next.js project root (merge with existing `app/` and create `components/` folder)

2. **Install fonts** — already handled via Google Fonts in `layout.tsx` (Cormorant Garamond + DM Sans)

3. **Tailwind** — merge `tailwind.config.ts` with your existing config. No extra plugins required.

4. **Images** — currently using Unsplash URLs for placeholders. Replace with your actual project photography by swapping the `backgroundImage` and `src` props throughout the components.

5. **Run dev** — `npm run dev` and navigate to `localhost:3000`

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--stone-darkest` | `#1a1714` | Dark sections bg, headings |
| `--stone-dark` | `#2d2926` | Card backgrounds, borders |
| `--stone-mid` | `#5c5550` | Body text |
| `--stone-light` | `#a39890` | Muted labels, secondary text |
| `--gold` | `#b8975a` | Primary accent, CTAs |
| `--white` | `#faf8f5` | Page background |

**Display font:** Cormorant Garamond (light/italic for elegance)  
**Body font:** DM Sans (clean, legible, professional)

---

## Animations

All scroll animations are CSS-only via `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` classes with an `IntersectionObserver` in each section component. No external animation library needed.

Key effects:
- **Hero** — word-by-word clip-path text reveal, parallax image
- **Marquee** — infinite CSS `translateX` loop
- **Cards** — image zoom + overlay fade on hover  
- **Testimonials** — lift + shadow on hover
- **Buttons** — sliding fill via `::before` pseudo-element

---

## Customisation Checklist

- [ ] Replace Unsplash placeholder images with real project photos
- [ ] Update phone number and email in `Header.tsx` and `Contact.tsx`
- [ ] Update service area text in `Contact.tsx`
- [ ] Add real Google/Houzz review links in `Testimonials.tsx`
- [ ] Wire up the contact form to your backend (Formspree, Resend, etc.)
- [ ] Add real social media links in `Footer.tsx`
- [ ] Update stat numbers in `Hero.tsx` (projects completed, satisfaction %, awards)