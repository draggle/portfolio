import Link from 'next/link'
import { experiences } from '@/data/experience'

export default function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <div className="sec-label">experience</div>
      <div className="exp-cards">
        {experiences.map(exp => (
          <Link key={exp.id} href={`/experience/${exp.id}`} className="exp-card">
            <div className="exp-card-header">
              {exp.logoUrl ? (
                <div className={`exp-logo-wrap exp-logo-wrap-${exp.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={exp.logoUrl} alt={exp.company} className={`exp-logo exp-logo-${exp.id}`} />
                </div>
              ) : (
                <div className="logo-sq" style={{ background: exp.logoColor }} />
              )}
              <div className="exp-card-meta">
                <div className="exp-card-company">{exp.company}</div>
                <div className="exp-card-role">
                  {exp.role}
                  {exp.location && <span className="exp-card-location"> · {exp.location}</span>}
                </div>
              </div>
              <div className="exp-card-date">{exp.dateRange}</div>
            </div>
            <p className="exp-card-desc">{exp.cardDescription ?? exp.description}</p>
            {exp.tags && (
              <div className="proj-tags">
                {exp.tags.map(tag => <span key={tag} className="proj-tag">{tag}</span>)}
              </div>
            )}
          </Link>
        ))}
      </div>
      <div className="view-all">
        <a href="/experience" className="nyx-link">view all experience →</a>
      </div>
    </section>
  )
}
