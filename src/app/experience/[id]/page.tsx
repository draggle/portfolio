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
  if (!exp) return { title: 'not found' }
  return pageMetadata({
    title: `${exp.company} — ayan bin saif`,
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
    <div className="detail-page">
      <Link href="/experience" className="nyx-link back-link">← experience</Link>

      <div className="detail-header">
        <div className="exp-detail-logo-row">
          {exp.logoUrl && (
            <div className={`exp-logo-wrap exp-logo-wrap-${exp.id} exp-logo-wrap-lg`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={exp.logoUrl} alt={exp.company} className={`exp-logo exp-logo-${exp.id}`} />
            </div>
          )}
          <div>
            <h1 className="detail-title">{exp.company}</h1>
            <div className="exp-detail-role">
              {exp.role}
              {exp.location && <span className="exp-card-location"> · {exp.location}</span>}
            </div>
            <div className="exp-detail-dates">{exp.dateRange}</div>
          </div>
        </div>
        {exp.tags && (
          <div className="proj-tags" style={{ marginTop: '0.75rem' }}>
            {exp.tags.map(tag => (
              <span key={tag} className="proj-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {exp.link && (
        <div className="detail-links">
          {linkIsPdf ? (
            <a href={exp.link} target="_blank" rel="noopener noreferrer" className="detail-btn">
              {exp.linkLabel ?? 'visit ↗'}
            </a>
          ) : previewSrc ? (
            <LinkPreview url={exp.link} className="detail-btn" isStatic imageSrc={previewSrc}>
              {exp.linkLabel ?? 'visit ↗'}
            </LinkPreview>
          ) : (
            <LinkPreview url={exp.link} className="detail-btn">
              {exp.linkLabel ?? 'visit ↗'}
            </LinkPreview>
          )}
        </div>
      )}

      <div className="detail-body">
        <p className="detail-para">{exp.description}</p>
        {exp.highlights && exp.highlights.length > 0 && (
          <ul className="exp-highlights">
            {exp.highlights.map((h, i) => (
              <li key={i} className="exp-highlight-item">{h}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
