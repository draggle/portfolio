# SEO & Shareability Layer + Self-Hosted PDFs — Design

**Date:** 2026-07-02
**Status:** Approved pending user review

## Problem

The site has per-page titles but no shareability or search infrastructure:

- No `metadataBase`, no Open Graph or Twitter card tags anywhere — links pasted
  into LinkedIn/iMessage/Slack/Twitter unfurl with no preview card.
- No OG images.
- No `sitemap.xml` or `robots.txt` — search engines aren't told what pages exist.
- No RSS feed for the blog.
- Dynamic pages (blog posts, projects, experience) lack meta descriptions.
- The resume and recommendation-letter links point at
  `github.com/draggle/portfolio/raw/main/*.pdf`, which **404s** — the PDFs were
  never committed. Both links on the live site are broken today.

## Decisions (settled with user)

- Canonical production URL: **`https://www.ayans.dev`**
- OG images: **code-generated at build time** (not static/photo-based)
- `/terminal` **is included** in the sitemap
- RSS feed: **included**
- PDF sources: `~/Downloads/AyanBinSaif-Rez.pdf` (resume),
  `~/Downloads/AyanLetterofRecommendation.pdf` (recommendation letter)

## Design

### 1. Site-wide metadata (`src/app/layout.tsx`)

Extend the root `metadata` export:

- `metadataBase: new URL('https://www.ayans.dev')`
- Default `openGraph` block: site name, title, description, `type: 'website'`,
  `locale`, url `/`
- Default `twitter` block: `card: 'summary_large_image'`
- `alternates.canonical: '/'` (each page with its own metadata sets its own)
- `alternates.types['application/rss+xml']: '/rss.xml'` so feed readers
  auto-discover the feed from any page

Per-page additions (existing titles are kept):

- **Blog post (`blog/[id]/page.tsx`)** — extend the existing `generateMetadata`:
  `description` = post excerpt; `openGraph` with `type: 'article'`,
  `publishedTime` = post date, post URL as canonical.
- **Project (`projects/[slug]/page.tsx`)** — `description` =
  `shortDescription`; canonical + OG url per slug.
- **Experience (`experience/[id]/page.tsx`)** — `description` =
  `cardDescription`/`description`; canonical + OG url per id.
- **Static pages** (`/`, `/blog`, `/projects`, `/experience`, `/contact`,
  `/terminal`) — ensure each has a `description` and correct canonical.

### 2. Generated OG card images

Two build-time-generated images using `ImageResponse` from `next/og`
(1200×630 PNG, monospace type on the site's dark palette):

- **`src/app/opengraph-image.tsx`** — default card inherited by all pages:
  "ayan bin saif" large; "applied math @ waterloo · engineering @ tern"
  subline; "www.ayans.dev" corner mark.
- **`src/app/blog/[id]/opengraph-image.tsx`** — per-post card, one per entry
  in `generateStaticParams`: "blog · {date}" eyebrow; post title large
  (wraps, font size steps down for long titles); "www.ayans.dev · ayan bin
  saif" footer line.

Font: a monospace font file bundled locally and loaded into `ImageResponse`
(satori needs raw font data; it cannot use the Google Fonts stylesheet link).
Exact font/loading mechanism is an implementation-plan detail — verify against
`node_modules/next/dist/docs` for this Next version.

### 3. `sitemap.ts` + `robots.ts` (`src/app/`)

- **`sitemap.ts`** — built from the existing data files so it can't drift:
  - Static routes: `/`, `/experience`, `/projects`, `/blog`, `/contact`,
    `/terminal`
  - `experiences.map` → `/experience/{id}`
  - `projects.map` → `/projects/{slug}`
  - `posts.map` → `/blog/{id}`, `lastModified` = post date
- **`robots.ts`** — allow all user agents on all paths; `sitemap:
  https://www.ayans.dev/sitemap.xml`.

### 4. RSS feed (`src/app/rss.xml/route.ts`)

- Route handler, statically rendered at build time (`export const dynamic =
  'force-static'` or this Next version's equivalent — verify in bundled docs).
- RSS 2.0 XML built from `posts.ts`: channel title/link/description; one
  `<item>` per post with title, absolute link, `pubDate`, excerpt as
  description, `<guid>`.
- Titles/excerpts are XML-escaped via a small helper (unit-testable).
- A visible "rss" link on the `/blog` page pointing at `/rss.xml`.

### 5. Self-hosted PDFs

- Copy `~/Downloads/AyanBinSaif-Rez.pdf` → `public/resume.pdf`
- Copy `~/Downloads/AyanLetterofRecommendation.pdf` →
  `public/recommendation-letter.pdf`
- Update all three broken references to root-relative paths:
  - `src/app/page.tsx` hero "resume ↗" → `/resume.pdf`
  - `src/data/projects.ts` edubuddy `links.recommendation` →
    `/recommendation-letter.pdf`
  - `src/data/experience.ts` apple `link` → `/recommendation-letter.pdf`
- PDFs are committed to the public repo (already the intent of the old links).

## Not in scope

- Structured data (JSON-LD), analytics changes, per-project OG cards,
  Atom/JSON-feed variants, OG cards for experience/project detail pages
  (they inherit the default card).

## Error handling

Everything is generated at build time from `posts.ts` / `projects.ts` /
`experience.ts`; failures (missing post file, bad data) surface as build
errors, consistent with the existing convention noted in `posts.ts`.

## Testing

- Unit tests (vitest, matching existing test style): sitemap entry mapping,
  RSS XML generation/escaping (pure helpers extracted to `src/lib/`).
- Build-time verification: `npm run build`, then confirm the generated
  sitemap/robots/rss/OG images exist and are well-formed; eyeball both OG
  cards; verify meta tags on `/` and one blog post; confirm both PDFs are
  served and the three links resolve.
