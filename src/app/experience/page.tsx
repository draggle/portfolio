import Link from 'next/link'
import { experiences } from '@/data/experience'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'experience — ayan bin saif',
  description: 'work experience and education — tern, apple ios mentorship, and the university of waterloo.',
  path: '/experience',
})

export default function ExperiencePage() {
  return (
    <div className="projects-page">
      <Link href="/" className="nyx-link back-link">← ayan bin saif</Link>
      <div>
        <h1 className="page-title">experience</h1>
        <span className="page-title-line" />
      </div>
      <div className="projects-list">
        {experiences.map(exp => (
          <div key={exp.id} className="project-list-item">
            <div className="project-list-header">
              <div className="exp-list-meta">
                {exp.logoUrl && (
                  <div className={`exp-logo-wrap exp-logo-wrap-${exp.id}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={exp.logoUrl} alt={exp.company} className={`exp-logo exp-logo-${exp.id}`} />
                  </div>
                )}
                <div>
                  <h2 className="project-list-title">{exp.company}</h2>
                  <div className="exp-list-role">
                    {exp.role}
                    {exp.location && <span className="exp-card-location"> · {exp.location}</span>}
                    {' · '}{exp.dateRange}
                  </div>
                </div>
              </div>
              <Link href={`/experience/${exp.id}`} className="nyx-link">
                view →
              </Link>
            </div>
            <p className="project-list-desc">{exp.description}</p>
            {exp.tags && (
              <div className="proj-tags">
                {exp.tags.map(tag => (
                  <span key={tag} className="proj-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
