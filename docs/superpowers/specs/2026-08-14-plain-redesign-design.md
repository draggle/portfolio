# Plain Redesign — Design Spec


**Date:** 2026-08-14
**Status:** Approved direction; pending implementation plan
**Branch:** `redesign` (merges to `main` to ship)

## Goal

Replace the current site's visual identity with a very plain, typographic
design. All content transfers unchanged. This is a redesign of the
presentation layer only — data, MDX content, and SEO/RSS infrastructure
stay.

## What changes

### Pages & navigation

Four top-level routes, plus the dynamic post route:

| Route | Content |
|---|---|
| `/` | Home/about (see below) |
| `/experience` | Experience list, content from `src/data/experience.ts` |
| `/projects` | Projects list, content from `src/data/projects.ts` |
| `/writing` | Post index, content from `src/data/posts.ts` |
| `/writing/[slug]` | Individual MDX posts from `src/content/blog/` |

Navigation is a plain row of text links: **Ayan Bin Saif · Experience ·
Projects · Writing**, with the dark-mode toggle at the end. "Ayan Bin
Saif" links to `/` and doubles as the site name. Normal capitalization
throughout — the all-lowercase styling is dropped.

**Removed:** `/terminal`, `/contact`, PaintZone, LocationWidget,
ScrambleLogo, animated underline/shining/special text, blog falling
pattern, and any other decorative animation components.

**Kept:** dark-mode toggle; hover link previews (`LinkPreview`,
`LinkedInBadgePreview`).

### Home page

Two paragraphs:

1. About: currently studying applied mathematics with scientific
   computing and scientific machine learning at the University of
   Waterloo; currently engineering at Tern; interests (software
   engineering, data science, full-stack, mobile). Content carried from
   the current hero bio, recased to normal capitalization.
2. Contact: inline links for email, GitHub, LinkedIn, and resume
   (`/resume.pdf`). GitHub/LinkedIn/school/company links keep their
   hover previews.

### URL rename: /blog → /writing

- Permanent redirects in `next.config.ts`: `/blog` → `/writing` and
  `/blog/:slug` → `/writing/:slug`.
- RSS (`/rss.xml`), sitemap, canonical URLs, and OG metadata emit
  `/writing` URLs. The feed URL itself does not move.

### Visual design

- One typeface; comfortable reading measure; generous line-height.
- Black-on-white with a true dark mode (white-on-black), driven by the
  existing toggle.
- Links underlined or subtly styled; no buttons-as-links.
- Projects and experience render as clean text lists — no cards, no
  grids, no borders unless a list genuinely needs separation.
- No motion beyond the hover previews.
- `globals.css` is rewritten from scratch for the new design; unused
  component styles are deleted rather than carried.

## What does not change

- `src/data/` (projects, experience, posts) — content source of truth.
- `src/content/blog/` MDX files.
- `src/lib/` (seo, rss, time, utils) — edited only where the
  `/blog` → `/writing` URL change requires it.
- Sitemap, robots, OG image generation, RSS feed location.
- Vitest suite — tests updated where URLs changed, not removed.
- Deployment (Vercel) and domain.

## Testing

- Existing unit tests updated for `/writing` URLs and kept green.
- Manual pass: all four pages plus a post render in light and dark;
  `/blog` and `/blog/<slug>` redirect permanently; `/rss.xml` validates
  and links resolve.

## Out of scope

New content, new features, analytics changes, and anything not listed
under "What changes."
