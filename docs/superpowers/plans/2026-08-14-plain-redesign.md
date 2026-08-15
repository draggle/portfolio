# Plain Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's presentation layer with a very plain typographic design, rename `/blog` to `/writing` with permanent redirects, and delete all decorative features — while keeping all content, data, and SEO/RSS infrastructure.

**Architecture:** Next.js App Router site where `src/data/` + `src/content/` are the content source of truth and pages are thin renderers. This plan rewrites the renderers (layout, nav, pages, `globals.css`), edits `src/lib/` only for the URL rename and name recasing, and deletes ~15 decorative components/pages.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19, Tailwind CSS v4 (via `@import "tailwindcss"` in globals.css), MDX via `@next/mdx`, Vitest, Geist font via `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-08-14-plain-redesign-design.md`

## Global Constraints

- **This repo's Next.js has breaking changes vs. your training data.** Read the relevant guide in `node_modules/next/dist/docs/` (App Router docs under `01-app/`) before writing any Next-specific code. (From AGENTS.md.)
- Branch: all work happens on `redesign`.
- Site identity: `SITE_URL = 'https://www.ayans.dev'`, site name becomes `Ayan Bin Saif` (normal capitalization everywhere; the all-lowercase styling is dropped).
- Writing URLs: post pages live at `/writing/<id>` (numeric ids, e.g. `/writing/1`). `/blog` and `/blog/:id` 308-redirect to them.
- Keep: dark-mode toggle, hover link previews (`LinkPreview`, `LinkedInBadgePreview`), `BlogCarousel` + `BlogLink` (used by MDX content), all of `src/data/`, `src/content/`, RSS at `/rss.xml`, sitemap, robots, `images: { unoptimized: true }`, Vercel Analytics.
- Delete: `/terminal`, `/contact`, PaintZone, LocationWidget, ScrambleLogo, Terminal, TermNavLink, MobileNav, ExperienceSection, ProjectCard, LayoutClient, falling-pattern, shining-text, special-text, animated-underline-text-one, contact-title, contact-intro, scroll-progress-bar, `src/lib/time.ts`, `src/lib/platform.ts` (+ their tests).
- Visual rules: one typeface (Geist), max text measure ~42rem centered, black-on-white light / white-on-black dark via existing `html.dark` class mechanism, underlined links, no cards/grids/borders/pills, no motion beyond hover previews.
- Do not remove npm dependencies in this plan (framer-motion etc. are still used by kept components; auditing the rest is out of scope).
- After every task: `npm test` and `npm run build` must pass before committing.

---

### Task 1: Lib layer — recased identity + `/writing` URLs (TDD)

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/rss.ts`
- Test: `src/lib/seo.test.ts`, `src/lib/rss.test.ts`

**Interfaces:**
- Consumes: `posts`, `projects`, `experiences` from `src/data/` (unchanged shapes).
- Produces: `SITE_NAME = 'Ayan Bin Saif'`, recased `SITE_DESCRIPTION`, `pageMetadata(opts)` (signature unchanged), `buildSitemapEntries()` emitting `/writing/<id>` post URLs and static paths `['', '/experience', '/projects', '/writing']`, `buildRssXml(posts)` emitting `/writing/<id>` links. Later tasks rely on these exact values.

- [ ] **Step 1: Update the tests to the new expectations (failing first)**

In `src/lib/seo.test.ts`:
- `SITE_URL` test unchanged.
- In the `pageMetadata` website test, change expected `siteName` to `'Ayan Bin Saif'`.
- In the article test, change `path: '/blog/1'` → `path: '/writing/1'` and the expected `url` to `'/writing/1'`.
- Replace the static-routes test:

```ts
  it('includes exactly the four static routes', () => {
    for (const path of ['', '/experience', '/projects', '/writing']) {
      expect(urls).toContain(`https://www.ayans.dev${path}`)
    }
    expect(urls).not.toContain('https://www.ayans.dev/blog')
    expect(urls).not.toContain('https://www.ayans.dev/contact')
    expect(urls).not.toContain('https://www.ayans.dev/terminal')
  })
```

- In the per-post test, change the expected URL to `` `https://www.ayans.dev/writing/${post.id}` ``.

In `src/lib/rss.test.ts`:
- Channel test: expect `<link>https://www.ayans.dev/writing</link>` and add `expect(xml).toContain('<title>Ayan Bin Saif — Writing</title>')`.
- Item/guid/order tests: replace every `/blog/1`, `/blog/2` with `/writing/1`, `/writing/2`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — seo and rss assertions about `/writing`, siteName, and channel title.

- [ ] **Step 3: Implement in `src/lib/seo.ts` and `src/lib/rss.ts`**

`seo.ts` changes only these lines:

```ts
export const SITE_NAME = 'Ayan Bin Saif'
export const SITE_DESCRIPTION =
  'Applied Mathematics with Scientific Computing and Scientific Machine Learning student at the University of Waterloo. Software engineer.'
```

and in `buildSitemapEntries`:

```ts
  const staticPaths = ['', '/experience', '/projects', '/writing']
```

```ts
    ...posts.map(p => ({
      url: `${SITE_URL}/writing/${p.id}`,
      lastModified: new Date(p.date + 'T00:00:00Z'),
    })),
```

`rss.ts`: change the item link to `` `${SITE_URL}/writing/${post.id}` ``, the channel title line to `` <title>${escapeXml(SITE_NAME)} — Writing</title> ``, and the channel link to `` ${SITE_URL}/writing ``.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/lib/rss.ts src/lib/seo.test.ts src/lib/rss.test.ts
git commit -m "feat: recase site identity, emit /writing urls from seo and rss helpers"
```

---

### Task 2: Move blog routes to `/writing` + permanent redirects

**Files:**
- Move: `src/app/blog/` → `src/app/writing/` (`page.tsx`, `[id]/page.tsx`, `[id]/opengraph-image.tsx`)
- Modify: `next.config.ts`, `src/components/BlogPostLayout.tsx`
- Test: existing suite + manual curl of redirects

**Interfaces:**
- Consumes: `pageMetadata` from Task 1; `posts` from `src/data/posts.ts`; MDX files at `src/content/blog/<id>.mdx` (directory name intentionally unchanged — it is a content store, not a URL).
- Produces: routes `/writing` and `/writing/[id]`; `BlogPostLayout({ title, date, readTimeMinutes, children })` (props unchanged) now linking back to `/writing`. Task 5's nav links to `/writing`.

- [ ] **Step 1: Move the directory**

```bash
git mv src/app/blog src/app/writing
```

- [ ] **Step 2: Add redirects to `next.config.ts`**

```ts
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async redirects() {
    return [
      { source: '/blog', destination: '/writing', permanent: true },
      { source: '/blog/:id', destination: '/writing/:id', permanent: true },
    ]
  },
}
```

- [ ] **Step 3: Update `src/app/writing/page.tsx` (plain rewrite)**

```tsx
import Link from 'next/link'
import { posts } from '@/data/posts'
import { formatDate } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Writing — Ayan Bin Saif',
  description: 'Writing by Ayan Bin Saif on hackathons, Waterloo, and building software.',
  path: '/writing',
})

export default function WritingPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="page">
      <h1>Writing</h1>
      {sorted.length === 0 && <p className="muted">No posts yet.</p>}
      <ul className="item-list">
        {sorted.map(post => (
          <li key={post.id}>
            <Link href={`/writing/${post.id}`}>{post.title}</Link>
            <p className="muted">{formatDate(post.date)} · {post.readTimeMinutes} min read</p>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
      <p><a href="/rss.xml">Subscribe via RSS</a></p>
    </div>
  )
}
```

- [ ] **Step 4: Update `src/app/writing/[id]/page.tsx`**

Only the `pageMetadata` call changes: title `` `${post!.title} — Ayan Bin Saif` ``, path `` `/writing/${post!.id}` ``. The MDX import stays `@/content/blog/${id}.mdx`.

- [ ] **Step 5: Update `src/app/writing/[id]/opengraph-image.tsx`**

Change `alt` to `'Writing by Ayan Bin Saif'`, the kicker line to `Writing · {date}` (and drop the `.toLowerCase()` on the date), and the footer line to `www.ayans.dev · Ayan Bin Saif`.

- [ ] **Step 6: Simplify `src/components/BlogPostLayout.tsx`**

```tsx
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Props {
  title: string
  date: string
  readTimeMinutes: number
  children: React.ReactNode
}

export default function BlogPostLayout({ title, date, readTimeMinutes, children }: Props) {
  return (
    <div className="page">
      <p><Link href="/writing">← Writing</Link></p>
      <h1>{title}</h1>
      <p className="muted">{formatDate(date)} · {readTimeMinutes} min read</p>
      <div className="prose">{children}</div>
    </div>
  )
}
```

(`ScrollProgressBar` import removed; the ui file itself is deleted in Task 6.)

- [ ] **Step 7: Verify build, tests, and redirects**

```bash
npm test && npm run build
npm run start &
sleep 2
curl -sI http://localhost:3000/blog | head -3
curl -sI http://localhost:3000/blog/1 | head -3
kill %1
```

Expected: tests pass, build succeeds, both curls show `HTTP/1.1 308` with `location: /writing` and `/writing/1`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: move blog routes to /writing with permanent redirects"
```

---

### Task 3: Root layout + plain nav

**Files:**
- Modify: `src/app/layout.tsx`, `src/components/Nav.tsx`, `src/components/DarkModeToggle.tsx`
- Delete: usage of `LayoutClient` (file deleted in Task 6)

**Interfaces:**
- Consumes: `pageMetadata`, `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_URL` from Task 1; `DarkModeToggle` (default export, no props).
- Produces: `Nav` (default export, no props) rendered by the root layout; `<main className="page-wrap">` wrapping all pages. Tasks 4–5 style against `.site-nav`, `.page-wrap`, `.page`.

- [ ] **Step 1: Rewrite `src/app/layout.tsx`**

Keep: metadata block, Geist font, theme-init inline script, emoji favicon, `<Analytics />`. Drop: Berkeley Mono stylesheet + both preconnect links, `LayoutClient`.

```tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Nav from '@/components/Nav'
import './globals.css'
import { Geist } from 'next/font/google'
import { cn } from '@/lib/utils'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, pageMetadata } from '@/lib/seo'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: '/' }),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}` }} />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </head>
      <body>
        <Nav />
        <main className="page-wrap">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Rewrite `src/components/Nav.tsx`**

```tsx
import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-name">Ayan Bin Saif</Link>
      <Link href="/experience">Experience</Link>
      <Link href="/projects">Projects</Link>
      <Link href="/writing">Writing</Link>
      <DarkModeToggle />
    </nav>
  )
}
```

- [ ] **Step 3: Recase `src/components/DarkModeToggle.tsx` button label**

Change the button content to `{dark ? 'Light mode' : 'Dark mode'}` (label states the action; logic unchanged, keep `className="toggle-btn"` and the aria-label).

- [ ] **Step 4: Verify**

Run: `npm test && npm run build`
Expected: PASS. (The site will look broken until Task 6's CSS rewrite — that is fine; build must still succeed.)

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/Nav.tsx src/components/DarkModeToggle.tsx
git commit -m "feat: plain root layout and text nav"
```

---

### Task 4: Data recasing

**Files:**
- Modify: `src/data/experience.ts`, `src/data/projects.ts`
- Test: `src/data/experience` has no test; `src/data/projects.test.ts` and `src/data/posts.test.ts` are shape-based and must keep passing unchanged.

**Interfaces:**
- Consumes/Produces: interfaces `Experience` and `Project` unchanged — only string values are recased. Tasks 5 render these strings verbatim.

- [ ] **Step 1: Recase `src/data/experience.ts` values**

- tern: `company: 'Tern'`, `role: 'Engineering Intern'`, `dateRange: 'May 2026 → Present'`, `cardDescription: 'Building the future of positioning through resilient, satellite-free navigation.'`, description → `'Engineering IDPS™, an AI-powered positioning stack that keeps navigation accurate without relying on GPS, GNSS, or cellular signals.'`, `tags: ['TypeScript', 'Next.js', 'Python', 'AI/ML', 'Positioning Systems']`, `linkLabel: 'tern.ai ↗'` (domain stays lowercase).
- apple: `company: 'Apple'`, `role: 'iOS App Developer'`, `dateRange: 'Feb 2024 → Jul 2024'`, `cardDescription: 'Mentorship on iOS native apps.'`, `tags: ['Swift', 'SwiftUI', 'Xcode', 'iOS', 'HIG']`, `linkLabel: 'View recommendation letter ↗'`.
- uwaterloo: `company: 'University of Waterloo'`, `role: 'Honours Bachelor of Mathematics'`, `dateRange: 'Present'`, `cardDescription: 'Applied Mathematics with Scientific Computing and Scientific Machine Learning.'`, `tags: ['Applied Mathematics', 'Scientific Computing', 'Machine Learning', 'Co-op']`, `linkLabel: 'View program ↗'`.

- [ ] **Step 2: Recase `src/data/projects.ts` values**

Titles: `'AlphaHedge'`, `'Rate My Rez'`, `'Cheeto-Fingers'`, `'Dice Duel Showdown'`, `'EduBuddy'`. Tags recased in place, e.g. `['Next.js', 'TypeScript', 'Supabase', 'Google Gemini', 'sim.ai']`, `['React', 'Firebase', 'Tailwind CSS']`, `['Python', 'OpenCV', 'MediaPipe', 'Computer Vision']`, `['Java', 'Python', 'JavaScript', 'OOP']`, `['Swift', 'SwiftUI', 'iOS', 'Apple HIG']`. Slugs, descriptions (already sentence case), links, thumbnails, `builtAt` values unchanged.

- [ ] **Step 3: Verify**

Run: `npm test && npm run build`
Expected: PASS — data tests are shape-based, so any failure means a structural typo; fix it.

- [ ] **Step 4: Commit**

```bash
git add src/data/experience.ts src/data/projects.ts
git commit -m "feat: recase data display strings to normal capitalization"
```

---

### Task 5: Plain pages — home, experience, projects (+ detail pages)

**Files:**
- Modify: `src/app/page.tsx`, `src/app/experience/page.tsx`, `src/app/experience/[id]/page.tsx`, `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: recased data from Task 4; `pageMetadata`; `LinkPreview` (`{ url, isStatic?, imageSrc?, className?, children }`) and `LinkedInBadgePreview` (`{ className?, children }`) — kept as-is; CSS classes `.page`, `.item-list`, `.muted`, `.prose` defined in Task 6.
- Produces: final page markup for `/`, `/experience`, `/projects` and both detail routes.

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

```tsx
import { LinkPreview } from '@/components/ui/link-preview'
import { LinkedInBadgePreview } from '@/components/ui/linkedin-badge-preview'

export default function HomePage() {
  return (
    <div className="page">
      <h1>Ayan Bin Saif</h1>
      <p>
        I&apos;m studying{' '}
        <LinkPreview
          url="https://uwaterloo.ca/future-students/programs/applied-mathematics-scientific-computing"
          isStatic
          imageSrc="/previews/uwaterloo-program.png"
        >
          Applied Mathematics with Scientific Computing and Scientific Machine Learning
        </LinkPreview>{' '}
        at the{' '}
        <LinkPreview url="https://uwaterloo.ca" isStatic imageSrc="/previews/uwaterloo.png">
          University of Waterloo
        </LinkPreview>
        , and currently engineering at{' '}
        <LinkPreview url="https://tern.ai" isStatic imageSrc="/previews/tern.png">
          Tern
        </LinkPreview>
        . I&apos;m interested in software engineering, data science, full-stack development, and
        mobile engineering.
      </p>
      <p>
        You can reach me by <a href="mailto:ayan.binsaif@uwaterloo.ca">email</a>, find me on{' '}
        <LinkPreview url="https://github.com/draggle" isStatic imageSrc="/previews/github.png">
          GitHub
        </LinkPreview>{' '}
        and <LinkedInBadgePreview>LinkedIn</LinkedInBadgePreview>, or read my{' '}
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">resume</a>.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Rewrite `src/app/experience/page.tsx`**

Metadata: title `'Experience — Ayan Bin Saif'`, description `'Work experience and education — Tern, Apple iOS mentorship, and the University of Waterloo.'`, path `'/experience'`. Body:

```tsx
export default function ExperiencePage() {
  return (
    <div className="page">
      <h1>Experience</h1>
      <ul className="item-list">
        {experiences.map(exp => (
          <li key={exp.id}>
            <Link href={`/experience/${exp.id}`}>{exp.company}</Link>
            <p className="muted">
              {exp.role}
              {exp.location && ` · ${exp.location}`} · {exp.dateRange}
            </p>
            <p>{exp.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

(No logos, no tag pills on the list page.)

- [ ] **Step 3: Rewrite `src/app/projects/page.tsx`**

Metadata: title `'Projects — Ayan Bin Saif'`, description `'Selected software projects by Ayan Bin Saif — full-stack, iOS, and computer vision work.'`, path `'/projects'`. Body mirrors experience:

```tsx
export default function ProjectsPage() {
  return (
    <div className="page">
      <h1>Projects</h1>
      <ul className="item-list">
        {projects.map(project => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            <p>{project.shortDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: Restyle `src/app/experience/[id]/page.tsx`**

Keep: `generateStaticParams`, `generateMetadata` (recase title to `` `${exp.company} — Ayan Bin Saif` ``), `STATIC_PREVIEWS`, the PDF-vs-preview link logic. Replace the JSX body: drop logo images, tag pills, and all `detail-*`/`exp-*` classes:

```tsx
  return (
    <div className="page">
      <p><Link href="/experience">← Experience</Link></p>
      <h1>{exp.company}</h1>
      <p className="muted">
        {exp.role}
        {exp.location && ` · ${exp.location}`} · {exp.dateRange}
      </p>
      {exp.link && (
        <p>
          {linkIsPdf ? (
            <a href={exp.link} target="_blank" rel="noopener noreferrer">{exp.linkLabel ?? 'Visit ↗'}</a>
          ) : previewSrc ? (
            <LinkPreview url={exp.link} isStatic imageSrc={previewSrc}>{exp.linkLabel ?? 'Visit ↗'}</LinkPreview>
          ) : (
            <LinkPreview url={exp.link}>{exp.linkLabel ?? 'Visit ↗'}</LinkPreview>
          )}
        </p>
      )}
      <p>{exp.description}</p>
      {exp.highlights && exp.highlights.length > 0 && (
        <ul>
          {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
    </div>
  )
```

- [ ] **Step 5: Restyle `src/app/projects/[slug]/page.tsx`**

Keep: `generateStaticParams`, `generateMetadata` (recase title to `` `${project.title} — Ayan Bin Saif` ``), `getYouTubeId`, `STATIC_PREVIEWS`. Drop tag pills and `viewTransitionName`. Build the links row as an array so separators land only between rendered links (EduBuddy has only `recommendation`; conditional inline `{' · '}` would dangle):

```tsx
  const linkItems: React.ReactNode[] = []
  if (project.links.github) linkItems.push(
    previews.github
      ? <LinkPreview key="gh" url={project.links.github} isStatic imageSrc={previews.github}>GitHub ↗</LinkPreview>
      : <LinkPreview key="gh" url={project.links.github}>GitHub ↗</LinkPreview>
  )
  if (project.links.demo) linkItems.push(
    previews.demo
      ? <LinkPreview key="demo" url={project.links.demo} isStatic imageSrc={previews.demo}>Demo ↗</LinkPreview>
      : <LinkPreview key="demo" url={project.links.demo}>Demo ↗</LinkPreview>
  )
  if (project.links.event) linkItems.push(
    previews.event
      ? <LinkPreview key="event" url={project.links.event} isStatic imageSrc={previews.event}>YC event ↗</LinkPreview>
      : <LinkPreview key="event" url={project.links.event}>YC event ↗</LinkPreview>
  )
  if (project.links.video) linkItems.push(
    previews.video
      ? <LinkPreview key="video" url={project.links.video} isStatic imageSrc={previews.video}>Demo video ↗</LinkPreview>
      : <LinkPreview key="video" url={project.links.video}>Demo video ↗</LinkPreview>
  )
  if (project.links.recommendation) linkItems.push(
    <a key="rec" href={project.links.recommendation} target="_blank" rel="noopener noreferrer">
      Recommendation letter ↗
    </a>
  )
```

Then the returned JSX:

```tsx
  return (
    <div className="page">
      <p><Link href="/projects">← Projects</Link></p>
      <h1>{project.title}</h1>
      <p>{linkItems.map((item, i) => <span key={i}>{i > 0 && ' · '}{item}</span>)}</p>
      {project.links.video && (
        <div className="video-embed">
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(project.links.video)}`}
            title={`${project.title} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {project.description.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      {project.builtAt && (
        <p className="muted">Built at {project.builtAt}</p>
      )}
    </div>
  )
```

- [ ] **Step 6: Verify**

Run: `npm test && npm run build`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/app/experience src/app/projects
git commit -m "feat: plain home, experience, and projects pages"
```

---

### Task 6: Delete removed features + rewrite globals.css

**Files:**
- Delete: `src/app/terminal/`, `src/app/contact/`, `src/components/{Terminal,TermNavLink,ScrambleLogo,PaintZone,LocationWidget,ExperienceSection,ProjectCard,MobileNav,LayoutClient}.tsx`, `src/components/ui/{falling-pattern,shining-text,special-text,animated-underline-text-one,contact-title,contact-intro,scroll-progress-bar}.tsx`, `src/lib/{time.ts,time.test.ts,platform.ts}`
- Modify: `src/app/globals.css` (full rewrite)

**Interfaces:**
- Consumes: class names used by Tasks 2–5: `.site-nav`, `.nav-name`, `.toggle-btn`, `.page-wrap`, `.page`, `.item-list`, `.muted`, `.prose`, `.video-embed`. Kept components still using Tailwind utilities + `cn()`: `link-preview.tsx`, `linkedin-badge-preview.tsx`, `BlogCarousel.tsx` — so the three top `@import` lines must stay.
- Produces: the final stylesheet; nothing downstream.

- [ ] **Step 1: Delete files**

```bash
git rm -r src/app/terminal src/app/contact
git rm src/components/Terminal.tsx src/components/TermNavLink.tsx src/components/ScrambleLogo.tsx \
  src/components/PaintZone.tsx src/components/LocationWidget.tsx src/components/ExperienceSection.tsx \
  src/components/ProjectCard.tsx src/components/MobileNav.tsx src/components/LayoutClient.tsx
git rm src/components/ui/falling-pattern.tsx src/components/ui/shining-text.tsx \
  src/components/ui/special-text.tsx src/components/ui/animated-underline-text-one.tsx \
  src/components/ui/contact-title.tsx src/components/ui/contact-intro.tsx \
  src/components/ui/scroll-progress-bar.tsx
git rm src/lib/time.ts src/lib/time.test.ts src/lib/platform.ts
```

Then `grep -rn "PaintZone\|LocationWidget\|ScrambleLogo\|TermNavLink\|MobileNav\|LayoutClient\|ExperienceSection\|ProjectCard\|scroll-progress\|falling-pattern\|shining-text\|special-text\|contact-title\|contact-intro\|lib/time\|lib/platform" src mdx-components.tsx` — expect zero hits outside deleted files; fix any straggler imports.

- [ ] **Step 2: Rewrite `src/app/globals.css`**

Full replacement content:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root {
  --bg: #ffffff;
  --text: #111111;
  --muted: #666666;
  --border: #e5e5e5;
}

html.dark {
  --bg: #111111;
  --text: #e8e8e8;
  --muted: #999999;
  --border: #2a2a2a;
}

html {
  background: var(--bg);
  color: var(--text);
}

body {
  font-family: var(--font-sans), system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  background: var(--bg);
  color: var(--text);
}

/* ── Nav ── */
.site-nav {
  max-width: 42rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 1.25rem;
}

.site-nav a {
  color: var(--text);
  text-decoration: none;
}

.site-nav a:hover { text-decoration: underline; }

.nav-name { font-weight: 600; }

.toggle-btn {
  margin-left: auto;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--muted);
  cursor: pointer;
}

.toggle-btn:hover { text-decoration: underline; }

/* ── Page ── */
.page-wrap {
  max-width: 42rem;
  margin: 0 auto;
  padding: 3rem 1.25rem 5rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

h2 { font-size: 1.15rem; font-weight: 600; margin: 2rem 0 0.75rem; }
h3 { font-size: 1rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }

p { margin-bottom: 1rem; }

a {
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.muted { color: var(--muted); font-size: 0.9rem; margin-bottom: 0.5rem; }

ul { padding-left: 1.25rem; list-style: disc; margin-bottom: 1rem; }

/* ── Lists of items (experience, projects, writing) ── */
.item-list { list-style: none; padding: 0; }

.item-list > li { margin-bottom: 2rem; }

.item-list > li > a { font-weight: 600; }

/* ── Post/detail content ── */
.prose img { max-width: 100%; display: block; margin: 1.5rem 0; }

.prose blockquote {
  border-left: 2px solid var(--border);
  padding-left: 1rem;
  color: var(--muted);
  margin: 1.5rem 0;
}

.prose code {
  font-family: ui-monospace, monospace;
  font-size: 0.9em;
  background: color-mix(in srgb, var(--text) 6%, transparent);
  padding: 0.1em 0.3em;
  border-radius: 3px;
}

.video-embed { margin: 1.5rem 0; }

.video-embed iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}
```

- [ ] **Step 3: Verify build, tests, and every page**

```bash
npm test && npm run build
npm run start &
sleep 2
for p in / /experience /experience/tern /projects /projects/alphahedge /writing /writing/1 /writing/2 /rss.xml /sitemap.xml; do
  echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000$p)"
done
curl -s -o /dev/null -w '/terminal -> %{http_code}\n' http://localhost:3000/terminal
kill %1
```

Expected: all listed pages 200; `/terminal` 404.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: plain stylesheet, delete decorative features and dead pages"
```

---

### Task 7: Root OG image recase

**Files:**
- Modify: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: nothing from other tasks. Produces: the site-wide OG card.

- [ ] **Step 1: Recase text and plainen the card**

Keep `ImageResponse`, `size`, `contentType`. Change: `alt` → `'Ayan Bin Saif — Applied Math @ Waterloo · Engineering @ Tern'`; background `'#ffffff'`, text color `'#111111'`; name line text `Ayan Bin Saif`; subtitle `Applied Math @ Waterloo · Engineering @ Tern` in `#666666`; footer `www.ayans.dev` in `#666666` (drop the red accent).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: PASS (OG images are generated at build time; a type or JSX error would fail here).

- [ ] **Step 3: Commit**

```bash
git add src/app/opengraph-image.tsx
git commit -m "feat: plain recased open graph card"
```

---

### Task 8: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full suite + build**

Run: `npm test && npm run lint && npm run build`
Expected: all pass, zero lint errors.

- [ ] **Step 2: Manual pass in a real browser**

Run `npm run start`, then check: all four nav pages plus one post and one detail page render correctly in light AND dark mode (toggle works, persists on reload); hover previews appear on home-page links; `/blog` and `/blog/1` redirect; `/rss.xml` shows `/writing/` links; no lowercase site-name leftovers (`grep -rn "ayan bin saif" src` → expect zero hits).

- [ ] **Step 3: Report**

Summarize results to the user; the branch is ready for their review before merging to `main`.
