import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { experiences } from '@/data/experience'
import { LinkPreview } from '@/components/ui/link-preview'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return experiences.map(e => ({ id: e.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const exp = experiences.find(e => e.id === id)
  if (!exp) return { title: 'Not found' }
  return pageMetadata({
    title: `${exp.company} — Ayan Bin Saif`,
    description: exp.cardDescription ?? exp.description,
    path: `/experience/${exp.id}`,
  })
}

const STATIC_PREVIEWS: Record<string, string> = {
  tern:      '/previews/tern.png',
  uwaterloo: '/previews/uwaterloo-program.png',
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exp = experiences.find(e => e.id === id)
  if (!exp) notFound()

  const linkIsPdf = exp.link?.toLowerCase().endsWith('.pdf')
  const previewSrc = STATIC_PREVIEWS[id]

  return (
    <div className="page">
      <p><Link href="/experience">← Experience</Link></p>
      <h1>{exp.company}</h1>
      <p className="muted">
        {exp.role}
        {exp.location && ` · ${exp.location}`} · {exp.dateRange}
      </p>
      {(exp.link || exp.websiteUrl) && (
        // .para div, not <p>: LinkPreview's hover popup renders a <div>, invalid inside <p>
        <div className="para">
          {exp.websiteUrl && (
            <>
              <LinkPreview url={exp.websiteUrl}>{exp.websiteLabel ?? 'Website ↗'}</LinkPreview>
              {exp.link && ' · '}
            </>
          )}
          {exp.link && (linkIsPdf ? (
            <a href={exp.link} target="_blank" rel="noopener noreferrer">{exp.linkLabel ?? 'Visit ↗'}</a>
          ) : previewSrc ? (
            <LinkPreview url={exp.link} isStatic imageSrc={previewSrc}>{exp.linkLabel ?? 'Visit ↗'}</LinkPreview>
          ) : (
            <LinkPreview url={exp.link}>{exp.linkLabel ?? 'Visit ↗'}</LinkPreview>
          ))}
        </div>
      )}
      <p>{exp.description}</p>
      {exp.highlights && exp.highlights.length > 0 && (
        <ul>
          {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
    </div>
  )
}
