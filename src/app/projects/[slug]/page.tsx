import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { LinkPreview } from '@/components/ui/link-preview'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) return { title: 'project not found' }
  return pageMetadata({
    title: `${project.title} — ayan bin saif`,
    description: project.shortDescription,
    path: `/projects/${project.slug}`,
  })
}

function getYouTubeId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/)
  return match?.[1] ?? ''
}

const STATIC_PREVIEWS: Record<string, { github?: string; demo?: string; event?: string; video?: string }> = {
  'alphahedge':       { github: '/previews/alphahedge-github.png', event: '/previews/yc-event.png' },
  'rate-my-rez':      { github: '/previews/ratemyrez-github.png', demo: '/previews/ratemyrez-demo.png' },
  'cheeto-fingers':   { github: '/previews/cheeto-github.png' },
  'dice-duel-showdown': { github: '/previews/dice-github.png', demo: '/previews/dice-demo.png' },
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()

  const previews = STATIC_PREVIEWS[slug] ?? {}

  return (
    <div className="detail-page">
      <Link href="/projects" className="nyx-link back-link">← projects</Link>

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
          previews.github
            ? <LinkPreview url={project.links.github} className="detail-btn" isStatic imageSrc={previews.github}>github ↗</LinkPreview>
            : <LinkPreview url={project.links.github} className="detail-btn">github ↗</LinkPreview>
        )}
        {project.links.demo && (
          previews.demo
            ? <LinkPreview url={project.links.demo} className="detail-btn" isStatic imageSrc={previews.demo}>demo ↗</LinkPreview>
            : <LinkPreview url={project.links.demo} className="detail-btn">demo ↗</LinkPreview>
        )}
        {project.links.event && (
          previews.event
            ? <LinkPreview url={project.links.event} className="detail-btn" isStatic imageSrc={previews.event}>yc event ↗</LinkPreview>
            : <LinkPreview url={project.links.event} className="detail-btn">yc event ↗</LinkPreview>
        )}
        {project.links.video && (
          previews.video
            ? <LinkPreview url={project.links.video} className="detail-btn" isStatic imageSrc={previews.video}>demo video ↗</LinkPreview>
            : <LinkPreview url={project.links.video} className="detail-btn">demo video ↗</LinkPreview>
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
