# Hero & Footer Redesign — Design Spec

**Date:** 2026-05-16  
**Status:** Approved  
**Design Direction:** Take 2 — Organic Dark  
**Animation Approach:** Line Mask Reveal (GSAP)

---

## Context

The existing Hero and Footer share identical marquee watermarks, the same `#020617` dark gradient palette, gradient text fills (`from-white via-neutral-200 to-neutral-400`), and generic glassmorphism pill buttons. Both feel templated. The goal is a clean, modern redesign that reads as intentional and craft-forward — not AI-generated.

---

## Design Principles

- **No gradient text fills** — white or single flat accent only
- **No marquee watermarks** — remove from both hero and footer entirely
- **No heavy overlay gradients** — let the background breathe
- **Restrained accent color** — `#a0cbdb` used in max 1–2 places per section, not everywhere
- **No generic glassmorphism** — buttons are either solid white or subtle border-only
- **Animation serves content** — every animated element has a reason

---

## Hero Redesign

### Layout
Sticky, full-viewport-height card (existing `px-2 pb-2 md:px-4 md:pb-4` padding and scroll-shrink preserved).

### Background
- Base color: `#080b14`
- Single radial glow orb: `radial-gradient(ellipse 80% 60% at 50% 70%, rgba(160,203,219,0.06), transparent 70%)`
- No background image — clean, dark, atmospheric
- No marquee watermarks

### Top area — pill tag (replacing the heavy marquee)
- Centered pill: `Healthcare Monitoring · 2025`
- Style: `border: 1px solid rgba(255,255,255,0.10)`, `background: rgba(255,255,255,0.04)`, rounded-full, monospace 7–8px, wide letter-spacing, dim white

### Headline (3 lines)
```
Proactive          ← white, 900 weight, -2px tracking, large
Elderly Care.      ← white, same weight
Monitoring System. ← rgba(255,255,255,0.22) — intentionally faded
```
All three lines use overflow:hidden clip containers for the mask reveal animation.

### Descriptor
`Real-time · IoT · AI-Powered` — monospace, letter-spacing 4–5px, `rgba(255,255,255,0.30)`, small caps

### CTA Pair
- **Primary** — solid white fill, `color: #080b14`, rounded-full, `font-weight: 700`, text: `Get Started` → scrolls to `#product`
- **Secondary** — `border: 1px solid rgba(255,255,255,0.12)`, `background: rgba(255,255,255,0.04)`, dim text, rounded-full, text: `Watch Demo` → scrolls to footer and triggers video

### Bottom Bar
Three-column layout:
- **Left** — mini product stats: `24/7 Monitoring` and `<2s Alert Time` (stacked value + label)
- **Center** — `Scroll to explore` in monospace, wide tracking, dim
- **Right** — hidden on mobile, empty on desktop (clean)
- Separated by `border-top: 1px solid rgba(255,255,255,0.05)`

### Removed from current Hero
- All marquee watermarks (4 rows)
- Background image (`herotest1.webp`) and heavy gradient overlay
- Gradient text fills
- `time` state (dead code — never rendered)
- Mouse parallax on text container (adds complexity, not polish)
- `text-shimmer` shimmer animation on "Scroll to Explore"

### Kept from current Hero
- Sticky positioning + scroll-shrink `ScrollTrigger` (scale down, round bottom corners on scroll)
- `px-2 pb-2 md:px-4 md:pb-4` outer padding and card structure
- `rounded-b-[1.5rem]` rounding and `origin-top` scroll behavior

---

## Hero GSAP Animation Sequence

All triggered on mount, sequenced via a single GSAP timeline.

| Step | Target | From | To | Delay | Ease |
|------|--------|------|----|-------|------|
| 0 | Glow orb | `opacity:0, scale:0.6` | `opacity:1, scale:1` | 0s | `power2.out` |
| 1 | Pill tag | `opacity:0, y:8` | `opacity:1, y:0` | 0.1s | `power3.out` |
| 2 | Headline line 1 | `y:105%` (inside clip) | `y:0` | 0.2s | `power3.out` |
| 3 | Headline line 2 | `y:105%` | `y:0` | 0.32s | `power3.out` |
| 4 | Headline line 3 | `y:105%` | `y:0` | 0.44s | `power3.out` |
| 5 | Descriptor | `opacity:0` | `opacity:1` | 0.56s | `power2.out` |
| 6 | CTA group | `opacity:0, y:10` | `opacity:1, y:0` | 0.64s | `power3.out` |
| 7 | Stats (bottom-left) | `opacity:0` | `opacity:1` | 0.72s | `power2.out` |

Duration for line reveals: `0.75s`. Duration for fades: `0.5s`.

Scroll-exit (existing, keep): `ScrollTrigger` scrub that scales hero to `0.8`, fades, and adds bottom border-radius as user scrolls past it.

---

## Footer Redesign

### Layout
Full-viewport-height `<footer>`, existing `px-2 pt-2 md:px-4 md:pt-4` padding, top-rounded card. Video overlay mechanism fully preserved.

### Background
- Base: `#080b14`
- Radial glow: positioned at `50% 30%` (top-center) to distinguish from hero's `50% 70%` glow
- No background image (`footer_1BNW.webp` removed)
- No marquee watermarks

### Main CTA Content (center)
```
That's our story.     ← eyebrow: monospace, dim, letter-spacing
Wellness              ← white, 900 weight, very large
Simplified.           ← rgba(255,255,255,0.15) — strongly faded
```

### CTA Pair
- **Primary** — solid white, rounded-full, `Send a Message` → opens contact popup (existing event)
- **Secondary** — ghost border, rounded-full, `Watch Demo` → triggers existing video overlay

### Bottom Bar
Single `border-top` separator. Three zones:
- **Left** — `© 2025 SoterCare · All Rights Reserved` 
- **Center** (absolute, centered) — `support@sotercare.com`
- **Right** — phone number + Instagram icon + LinkedIn icon

### Footer GSAP Animation
Scroll-triggered entrance (existing structure, refined):
- Heading lines use same mask reveal on `scrollTrigger: start "top 80%"`
- Bottom bar fades up after heading, `-=0.4` overlap
- Glow orb blooms in when footer enters viewport

### Removed from current Footer
- Background image (`footer_1BNW.webp`) and its gradient overlay
- All 4 marquee watermark rows
- `bg-gradient-to-t from-[#020617]/90` heavy overlay

### Kept from current Footer
- Video overlay mechanism (`videoOverlayRef`, `iframeWrapperRef`, `backBtnRef`) — fully preserved
- `handleWatchClick` / `handleBackClick` logic
- Scroll-to-bottom behavior before video opens
- Back button with existing animation

---

## Shared Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-dark` | `#080b14` | Hero + footer background |
| `--accent` | `#a0cbdb` | Pill tag, glow tint — max 1 use per section |
| `--text-faded-1` | `rgba(255,255,255,0.22)` | Headline line 3 |
| `--text-faded-2` | `rgba(255,255,255,0.15)` | Footer "Simplified." |
| `--text-dim` | `rgba(255,255,255,0.30)` | Descriptors, bottom bar labels |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Structural dividers |

---

## Files to Modify

- `src/components/Hero.tsx` — full rewrite of JSX + GSAP animations
- `src/components/Footer.tsx` — rewrite background/marquee/typography, preserve video logic
- `src/app/globals.css` — no changes needed (existing keyframes not used after redesign)

---

## Out of Scope

- Middle sections (Mission, Product, Features, Pricing, FAQ, Team) — untouched
- Navbar — untouched
- Dashboard — untouched
- Any new dependencies — GSAP is already installed
