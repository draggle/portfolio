# SEO & Shareability Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Open Graph/Twitter metadata, generated OG card images, sitemap, robots.txt, and an RSS feed; serve the resume and recommendation-letter PDFs from the site's own domain (the current GitHub links 404).

**Architecture:** All shareability data is generated at build time from the existing data files (`src/data/posts.ts`, `projects.ts`, `experience.ts`) so nothing can drift. Pure logic (metadata builder, sitemap entries, RSS XML) lives in `src/lib/` where it's unit-tested; `src/app/` files are thin wrappers using Next file conventions (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `rss.xml/route.ts`).

**Tech Stack:** Next.js 16.2.9 (App Router, MDX), TypeScript, vitest. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-02-seo-shareability-design.md`

## Global Constraints

- Canonical production URL is exactly `https://www.ayans.dev` (with `www`).
- This is Next.js **16.2.9** — conventions differ from older versions. Notably: route `params` is a **Promise** that must be awaited. If unsure about an API, check `node_modules/next/dist/docs/` before writing code.
- No new npm dependencies.
- `ImageResponse` from `next/og` defaults to the Geist font in this Next version (verified: `node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf`). Do **not** load custom fonts.
- Site copy is all-lowercase by convention (e.g. "ayan bin saif", "view all projects →"). Match it in any user-visible text.
- Tests: vitest, colocated next to source (`src/lib/foo.ts` → `src/lib/foo.test.ts`), style matches `src/lib/utils.test.ts`.
- Run tests with `npm run test` (or `npx vitest run <file>` for one file).
- `/terminal` IS included in the sitemap (explicit user decision).
- Commit messages: conventional-commit style, ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: SEO helpers — site constants, `pageMetadata()`, sitemap entries

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/lib/seo.test.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Interfaces:**
- Consumes: `posts` from `@/data/posts`, `projects` from `@/data/projects`, `experiences` from `@/data/experience` (all existing).
- Produces (later tasks rely on these exact names):
  - `SITE_URL: string` — `'https://www.ayans.dev'`, no trailing slash
  - `SITE_NAME: string` — `'ayan bin saif'`
  - `SITE_DESCRIPTION: string`
  - `pageMetadata(opts: { title: string; description: string; path: string; ogType?: 'website' | 'article'; publishedTime?: string }): Metadata`
  - `buildSitemapEntries(): MetadataRoute.Sitemap`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/seo.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { SITE_URL, pageMetadata, buildSitemapEntries } from './seo'
import { posts } from '@/data/posts'
import { projects } from '@/data/projects'
import { experiences } from '@/data/experience'

describe('SITE_URL', () => {
  it('is the canonical www domain without trailing slash', () => {
    expect(SITE_URL).toBe('https://www.ayans.dev')
  })
})

describe('pageMetadata', () => {
  it('builds website metadata with canonical path and OG/twitter blocks', () => {
    const meta = pageMetadata({
      title: 'projects — ayan bin saif',
      description: 'some description',
      path: '/projects',
    })
    expect(meta.title).toBe('projects — ayan bin saif')
    expect(meta.description).toBe('some description')
    expect(meta.alternates?.canonical).toBe('/projects')
    expect(meta.openGraph).toMatchObject({
      title: 'projects — ayan bin saif',
      description: 'some description',
      url: '/projects',
      siteName: 'ayan bin saif',
      type: 'website',
    })
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('builds article metadata with publishedTime for blog posts', () => {
    const meta = pageMetadata({
      title: 'a post — ayan bin saif',
      description: 'excerpt',
      path: '/blog/1',
      ogType: 'article',
      publishedTime: '2026-02-15',
    })
    expect(meta.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-02-15',
      url: '/blog/1',
    })
  })
})

describe('buildSitemapEntries', () => {
  const entries = buildSitemapEntries()
  const urls = entries.map(e => e.url)

  it('includes all static routes, including /terminal', () => {
    for (const path of ['', '/experience', '/projects', '/blog', '/contact', '/terminal']) {
      expect(urls).toContain(`https://www.ayans.dev${path}`)
    }
  })

  it('includes every blog post with its date as lastModified', () => {
    for (const post of posts) {
      const entry = entries.find(e => e.url === `https://www.ayans.dev/blog/${post.id}`)
      expect(entry).toBeDefined()
      expect(entry!.lastModified).toEqual(new Date(post.date + 'T00:00:00Z'))
    }
  })

  it('includes every project and experience detail page', () => {
    for (const p of projects) {
      expect(urls).toContain(`https://www.ayans.dev/projects/${p.slug}`)
    }
    for (const e of experiences) {
      expect(urls).toContain(`https://www.ayans.dev/experience/${e.id}`)
    }
  })

  it('contains no duplicate urls', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: FAIL — cannot resolve `./seo`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/seo.ts`:

```ts
import type { Metadata, MetadataRoute } from 'next'
import { posts } from '@/data/posts'
import { projects } from '@/data/projects'
import { experiences } from '@/data/experience'

export const SITE_URL = 'https://www.ayans.dev'
export const SITE_NAME = 'ayan bin saif'
export const SITE_DESCRIPTION =
  'applied mathematics with scientific computing and scientific machine learning student at the university of waterloo. software engineer.'

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  publishedTime?: string
}

export function pageMetadata(opts: PageMetadataOptions): Metadata {
  const { title, description, path, ogType = 'website', publishedTime } = opts
  const shared = { title, description, url: path, siteName: SITE_NAME }
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph:
      ogType === 'article'
        ? { ...shared, type: 'article', publishedTime }
        : { ...shared, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/experience', '/projects', '/blog', '/contact', '/terminal']
  return [
    ...staticPaths.map(path => ({ url: `${SITE_URL}${path}` })),
    ...experiences.map(e => ({ url: `${SITE_URL}/experience/${e.id}` })),
    ...projects.map(p => ({ url: `${SITE_URL}/projects/${p.slug}` })),
    ...posts.map(p => ({
      url: `${SITE_URL}/blog/${p.id}`,
      lastModified: new Date(p.date + 'T00:00:00Z'),
    })),
  ]
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/seo.test.ts`
Expected: PASS (all tests).

- [ ] **Step 5: Add the Next file-convention wrappers**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries()
}
```

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 6: Verify the whole suite and lint still pass**

Run: `npm run test && npm run lint`
Expected: PASS, no lint errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add seo helpers, sitemap, and robots

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: RSS feed

**Files:**
- Create: `src/lib/rss.ts`
- Create: `src/lib/rss.test.ts`
- Create: `src/app/rss.xml/route.ts` (a directory literally named `rss.xml` containing `route.ts`)
- Modify: `src/app/blog/page.tsx` (add visible rss link)

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION` from `@/lib/seo` (Task 1); `Post` type + `posts` from `@/data/posts`.
- Produces: `escapeXml(s: string): string`, `buildRssXml(posts: Post[]): string`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/rss.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { escapeXml, buildRssXml } from './rss'
import type { Post } from '@/data/posts'

const samplePosts: Post[] = [
  {
    id: 1,
    title: 'Tips & tricks for <MDX>',
    date: '2026-02-15',
    excerpt: 'It\'s "fun"',
    readTimeMinutes: 3,
  },
  {
    id: 2,
    title: 'Second post',
    date: '2026-06-19',
    excerpt: 'Another excerpt',
    readTimeMinutes: 4,
  },
]

describe('escapeXml', () => {
  it('escapes all five xml special characters', () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;'
    )
  })

  it('leaves plain text untouched', () => {
    expect(escapeXml('hello world')).toBe('hello world')
  })
})

describe('buildRssXml', () => {
  const xml = buildRssXml(samplePosts)

  it('is an rss 2.0 document with the site channel', () => {
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('<link>https://www.ayans.dev/blog</link>')
  })

  it('contains one item per post with absolute links', () => {
    expect(xml).toContain('<link>https://www.ayans.dev/blog/1</link>')
    expect(xml).toContain('<link>https://www.ayans.dev/blog/2</link>')
    expect(xml).toContain('<guid>https://www.ayans.dev/blog/1</guid>')
  })

  it('escapes titles and excerpts', () => {
    expect(xml).toContain('Tips &amp; tricks for &lt;MDX&gt;')
    expect(xml).not.toContain('<MDX>')
  })

  it('lists newest posts first', () => {
    expect(xml.indexOf('/blog/2</link>')).toBeLessThan(xml.indexOf('/blog/1</link>'))
  })

  it('formats pubDate as UTC rfc822', () => {
    expect(xml).toContain('<pubDate>Sun, 15 Feb 2026 00:00:00 GMT</pubDate>')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/rss.test.ts`
Expected: FAIL — cannot resolve `./rss`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/rss.ts`:

```ts
import type { Post } from '@/data/posts'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './seo'

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildRssXml(posts: Post[]): string {
  const items = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(post => {
      const link = `${SITE_URL}/blog/${post.id}`
      const pubDate = new Date(post.date + 'T00:00:00Z').toUTCString()
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/rss.test.ts`
Expected: PASS (all tests).

- [ ] **Step 5: Add the route handler**

Create `src/app/rss.xml/route.ts`:

```ts
import { posts } from '@/data/posts'
import { buildRssXml } from '@/lib/rss'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildRssXml(posts), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
```

- [ ] **Step 6: Add the visible rss link to the blog page**

In `src/app/blog/page.tsx`, after the closing `</div>` of `<div className="projects-list">…` (currently the last element before the outer `</div>`), add:

```tsx
      <div className="view-all">
        <a href="/rss.xml" className="nyx-link">subscribe via rss →</a>
      </div>
```

(`view-all` and `nyx-link` are existing classes used for the same pattern on the home page.)

- [ ] **Step 7: Verify suite and lint**

Run: `npm run test && npm run lint`
Expected: PASS, no lint errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/rss.ts src/lib/rss.test.ts src/app/rss.xml/route.ts src/app/blog/page.tsx
git commit -m "feat: add rss feed at /rss.xml with blog page link

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Root layout + per-page metadata

**Files:**
- Modify: `src/app/layout.tsx:10-14` (metadata export)
- Modify: `src/app/blog/page.tsx:6-8`
- Modify: `src/app/projects/page.tsx:4-6`
- Modify: `src/app/experience/page.tsx:5-7`
- Modify: `src/app/contact/page.tsx:8-10`
- Modify: `src/app/terminal/page.tsx:4-6`
- Modify: `src/app/blog/[id]/page.tsx:15-22` (generateMetadata)
- Modify: `src/app/projects/[slug]/page.tsx:11-15` (generateMetadata)
- Modify: `src/app/experience/[id]/page.tsx:11-15` (generateMetadata)

**Interfaces:**
- Consumes: `pageMetadata`, `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION` from `@/lib/seo` (Task 1).
- Produces: nothing new — every page now emits description, canonical, OG, and twitter tags.

No new unit tests in this task (it's wiring of the already-tested `pageMetadata`); verified by build + tag inspection in Task 6.

- [ ] **Step 1: Replace the root layout metadata**

In `src/app/layout.tsx`, replace the existing `metadata` export (lines 10–14) with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: '/' }),
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/rss.xml` },
  },
}
```

And add the import at the top of the file:

```tsx
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, pageMetadata } from '@/lib/seo'
```

Note: the spread's `alternates` is intentionally overridden by the explicit
`alternates` key below it, which adds RSS feed auto-discovery.

- [ ] **Step 2: Update the five static pages**

Each page keeps its existing title, gains a description + canonical/OG via `pageMetadata`. In every file below, also add the import `import { pageMetadata } from '@/lib/seo'` and remove the `Metadata` type import if it becomes unused.

`src/app/blog/page.tsx` — replace the `metadata` export with:

```tsx
export const metadata = pageMetadata({
  title: 'blog — ayan bin saif',
  description: 'writing by ayan bin saif on hackathons, waterloo, and building software.',
  path: '/blog',
})
```

`src/app/projects/page.tsx` — replace the `metadata` export with:

```tsx
export const metadata = pageMetadata({
  title: 'projects — ayan bin saif',
  description: 'selected software projects by ayan bin saif — full-stack, ios, and computer vision work.',
  path: '/projects',
})
```

`src/app/experience/page.tsx` — replace the `metadata` export with:

```tsx
export const metadata = pageMetadata({
  title: 'experience — ayan bin saif',
  description: 'work experience and education — tern, apple ios mentorship, and the university of waterloo.',
  path: '/experience',
})
```

`src/app/contact/page.tsx` — replace the `metadata` export with:

```tsx
export const metadata = pageMetadata({
  title: 'contact — ayan bin saif',
  description: 'get in touch with ayan bin saif — email, github, linkedin.',
  path: '/contact',
})
```

`src/app/terminal/page.tsx` — replace the `metadata` export with:

```tsx
export const metadata = pageMetadata({
  title: 'terminal — ayan bin saif',
  description: 'an interactive terminal for exploring this site.',
  path: '/terminal',
})
```

- [ ] **Step 3: Update the three dynamic pages' generateMetadata**

`src/app/blog/[id]/page.tsx` — replace the existing `generateMetadata` (lines 15–22) with:

```tsx
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const post = getPost(id)
  if (!post) notFound()
  return pageMetadata({
    title: `${post!.title} — ayan bin saif`,
    description: post!.excerpt,
    path: `/blog/${post!.id}`,
    ogType: 'article',
    publishedTime: post!.date,
  })
}
```

Add import: `import { pageMetadata } from '@/lib/seo'`

`src/app/projects/[slug]/page.tsx` — replace the existing `generateMetadata` with:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) return { title: 'project not found' }
  return pageMetadata({
    title: `${project.title} — ayan bin saif`,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
  })
}
```

Add import: `import { pageMetadata } from '@/lib/seo'`

`src/app/experience/[id]/page.tsx` — replace the existing `generateMetadata` with:

```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const exp = experiences.find(e => e.id === id)
  if (!exp) return { title: 'not found' }
  return pageMetadata({
    title: `${exp.company} — ayan bin saif`,
    description: exp.cardDescription ?? exp.description,
    path: `/experience/${exp.id}`,
  })
}
```

Add import: `import { pageMetadata } from '@/lib/seo'`

- [ ] **Step 4: Verify it compiles, tests and lint pass**

Run: `npx tsc --noEmit && npm run test && npm run lint`
Expected: no type errors, tests PASS, no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/blog/page.tsx src/app/projects/page.tsx src/app/experience/page.tsx src/app/contact/page.tsx src/app/terminal/page.tsx "src/app/blog/[id]/page.tsx" "src/app/projects/[slug]/page.tsx" "src/app/experience/[id]/page.tsx"
git commit -m "feat: add open graph, twitter, canonical, and description metadata to all pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Generated OG card images

**Files:**
- Create: `src/app/opengraph-image.tsx`
- Create: `src/app/blog/[id]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `posts` from `@/data/posts`; `formatDate` from `@/lib/utils` (existing: `formatDate('2026-02-15')` → `'February 15, 2026'`).
- Produces: `/opengraph-image` (default card, inherited by all pages) and `/blog/{id}/opengraph-image` (per-post card). Next automatically wires these into each page's `og:image` tags.

Design notes (both cards): 1200×630, dark background `#111111`, light text `#fafafa`, muted gray `#999999`, red accent `#ef4444` (values from `globals.css` dark palette). Default Geist font — do NOT pass a `fonts` option. `ImageResponse` only supports flexbox (no grid), and every element containing multiple children needs explicit `display: 'flex'`.

- [ ] **Step 1: Create the default site card**

Create `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'

export const alt = 'ayan bin saif — applied math @ waterloo · engineering @ tern'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: '#111111',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700 }}>ayan bin saif</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#999999', marginTop: 28 }}>
          applied math @ waterloo · engineering @ tern
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 96,
            display: 'flex',
            fontSize: 28,
            color: '#ef4444',
          }}
        >
          www.ayans.dev
        </div>
      </div>
    ),
    size
  )
}
```

- [ ] **Step 2: Create the per-blog-post card**

Create `src/app/blog/[id]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { posts } from '@/data/posts'
import { formatDate } from '@/lib/utils'

export const alt = 'blog post by ayan bin saif'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = posts.find(p => p.id === Number(id))
  const title = post?.title ?? 'blog'
  const date = post ? formatDate(post.date).toLowerCase() : ''
  const titleSize = title.length > 60 ? 52 : 64

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: '#111111',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#ef4444' }}>blog · {date}</div>
        <div
          style={{
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 28,
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 96,
            display: 'flex',
            fontSize: 28,
            color: '#999999',
          }}
        >
          www.ayans.dev · ayan bin saif
        </div>
      </div>
    ),
    size
  )
}
```

- [ ] **Step 3: Build and verify the images render**

Run: `npm run build`
Expected: build succeeds. Then start the server and fetch both images:

```bash
npm run start &
sleep 3
curl -s -o /tmp/og-default.png -w "%{http_code} %{content_type}\n" http://localhost:3000/opengraph-image
curl -s -o /tmp/og-blog1.png -w "%{http_code} %{content_type}\n" http://localhost:3000/blog/1/opengraph-image
kill %1
```

Expected: both `200 image/png`. Open both PNGs (Read tool renders images) and confirm: dark background, correct text, nothing clipped or overlapping. Also fetch `http://localhost:3000/blog/1` HTML and confirm it contains an `og:image` meta tag pointing at the blog-post image URL.

- [ ] **Step 4: Verify suite and lint**

Run: `npm run test && npm run lint`
Expected: PASS, no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/opengraph-image.tsx "src/app/blog/[id]/opengraph-image.tsx"
git commit -m "feat: add generated open graph card images for site and blog posts

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Self-hosted PDFs

**Files:**
- Create: `public/resume.pdf` (copy of `~/Downloads/AyanBinSaif-Rez.pdf`)
- Create: `public/recommendation-letter.pdf` (copy of `~/Downloads/AyanLetterofRecommendation.pdf`)
- Modify: `src/app/page.tsx:51-58` (hero resume link)
- Modify: `src/data/projects.ts:103-106` (edubuddy recommendation link)
- Modify: `src/data/experience.ts:54` (apple experience link)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `/resume.pdf` and `/recommendation-letter.pdf` served from the site domain.

Background: the current links point at `https://github.com/draggle/portfolio/raw/main/*.pdf`, which return **404** (the PDFs were never committed). This task fixes both.

- [ ] **Step 1: Copy the PDFs into public/**

```bash
cp ~/Downloads/AyanBinSaif-Rez.pdf public/resume.pdf
cp ~/Downloads/AyanLetterofRecommendation.pdf public/recommendation-letter.pdf
```

Verify both are valid PDFs: `file public/resume.pdf public/recommendation-letter.pdf`
Expected: both report `PDF document`.

- [ ] **Step 2: Update the three links**

In `src/app/page.tsx`, replace the hero resume anchor (lines 51–58):

```tsx
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="nyx-link"
          >
            resume ↗
          </a>
```

In `src/data/projects.ts`, in the `edubuddy` entry, replace the `links` object:

```ts
    links: {
      recommendation: '/recommendation-letter.pdf',
    },
```

In `src/data/experience.ts`, in the `apple` entry, replace the `link` value:

```ts
    link: '/recommendation-letter.pdf',
```

(Keep `linkLabel: 'view recommendation letter ↗'` as is.)

- [ ] **Step 3: Check for other consumers of the old URLs**

Run: `grep -rn "raw/main" src/`
Expected: no matches. If any remain, update them to the new root-relative paths.

Also check `src/app/experience/[id]/page.tsx` — it computes `linkIsPdf = exp.link?.toLowerCase().endsWith('.pdf')`; the new `/recommendation-letter.pdf` value still ends in `.pdf`, so that logic keeps working. Confirm by reading the file, and confirm `src/components/Terminal.tsx` doesn't hardcode the old resume URL (`grep -rn "Ayan_Resume\|Letter_Of_Recommendation" src/`).

- [ ] **Step 4: Verify tests and lint pass**

Run: `npm run test && npm run lint`
Expected: PASS (note `src/data/projects.test.ts` exists — if it asserts on the old URL, update the assertion to the new path).

- [ ] **Step 5: Commit**

```bash
git add public/resume.pdf public/recommendation-letter.pdf src/app/page.tsx src/data/projects.ts src/data/experience.ts
git commit -m "feat: serve resume and recommendation letter from own domain

Fixes broken github raw links that 404ed.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: End-to-end build verification

**Files:** none created — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–5.
- Produces: confirmation the full feature works in a production build.

- [ ] **Step 1: Full test suite, lint, and production build**

Run: `npm run test && npm run lint && npm run build`
Expected: all pass, build succeeds with `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/opengraph-image`, and `/blog/[id]/opengraph-image` in the route output.

- [ ] **Step 2: Start the production server and probe every new endpoint**

```bash
npm run start &
sleep 3
curl -s -w "\n%{http_code}\n" http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml | head -30
curl -s http://localhost:3000/rss.xml | head -30
curl -s -o /dev/null -w "resume: %{http_code} %{content_type}\n" http://localhost:3000/resume.pdf
curl -s -o /dev/null -w "letter: %{http_code} %{content_type}\n" http://localhost:3000/recommendation-letter.pdf
curl -s -o /dev/null -w "og-default: %{http_code} %{content_type}\n" http://localhost:3000/opengraph-image
curl -s -o /dev/null -w "og-blog: %{http_code} %{content_type}\n" http://localhost:3000/blog/1/opengraph-image
```

Expected:
- robots.txt: 200, contains `Sitemap: https://www.ayans.dev/sitemap.xml`
- sitemap.xml: contains `https://www.ayans.dev/terminal` and all blog/project/experience URLs
- rss.xml: valid RSS with both posts, newest first
- both PDFs: `200` with `application/pdf`
- both OG images: `200` with `image/png`

- [ ] **Step 3: Inspect meta tags on home and a blog post**

```bash
curl -s http://localhost:3000/ | grep -o '<meta[^>]*\(og:\|twitter:\|canonical\|application/rss\)[^>]*>' | head -20
curl -s http://localhost:3000/blog/1 | grep -o '<meta[^>]*\(og:\|twitter:\|canonical\)[^>]*>' | head -20
kill %1
```

Expected on `/`: `og:title`, `og:description`, `og:url` (`https://www.ayans.dev/`), `og:image` (absolute URL), `twitter:card` = `summary_large_image`, RSS alternate link.
Expected on `/blog/1`: `og:type` = `article`, `article:published_time` = `2026-02-15…`, post-specific `og:image` under `/blog/1/`, canonical `https://www.ayans.dev/blog/1`.

- [ ] **Step 4: Report**

No commit (nothing changed). Report the probe results verbatim to the user, including anything that deviated from expectations.
