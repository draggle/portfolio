import Link from 'next/link'
import { experiences } from '@/data/experience'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Experience — Ayan Bin Saif',
  description: 'Work experience and education — Tern, Apple iOS mentorship, and the University of Waterloo.',
  path: '/experience',
})

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
