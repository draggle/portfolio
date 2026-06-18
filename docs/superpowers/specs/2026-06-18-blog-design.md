# Blog Section Design

**Date:** 2026-06-18  
**Status:** Approved

## Overview

Add a `/blog` section to the portfolio. Posts are MDX files numbered sequentially (`1.mdx`, `2.mdx`, …). A small registry in `posts.ts` holds the metadata needed to render the list page. The detail page dynamically imports the correct MDX file.

## File Structure

```
src/
  content/
    blog/
      1.mdx
      2.mdx
  data/
    posts.ts             # registry: id, title, date, excerpt
  app/
    blog/
      page.tsx           # list page at /blog
      [id]/
        page.tsx         # detail page at /blog/1, /blog/2, …
  components/
    BlogPostLayout.tsx   # reading layout wrapper
mdx-components.tsx       # global MDX component overrides
```

## Data

### `src/data/posts.ts`

```ts
export interface Post {
  id: number
  title: string
  date: string        // ISO date string, e.g. "2026-06-18"
  excerpt: string
}

export const posts: Post[] = [
  // entries added in chronological order; list page reverses for display
]
```

### `src/content/blog/[n].mdx`

Each file exports metadata matching the registry entry and contains the post body:

```mdx
export const metadata = {
  title: 'Post title',
  date: '2026-06-18',
  excerpt: 'Short description shown on the list page.',
}

# Post title

Content goes here. React components can be imported and used inline.
```

## Pages

### List page — `src/app/blog/page.tsx`

- Reads `posts` from registry, reverses for newest-first display
- Layout mirrors `/projects` and `/experience`:
  - `← ayan bin saif` back link
  - `h1.page-title` "blog" + `span.page-title-line`
  - Each entry: title, date, excerpt, `read post →` link to `/blog/[id]`
- Static metadata: `title: 'blog — ayan bin saif'`

### Detail page — `src/app/blog/[id]/page.tsx`

- `generateStaticParams` returns all IDs from `posts.ts`
- `dynamicParams = false` — unknown IDs 404 cleanly
- Dynamically imports `@/content/blog/${id}.mdx`
- Passes content to `BlogPostLayout`
- `generateMetadata` sets `title: '[post title] — ayan bin saif'`

## Components

### `src/components/BlogPostLayout.tsx`

Props: `title`, `date`, `readTime` (minutes, derived from word count), `children`

Layout:
- `← blog` back link
- `h1` title
- Date + read time subtitle line
- Prose container: `max-width ~65ch`, comfortable line-height
- `{children}` renders MDX content

### `mdx-components.tsx` (project root)

Required by `@next/mdx` with App Router. Maps MDX elements to styled components:
- `img` → `next/image` (responsive, optimized)
- `h1`, `h2`, `h3` → styled headings consistent with site typography
- `a` → styled links (inherits `nyx-link` style or equivalent)
- `pre` / `code` → code block styling

## Navigation

`blog` link added to `Nav.tsx` between `projects` and `contact`.

## Dependencies

New packages required:
- `@next/mdx`
- `@mdx-js/loader`
- `@mdx-js/react`
- `@types/mdx`

`next.config` updated to add `pageExtensions` for `.mdx` and wire up `createMDX`.

## Read Time Calculation

Utility function: `Math.ceil(wordCount / 200)` minutes. Exposed from `src/lib/utils.ts` or inline in `BlogPostLayout`.

## Constraints

- No external CMS or build-time API calls — all content is local
- Interactive React components work by importing them directly inside `.mdx` files
- Images served from `/public` and rendered via `next/image`
- Adding a new post = add `[n].mdx` to `src/content/blog/` + add entry to `posts.ts`
