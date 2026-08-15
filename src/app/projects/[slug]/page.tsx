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
  if (!project) return { title: 'Project not found' }
  return pageMetadata({
    title: `${project.title} — Ayan Bin Saif`,
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

  const linkItems: React.ReactNode[] = []
  if (project.links.github) linkItems.push(
    previews.github
      ? <LinkPreview key="gh" url={project.links.github} isStatic imageSrc={previews.github}>GitHub ↗</LinkPreview>
      : <LinkPreview key="gh" url={project.links.github}>GitHub ↗</LinkPreview>
  )
  if (project.links.demo) linkItems.push(
    previews.demo
      ? <LinkPreview key="demo" url={project.links.demo} isStatic imageSrc={previews.demo}>Demo ↗</LinkPreview>
      : <LinkPreview key="demo" url={project.links.demo}>Demo ↗</LinkPreview>
  )
  if (project.links.event) linkItems.push(
    previews.event
      ? <LinkPreview key="event" url={project.links.event} isStatic imageSrc={previews.event}>YC event ↗</LinkPreview>
      : <LinkPreview key="event" url={project.links.event}>YC event ↗</LinkPreview>
  )
  if (project.links.video) linkItems.push(
    previews.video
      ? <LinkPreview key="video" url={project.links.video} isStatic imageSrc={previews.video}>Demo video ↗</LinkPreview>
      : <LinkPreview key="video" url={project.links.video}>Demo video ↗</LinkPreview>
  )
  if (project.links.recommendation) linkItems.push(
    <a key="rec" href={project.links.recommendation} target="_blank" rel="noopener noreferrer">
      Recommendation letter ↗
    </a>
  )

  return (
    <div className="page">
      <p><Link href="/projects">← Projects</Link></p>
      <h1>{project.title}</h1>
      {/* .para div, not <p>: LinkPreview's hover popup renders a <div>, invalid inside <p> */}
      <div className="para">{linkItems.map((item, i) => <span key={i}>{i > 0 && ' · '}{item}</span>)}</div>
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
      {project.description.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
      {project.builtAt && (
        <p className="muted">Built at {project.builtAt}</p>
      )}
    </div>
  )
}
