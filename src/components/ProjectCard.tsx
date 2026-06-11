import Link from 'next/link'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`proj-card${featured ? ' featured' : ''}`}
      style={{ viewTransitionName: `project-card-${project.slug}` } as React.CSSProperties}
    >
      <div className="proj-thumb" style={{ background: project.thumbnail.gradient }}>
        <span role="img" aria-label={project.title}>{project.thumbnail.emoji}</span>
      </div>
      <div className="proj-body">
        <div className="proj-title-row">
          <span className="proj-title">{project.title}</span>
          {project.slug === 'alphahedge' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Y_Combinator_logo.svg"
              alt="Y Combinator"
              className="yc-logo"
            />
          )}
        </div>
        <p className="proj-desc">{project.shortDescription}</p>
        <div className="proj-tags">
          {project.tags.map(tag => (
            <span key={tag} className="proj-tag">{tag}</span>
          ))}
        </div>
        <span className="nyx-link proj-link">view project →</span>
      </div>
    </Link>
  )
}
