import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  return { title: project ? `${project.title} — ayan bin saif` : 'project not found' }
}

function getYouTubeId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/)
  return match?.[1] ?? ''
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="detail-page">
      <Link href="/" className="nyx-link back-link">← ayan bin saif</Link>

      <div
        className="detail-header"
        style={{ viewTransitionName: `project-card-${project.slug}` } as React.CSSProperties}
      >
        <h1 className="detail-title">{project.title}</h1>
        <div className="proj-tags">
          {project.tags.map(tag => (
            <span key={tag} className="proj-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="detail-links">
        {project.links.github && (
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="detail-btn">
            github ↗
          </a>
        )}
        {project.links.demo && (
          <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="detail-btn">
            demo ↗
          </a>
        )}
        {project.links.event && (
          <a href={project.links.event} target="_blank" rel="noopener noreferrer" className="detail-btn">
            yc event ↗
          </a>
        )}
        {project.links.video && (
          <a href={project.links.video} target="_blank" rel="noopener noreferrer" className="detail-btn">
            demo video ↗
          </a>
        )}
        {project.links.recommendation && (
          <a href={project.links.recommendation} target="_blank" rel="noopener noreferrer" className="detail-btn">
            recommendation letter ↗
          </a>
        )}
      </div>

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

      <div className="detail-body">
        {project.description.map((para, i) => (
          <p key={i} className="detail-para">{para}</p>
        ))}
        {project.builtAt && (
          <p className="detail-builtat">built with love @ {project.builtAt.toLowerCase()}</p>
        )}
      </div>
    </div>
  )
}
