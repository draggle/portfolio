# Mobile Nav Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hamburger button to the mobile nav that opens a framer-motion slide-in drawer from the right, replacing the current wrapping nav links on small screens.

**Architecture:** A new `MobileNav.tsx` client component owns the hamburger button, animated backdrop, and drawer panel with all nav links. `Nav.tsx` remains a server component and simply renders `<MobileNav />` alongside the existing desktop `nav-links` div. CSS hides each at the appropriate breakpoint.

**Tech Stack:** Next.js 16 App Router, framer-motion (already installed), custom CSS in globals.css

## Global Constraints

- No new dependencies — framer-motion already in package.json
- `Nav.tsx` must remain a server component — `'use client'` goes only in `MobileNav.tsx`
- Breakpoint: 640px (matches existing mobile breakpoint in globals.css)
- Z-index ladder: scroll progress bar (200) > drawer/hamburger (150) > backdrop (149) > nav (100)
- CSS variables only — no hardcoded colors
- Desktop nav (≥641px) must be completely unchanged

---

### Task 1: Create MobileNav component, add CSS, wire into Nav

**Files:**
- Create: `src/components/MobileNav.tsx`
- Modify: `src/components/Nav.tsx`
- Modify: `src/app/globals.css` — append mobile nav CSS section at the end

**Interfaces:**
- Produces: `MobileNav` default export — no props; self-contained

- [ ] **Step 1: Create src/components/MobileNav.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import DarkModeToggle from './DarkModeToggle'
import TermNavLink from './TermNavLink'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const close = () => setIsOpen(false)

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <nav className="mobile-drawer-links">
                <a href="/#about" className="mobile-drawer-link" onClick={close}>about</a>
                <a href="/experience" className="mobile-drawer-link" onClick={close}>experience</a>
                <Link href="/projects" className="mobile-drawer-link" onClick={close}>projects</Link>
                <Link href="/blog" className="mobile-drawer-link" onClick={close}>blog</Link>
                <Link href="/contact" className="mobile-drawer-link" onClick={close}>contact</Link>
                <div className="mobile-drawer-actions">
                  <TermNavLink />
                  <DarkModeToggle />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Update src/components/Nav.tsx to import and render MobileNav**

Replace the entire file with:

```tsx
import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'
import TermNavLink from './TermNavLink'
import ScrambleLogo from './ScrambleLogo'
import MobileNav from './MobileNav'

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-logo"><ScrambleLogo text="ayans.dev" /></Link>
      <div className="nav-links">
        <a href="/#about" className="nav-section">about</a>
        <a href="/experience">experience</a>
        <Link href="/projects">projects</Link>
        <Link href="/blog">blog</Link>
        <Link href="/contact">contact</Link>
        <TermNavLink />
        <DarkModeToggle />
      </div>
      <MobileNav />
    </nav>
  )
}
```

- [ ] **Step 3: Append mobile nav CSS to the end of src/app/globals.css**

Add this block at the very end of the file:

```css
/* ── MOBILE NAV DRAWER ── */
.hamburger-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 4px;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  z-index: 150;
}
.hamburger-btn:hover { color: var(--accent); }

@media (max-width: 640px) {
  .nav-links { display: none; }
  .hamburger-btn { display: flex; }
}

.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: var(--text);
  z-index: 149;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: 75vw;
  max-width: 300px;
  background: var(--bg);
  border-left: 1px solid var(--border);
  z-index: 150;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.mobile-drawer-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.mobile-drawer-link {
  font-size: 1.1rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
  font-family: inherit;
}
.mobile-drawer-link:hover { color: var(--accent); }

.mobile-drawer-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
```

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

Expected: build succeeds, no errors.

- [ ] **Step 6: Spot-check in dev server**

```bash
npm run dev
```

Open `http://localhost:3000` and use browser DevTools to set viewport to 375px width (iPhone size).

Check:
- Desktop (≥641px): hamburger button invisible, nav links visible as before — no change
- Mobile (<640px): nav links hidden, hamburger (three lines) visible top-right
- Tap hamburger: drawer slides in from the right in ~250ms, backdrop darkens behind it
- Icon swaps to ✕ when open
- Tap a link: drawer closes, navigates correctly
- Tap backdrop: drawer closes
- Dark mode toggle works inside the drawer
- Scroll is locked while drawer is open (try scrolling the page behind the backdrop)

- [ ] **Step 7: Commit**

```bash
git add src/components/MobileNav.tsx src/components/Nav.tsx src/app/globals.css
git commit -m "feat: add mobile nav drawer with hamburger button"
```
