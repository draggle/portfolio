# Mobile Nav Drawer Design

**Date:** 2026-06-19  
**Status:** Approved

## Overview

Replace the wrapping mobile nav links with a hamburger button that opens a slide-in drawer from the right. Desktop nav is unchanged. A new `MobileNav.tsx` client component handles all mobile-specific behaviour; `Nav.tsx` remains a server component.

## Architecture

```
src/components/
  Nav.tsx         — server component, unchanged except: renders MobileNav + hides nav-links on mobile
  MobileNav.tsx   — new client component: hamburger button, drawer, backdrop, links
```

`Nav.tsx` renders both the existing `nav-links` div (desktop) and `<MobileNav />`. CSS controls which is visible at each breakpoint.

## MobileNav Component

**State:** single `isOpen: boolean` via `useState`.

**Elements:**
- Hamburger button — three horizontal lines icon, visible only on mobile (hidden ≥640px). Swaps to ✕ when `isOpen` is true.
- Backdrop — fixed full-screen semi-transparent overlay, `opacity: 0.4`, tap closes drawer.
- Drawer panel — fixed, right-aligned, `width: 75vw`, `max-width: 300px`, slides in from `x: 100%` to `x: 0`.

**Links in drawer:** about (`/#about`), experience (`/experience`), projects (`/projects`), blog (`/blog`), contact (`/contact`), terminal button (`TermNavLink`), dark mode toggle (`DarkModeToggle`). Each link closes the drawer `onClick`.

**Body scroll lock:** `document.body.style.overflow = 'hidden'` when open, restored on close. Applied via `useEffect` keyed to `isOpen`.

## Animation

Using framer-motion `AnimatePresence` + `motion.div`:

- **Drawer:** `initial={{ x: '100%' }}` → `animate={{ x: 0 }}` → `exit={{ x: '100%' }}`, `transition: { duration: 0.25, ease: 'easeOut' }`
- **Backdrop:** `initial={{ opacity: 0 }}` → `animate={{ opacity: 0.4 }}` → `exit={{ opacity: 0 }}`, same duration

## CSS Changes (`globals.css`)

```css
/* hide desktop links on mobile */
@media (max-width: 640px) {
  .nav-links { display: none; }
}

/* hide hamburger on desktop */
.hamburger-btn { display: none; }
@media (max-width: 640px) {
  .hamburger-btn { display: flex; ... }
}

/* drawer and backdrop */
.mobile-drawer { ... }   /* right-aligned panel, z-index: 150 */
.mobile-backdrop { ... } /* fixed overlay, z-index: 149, background: var(--text) */
```

Z-index ladder: scroll progress bar (200) > hamburger / drawer (150) > nav (100).

## Constraints

- No new dependencies — framer-motion already installed
- Dark mode works automatically via CSS variables
- Desktop nav (≥640px) is completely unchanged
- `Nav.tsx` remains a server component — `MobileNav.tsx` carries the `'use client'` directive
- Body scroll lock cleaned up on unmount (useEffect return)
