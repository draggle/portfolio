import Link from 'next/link'
import { projects } from '@/data/projects'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Projects — Ayan Bin Saif',
  description: 'Selected software projects by Ayan Bin Saif — full-stack, iOS, and computer vision work.',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <div className="page">
      <h1>Projects</h1>
      <ul className="item-list">
        {projects.map(project => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
            <p>{project.shortDescription}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
