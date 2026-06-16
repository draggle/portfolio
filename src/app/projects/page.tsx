import Link from 'next/link'
import { projects } from '@/data/projects'

export const metadata = {
  title: 'projects — ayan bin saif',
}

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <Link href="/" className="nyx-link back-link">← ayan bin saif</Link>
      <div>
        <h1 className="page-title">projects</h1>
        <span className="page-title-line" />
      </div>
      <div className="projects-list">
        {projects.map(project => (
          <div key={project.slug} className="project-list-item">
            <div className="project-list-header">
              <h2 className="project-list-title">{project.title}</h2>
              <Link href={`/projects/${project.slug}`} className="nyx-link">
                view project →
              </Link>
            </div>
            <p className="project-list-desc">{project.shortDescription}</p>
            <div className="proj-tags">
              {project.tags.map(tag => (
                <span key={tag} className="proj-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
