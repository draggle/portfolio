# Blog Carousel — Design

**Date:** 2026-07-01
**Status:** Approved

## Goal

Replace the single Golden Gate Bridge image at the end of blog post 1 with a
hand-rolled image carousel, so the same frame can cycle through several San
Francisco photos, each with its own caption. Only that one frame changes; the
yc-sign and waymo images in the post are untouched.

## Component

New client component: `src/components/BlogCarousel.tsx` (`"use client"`).

```tsx
type Slide = { src: string; alt: string; caption?: string }
<BlogCarousel slides={Slide[]} />
```

Behavior:

- Renders one slide at a time inside a frame the same width as the existing
  blog images (inline in the article flow — **not** the full-screen
  `min-h-screen` layout from the reference snippet).
- Navigation: prev/next arrow buttons, clickable dots, left/right keyboard
  arrows when the carousel is focused, and touch-swipe on mobile.
- No looping: prev is disabled on the first slide, next on the last.
- Each slide's caption renders below the image, styled to match the existing
  `BlogImage` figcaption (italic, `var(--accent)`, centered).
- Current slide index held in local React state. No new dependencies.

## Wiring

In `src/content/blog/1.mdx`:

- Import `BlogCarousel` at the top of the file.
- Replace the `<BlogImage src="/blog/golden-gate.jpeg" ... />` at the end of the
  post with `<BlogCarousel slides={[...]} />`.

## Placeholders

Until real photos are added, seed `slides` with 3 entries all pointing at the
existing `/blog/golden-gate.jpeg` (so nothing 404s), each with a distinct
placeholder caption. Leave a clear comment marking where to swap in real
photos: drop files into `public/blog/`, then edit `src` + `caption`.

## Out of scope

- No new dependencies (no embla). If the hand-rolled swipe feel is
  unsatisfactory, revisit with embla later.
- No changes to other blog posts or the shared `BlogImage` component.
